import browser from 'webextension-polyfill'
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
import { settings } from '../setting/Settings'
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
    // 获取文件名
    let _fileName = fileName.createFileName(arg.result)

    // 重置当前下载记录条
    this.setProgressBar(_fileName, 0, 0)

    await downloadInterval.wait()
    this.lastRequestTime = Date.now()

    if (arg.result.type === 3) {
      // 小说文件单独处理，因为它是动态生成的，生成后就可以直接下载，不需要走下面的 Fetch 请求流程
      const blob = await this.getNovelFileURL(arg.result.novelMeta, _fileName)
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
    const url = arg.result[settings.imageSize] || arg.result.original

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
      const sizeCheck = await this.checkSize(arg.result, total)
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
      const convertResult = await this.convertUgoira(arg.result, file)
      file = convertResult || file

      if (this.cancel) {
        return
      }

      // 生成下载链接
      const blobURL = URL.createObjectURL(file)

      // 对插画、漫画进行颜色检查
      // 在这里进行检查的主要原因：抓取时只会检查单图作品的颜色，不会检查多图作品的颜色。所以多图作品需要在这里进行检查。
      // 另一个原因：如果抓取时没有设置图片的颜色条件，下载时才设置颜色条件，那么就必须在这里进行检查。
      await this.checkColor(arg.result, blobURL)

      // 从第二张图片开始，检查原图的实际宽高。如果宽高与抓取结果里的不同，则重新生成文件名
      const newFileName = await this.checkNamingRulePX(arg.result, blobURL)
      if (newFileName && newFileName !== _fileName) {
        _fileName = newFileName
        this.setProgressBar(newFileName, file.size, file.size)
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

      // 网络错误时 fetch 会抛出 TypeError，此时 status 为 0
      // 储存重试的时间戳等信息
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
    log.log(lang.transl('_下载器会暂时跳过它'))
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

  /** 转换动图，返回 Blob 文件。如果不需要转换，或者转换失败，会返回 null */
  private async convertUgoira(result: Result, zipFile: Blob) {
    const convertExt = ['webm', 'gif', 'apng'] as const
    const ext = settings.ugoiraSaveAs as (typeof convertExt)[number]
    // ext 有可能是 'zip'，这会导致 includes 时产生类型错误，所以这里断言来避免报错

    // 当下载图片的方形缩略图时，不转换动图，因为此时下载的是作品的静态缩略图，无法进行转换
    if (
      !convertExt.includes(ext) ||
      !result.ugoiraInfo ||
      settings.imageSize === 'thumb'
    ) {
      return null
    }

    try {
      const blob = await convertUgoira[ext](
        zipFile,
        result.ugoiraInfo,
        result.idNum
      )
      return blob || null
    } catch (error) {
      const msg =
        lang.transl('_动图转换失败的提示', Tools.createWorkLink(result.idNum)) +
        '<br>' +
        lang.transl('_下载器会暂时跳过它')
      log.error(msg)
      this.error = true
      EVT.fire('downloadError', result.id)
      return null
    }
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
    if (result.type === 0 || result.type === 1) {
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

  private async sendDownload(
    blob: Blob,
    blobURL: string,
    fileName: string,
    id: string,
    taskBatch: number
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
      msg: 'save_work_file',
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
