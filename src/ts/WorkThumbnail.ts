// 查找作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
abstract class WorkThumbnail {
  /**作品缩略图的选择器 */
  // 选择器的元素必须含有作品的超链接（超链接可以在这个元素上，也可以在这个元素的子元素上）
  protected selectors: string[] = []

  protected enterCallback: Function[] = []
  protected leaveCallback: Function[] = []
  protected clickCallback: Function[] = []
  protected bookmarkBtnCallback: Function[] = []

  /**查找作品缩略图 */
  protected abstract findThumbnail(parent: HTMLElement): void

  /**查找缩略图右下角的收藏按钮 */
  protected findBookmarkBtn(el: HTMLElement): HTMLElement | null {
    // 缩略图容器里只有 1 个 button，就是收藏按钮。目前还没有发现有多个 button 的情况
    if (el.querySelector('button svg[width="32"]')) {
      return el.querySelector('button') as HTMLButtonElement
    }

    // 旧版缩略图里，缩略图元素是 div._one-click-bookmark （例如：各种排行榜页面）
    return el.querySelector('div._one-click-bookmark')
  }

  /**为作品缩略图绑定事件 */
  protected bindEvents(el: HTMLElement, id: string) {
    // 如果这个缩略图元素、或者它的直接父元素、或者它的直接子元素已经有标记，就跳过它
    // mouseover 这个标记名称不可以修改，因为它在 Pixiv Previewer 里硬编码了
    // https://github.com/xuejianxianzun/PixivBatchDownloader/issues/212
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
    ;(el as HTMLElement).dataset.mouseover = '1'

    el.addEventListener('mouseenter', (ev) => {
      this.enterCallback.forEach((cb) => cb(el, id, ev))
    })

    el.addEventListener('mouseleave', (ev) => {
      this.leaveCallback.forEach((cb) => cb(el, ev))
    })

    el.addEventListener('click', (ev) => {
      this.clickCallback.forEach((cb) => cb(el, id, ev))
    })

    // 查找作品缩略图右下角的收藏按钮
    const bmkBtn = this.findBookmarkBtn(el as HTMLElement)
    if (!!bmkBtn) {
      bmkBtn.addEventListener('click', (ev) => {
        this.bookmarkBtnCallback.forEach((cb) => cb(id, bmkBtn, ev))
      })
    }
  }

  /**使用监视器，让未来添加的作品缩略图也绑定上事件 */
  protected createObserver(target: HTMLElement) {
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length > 0) {
          // 遍历被添加的元素
          for (const newEl of record.addedNodes) {
            this.findThumbnail(newEl as HTMLElement)
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
   * @ev Event 对象
   */
  public onEnter(cb: Function) {
    this.enterCallback.push(cb)
  }

  /**添加鼠标离开作品缩略图时的回调。
   *
   * 回调函数会接收到 2 个参数：
   *
   * @el 作品缩略图的元素
   *
   * @ev Event 对象
   *
   * 没有 id 参数，因为鼠标离开时的 id 就是鼠标进入时的 id
   */
  public onLeave(cb: Function) {
    this.leaveCallback.push(cb)
  }

  /**添加鼠标点击作品缩略图时的回调。
   *
   * 回调函数会接收到 3 个参数：
   *
   * @el 作品缩略图的元素
   *
   * @id 作品 id
   *
   * @ev Event 对象
   */
  public onClick(cb: Function) {
    this.clickCallback.push(cb)
  }

  /**添加鼠标点击缩略图里的收藏按钮时的回调。
   *
   * 回调函数会接收到 3 个参数：
   *
   * @id 作品 id
   *
   * @btn 收藏按钮
   *
   * @ev Event 对象
   */
  public onClickBookmarkBtn(cb: Function) {
    this.bookmarkBtnCallback.push(cb)
  }
}

export { WorkThumbnail }
