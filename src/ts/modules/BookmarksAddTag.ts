import { API } from './API'
import { DOM } from './DOM'
import { token } from './Token'
import {
  BookmarkData,
  NovelCommonData,
  BookmarkResult,
  ArtworkCommonData,
} from './CrawlResult.d'

// 给收藏页面里的未分类作品批量添加 tag
class BookmarksAddTag {
  constructor(btn: HTMLButtonElement) {
    this.btn = btn
    this.bindEvents()
  }

  private type: 'illusts' | 'novels' = 'illusts' // 页面是图片还是小说

  private addTagList: BookmarkResult[] = [] // 需要添加 tag 的作品的数据

  private btn: HTMLButtonElement

  private readonly once = 100 // 一次请求多少个作品的数据

  private bindEvents() {
    this.btn.addEventListener('click', () => {
      this.addTagList = [] // 每次点击清空结果
      this.btn.setAttribute('disabled', 'disabled')
      this.btn.textContent = `Checking`

      if (window.location.pathname.includes('/novel')) {
        this.type = 'novels'
      }

      this.readyAddTag()
    })
  }

  // 准备添加 tag。loop 表示这是第几轮循环
  private async readyAddTag(loop: number = 0) {
    const offset = loop * this.once // 一次请求只能获取一部分，所以可能有多次请求，要计算偏移量

    // 发起请求
    const [showData, hideData]: BookmarkData[] = await Promise.all([
      API.getBookmarkData(DOM.getUserId(), this.type, '未分類', offset, false),
      API.getBookmarkData(DOM.getUserId(), this.type, '未分類', offset, true),
    ]).catch((error) => {
      if (error.status && error.status === 403) {
        this.btn!.textContent = `× Permission denied`
      }
      throw new Error('Permission denied')
    })

    // 保存有用的数据
    for (const data of [showData, hideData]) {
      const works = data.body.works
      // 如果作品的 bookmarkData 为假说明没有实际数据，可能是在获取别人的收藏数据。
      if (works.length > 0 && works[0].bookmarkData) {
        works.forEach((work: ArtworkCommonData | NovelCommonData) => {
          this.addTagList.push({
            id: work.id,
            tags: work.tags,
            restrict: work.bookmarkData!.private,
          })
        })
      }
    }

    // 已删除或无法访问的作品不会出现在请求结果里。本来一次请求 100 个，但返回的结果有可能会比 100 个少，甚至极端情况下是 0。所以实际获取到的作品可能比  total 数量少，这是正常的。

    // 判断是否请求了所有未分类的作品数据
    const total = offset + this.once
    if (total >= showData.body.total && total >= hideData.body.total) {
      if (this.addTagList.length === 0) {
        // 如果结果为空，不需要处理
        this.btn!.textContent = `✓ No need`
        this.btn!.removeAttribute('disabled')
        return
      } else {
        // 开始添加 tag
        this.addTag(0, this.addTagList, token.token)
      }
    } else {
      // 需要继续获取
      this.readyAddTag(++loop)
    }
  }

  // 给未分类作品添加 tag
  private async addTag(
    index: number,
    addList: BookmarkResult[],
    tt: string
  ): Promise<void> {
    const item: BookmarkResult = addList[index] as BookmarkResult

    await API.addBookmark(this.type, item.id, item.tags, item.restrict, tt)
    if (index < addList.length - 1) {
      index++
      this.btn!.textContent = `${index} / ${addList.length}`
      // 继续添加下一个
      return this.addTag(index, addList, tt)
    } else {
      this.btn!.textContent = `✓ Complete`
      this.btn!.removeAttribute('disabled')
    }
  }
}

export { BookmarksAddTag }
