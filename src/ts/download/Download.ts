import browser from 'webextension-polyfill'

declare const JSZip: any
import { EVT } from '../EVT'
import { log } from '../Log'
import { lang } from '../Language'
import { fileName } from '../FileName'
import { convertUgoira } from '../ConvertUgoira/ConvertUgoira'
import {
  downloadArgument,
  SendToBackEndData,
  DonwloadSkipData,
} from './DownloadType'
import { progressBar } from './ProgressBar'
import { filter } from '../filter/Filter'
import { downloadRecord } from './DownloadRecord'
import { SettingKeys, settings } from '../setting/Settings'
import { makeNovelFile } from './MakeNovelFile'
import { Utils } from '../utils/Utils'
import { Config } from '../Config'
import { msgBox } from '../MsgBox'
import { states } from '../store/States'
import { Tools } from '../Tools'
import { downloadStates } from './DownloadStates'
import { downloadInterval } from './DownloadInterval'
import { NovelMeta, Result } from '../store/StoreType'

// 下载抓取结果里的一个文件
class Download {
  constructor(
    progressBarIndex: number,
    data: downloadArgument,
    downloadStatesIndex: number
  ) {
    this.progressBarIndex = progressBarIndex
    this.downloadStatesIndex = downloadStatesIndex
    this.beforeDownload(data)
  }

  private progressBarIndex: number
  private downloadStatesIndex: number

  private retry = 0 // 重试次数
  private lastRequestTime = 0 // 最后一次发起请求的时间戳
  private retryInterval: number[] = [] // 保存每次到达重试环节时，距离上一次请求的时间差

  private sizeChecked = false // 是否对文件体积进行了检查
  private skip = false // 这个下载是否应该被跳过。如果这个文件不符合某些过滤条件就应该跳过它
  private error = false // 在下载过程中是否出现了无法解决的错误

  private get cancel() {
    return this.skip || this.error || !states.downloading
  }

  /** 跳过下载这个文件。可以传入用于提示的文本 */
  private skipDownload(data: DonwloadSkipData, msg?: string) {
    this.skip = true
    if (msg) {
      log.warning('🚫' + msg)
    }
    if (states.downloading) {
      EVT.fire('skipDownload', data)
    }
  }

  /** 在下载前检查一些过滤条件，以确认是否应该下载这个文件 */
  private async beforeDownload(arg: downloadArgument) {
    // 检查是否是重复文件
    const duplicate = await downloadRecord.checkDeduplication(arg.result)
    if (duplicate) {
      return this.skipDownload({
        id: arg.id,
        type: arg.result.type,
        reason: 'duplicate',
      })
    }

    // 如果是动图，再次检查是否排除了动图
    // 因为有时候用户在抓取时没有排除动图，但是在下载时排除了动图。所以下载时需要再次检查
    if (arg.result.type === 2 && !settings.downType2) {
      return this.skipDownload({
        id: arg.id,
        reason: 'excludedType',
      })
    }

    // 检查宽高条件和宽高比
    const checkResult = await this.checkWidthHeight(arg.result)
    if (!checkResult) {
      return this.skipDownload(
        {
          id: arg.id,
          reason: 'widthHeight',
        },
        lang.transl('_不保存图片因为宽高', Tools.createWorkLink(arg.id))
      )
    }

    // 检查通过，下载这个文件
    this.download(arg)
  }

