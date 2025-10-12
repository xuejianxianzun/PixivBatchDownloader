import { API } from './API'
import { Config } from './Config'
import { ArtworkData, NovelData } from './crawl/CrawlResult'
import { fileName } from './FileName'
import { lang } from './Language'
import { msgBox } from './MsgBox'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { saveArtworkData } from './store/SaveArtworkData'
import { saveNovelData } from './store/SaveNovelData'
import { IDData } from './store/StoreType'
import { toast } from './Toast'
import { Tools } from './Tools'
import { DateFormat } from './utils/DateFormat'

class CopyWorkInfo {
  public async receive(idData: IDData) {
    const id = idData.id
    const unlisted = pageType.type === pageType.list.Unlisted
    try {
      // 这里不使用 cacheWorkData中的缓存数据，因为某些数据（如作品的收藏状态）可能已经发生变化
      if (idData.type === 'novels') {
        const data = await API.getNovelData(id, unlisted)
        await saveNovelData.save(data)
        this.copy(data)
      } else {
        const data = await API.getArtworkData(id, unlisted)
        await saveArtworkData.save(data)
        this.copy(data)
      }
    } catch (error: Error | any) {
      if (error.status) {
        toast.error(
          `${lang.transl('_获取作品数据失败')}: ${lang.transl('_错误代码')} ${error.status}`
        )
      } else {
        toast.error(lang.transl('_获取作品数据失败'))
      }
    }
  }

  // 类型守卫
  private isImageWork(data: ArtworkData | NovelData): data is ArtworkData {
    return 'illustType' in data.body
  }

