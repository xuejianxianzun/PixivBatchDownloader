import { API } from './API'
import { token } from './Token'
import { lang } from './Lang'
import { settings } from './setting/Settings'
import { BookmarkResult } from './CrawlResult.d'
import { EVT } from './EVT'
import { toast } from './Toast'

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
    }
  }

  private idList: IDList[] = []

  private bookmarKData: BookmarkData[] = []

  public tipWrap: HTMLElement = document.createElement('button')

  // 传递 workList，这是作品列表元素的合集。代码会尝试分析每个作品元素中的超链接，提取出作品 id
  // 如果传递的作品是本页面上的作品，可以省略 type。代码会根据页面 url 判断是图片还是小说。
  // 如果传递的作品不是本页面上的，为防止误判，需要显式传递 type
  public sendWorkList(
    list: NodeListOf<HTMLElement> | HTMLElement[],
    type?: WorkType
  ) {
    this.reset()

    if (type === undefined) {
      type = window.location.pathname.includes('/novel') ? 'novels' : 'illusts'
    }

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

    this.tipWrap.textContent = `Checking`
    this.tipWrap.setAttribute('disabled', 'disabled')

    await this.getTagData()
    await this.addBookmarkAll()
    this.complete()
  }

  // 获取每个作品的 tag 数据
  private async getTagData() {
    return new Promise<void>(async (resolve) => {
      for (const id of this.idList) {
        this.tipWrap.textContent = `Get data ${this.bookmarKData.length} / ${this.idList.length}`

        let data

        if (id.type === 'novels') {
          data = await API.getNovelData(id.id)
        } else {
          data = await API.getArtworkData(id.id)
        }

        const tagArr = data.body.tags.tags // 取出 tag 信息
        const tags: string[] = [] // 保存 tag 列表

        for (const tagData of tagArr) {
          tags.push(tagData.tag)
        }

        this.bookmarKData.push({
          type: id.type,
          id: data.body.id,
          tags: tags,
          restrict: false,
        })
      }

      resolve()
    })
  }

  // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
  private async addBookmarkAll() {
    return new Promise<void>(async (resolve) => {
      let index = 0
      for (const data of this.bookmarKData) {
        this.tipWrap.textContent = `Add bookmark ${index} / ${this.bookmarKData.length}`
        await API.addBookmark(
          data.type,
          data.id,
          settings.widthTag === 'yes' ? data.tags : [],
          settings.restrict === 'yes',
          token.token
        )
        index++
      }

      resolve()
    })
  }

  private complete() {
    this.tipWrap.textContent = `✓ Complete`
    this.tipWrap.removeAttribute('disabled')
    EVT.fire(EVT.list.bookmarkModeEnd)

    toast.success('✓ Complete')
  }
}

export { BookmarkAllWorks }