  private async download(arg: downloadArgument): Promise<void> {
    const result = arg.result
    // 获取文件名
    let _fileName = fileName.createFileName(result)

    // 重置当前下载记录条
    this.setProgressBar(_fileName, 0, 0)

    await downloadInterval.wait()
    this.lastRequestTime = Date.now()

    if (result.type === 3) {
      // 小说文件单独处理，因为它是动态生成的，生成后就可以直接下载，不需要走下面的 Fetch 请求流程
      const blob = await this.getNovelFileURL(result.novelMeta, _fileName)
      const blobURL = URL.createObjectURL(blob)

      // 等待上一个文件下载完成
      await this.waitPreviousFileDownload()

      // 发送下载任务
      const size = blob.size
      this.setProgressBar(_fileName, size, size)
      this.sendDownload(blob, blobURL, _fileName, arg.id, arg.taskBatch)
      return
    }

    // 下载图像作品
    // 如果设置了图片尺寸就使用指定的 url，否则使用原图 url
    const url = result[settings.imageSize] || result.original

    // 检查 url 的扩展名，如果与文件名里的扩展名不同，则重设文件名
    // 常见的情况是：一些图片的原图的扩展名是 .png，但其他尺寸的扩展名是 .jpg。如果用户下载的图片尺寸不是原图，就在这里把扩展名从 .png 改成 .jpg。虽然这个操作不是必须的，但更符合实际情况，也可以减少用户的困惑
    if (settings.imageSize !== 'original') {
      _fileName = Utils.replaceExtension(_fileName, url)
      this.setProgressBar(_fileName, 0, 0)
    }

    // 使用 Fetch API 下载文件
    // 相比 XHR，Fetch API 不受系统盘可用空间的限制，可以更可靠地下载大文件
    const controller = new AbortController()
    // 保存 catch 里的响应状态码
    let status = 0

    try {
      const response = await fetch(url, { signal: controller.signal })
      const contentType = response.headers
        .get('Content-Type')
        ?.split(';')[0]
        .trim()
      status = response.status

      // 状态码错误，抛出异常进入重试流程
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      // 获取文件总体积
      // 但是 Pixiv 的服务器有问题，偶尔一些文件没有 Content-Length 响应头（之后重试可能又有了），直接设置为 0
      const contentLength = response.headers.get('Content-Length') || '0'
      const total = parseInt(contentLength, 10)

      // 检查体积设置，如果检查不通过，会把 this.skip 设置成 true，从而中断下载
      const sizeCheck = await this.checkSize(result, total)
      if (!sizeCheck) {
        // 当因为体积问题跳过下载时，直接把进度条拉满
        // 如果不把进度条拉满，用户看到这个文件的进度条只有一点点，就会以为下载卡住或出错了
        this.setProgressBar(_fileName, 1, 1)
      }

      if (this.cancel) {
        controller.abort()
        return
      }

      // 使用 ReadableStream 读取响应体，跟踪下载进度
      const reader = response.body!.getReader()
      const chunks: Uint8Array[] = []
      let loaded = 0

      while (true) {
        if (this.cancel) {
          reader.cancel()
          return
        }

        const { done, value } = await reader.read()
        if (done) break

        chunks.push(value)
        loaded += value.length
        this.setProgressBar(_fileName, loaded, total)
      }

      // 组装 Blob
      let file: Blob = new Blob(chunks as BlobPart[], {
        type: contentType || 'application/octet-stream',
      })

      // 下载时有些图片可能没有 content-length，无法计算下载进度
      // 所以在下载完毕后，把下载进度拉满
      if (file.size) {
        this.setProgressBar(_fileName, file.size, file.size)
      }
      progressBar.errorColor(this.progressBarIndex, false)

      // 转换动图
      if (result.type === 2) {
        // 如果不需要转换会返回 null，此时继续使用 file
        const convertResult = await this.convertUgoira(result, file, _fileName)
        file = convertResult || file
        const lastName = this.lastUgoiraFileName
        if (lastName && lastName !== _fileName) {
          _fileName = lastName
          this.setProgressBar(lastName, file.size, file.size)
        }
      }

      if (this.cancel) {
        file = null as any
        return
      }

      // 生成下载链接
      const blobURL = URL.createObjectURL(file)

      // 对插画、漫画进行颜色检查
      // 在这里进行检查的主要原因：抓取时只会检查单图作品的颜色，不会检查多图作品的颜色。所以多图作品需要在这里进行检查。
      // 另一个原因：如果抓取时没有设置图片的颜色条件，下载时才设置颜色条件，那么就必须在这里进行检查。
      if (result.type === 0 || result.type === 1) {
        await this.checkColor(result, blobURL)
      }

      // 从第二张图片开始，检查原图的实际宽高。如果宽高与抓取结果里的不同，则重新生成文件名
      if (result.index > 0) {
        const newFileName = await this.checkNamingRulePX(result, blobURL)
        if (newFileName && newFileName !== _fileName) {
          _fileName = newFileName
          this.setProgressBar(newFileName, file.size, file.size)
        }
      }

      // 等待上一个文件下载完成
      await this.waitPreviousFileDownload()

      // 发送下载任务
      this.sendDownload(file, blobURL, _fileName, arg.id, arg.taskBatch)
      file = null as any
    } catch (error) {
      if (this.cancel) {
        return
      }

      // AbortError 表示请求被主动中断，不需要重试
      if ((error as Error).name === 'AbortError') {
        return
      }

      console.error('Download error:', error)

      // 网络错误时 fetch 会抛出 TypeError，此时 status 为 0
      // 储存重试的时间戳等信息
      if (this.retryInterval.length > Config.retryMax) {
        this.retryInterval.shift()
      }
      this.retryInterval.push(Date.now() - this.lastRequestTime)

      progressBar.errorColor(this.progressBarIndex, true)
      this.retry++

      if (this.retry >= Config.retryMax) {
        // 重试达到最大次数
        this.afterReTryMax(status, arg.id)
      } else {
        // 开始重试
        return this.download(arg)
      }
    }
  }