  private async copy(data: ArtworkData | NovelData) {
    if (
      !settings.copyFormatImage &&
      !settings.copyFormatHtml &&
      !settings.copyFormatText
    ) {
      msgBox.error(lang.transl('_至少需要选择一种复制格式'), {
        title: lang.transl('_复制失败'),
      })
      return
    }

    try {
      const copyData: {
        'text/html'?: Blob
        'text/plain'?: Blob
        'image/png'?: Blob
        'text/rtf'?: Blob
      } = {}

      if (settings.copyFormatText) {
        // 构造纯文本内容
        const plainText = this.convertTextFormat(data, 'text')
        const textBlob = new Blob([plainText], { type: 'text/plain' })
        copyData['text/plain'] = textBlob
      }

      const needCopyImage = settings.copyFormatImage || settings.copyFormatHtml
      if (needCopyImage) {
        // 对于图片作品，使用 1200px 的普通尺寸图片
        // 对于小说，使用封面图片
        const imageUrl = this.isImageWork(data)
          ? data.body.urls.regular
          : data.body.coverUrl
        if (!imageUrl) {
          toast.error(
            lang.transl('_错误') + ': ' + lang.transl('_没有找到可用的图片网址')
          )
          return
        }

        toast.show(lang.transl('_正在加载缩略图'))

        // 先使用 fetch 获取图片的 Blob
        // 这可以解决 Tainted canvases 的问题
        const jpgBlob = await fetch(imageUrl).then((res) => res.blob())

        // 添加 image/png 内容
        // 缩略图的格式都是 jpg，但 Chrome 目前不支持复制 image/jpeg 内容，所以需要转换成 png 格式
        if (settings.copyFormatImage) {
          // 使用 canvas 把图片的 Blob 转换为 png 格式的 Blob
          const image = new Image()
          const url = URL.createObjectURL(jpgBlob)
          image.src = url
          await new Promise((resolve) => (image.onload = resolve))

          const canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw new Error('Failed to get canvas context')
          }
          ctx.drawImage(image, 0, 0)

          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to convert canvas to blob'))
              }
            }, 'image/png')
          })
          URL.revokeObjectURL(url)
          // 添加 'image/png' 类型的内容，也就是 CF_DIB
          // 注意：某些软件如 QQ、微信、Telegram 会优先粘贴图片内容。
          // 当存在 'image/png' 内容时，会导致其他内容被忽略，也就是只会粘贴图片，不会粘贴文本
          copyData['image/png'] = pngBlob
        }

        // 添加 text/html 内容
        // 此时图片转换成了 DataURL，所以可以复制 jpg 文件，不需要转换成 png 格式
        if (settings.copyFormatHtml) {
          // 把图片的 Blob 转换为 DataURL
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(jpgBlob)
          })

          // 构造富文本内容
          // 这样在 Word、微信里粘贴时，可以同时粘贴图片和文本
          // 本来在 QQ 里也可以，但是最新版 QQ 里粘贴图文混合内容时，图片会在发送时加载失败
          const htmlText = this.convertTextFormat(data, 'html')
          const htmlContent = `<div><img src="${dataUrl}"><p>${htmlText}</p></div>`
          const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
          copyData['text/html'] = htmlBlob
        }

        // // 构造 RTF 格式内容，同时包含图片和文字内容
        // Chrome 141 版本尚不支持复制 RTF 内容，可用性检测为 false，实际执行也报错不支持写入 rtf 格式
        // 所以这部分代码注释掉了
        // ClipboardItem.supports('text/rtf')
        // const rtfContent = await this.generateRtfWithImage(blob, htmlText, blob.type as 'image/png' | 'image/jpeg');
        // const rtfBlob = new Blob([rtfContent], { type: 'text/rtf' });
        // copyData['text/rtf'] = rtfBlob
      }

      const clipboardItem = new ClipboardItem(copyData)
      await navigator.clipboard.write([clipboardItem])
      toast.success(lang.transl('_已复制'))

      // 复制混合内容（富文本）还有一种方法：
      // 是把 html 内容写入到一个隐藏的 contenteditable div 里，然后使用 document.execCommand('copy') 复制
      // 但这个方法的效果和上面的方法一致，在各个软件里粘贴时的表现是一样的，所以没必要使用

      // 踩的一些坑：
      // 1. 要复制混合内容的话（图片+文本），需要把内容放在一个 ClipboardItem 里。
      // 不能分别放在两个 ClipboardItem 里，最后在 write 里混合。因为 Chrome 尚未实现此功能。
      // 2. 图片的 MIME 必须为 png。虽然理论上支持 jpeg，但是 Chrome 尚未实现对 jpeg 的支持，复制时会报错。
      // 3. 缩略图的网址是 i.pximg.net，与页面网址 pixiv.net 不同，
      // 所以无法直接用缩略图网址作为 img.src，然后渲染到 canvas 得到 imageBlob，因为浏览器会报错：
      // Uncaught SecurityError: Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported.
      // 4. 即使成功复制了图片+文本，但在粘贴到其他应用时，可能只会粘贴图片或文本的其中之一。
      // 这是因为复制的内容的格式与某些软件所要求的格式不同，并且有些软件只会粘贴优先级最高的内容。
      // 在 Word 里，粘贴的优先级是 text/html > image/png > text/plain。它会优先粘贴 text/html（如果有），并忽略其他内容
      // image/png 在许多通讯软件里（我测试了 QQ、微信、Telegram）的优先级最高。如果有 image/png 的话，就会粘贴图片，并忽略其他内容
      // text/html 可以同时复制图片和文本，可以兼容 QQ、微信、Word，但是在 Telegram 和网页的 textarea 里无法粘贴，可见 Telegram 不支持 text/html。
      // text/plain 的兼容性最好，但无法携带图片内容。
      // 5. 在 Windows 上的最新版 QQ 9.9.21 里，复制富文本 text/html 内容，在 QQ 里粘贴后发送时，会显示图片“加载失败”，并导致消息发送失败。
      // 但是在上个版本的 QQ 里，以及在当前的微信里是正常的。我觉得这应该是 QQ 在最新版本里产生的 bug。
      // 现在我尝试了把复制的图片从 jpeg 格式改为 png、把 jpeg 图片转换为 png 格式再复制、修改 html 内容只保留 img 标签、构造 RTF 格式并复制、使用另一种复制方法，都无法解决
      // 目前解决办法只有一种：在复制项里添加 'image/png' 类型，这样在 QQ 里可以粘贴并发送，但是这样会导致在 QQ 里只能粘贴图片，不会粘贴文字
      // 因为在 QQ 里粘贴时，'image/png' 的优先级是最高的，其他类型的内容会被忽略
    } catch (err) {
      // 复制失败时会显示报错信息，我见过的有两种情况：
      // 1. 用户点击复制按钮后切换到了其他应用，导致网页失去了焦点，这会导致下载器写入剪贴板失败
      // 2. 用户排除了所有复制格式，导致复制了空对象。不过这个情况现在我会预先检查
      // 3. 由于这个 try catch 也包含了网络请求部分，所以网络请求出错应该也会在这里显示详细信息
      msgBox.error(err as any, {
        title: lang.transl('_复制失败'),
      })
      console.error('复制失败:', err)
      console.trace()
    }
  }

  /** 把用户设置的文本格式转换成实际文本，目标格式可选纯文本或 html */
  // 需要处理命名标记，这类似于生成文件名，但有所不同，因为此时：
  // - 不需要处理不能作为文件名的特殊字符
  // - 不需要建立文件夹，所以不需要处理非法的文件夹路径
  // - 忽略某些命名设置，例如第一张图不带序号、移除用户名中的 @ 符号、创建文件夹相关的设置等
  // - 额外添加了 {n} 和 {url} 标记
  // - 在每个标签前面加上 # 符号
  // - {id} 等同于 {id_num}，是纯数字
  // - {p_num} 总是 0
  private convertTextFormat(
    data: ArtworkData | NovelData,
    format: 'text' | 'html' = 'text'
  ) {
    const page_title = Tools.getPageTitle()
    const page_tag = Tools.getTagFromURL()
    const body = data.body
    const type = 'illustType' in body ? body.illustType : 3
    const tags = Tools.extractTags(data).map((str) => '#' + str)
    const tagsWithTransl = Tools.extractTags(data, 'both').map(
      (str) => '#' + str
    )
    const tagsTranslOnly = Tools.extractTags(data, 'transl').map(
      (str) => '#' + str
    )

    // 如果作品是 AI 生成的，但是 Tags 里没有 AI 生成的标签，则添加
    const aiMarkString = Tools.getAIGeneratedMark(body.aiType)
    const AITag = '#' + aiMarkString
    if (aiMarkString) {
      if (tags.includes(AITag) === false) {
        tags.unshift(AITag)
        tagsWithTransl.unshift(AITag)
        tagsTranslOnly.unshift(AITag)
      }
    }
    const AI = body.aiType === 2 || tags.includes(AITag)

    const seriesNavData = body.seriesNavData

    // 在 html 格式里，使用 <br> 换行
    const lf = format === 'text' ? '\n' : '<br>'
    // 在 html 格式里，给作品的 url 加上超链接
    // 使用 n、i 缩写，一方面是因为简短，另一方面是因为在 QQ 里，缩写没有被屏蔽，可以点击链接直接打开
    // 如果把 i 换成完整的 artworks，会被 QQ 屏蔽，点击链接会被拦截
    const link = `https://www.pixiv.net/${type === 3 ? 'n' : 'i'}/${body.id}`
    const url =
      format === 'text' ? link : `<a href="${link}" target="_blank">${link}</a>`
    // 在 html 格式里，给作品 id 也加上超链接
    const id =
      format === 'text'
        ? body.id
        : `<a href="${link}" target="_blank">${body.id}</a>`
    // 在 html 格式里，给作者名字和作者 id 也加上超链接
    const userLink = `https://www.pixiv.net/users/${body.userId}`
    const user =
      format === 'text'
        ? body.userName
        : `<a href="${userLink}" target="_blank">${body.userName}</a>`
    const userID =
      format === 'text'
        ? body.userId
        : `<a href="${userLink}" target="_blank">${body.userId}</a>`
    // 在 html 格式里，给系列标题也加上超链接
    let seriesTitle = ''
    if (seriesNavData) {
      if (format === 'text') {
        seriesTitle = seriesNavData.title
      } else {
        // 图像系列和小说系列的网址格式不同，需要分别处理
        if (type !== 3) {
          seriesTitle = `<a href="https://www.pixiv.net/user/${body.userId}/series/${seriesNavData.seriesId}" target="_blank">${seriesNavData.title}</a>`
        } else {
          seriesTitle = `<a href="https://www.pixiv.net/novel/series/${seriesNavData.seriesId}" target="_blank">${seriesNavData.title}</a>`
        }
      }
    }

    const cfg = {
      '{n}': lf,
      '{url}': url,
      '{p_title}': page_title,
      '{page_title}': page_title,
      '{p_tag}': '#' + page_tag,
      '{page_tag}': '#' + page_tag,
      '{id}': id,
      '{id_num}': id,
      '{p_num}': 0,
      '{rank}': 'rank' in data.body ? `#${data.body.rank}` : '',
      '{title}': body.title,
      '{user}': user,
      '{userid}': userID,
      '{user_id}': userID,
      '{px}': this.getPX(body),
      '{tags}': tags.join(settings.tagsSeparator),
      '{tags_translate}': tagsWithTransl.join(settings.tagsSeparator),
      '{tags_transl_only}': tagsTranslOnly.join(settings.tagsSeparator),
      '{bmk}': body.bookmarkCount,
      '{bmk_id}': body.bookmarkData ? body.bookmarkData.id : '',
      '{bmk_1000}': fileName.getBKM1000(body.bookmarkCount),
      '{like}': body.likeCount,
      '{view}': body.viewCount,
      '{date}': DateFormat.format(body.createDate, settings.dateFormat),
      '{upload_date}': DateFormat.format(body.uploadDate, settings.dateFormat),
      '{task_date}': DateFormat.format(new Date(), settings.dateFormat),
      '{type}': Config.worksTypeName[type],
      '{AI}': AI ? 'AI' : '',
      '{series_title}': seriesTitle,
      '{series_order}': seriesNavData ? '#' + seriesNavData.order : '',
      '{series_id}': seriesNavData ? seriesNavData.seriesId : '',
      '{sl}': 'sl' in body ? body.sl : '',
    }

    // 替换标记
    let str = settings.copyWorkInfoFormat
    Object.entries(cfg).forEach(([key, val]) => {
      // console.log(`${key}\t${val}`)
      str = str.replace(new RegExp(key, 'g'), val as string)
    })
    // 以换行符分割，如果某一行的内容是空字符串，则移除这一行
    // 这是为了防止某个标记为空时，产生连续的换行
    // 例如 {AI} 标记的结果为空时，{AI}{n} 就会产生一个空白的换行
    str = str
      .split(lf)
      .filter((str) => str !== '')
      .join(lf)
    return str
  }

  private getPX(body: ArtworkData['body'] | NovelData['body']) {
    if ('width' in body && 'height' in body) {
      return body.width + 'x' + body.height
    }
    return ''
  }

  // RTF 生成函数
  private async generateRtfWithImage(
    imageBlob: Blob,
    text: string,
    imageType: 'image/png' | 'image/jpeg' = 'image/jpeg'
  ): Promise<string> {
    // 获取图片尺寸
    const img = new Image()
    const imageUrl = URL.createObjectURL(imageBlob)
    img.src = imageUrl
    const { width, height } = await new Promise<{
      width: number
      height: number
    }>((resolve) => {
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
    })
    URL.revokeObjectURL(imageUrl)

    // 转换图片为 hex (PNG 假设)
    const arrayBuffer = await imageBlob.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const hex = Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join('') // 无空格，大写

    // Twips: 假设 72 DPI，1440 twips/inch
    const picwgoal = Math.round((width * 1440) / 72)
    const pichgoal = Math.round((height * 1440) / 72)

    // RTF 模板：简单结构，文本 + 图片
    const blipType = imageType === 'image/jpeg' ? '\\jpegblip' : '\\pngblip'
    const rtf = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}}\\f0\\fs24 ${this.escapeRtfText(text)} {\\pict\\${blipType}\\picwgoal${picwgoal}\\pichgoal${pichgoal} ${hex}}\\par }`

    return rtf
  }

  // 转义 RTF 文本（简单版，处理常见字符）
  private escapeRtfText(text: string): string {
    return text
      .replace(/\\/g, '\\\\') // 反斜杠
      .replace(/{/g, '\\{') // 花括号
      .replace(/}/g, '\\}') // 花括号
      .replace(/\n/g, '\\par ') // 换行
      .replace(/\r/g, '') // 忽略
  }
}

const copyWorkInfo = new CopyWorkInfo()
export { copyWorkInfo }
