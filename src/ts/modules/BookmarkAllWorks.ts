import { API } from './API'
import { DOM } from './DOM'
import { Colors } from './Colors'
import { lang } from './Lang'
import { form } from './setting/Form'
import { BookmarkResult } from './CrawlResult.d'

// 一键收藏本页面上的所有作品
class BookmarkAllWorks {
  constructor() {
    const btn = DOM.addBtn(
      'otherBtns',
      Colors.green,
      lang.transl('_收藏本页面的所有作品')
    )
    this.btn = btn
  }

  private type: 'illusts' | 'novels' = 'illusts' // 页面是图片还是小说

  private idList: string[] = []

  private addTagList: BookmarkResult[] = [] // 需要添加 tag 的作品的数据

  private index = 0

  public btn: HTMLButtonElement

  private workList: NodeListOf<HTMLElement> | HTMLElement[] | null = null

  private token = API.getToken()

  // workList 是作品列表元素的合集。本模块会尝试分析每个作品元素中的超链接，提取出作品 id
  public setWorkList(list: NodeListOf<HTMLElement> | HTMLElement[]) {
    if (!list) {
      alert(lang.transl('_没有数据可供使用'))
      return
    }
    this.workList = list
    this.readyAddTag()
  }

  // 准备添加 tag
  private async readyAddTag(loop: number = 0) {
    // 每次点击清空结果
    this.idList = []
    this.addTagList = []
    this.index = 0

    this.token = API.getToken()

    this.btn.setAttribute('disabled', 'disabled')
    this.btn.textContent = `Checking`

    if (window.location.pathname.includes('/novel')) {
      this.type = 'novels'
    }

    this.getIdList()
  }

  // 获取作品列表里的作品 id
  private getIdList() {
    if (!this.workList) {
      return
    }

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

    this.getTagData()
  }

  // 获取每个作品的详细信息，保存它们的 tag
  private async getTagData() {
    this.btn.textContent = `Get data ${this.index} / ${this.idList.length}`

    const id = this.idList[this.index]
    try {
      let data
      // 发起请求
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

      this.addTagList.push({
        id: data.body.id,
        tags: tags,
        restrict: false,
      })

      this.index++

      if (this.index === this.idList.length) {
        this.index = 0
        return this.addTag()
      }

      this.getTagData()
    } catch (error) {
      this.getTagData()
    }
  }

  // 给所有作品添加 tag（即使之前收藏过的，也会再次收藏）
  private async addTag() {
    this.btn.textContent = `Add bookmark ${this.index} / ${this.idList.length}`

    const data = this.addTagList[this.index]

    // 如果设置了不启用快速收藏，则把 tag 设置为空
    if (form.quickBookmarks.checked === false) {
      data.tags = []
    }
    await API.addBookmark(
      this.type,
      data.id,
      data.tags,
      data.restrict,
      this.token
    )

    this.index++

    // 添加完毕
    if (this.index === this.addTagList.length) {
      this.btn!.textContent = `✓ Complete`
      this.btn!.removeAttribute('disabled')
      return
    }

    // 继续添加
    this.addTag()
  }
}

export { BookmarkAllWorks }