  /** 设置下载的这个文件的进度条信息 */
  private setProgressBar(name: string, loaded: number, total: number) {
    // 在下载初始化和下载完成时，立即更新进度条
    // 在下载途中，使用节流来更新进度条
    progressBar[loaded === total ? 'setProgress' : 'setProgressThrottle'](
      this.progressBarIndex,
      {
        name,
        loaded,
        total,
      }
    )
  }

  /** 当重试达到最大次数时 */
  private afterReTryMax(status: number, fileId: string) {
    const errorMsg = lang.transl(
      '_作品id无法下载带状态码',
      Tools.createWorkLink(fileId),
      status.toString()
    )
    // 发生 404 500 错误时跳过这个作品。因为没有触发 downloadError 事件，所以不会重试下载它
    if (status === 404 || status === 500) {
      log.error(errorMsg)
      log.error(lang.transl('_下载器不会再重试下载它'))
      return this.skipDownload({
        id: fileId,
        reason: status.toString() as '404' | '500',
      })
    }

    // 状态码为 0，可能是系统磁盘空间不足导致的错误，也可能是代理软件导致的网络错误
    // 超时也会返回状态码 0
    if (status === 0) {
      // 判断是否是磁盘空间不足。特征是每次重试之间的间隔时间比较短。
      // 如果是超时，那么等待时间会比较长，可能超过 20 秒
      const timeLimit = 10000 // 如果从发起请求到进入重试的时间间隔小于这个值，则视为磁盘空间不足的情况
      const result = this.retryInterval.filter((val) => val <= timeLimit)
      // 在全部的 10 次请求中，如果有 9 次小于 10 秒，就有可能是磁盘空间不足。
      if (result.length > 9) {
        log.error(errorMsg)
        const tip = lang.transl('_状态码为0的错误提示')
        log.error(tip)
        msgBox.error(tip)
        return EVT.fire('requestPauseDownload')
      }
    }

    // 其他状态码，暂时跳过这个任务，但最后还是会尝试重新下载它
    log.log(lang.transl('_下载器会暂时跳过它并在其他文件下载完毕后重试下载它'))
    this.error = true
    EVT.fire('downloadError', fileId)
  }

  /** 生成小说文件 */
  private async getNovelFileURL(novelMeta: NovelMeta | null, filename: string) {
    if (!novelMeta) {
      throw new Error('Not found novelMeta')
    }

    const blob = await makeNovelFile[
      settings.novelSaveAs === 'epub' ? 'makeEPUB' : 'makeTXT'
    ](novelMeta, filename)
    return blob
  }

  private lastUgoiraFileName = ''

