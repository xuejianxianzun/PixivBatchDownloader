import { store } from '../store/Store'
import { Result } from '../store/StoreType'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { downloadNovelCover } from '../download/DownloadNovelCover'
import { downloadNovelEmbeddedImage } from './DownloadNovelEmbeddedImage'
import { log } from '../Log'
import { API } from '../API'
import { NovelSeriesData } from '../crawl/CrawlResult'

declare const jEpub: any

// 单个小说的数据
interface NovelData {
  /**小说在系列中的排序，是从 1 开始的数字 */
  no: number
  title: string
  description: string
  content: string
  embeddedImages: null | {
    [key: string]: string
  }
}

class MergeNovel {
  constructor() {
    this.init()
  }

  private readonly CRLF = '\n' // pixiv 小说的换行符

  /** 这个系列小说的元数据 */
  private seriesMeta = ''

  private init() {
    window.addEventListener(EVT.list.crawlComplete, () => {
      window.setTimeout(() => {
        if (states.mergeNovel) {
          this.merge()
        }
      }, 0)
    })
  }

  private async merge() {
    if (
      store.resultMeta.length === 0 ||
      store.resultMeta[0].novelMeta === null
    ) {
      states.mergeNovel = false
      return
    }

    // 因为结果里的小说顺序可能是乱的，所以需要按照小说的序号对结果进行排序
    const allResult = store.resultMeta.sort(
      Utils.sortByProperty('seriesOrder', 'asc')
    )

    // 汇总小说数据
    const allNovelData: NovelData[] = []
    for (const result of allResult) {
      allNovelData.push({
        no: result.seriesOrder!,
        title: Utils.replaceUnsafeStr(result.title),
        content: result.novelMeta!.content,
        embeddedImages: result.novelMeta!.embeddedImages,
        description: result.description,
      })
    }

    // 获取这个系列本身的资料
    const seriesDataJSON = await API.getNovelSeriesData(
      store.resultMeta[0].seriesId!
    )
    const seriesData = seriesDataJSON.body

    // 生成系列小说元数据的文本
    this.seriesMeta = ''

    const title = Tools.replaceEPUBTitle(
      Utils.replaceUnsafeStr(seriesData.title)
    )
    const userName = Tools.replaceEPUBText(
      Utils.replaceUnsafeStr(seriesData.userName)
    )
    if (settings.saveNovelMeta) {
      const metaArray: string[] = []
      // 系列标题
      metaArray.push(title)
      // 作者
      metaArray.push(userName)
      // 网址链接
      const link = `https://www.pixiv.net/novel/series/${seriesData.id}`
      metaArray.push(link + this.CRLF)

      const description = Utils.htmlToText(seriesData.caption)
      metaArray.push(description + this.CRLF.repeat(2))

      // 设定资料
      if (store.novelSeriesGlossary) {
        metaArray.push(
          Utils.htmlToText(store.novelSeriesGlossary) + this.CRLF.repeat(2)
        )
      }

      this.seriesMeta = metaArray.join(this.CRLF)
    }

    // 生成小说文件并下载
    let file: Blob | null = null
    const novelName = `${title}-tags_${seriesData.tags}-user_${userName}-seriesId_${seriesData.id}.${settings.novelSaveAs}`
    if (settings.novelSaveAs === 'txt') {
      file = await this.mergeTXT(allNovelData)
      // 保存为 txt 格式时，在这里下载小说内嵌的图片
      for (const result of allResult) {
        await downloadNovelEmbeddedImage.TXT(
          result.novelMeta!.content,
          result.novelMeta!.embeddedImages,
          novelName,
          'mergeNovel'
        )
      }
    } else {
      file = await this.mergeEPUB(allNovelData, seriesData)
    }

    const url = URL.createObjectURL(file)
    Utils.downloadFile(url, Utils.replaceUnsafeStr(novelName))

    // 下载系列小说的封面图片
    const cover = seriesData.cover.urls.original
    log.log(lang.transl('_下载封面图片'))
    await downloadNovelCover.download(cover, novelName, 'mergeNovel')

    states.mergeNovel = false
    EVT.fire('downloadComplete')
    log.success(lang.transl('_下载完毕'), 2)

    store.reset()
  }

  private async mergeTXT(novelDataArray: NovelData[]): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const result: string[] = []
      if (settings.saveNovelMeta) {
        result.push(this.seriesMeta)
      }

