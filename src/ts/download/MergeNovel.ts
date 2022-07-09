import { store } from '../store/Store'
import { Result } from '../store/StoreType'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { downloadNovelCover } from '../download/DownloadNovelCover'

// 单个小说的数据
interface NovelData {
  /**小说在系列中的排序，是从 1 开始的数字 */
  no: number
  title: string
  content: string
}

// https://github.com/bbottema/js-epub-maker
declare const EpubMaker: any

class MergeNovel {
  constructor() {
    this.init()
  }

  private readonly CRLF = '\n' // pixiv 小说的换行符

  /**在文件开头添加的元数据 */
  private meta = ''

  private init() {
    window.addEventListener(EVT.list.crawlFinish, () => {
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

    const firstResult = store.resultMeta[0]

    // 汇总小说数据
    const allNovelData: NovelData[] = []
    for (const result of allResult) {
      allNovelData.push({
        no: result.seriesOrder!,
        title: result.title,
        content: result.novelMeta!.content,
      })
    }

    // 生成 meta 文本
    this.meta = ''
    if (settings.saveNovelMeta) {
      const metaArray: string[] = []
      // 系列标题
      metaArray.push(firstResult.seriesTitle!)
      // 作者
      metaArray.push(firstResult.user)
      // 网址链接
      const link = `https://www.pixiv.net/novel/series/${firstResult.seriesId}`
      metaArray.push(link + this.CRLF.repeat(2))
      // 设定资料
      if (store.novelSeriesGlossary) {
        metaArray.push(store.novelSeriesGlossary)
      }

      this.meta = metaArray.join(this.CRLF.repeat(2))
    }

    // 生成小说文件并下载
    let file: Blob | null = null
    if (settings.novelSaveAs === 'txt') {
      file = this.makeTXT(allNovelData)
    } else {
      file = await this.makeEPUB(allNovelData, firstResult)
    }

    const url = URL.createObjectURL(file)
    const fileName = `${firstResult.seriesTitle}-tags_${firstResult.tags}-user_${firstResult.user}-seriesId_${firstResult.seriesId}.${settings.novelSaveAs}`
    Utils.downloadFile(url, fileName)

    states.mergeNovel = false
    EVT.fire('downloadComplete')

    // 保存第一个小说的封面图片
    // 实际上系列的封面不一定是第一个小说的封面，这里用第一个小说的封面凑合一下
    downloadNovelCover.downloadOnMergeNovel(
      firstResult.novelMeta!.coverUrl,
      fileName
    )

    store.reset()
  }

  private makeTXT(novelDataArray: NovelData[]) {
    const result: string[] = []

    if (settings.saveNovelMeta) {
      result.push(this.meta)
    }

    for (const data of novelDataArray) {
      // 添加章节名
      result.push(`${this.chapterNo(data.no)} ${data.title}`)
      // 在章节名与正文之间添加换行
      result.push(this.CRLF.repeat(2))
      // 添加正文
      // 替换换行标签，移除 html 标签
      result.push(
        data.content.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, '')
      )
      // 在正文结尾添加换行标记，使得不同章节之间区分开来
      result.push(this.CRLF.repeat(4))
    }

    return new Blob(result, {
      type: 'text/plain',
    })
  }

  private makeEPUB(
    novelDataArray: NovelData[],
    firstResult: Result
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      // 添加一些元数据
      let epubData = new EpubMaker()
        .withTemplate('idpf-wasteland')
        .withAuthor(Utils.replaceUnsafeStr(firstResult.novelMeta!.userName))
        .withModificationDate(new Date(firstResult.novelMeta!.createDate))
        .withRights({
          description: firstResult.novelMeta!.description,
          license: '',
        })
        .withAttributionUrl(
          `https://www.pixiv.net/novel/show.php?id=${firstResult.novelMeta!.id}`
        )
        .withCover(firstResult.novelMeta!.coverUrl, {
          license: '',
          attributionUrl: '',
        })
        .withTitle(Utils.replaceUnsafeStr(firstResult.seriesTitle!))

      // 下面注释的伪代码是用于创建二级目录用的。目前 pixiv 的小说只需要一层目录就够了，所以这里的代码未被使用
      // const Section = new EpubMaker.Section(...........)
      // for (const data of novelDataArray) {
      //   Section.withSubSection(
      //     new EpubMaker.Section(...........)
      //   )
      // }
      // epubData = epubData.withSection(Section)

      if (settings.saveNovelMeta) {
        epubData.withSection(
          new EpubMaker.Section(
            'chapter',
            0,
            {
              title: lang.transl('_设定资料'),
              content: Tools.replaceEPUBText(this.meta),
            },
            true,
            true
          )
        )
      }

      // 为每一篇小说创建一个章节
      for (const data of novelDataArray) {
        // 创建 epub 文件时不需要在标题和正文后面添加换行符
        epubData.withSection(
          new EpubMaker.Section(
            'chapter',
            data.no,
            {
              title: `${this.chapterNo(data.no)} ${data.title}`,
              content: Tools.replaceEPUBText(data.content),
            },
            true,
            true
          )
          // 倒数第二个参数是 includeInToc，必须为 true，否则某些小说阅读软件无法读取章节信息
          // includeInToc 的作用是在 .ncx 文件和 nav.xhtml 文件里添加导航信息
        )
      }

      epubData.makeEpub().then((blob: Blob) => {
        resolve(blob)
      })
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
    // 我还尝试过使用 #1 这样的编号，但是这种方式并不可靠，有的小说可以分章有的小说不可以，我也不知道怎么回事
  }
}

new MergeNovel()