  /** 转换动图，并返回一个 Blob 文件。注意：用户可以同时选择多种动图的保存格式，这里只会返回最后转换成功的那个格式的 Blob 文件。前面转换的文件不会返回，而是会直接下载
   *
   * 如果不需要转换，或者转换失败，会返回 null */
  private async convertUgoira(
    result: Result,
    zipFile: Blob,
    fileName: string
  ): Promise<Blob | null> {
    // 当下载的图片尺寸是方形缩略图不转换动图，因为此时下载的是作品的静态缩略图，无法进行转换
    if (!result.ugoiraInfo || settings.imageSize === 'thumb') {
      return null
    }

    // 用户可以同时选择多种动图的保存格式，需要全部处理
    const needConvertFormats: (typeof Config.allUgoiraFormats)[number][] = []
    // 当用户同时选择了多种格式时，只有最后 push 的那个会保存下载记录，所以在这个作品的下载记录里，文件名的扩展名就是最后保存的格式
    // 把不需要转换、能直接保存的 zip 文件放到最前面，优先保存。这样如果之后转换时出现了错误的话，至少已经保存了源文件
    if (settings.ugoiraSaveAsZIP) needConvertFormats.push('zip')
    if (settings.ugoiraSaveAsUgoira) needConvertFormats.push('ugoira')
    // 把需要转换的格式放到后面。
    // 先转换 WebP 格式，因为它现在是默认格式
    if (settings.ugoiraSaveAsWebP) needConvertFormats.push('webp')
    // WebM 格式也是我比较推荐的格式，而且转换时占用的内存相对较少
    if (settings.ugoiraSaveAsWebM) needConvertFormats.push('webm')
    // GIF 格式我不推荐，所以放到后面
    if (settings.ugoiraSaveAsGIF) needConvertFormats.push('gif')
    // APNG 格式转换时占用的内存最多，耗时也比较久。有些用户反馈他们在转换 APNG 文件时总是失败，因此放到最后
    if (settings.ugoiraSaveAsAPNG) needConvertFormats.push('apng')

    if (needConvertFormats.length === 0) {
      // 如果用户没有选择任何动图格式，则不进行转换
      // 注意：此时下载器依然会保存原始 zip 文件，而不是跳过这个文件
      return null
    }

    while (needConvertFormats.length > 0) {
      let file: Blob | null = null
      const format = needConvertFormats.shift()!
      const newFileName = Utils.replaceExtension(fileName, '.' + format)
      this.lastUgoiraFileName = newFileName
      // 显示新的文件名。此时转换尚未开始，所以体积使用 zip 文件的体积
      this.setProgressBar(this.lastUgoiraFileName, zipFile.size, zipFile.size)

      // 保存为 ZIP 或 Ugoria 格式时，在里面添加 animation.json 文件，保存动图的元信息
      if (format === 'zip' || format === 'ugoira') {
        // 对于播放动画来说，只有 frames 是必须的。其他数据是作品的元数据，不是必须的
        let animationInfo = {
          frames: result.ugoiraInfo.frames,
          mime_type: result.ugoiraInfo.mime_type,
          id: result.idNum,
          title: result.title,
          tags: result.tags,
          date: result.date,
          xRestrict: result.xRestrict,
          width: result.fullWidth,
          height: result.fullHeight,
          user: result.user,
          userId: result.userId,
          regularSrc: result.regular,
          originalSrc: result.original,
          thumbnail: result.ugoiraInfo.originalThumbnail || result.thumb,
        }

        // FUCK Firefox
        // 在 Firefox 里使用 JSZip().loadAsync(blob) 加载一个 ZIP 文件时会报错：
        // Error: Can't read the data of 'the loaded zip file'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?
        // 这个错误是由跨 realm 问题引起的。解决这个错误之后，又会产生新的错误：
        // Error: Permission denied to access property "constructor"
        // AI 反复尝试也无法解决这个问题。最后我从 GitHub 上抄了一个办法解决了这个问题：
        // https://github.com/Stuk/jszip/issues/759#issuecomment-932896399
        // 使用了弃用的 FileReader.readAsBinaryString 方法把 ZIP 文件读取为二进制数据再使用
        // 这个问题浪费了我很多时间。虽然现在解决了，但是在 Firefox 里会多出一些性能开销
        let zipData = zipFile
        if (Config.isFirefox) {
          zipData = (await Utils.readAsBinaryString(zipFile)) as any
        }

        // 把 animationInfo 写入 animation.json，并添加到 zip 文件里
        const zip = await new JSZip().loadAsync(zipData)
        zip.file('animation.json', JSON.stringify(animationInfo))
        file = await zip.generateAsync({
          type: 'blob',
          // ugoira 格式需要二进制流的 mimeType。如果使用 zip 的 mimeType，浏览器在保存文件时会把它的扩展名强制设为 zip
          mimeType:
            format === 'ugoira'
              ? 'application/octet-stream'
              : 'application/zip',
        })
      } else {
        // 处理其他格式：webm gif apng，需要进行转换
        try {
          const blob = await convertUgoira[format](
            zipFile,
            result.ugoiraInfo,
            result.idNum
          )
          file = blob || null
        } catch (error) {
          const msg =
            lang.transl(
              '_动图转换失败的提示',
              Tools.createWorkLink(result.idNum)
            ) +
            '<br>' +
            lang.transl('_格式') +
            ': ' +
            format +
            '<br>' +
            lang.transl('_下载器会暂时跳过它并在其他文件下载完毕后重试下载它')
          log.error(msg)
          this.error = true
          // 转换动图出错时，只要出错 1 次就会暂时跳过它，等下载完其他文件再重试它
          EVT.fire('downloadError', result.id)
          file = null
        }
      }

      if (!file) {
        continue
      }

      // 如果这不是最后一个待处理的格式，就直接在这里下载
      if (needConvertFormats.length > 0) {
        // 显示转换后的文件的体积
        this.setProgressBar(this.lastUgoiraFileName, file.size, file.size)

        // 等待上一个文件下载完成
        await this.waitPreviousFileDownload()

        // 发送下载任务
        const blobURL = URL.createObjectURL(file)
        // 此时不会返回下载成功或失败的消息，所以这个抓取结果会保持下载中的状态
        this.sendDownload(file, blobURL, newFileName, result.id, -1, false)
        await Utils.sleep(200)
        setTimeout(() => {
          URL.revokeObjectURL(blobURL)
        }, 3000)
      } else {
        // 如果这是最后一个待处理的格式

        // 保存动图的缩略图
        await this.downloadUgoiraThumbnail(result, newFileName, zipFile)

        // 返回这个 Blob 文件，让后续下载流程继续处理
        return file
      }
    }

    return null
  }

