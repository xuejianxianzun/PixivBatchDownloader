import { API } from '../API'
import { lang } from '../Language'
import { BookmarkResult } from '../crawl/CrawlResult'
import { EVT } from '../EVT'
import { toast } from '../Toast'
import { bookmark } from '../Bookmark'
import { Tools } from '../Tools'
import { msgBox } from '../MsgBox'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'

// 一键收藏所有作品
// 可以传入页面上的作品元素列表，也可以直接传入 id 列表
// 一次任务里要么全部传递插画，要么全部传递小说，不要混合
type WorkType = 'illusts' | 'novels'

export interface IDList {
  type: WorkType
  id: string
}

type BookmarkData = BookmarkResult & {
  type: WorkType
}

class BookmarkAllWorks {
  constructor(tipWrap?: HTMLElement) {
    if (tipWrap) {
      this.tipWrap = tipWrap

      const span = tipWrap.querySelector('span')
      if (span) {
        this.textSpan = span
      } else {
        this.textSpan = tipWrap
      }
    }
  }

  private idList: IDList[] = []

  private bookmarKData: BookmarkData[] = []

  private tipWrap: HTMLElement = document.createElement('button')
  private textSpan: HTMLSpanElement = document.createElement('span')

  // 传递 workList，这是作品列表元素的合集。代码会尝试分析每个作品元素中的超链接，提取出作品 id
  // 如果传递的作品是本页面上的作品，可以省略 type。代码会根据页面 url 判断是图片还是小说。
  // 如果传递的作品不是本页面上的，为防止误判，需要显式传递 type
  public sendWorkList(
    list: NodeListOf<HTMLElement> | HTMLElement[],
    type?: WorkType
  ) {
    this.reset()

    type =
      type ??
      (window.location.pathname.includes('/novel') ? 'novels' : 'illusts')

    const regExp = type === 'illusts' ? /\/artworks\/(\d*)/ : /\?id=(\d*)/
    for (const el of list) {
      const a = el.querySelector('a')
      if (a) {
        // "https://www.pixiv.net/artworks/82618568"
        // "https://www.pixiv.net/novel/show.php?id=12350618"
        const test = regExp.exec(a.href)
        if (test && test.length > 1) {
          this.idList.push({
            type,
            id: test[1],
          })
        }
      }
    }

    this.startBookmark()
  }

  // 直接传递 id 列表
  public sendIdList(list: IDList[]) {
    this.reset()

    this.idList = list

    this.startBookmark()
  }

  private reset() {
    this.idList = []
    this.bookmarKData = []
  }

  // 启动收藏流程
  private async startBookmark() {
    if (this.idList.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      return
    }

    this.textSpan.textContent = `Checking`
    this.tipWrap.setAttribute('disabled', 'disabled')

    await this.getTagData()
    await this.addBookmarkAll()
    this.complete()
  }

  // 获取每个作品的 tag 数据
  private async getTagData() {
    for (const id of this.idList) {
      this.textSpan.textContent = `Get data ${this.bookmarKData.length} / ${this.idList.length}`
      const noTagData = {
        type: id.type,
        id: id.id,
        tags: [],
        restrict: false,
      }
      try {
        // 如果下载器的收藏按钮设置为“不添加标签”，就不需要请求作品的数据
        if (!settings.widthTagBoolean) {
          this.bookmarKData.push(noTagData)
          continue
        }

        // 如果作品数量大于一定数量，则启用慢速抓取，以免在获取作品数据时发生 429 错误
        const delay = this.idList.length >= 120 ? settings.slowCrawlDealy : 0
        await Utils.sleep(delay)
        let data
        if (id.type === 'novels') {
          data = await API.getNovelData(id.id)
        } else {
          data = await API.getArtworkData(id.id)
        }

        this.bookmarKData.push({
          type: id.type,
          id: data.body.id,
          tags: Tools.extractTags(data),
          restrict: false,
        })
      } catch (error) {
        // 出现错误时，添加没有 tags 的数据。因为对于添加收藏的任务来说，附带 tags 不是必须的
        this.bookmarKData.push(noTagData)
      }
    }
  }

  // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
  private async addBookmarkAll() {
    let index = 0
    for (const data of this.bookmarKData) {
      this.textSpan.textContent = `Add bookmark ${index} / ${this.bookmarKData.length}`
      const status = await bookmark.add(
        data.id,
        data.type,
        data.tags,
        undefined,
        undefined,
        true
      )

      if (status === 403) {
        const msg = Tools.addBookmark403Error()
        msgBox.error(msg)
        break
      }

      index++
    }
  }

  private complete() {
    this.textSpan.textContent = `✓ Complete`
    this.tipWrap.removeAttribute('disabled')
    toast.success(lang.transl('_收藏作品完毕'))
    EVT.fire('bookmarkModeEnd')
  }
}

export { BookmarkAllWorks }
