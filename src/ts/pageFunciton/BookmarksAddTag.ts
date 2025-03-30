import { API } from '../API'
import { Tools } from '../Tools'
import {
  BookmarkData,
  NovelCommonData,
  BookmarkResult,
  ArtworkCommonData,
} from '../crawl/CrawlResult'
import { toast } from '../Toast'
import { bookmark } from '../Bookmark'
import { lang } from '../Lang'
import { msgBox } from '../MsgBox'

// 给收藏页面里的未分类作品批量添加 tag
class BookmarksAddTag {
  constructor(btn: HTMLButtonElement) {
    this.btn = btn
    this.bindEvents()
  }

  private type: 'illusts' | 'novels' = 'illusts' // 页面是图片还是小说

  private addTagList: BookmarkResult[] = [] // 需要添加 tag 的作品的数据

  private addIndex = 0 // 添加 tag 时的计数

  private btn: HTMLButtonElement

  private readonly once = 100 // 一次请求多少个作品的数据

  private bindEvents() {
    this.btn.addEventListener('click', () => {
      // 每次点击重置状态
      this.addTagList = []
      this.addIndex = 0

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
    let errorFlag = false

    // 获取收藏的作品的数据
    const [showData, hideData]: BookmarkData[] = await Promise.all([
      API.getBookmarkData(
        Tools.getCurrentPageUserID(),
        this.type,
        '未分類',
        offset,
        false
      ),
      API.getBookmarkData(
        Tools.getCurrentPageUserID(),
        this.type,
        '未分類',
        offset,
        true
      ),
    ]).catch((error) => {
      // 如果错误码为 403, 可能是在其他用户的页面里
      if (error.status && error.status === 403) {
        this.btn!.textContent = `× Permission denied`
      }
      errorFlag = true
      return []
    })

    if (errorFlag) {
      return
    }

    // 保存有用的数据
    for (const data of [showData, hideData]) {
      const works = data.body.works
      // 如果作品的 bookmarkData 为假说明没有实际数据，可能是在获取别人的收藏数据。
      if (works.length > 0 && works[0].bookmarkData) {
        works.forEach((work: ArtworkCommonData | NovelCommonData) => {
          // 如果该作品没有标签，则不添加它
          // 这个作品也许确实没有标签，但绝大多数情况下，这表示这个作品已经被删除而不存在了（404）
          if (work.tags.length > 0) {
            this.addTagList.push({
              id: work.id,
              tags: work.tags,
              restrict: work.bookmarkData!.private,
            })
          }
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
        this.addTag()
      }
    } else {
      // 需要继续获取
      this.readyAddTag(++loop)
    }
  }

  // 给未分类作品添加 tag
  private async addTag(): Promise<void> {
    const item = this.addTagList[this.addIndex]

    const status = await bookmark.add(
      item.id,
      this.type,
      item.tags,
      true,
      item.restrict,
      true
    )
    if (status === 403) {
      this.btn!.textContent = `× Permission denied`
      msgBox.error(lang.transl('_你的账号已经被Pixiv限制'))
      return
    }

    if (this.addIndex < this.addTagList.length - 1) {
      this.addIndex++
      this.btn!.textContent = `${this.addIndex} / ${this.addTagList.length}`
      // 继续添加下一个
      return this.addTag()
    } else {
      // 添加完成
      this.btn!.textContent = `✓ Complete`
      this.btn!.removeAttribute('disabled')
      toast.success(lang.transl('_收藏作品完毕'))
    }
  }
}

export { BookmarksAddTag }