  /** 检查宽高条件和宽高比 */
  private async checkWidthHeight(result: Result) {
    if (result.type === 3 || (!settings.setWHSwitch && !settings.ratioSwitch)) {
      return true
    }

    // 默认使用当前作品中第一张图片的宽高
    let wh = {
      width: result.fullWidth,
      height: result.fullHeight,
    }
    // 如果不是第一张图片，则加载图片以获取宽高
    if (result.index > 0) {
      // 始终获取原图的尺寸
      wh = await Utils.getImageSize(result.original)
    }

    // 如果获取宽高失败，则不进行检查
    if (wh.width === 0 || wh.height === 0) {
      log.error(
        lang.transl('_获取图片的宽高时出现错误') +
          Tools.createWorkLink(result.id)
      )
      return true
      // 图片加载失败可能是请求超时，或者图片不存在。这里无法获取到具体原因，所以不直接返回。
      // 如果是 404 错误，在 download 方法中可以处理这个问题
      // 如果是请求超时，则有可能错误的通过了这个图片
    }

    return filter.check(wh)
  }

  /** 检查体积设置 */
  private async checkSize(result: Result, size: number) {
    if (!this.sizeChecked) {
      this.sizeChecked = true
      if (size === 0) {
        return true
      }

      const check = await filter.check({ size })
      if (!check) {
        this.skipDownload(
          {
            id: result.id,
            reason: 'size',
          },
          lang.transl('_不保存图片因为体积', Tools.createWorkLink(result.id))
        )
      }
      return check
    }

    return true
  }

  /* 对插画、漫画进行颜色检查 */
  private async checkColor(result: Result, blobURL: string) {
    const checkResult = await filter.check({
      mini: blobURL,
    })
    if (!checkResult) {
      return this.skipDownload(
        {
          id: result.id,
          reason: 'color',
        },
        lang.transl('_不保存图片因为颜色', Tools.createWorkLink(result.id))
      )
    }
  }

