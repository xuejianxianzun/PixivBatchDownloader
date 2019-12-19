import { API } from './API'
import { DOM } from './DOM'
import { BookmarkResult, BookmarkWork } from './CrawlResult'

// 给收藏里的未分类作品批量添加 tag
class BookmarksAddTag {
  private addTagList: BookmarkResult[] = [] // 需要添加 tag 的作品列表

  private btn: HTMLButtonElement = document.createElement('button')

  private readonly once = 100 // 一次请求多少个作品的数据

  public init(btn: HTMLButtonElement) {
    this.btn = btn
    this.btn.addEventListener('click', () => {
      this.addTagList = [] // 每次点击清空结果
      this.btn = document.getElementById('add_tag_btn') as HTMLButtonElement
      this.btn!.setAttribute('disabled', 'disabled')
      this.btn!.textContent = `Checking`
      this.readyAddTag()
    })
    // 显示/隐藏按钮
    this.toogleAddTagBtn()
    // 当页面无刷新切换时显示/隐藏按钮
    ;['pushState', 'popstate'].forEach(item => {
      window.addEventListener(item, () => {
        this.toogleAddTagBtn()
      })
    })
  }

  // 如果是书签页则显示添加 tag 的按钮，否则隐藏
  private toogleAddTagBtn() {
    const isBookmarkPage = location.href.includes('bookmark.php')

    if (this.btn) {
      if (isBookmarkPage) {
        this.btn.classList.remove('hidden')
      } else {
        this.btn.classList.add('hidden')
      }
    }
  }

  // 准备添加 tag。loop 表示这是第几轮循环
  private async readyAddTag(loop: number = 0) {
    const offset = loop * this.once // 一次请求只能获取一部分，所以可能有多次请求，要计算偏移量

    // 发起请求
    const [showData, hideData] = await Promise.all([
      API.getBookmarkData(DOM.getUserId(), '未分類', offset, false),
      API.getBookmarkData(DOM.getUserId(), '未分類', offset, true)
    ]).catch(error => {
      if (error.status && error.status === 403) {
        this.btn!.textContent = `× Permission denied`
      }
      throw new Error('Permission denied')
    })

    // 保存有用的数据
    for (const data of [showData, hideData]) {
      const works: BookmarkWork[] = data.body.works
      // 如果作品的 bookmarkData 为假说明没有实际数据，可能是在获取别人的收藏数据。
      if (works.length > 0 && works[0].bookmarkData) {
        works.forEach(work => {
          this.addTagList.push({
            id: work.id,
            tags: encodeURI(work.tags.join(' ')),
            restrict: work.bookmarkData.private
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
        this.btn!.textContent = `√ No need`
        this.btn!.removeAttribute('disabled')
        return
      } else {
        // 开始添加 tag
        this.addTag(0, this.addTagList, API.getToken())
      }
    } else {
      // 需要继续获取
      this.readyAddTag(++loop)
    }
  }

  // 给未分类作品添加 tag
  private async addTag(index: number, addList: BookmarkResult[], tt: string) {
    const item: BookmarkResult = addList[index] as BookmarkResult
    await API.addBookmark(item.id, item.tags, tt, item.restrict)
    if (index < addList.length - 1) {
      index++
      this.btn!.textContent = `${index} / ${addList.length}`
      // 继续添加下一个
      this.addTag(index, addList, tt)
    } else {
      this.btn!.textContent = `√ Complete`
      this.btn!.removeAttribute('disabled')
    }
  }
}

const bookmarksAddTag = new BookmarksAddTag()
export { bookmarksAddTag }
