import { API } from './API'
import { Config } from './Config'
import { ArtworkData, NovelData } from './crawl/CrawlResult'
import { fileName } from './FileName'
import { lang } from './Language'
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
        toast.error(`Error: ${error.status}`)
      } else {
        toast.error(`Failed to request work data`)
      }
    }
  }

  private async copy(data: ArtworkData | NovelData) {
    let imageUrl = ''
    if ('illustType' in data.body) {
      // 对于图片作品，使用 1200px 的普通尺寸图片
      imageUrl = data.body.urls.regular
    } else {
      // 对于小说，使用封面图片
      imageUrl = data.body.coverUrl
    }

    const text = this.convert(data, 'text')
    const html = this.convert(data, 'html')
    await this.copyMixedContent(imageUrl, text, html)
    toast.success(lang.transl('_已复制'))
  }

  private async copyMixedContent(
    imageUrl: string,
    plainText: string,
    htmlText: string
  ) {
    try {
      let dataUrl = ''
      const needCopyThumb = settings.copyThumb && imageUrl
      if (needCopyThumb) {
        toast.show(lang.transl('_正在加载缩略图'))
        // 先使用 fetch 获取图片的 Blob
        // 这可以解决 Tainted canvases 的问题，但现在没有使用 canvas 了
        const blob = await fetch(imageUrl).then((res) => res.blob())

        // 然后把图片的 Blob 转换为 DataURL
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }

      // 然后使用 canvas 把图片的 Blob 转换为 png 格式的 Blob
      // const image = new Image()
      // image.src = URL.createObjectURL(blob)
      // await new Promise((resolve) => (image.onload = resolve))

      // const canvas = document.createElement('canvas')
      // canvas.width = image.width
      // canvas.height = image.height
      // const ctx = canvas.getContext('2d')
      // if (!ctx) {
      //   throw new Error('Failed to get canvas context')
      // }
      // ctx.drawImage(image, 0, 0)

      // 现在不需要使用 imageBlob 了
      // const imageBlob = await new Promise<Blob>((resolve, reject) => {
      //   canvas.toBlob((blob) => {
      //     if (blob) {
      //       resolve(blob)
      //     } else {
      //       reject(new Error('Failed to convert canvas to blob'))
      //     }
      //   }, 'image/png')
      // })

      // 构造 HTML 内容
      const imgTag = dataUrl ? `<img src="${dataUrl}" /><br>` : ''
      const htmlContent = `<div>${imgTag}${htmlText}</div>`
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' })

      // 构造纯文本内容
      const textBlob = new Blob([plainText], { type: 'text/plain' })

      const clipboardItem = new ClipboardItem({
        // 复制富文本格式，这样在 QQ、Word 等软件里粘贴时，才能同时粘贴图片和文本
        'text/html': htmlBlob,
        // 复制纯文本内容是为了提供兼容性。在某些不支持解析富文本格式的软件里，可以粘贴纯文本内容
        'text/plain': textBlob,
        // 不使用图片格式，因为某些软件会优先粘贴图片内容，导致其他内容被忽略，也就是不会粘贴文本内容
        // 'image/png': imageBlob,
      })

      // 写入混合内容
      await navigator.clipboard.write([clipboardItem])

      // 还有一种方法是把 html 内容写入到一个 div 里，然后使用 document.execCommand('copy') 复制
      // 但这个方法依然无法在 Telegram 里同时粘贴图片和文本

      // 踩了一些坑：
      // 1. 要复制混合内容的话（图片+文本），需要把内容放在一个 ClipboardItem 里
      // 不能分别放在两个 ClipboardItem 里，最后在 write 里混合。因为 Chrome 尚未实现此功能
      // 2. 图片的 MIME 必须为 png。虽然理论上支持 jpeg，但是 Chrome 尚未实现对 jpeg 的支持
      // 3. 缩略图的网址是 i.pximg.net，与页面网址 pixiv.net 不同，
      // 所以无法直接用缩略图网址作为 img.src，然后渲染到 canvas 得到 imageBlob，因为浏览器会报错：
      // Uncaught SecurityError: Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported.
      // 4. 即使成功复制了图片+文本，但在粘贴到其他应用（如 QQ、Word）时，可能只会粘贴图片或文本的其中之一。
      // 这是因为复制的内容的格式与某些软件所要求的格式不同。
      // 在 QQ 和 Word 里，粘贴的优先级是 text/html > image/png > text/plain
      // 在许多应用程序里粘贴时，如果存在多种内容格式，只会粘贴优先级最高的那一项内容
      // 如果只使用 text/html，可以兼容 QQ、微信、Word，但是在 Telegram、网页的 textarea 里存在问题，不会粘贴出任何内容
      // 这可能是因为这些地方不支持解析 html 格式的富文本
      // 为了提高兼容性，同时复制了 text/plain 内容，这样至少可以粘贴文本
    } catch (err) {
      toast.error(lang.transl('_复制失败'))
      console.error('复制失败:', err)
      console.trace()
    }
  }

  /** 把用户设置的内容格式转换成文本，目标格式可选纯文本或 html */
  // 需要处理命名标记，这类似于生成文件名，但有所不同，因为此时：
  // - 不需要处理不能作为文件名的特殊字符
  // - 不需要建立文件夹，所以不需要处理非法的文件夹路径
  // - 忽略某些命名设置，例如第一张图不带序号、移除用户名中的 @ 符号、创建文件夹相关的设置等
  // - 额外添加了 {n} 和 {url} 标记
  // - 在每个标签前面加上 # 符号
  // - {id} 等同于 {id_num}，是纯数字
  // - {p_num} 总是 0
  private convert(
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
    // 这是为了防止某个标记为空时，产生连续的换行。例如 {AI}{n} 标记可能会产生连续的换行
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
}

const copyWorkInfo = new CopyWorkInfo()
export { copyWorkInfo }