  /** 如果这张图片的宽高与作品里第一张图片的宽高不同，则为其重新生成文件名。此时 {px} 标记的结果与第一张图片不同。 */
  // 这是因为每张图片的宽高可能都不一样，示例：
  // https://www.pixiv.net/artworks/142726174
  // 但是 Pixiv 的作品信息 API 里只有第一张图片的宽高，所以下载器在生成抓取结果时，会把每张图片的宽高都设置成第一张图片的宽高。但这可能不适用于从第二张开始的图片
  // 所以在下载图片时需要重新检查其宽高，如有必要就重新生成文件名。本质上，这是为了重新生成 {px} 标记的结果
  private async checkNamingRulePX(result: Result, blobURL: string) {
    if (result.index === 0 || settings.imageSize !== 'original') {
      return undefined
    }

    const size = await Utils.getImageSize(blobURL)
    if (
      size.width &&
      size.height &&
      result.fullWidth !== size.width &&
      result.fullHeight !== size.height
    ) {
      // 修改宽高数据，并重新生成文件名
      // 使用一个临时对象，不修改原本的抓取结果
      // 如果修改原本的抓取结果会带来副作用：下载前生成的文件名与下载后生成的文件名不同（因为 {px} 标记的结果变了），这会让这个文件始终被判断为不是重复文件，每次都会重新下载
      // 使用对象展开进行浅拷贝。由于这里只需要修改两个基础值，所以浅拷贝就够了，不会影响原本的抓取结果
      const tempResult = { ...result }
      tempResult.fullWidth = size.width
      tempResult.fullHeight = size.height
      const newFileName = fileName.createFileName(tempResult)
      return newFileName
    }

    return undefined
  }

  /** 等待上一个文件下载完成 */
  // 如果用户启用了“文件下载顺序”，就需要等待上一个文件下载完成后（浏览器返回文件下载成功的消息），再开始下载这个文件
  private async waitPreviousFileDownload() {
    while (settings.setFileDownloadOrder) {
      if (
        this.downloadStatesIndex === 0 ||
        downloadStates.states[this.downloadStatesIndex - 1] === 1
      ) {
        return
      }

      await Utils.sleep(50)
    }
  }

  /** 处理“为动图保存一张缩略图”设置 */
  private async downloadUgoiraThumbnail(
    result: Result,
    newFileName: string,
    zipFile: Blob,
    retryCount = 0
  ): Promise<void> {
    if (!settings.saveThumbnailForUgoira || !result.ugoiraInfo) {
      return
    }

    let thumbBlob: Blob | null = null
    let thumbURL = result.ugoiraInfo.originalThumbnail || ''

    // 如果缩略图不是 jpg 或 png 文件，就清空 thumbURL，这样接下来会从 zip 文件里提取缩略图
    // 并且在设置缩略图文件的扩展名时不会被不符合条件的扩展名干扰
    if (!thumbURL.endsWith('jpg') && !thumbURL.endsWith('png')) {
    }

    // 这些情况不加载缩略图文件，而是从 zip 文件里提取第一张图片来作为缩略图：
    // 1. 在 Firefox 浏览器里，无法使用 fetch 来加载缩略图文件（会触发跨域限制）
    // 2. 没有缩略图 URL 的情况。下载器之前版本的 ugoiraInfo 里没有 originalThumbnail 字段
    // 3. 缩略图不是 jpg 或 png 的情况。例如这个作品的缩略图是 gif 格式的静态图片：
    // https://www.pixiv.net/artworks/144539571
    // 下载器可以把动图转换为 GIF 图片，扩展名是 .gif。如果缩略图也是 gif 文件，就会和转换后的动态 GIF 文件重名，导致覆盖了动态 GIF 文件。此时从 zip 文件里提取第一张图片来作为缩略图，就可以避免这个问题
    if (
      Config.isFirefox ||
      !thumbURL ||
      (!thumbURL.endsWith('jpg') && !thumbURL.endsWith('png'))
    ) {
      // 重置 thumbURL，这样在设置缩略图文件的扩展名时不会使用 thumbURL 里的扩展名
      thumbURL = ''
      // FUCK Firefox
      // 在 Firefox 浏览器里，无法使用 fetch 来加载缩略图文件，因为缩略图的域名 i.pximg.net 会触发跨域限制
      // 我试了多种方法都无法绕过跨域限制，因为 Firefox 浏览器对 CORS 的检查时机更底层、更早，所以扩展程序里所有修改请求头的方法都无效，不管是使用 declarative_net_request_rules.json 还是 webRequest API、不管是在内容脚本还是 SW 里加载这个文件，都无法绕过 CORS 限制。AI 也解决不了
      // 现在直接从 zip 文件里提取第一张图片来作为缩略图。虽然这张图片的尺寸、体积可能都比最大尺寸的缩略图要小，但总比无法下载缩略图好
      thumbBlob = await Tools.extractFirstImage(await zipFile.arrayBuffer())
    } else {
      // 其他情况，使用 fetch 加载缩略图文件
      try {
        const response = await fetch(thumbURL)
        if (!response.ok) {
          // 如果请求成功但是状态码错误，就从 zip 文件里提取第一张图片来作为缩略图
          thumbBlob = await Tools.extractFirstImage(await zipFile.arrayBuffer())
        } else {
          thumbBlob = await response.blob()
        }
      } catch (error) {
        // 如果网络请求失败，重试最多 3 次
        if (retryCount <= 3) {
          return this.downloadUgoiraThumbnail(
            result,
            newFileName,
            zipFile,
            retryCount + 1
          )
        } else {
          // 如果重试达到最大次数，就不再重试，而是直接从 zip 文件里提取第一张图片来作为缩略图
          thumbBlob = await Tools.extractFirstImage(await zipFile.arrayBuffer())
        }
      }
    }

    // 下载缩略图
    if (!thumbBlob) {
      return
    }
    const thumbBlobURL = URL.createObjectURL(thumbBlob)
    const thumbFileName = Utils.replaceExtension(
      newFileName,
      thumbURL || '.jpg'
    )
    await this.waitPreviousFileDownload()
    this.sendDownload(
      thumbBlob,
      thumbBlobURL,
      thumbFileName,
      result.id,
      -1,
      false
    )
    setTimeout(() => {
      URL.revokeObjectURL(thumbBlobURL)
    }, 3000)
  }