      for (const data of novelDataArray) {
        // 添加章节名
        result.push(`${this.chapterNo(data.no)} ${data.title}`)
        result.push(this.CRLF.repeat(2))
        // 保存每篇小说的元数据，现在只添加了简介
        if (settings.saveNovelMeta) {
          result.push(Utils.htmlToText(data.description))
          result.push(this.CRLF.repeat(2))
        }
        // 添加正文
        // 替换换行标签，移除 html 标签
        result.push(
          data.content.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, '')
        )
        // 在正文结尾添加换行标记，使得不同章节之间区分开来
        result.push(this.CRLF.repeat(4))
      }

      const blob = new Blob(result, {
        type: 'text/plain',
      })
      return resolve(blob)
    })
  }

  private mergeEPUB(
    novelDataArray: NovelData[],
    seriesData: NovelSeriesData['body']
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const link = `https://www.pixiv.net/novel/series/${seriesData.id}`
      const title = Tools.replaceEPUBTitle(
        Utils.replaceUnsafeStr(seriesData.title)
      )
      const userName = Tools.replaceEPUBText(
        Utils.replaceUnsafeStr(seriesData.userName)
      )
      let description = Tools.replaceEPUBText(
        Utils.htmlToText(seriesData.caption)
      )

      // 现在生成的 EPUB 小说里有个“信息”页面，会显示如下数据（就是在下面的 jepub.init 里定义的）：
      // title 系列标题
      // author 作者
      // publisher 系列小说的 URL
      // tags 标签列表
      // description 简介

      // 所以如果需要保存系列小说的元数据，那么把上面未包含的数据添加到 description 里即可
      if (settings.saveNovelMeta) {
        if (store.novelSeriesGlossary) {
          description =
            description +
            '<br/><br/>' +
            Tools.replaceEPUBText(Utils.htmlToText(store.novelSeriesGlossary))
        }
      }

      const jepub = new jEpub()
      jepub.init({
        i18n: lang.type,
        // 对 EPUB 左侧的一些文字进行本地化
        i18n_config: {
          code: lang.type,
          cover: 'Cover',
          toc: lang.transl('_目录'),
          info: lang.transl('_Information'),
          note: 'Notes',
        },
        title: title,
        author: userName,
        publisher: link,
        tags: seriesData.tags,
        description: description,
      })

      jepub.uuid(link)
      jepub.date(new Date(seriesData.updateDate))

      const cover = await fetch(seriesData.cover.urls.original).then(
        (response) => {
          if (response.ok) return response.arrayBuffer()
          throw 'Network response was not ok.'
        }
      )
      jepub.cover(cover)

      // 循环添加小说内容
      for (const novelData of novelDataArray) {
        let content = Tools.replaceEPUBText(novelData.content)
        // 添加小说里的图片
        const imageList = await downloadNovelEmbeddedImage.getImageList(
          content,
          novelData.embeddedImages
        )

        let current = 1
        const total = imageList.length
        for (const image of imageList) {
          log.log(
            lang.transl('_正在下载小说中的插画', `${current} / ${total}`),
            1,
            false
          )
          current++
          if (image.url === null) {
            // 如果引用的图片作品已经不存在，那么它的图片网址会是 null。将其替换为提示
            content = content.replaceAll(
              image.flag,
              `image ${image.id} not found`
            )
            continue
          }

          // 加载图片
          const illustration = await fetch(image.url).then((response) => {
            if (response.ok) {
              return response.blob()
            }
          })
          // 如果图片获取失败，不重试，并将其替换为提示
          if (illustration === undefined) {
            content = content.replaceAll(
              image.flag,
              `fetch ${image.url} failed`
            )
            continue
          }
          jepub.image(illustration, image.id)

          // 将小说正文里的图片标记替换为真实的的图片路径，以在 EPUB 里显示
          const ext = Utils.getURLExt(image.url)
          const imgTag = `<br/><img src="assets/${image.id}.${ext}" /><br/>`
          content = content.replaceAll(image.flag, imgTag)
        }
        log.persistentRefresh()

        const title = Tools.replaceEPUBTitle(
          Utils.replaceUnsafeStr(novelData.title)
        )
        const description = Tools.replaceEPUBText(
          Utils.htmlToText(novelData.description)
        )

        // 保存每篇小说的元数据，现在只添加了简介
        if (settings.saveNovelMeta) {
          content = description + '<br/><br/>' + content
        }

        // 添加正文，这会在 EPUB 里生成一个新的章节
        // 实际上会生成一个对应的 html 文件，如 OEBPS/page-0.html
        jepub.add(`${this.chapterNo(novelData.no)} ${title}`, content)
      }

      const blob = await jepub.generate('blob', (metadata: any) => {
        // console.log('progression: ' + metadata.percent.toFixed(2) + ' %');
        // if (metadata.currentFile) console.log('current file = ' + metadata.currentFile);
      })
      resolve(blob)
    })
  }

  // 在每个小说的开头加上章节编号
  // 在 TXT 格式的小说里添加章节编号，可以使小说阅读软件能够识别章节，以及显示章节导航，提高阅读体验
  // 对于 EPUB 格式的小说，由于其内部自带分章结构，所以并不依赖这里的章节编号
  private chapterNo(number: number | string) {
    // 如果是中文用户，返回“第N章”。这样最容易被国内的小说阅读软件识别出来
    if (lang.type === 'zh-cn' || lang.type === 'zh-tw' || lang.type === 'ja') {
      return `第${number}章`
    } else {
      // 对于其他地区，返回 `Chapter N`。但是由于我没有使用过国外的小说阅读软件，所以并不清楚是否能够起到分章作用
      return `Chapter ${number}`
    }
    // 我还尝试过使用 #1 这样的编号，但是这种方式并不可靠，有的小说可以分章有的小说不可以
  }
}

new MergeNovel()
