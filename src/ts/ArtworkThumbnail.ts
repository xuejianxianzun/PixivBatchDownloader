import { pageType } from './PageType'
import { Tools } from './Tools'

// 查找图像作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
class ArtworkThumbnail {
  constructor() {
    // 立即对作品缩略图绑定事件
    this.handleThumbnail(document.body)
    // 使用监视器，让未来出现的作品缩略图也绑定上事件
    this.createObserver(document.body)
  }

  // 作品缩略图的选择器
  // 选择器的元素必须含有作品的超链接（超链接可以在这个元素上，也可以在这个元素的子元素上）
  private readonly selectors = [
    'div[width="136"]',
    'div[width="131"]',
    'div[width="288"]',
    'div[width="184"]',
    'div[width="112"]',
    'div[width="104"]',
    'div[width="90"]',
    'div[width="118"]',
    '._work',
    '._work.item',
    'li>div>div:first-child',
  ]

  private enterCallback: Function[] = []
  private leaveCallback: Function[] = []

  // 判断元素是否含有作品缩略图，如果找到了缩略图则为其绑定事件
  private handleThumbnail(parent: HTMLElement) {
    if (!parent.querySelectorAll) {
      return
    }
    // 遍历所有的选择器，为找到的元素绑定事件
    // 注意：有时候一个节点里会含有多种尺寸的缩略图，为了全部查找到它们，必须遍历所有的选择器。
    // 如果在查找到某个选择器之后，不再查找剩余的选择器，就可能会遗漏一部分缩略图。
    // 但是，这有可能会导致事件的重复绑定
    // 例如，画师主页顶部的“精选”作品会被两个选择器查找到：'li>div>div:first-child' 'div[width="288"]'
    // 但是，这有可能会导致事件的重复绑定，所以下载器添加了 dataset.mouseover 标记以减少重复绑定
    for (const selector of this.selectors) {
      // 现在 'li>div>div:first-child' 只在投稿页面使用
      if (
        selector === 'li>div>div:first-child' &&
        pageType.type !== pageType.list.Request
      ) {
        return
      }

      const elements = parent.querySelectorAll(selector)
      for (const el of elements) {
        const id = Tools.findWorkIdFromElement(el as HTMLElement, 'illusts')
        // 只有查找到作品 id 时才会执行回调函数
        if (id) {
          // 如果这个缩略图元素、或者它的直接父元素、或者它的直接子元素已经有标记，就跳过它
          if ((el as HTMLElement).dataset.mouseover) {
            return
          }

          if (el.parentElement && el.parentElement.dataset.mouseover) {
            return
          }

          if (
            el.firstElementChild &&
            (el.firstElementChild as HTMLElement).dataset.mouseover
          ) {
            return
          }

          // 当对一个缩略图元素绑定事件时，在它上面添加标记
          // 添加标记的目的是为了减少事件重复绑定的情况发生
          // mouseover 这个标记名称不可以修改，因为它在 Pixiv Previewer 里被硬编码了
          // https://github.com/xuejianxianzun/PixivBatchDownloader/issues/212
          ;(el as HTMLElement).dataset.mouseover = '1'

          el.addEventListener('mouseenter', (ev) => {
            this.enterCallback.forEach((cb) => cb(el, id, ev))
          })

          el.addEventListener('mouseleave', (ev) => {
            this.leaveCallback.forEach((cb) => cb(el, ev))
          })

          // 查找作品缩略图右下角的收藏按钮
          // 新版缩略图里，缩略图容器里只有 1 个 button，就是收藏按钮。目前还没有发现有多个 button 的情况
          // 旧版缩略图里，缩略图元素是 div._one-click-bookmark （例如：各种排行榜页面）
          let bmkBtn: HTMLElement | undefined
          if (el.querySelector('button svg[width="32"]')) {
            bmkBtn = el.querySelector('button') as HTMLButtonElement
          }
          if (!bmkBtn) {
            const test2 = el.querySelector('div._one-click-bookmark')
            if (test2) {
              bmkBtn = test2 as HTMLDivElement
            }
          }
          // 目前我没有观察到同一个收藏按钮会被重复绑定事件的情况，所以没必要添加特殊标记
          if (bmkBtn) {
            bmkBtn.addEventListener('click', (ev) => {
              this.bookmarkBtnCallback.forEach((cb) => {
                cb(id, bmkBtn, ev)
              })
            })
          }
        }
      }
    }
  }

  private createObserver(target: HTMLElement) {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素
          for (const newEl of record.addedNodes) {
            this.handleThumbnail(newEl as HTMLElement)
          }
        }
      }
    })
    observer.observe(target, {
      childList: true,
      subtree: true,
    })
  }

  /**添加鼠标进入作品缩略图时的回调。
   *
   * 回调函数会接收到 3 个参数：
   *
   * @el 作品缩略图的元素
   *
   * @id 作品 id
   *
   * @ev 鼠标进入或者移出 el 时的 Event 对象
   */
  public onEnter(cb: Function) {
    this.enterCallback.push(cb)
  }

  /**添加鼠标进入作品缩略图时的回调。
   *
   * 回调函数会接收到 2 个参数：
   *
   * @el 作品缩略图的元素
   *
   * @ev 鼠标进入或者移出 el 时的 Event 对象
   *
   * 没有 id 参数，因为鼠标离开时的 id 就是鼠标进入时的 id
   */
  public onLeave(cb: Function) {
    this.leaveCallback.push(cb)
  }

  private bookmarkBtnCallback: Function[] = []

  /**添加用户点击缩略图里的收藏按钮时的回调
   *
   * 回调函数会接收到 3 个参数：
   *
   * @id 作品 id
   *
   * @btn 收藏按钮
   *
   * @ev 鼠标点击收藏按钮时的 Event 对象
   */
  public onClickBookmarkBtn(cb: Function) {
    this.bookmarkBtnCallback.push(cb)
  }
}

const artworkThumbnail = new ArtworkThumbnail()
export { artworkThumbnail }