  private async sendDownload(
    blob: Blob,
    blobURL: string,
    fileName: string,
    id: string,
    taskBatch: number,
    reply = true
  ) {
    // 如果任务已停止，就不再下载这个文件
    if (this.cancel) {
      // 释放 blob URL
      URL.revokeObjectURL(blobURL)
      return
    }

    let dataURL: string | undefined = undefined
    if (Config.sendDataURL) {
      dataURL = await Utils.blobToDataURL(blob)
    }

    const sendData: SendToBackEndData = {
      msg: reply ? 'save_work_file' : 'no_reply',
      fileName: fileName,
      id,
      taskBatch,
      blobURL,
      blob: Config.sendBlob ? blob : undefined,
      dataURL,
    }

    // 使用 a.download 来下载文件时，不调用 downloads API
    if (settings.rememberTheLastSaveLocation) {
      // 移除文件夹，只保留文件名部分，因为这种方式不支持建立文件夹
      // 此时如果带有路径符号 /，会被浏览器自动替换成下划线 _
      // 所以我直接去掉了路径部分，只保留了文件名
      const lastName = fileName.split('/').pop()
      Utils.downloadFile(blobURL, lastName!)
      // 向 SW 传递消息，使其返回下载成功的消息（但实际上没有使用浏览器的 downloads API 来下载这个文件）
      sendData.msg = 'save_work_file_a_download'
      browser.runtime.sendMessage(sendData)
      return
    }

    // 发送给浏览器下载
    try {
      browser.runtime.sendMessage(sendData)
      EVT.fire('sendBrowserDownload')
    } catch (error) {
      let msg = `${lang.transl('_发生错误原因')}<br>{}${lang.transl(
        '_请刷新页面'
      )}`
      if ((error as Error).message.includes('Extension context invalidated')) {
        msg = msg.replace('{}', lang.transl('_扩展程序已更新'))
        log.error(msg)
        msgBox.error(msg)
        return
      }

      msg = msg.replace('{}', lang.transl('_未知错误'))
      log.error(msg)
      msgBox.error(msg)
    }
  }
}

export { Download }
