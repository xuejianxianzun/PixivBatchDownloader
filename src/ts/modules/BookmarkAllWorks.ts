import { API } from './API'
import { DOM } from './DOM'
import { Colors } from './Colors'
import { token } from './Token'
import { lang } from './Lang'
import { settings } from './setting/Settings'
import { BookmarkResult } from './CrawlResult.d'

// 一键收藏所有作品
// 可以传入页面上的作品元素列表，也可以直接传入 id 列表
// 一次任务里要么全部传递插画，要么全部传递小说，不要混合
type WorkType = 'illusts' | 'novels'

class BookmarkAllWorks {
  constructor() {
    this.btn = DOM.addBtn(
      'otherBtns',
      Colors.green,
      lang.transl('_收藏本页面的所有作品')
    )
  }

  private type: WorkType = 'illusts' // 作品的类型

  private idList: string[] = []

  private bookmarKData: BookmarkResult[] = []

  public btn!: HTMLButtonElement

  private workList!: NodeListOf<HTMLElement> | HTMLElement[]

  // 传递 workList，这是作品列表元素的合集。代码会尝试分析每个作品元素中的超链接，提取出作品 id
  // 如果传递的作品是本页面上的作品，可以省略 type。代码会根据页面 url 判断是图片还是小说。
  // 如果传递的作品不是本页面上的，为防止误判，需要显式传递 type
  public setWorkList(
    list: NodeListOf<HTMLElement> | HTMLElement[],
    type?: WorkType
  ) {
    if (!list || list.length === 0) {
      return alert(lang.transl('_没有数据可供使用'))
    }

    this.ready(type)

    this.workList = list

    this.getIdList()

    this.startBookmark()
  }

  // 直接传递作品 id 列表
  public setIdList(list: string[], type?: WorkType) {
    this.ready(type)

    this.idList = list

    this.startBookmark()
  }

  // 启动收藏流程，前提是已经设置了作品 id 列表
  private async startBookmark() {
    await this.getTagData()
    await this.addBookmarkAll()
    this.complete()
  }

  // 初始化数据和按钮状态
  private ready(type?: WorkType) {
    this.idList = []
    this.bookmarKData = []

    if (type) {
      this.type = type
    } else {
      this.type = window.location.pathname.includes('/novel')
        ? 'novels'
        : 'illusts'
    }

    this.btn.textContent = `Checking`
    this.btn.setAttribute('disabled', 'disabled')
  }

  // 获取作品 id 列表
  private getIdList() {
    const regExp = this.type === 'illusts' ? /\/artworks\/(\d*)/ : /\?id=(\d*)/
    for (const el of this.workList) {
      const a = el.querySelector('a')
      if (a) {
        // "https://www.pixiv.net/artworks/82618568"
        // "https://www.pixiv.net/novel/show.php?id=12350618"
        const test = regExp.exec(a.href)
        if (test && test.length > 1) {
          this.idList.push(test[1])
        }
      }
    }
  }

  // 获取每个作品的 tag 数据
  private async getTagData() {
    return new Promise<void>(async (resolve) => {
      for (const id of this.idList) {
        this.btn.textContent = `Get data ${this.bookmarKData.length} / ${this.idList.length}`

        let data

        if (this.type === 'novels') {
          data = await API.getNovelData(id)
        } else {
          data = await API.getArtworkData(id)
        }

        const tagArr = data.body.tags.tags // 取出 tag 信息
        const tags: string[] = [] // 保存 tag 列表

        for (const tagData of tagArr) {
          tags.push(tagData.tag)
        }

        this.bookmarKData.push({
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
        this.btn.textContent = `Add bookmark ${index} / ${this.bookmarKData.length}`
        await API.addBookmark(
          this.type,
          data.id,
          settings.quickBookmarks ? data.tags : [],
          data.restrict,
          token.token
        )
        index++
      }

      resolve()
    })
  }

  private complete() {
    this.btn.textContent = `✓ Complete`
    this.btn.removeAttribute('disabled')
  }
}

export { BookmarkAllWorks }
