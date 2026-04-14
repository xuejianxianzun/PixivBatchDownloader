import { Config } from './Config'
import { EVT } from './EVT'
import { ppdTask } from './PPDTask'
import { setSetting, settings } from './setting/Settings'
import { toast } from './Toast'
import { Utils } from './utils/Utils'

// 查找作品的缩略图，当鼠标进入、移出时等动作触发时执行回调函数
abstract class WorkThumbnail {
  constructor() {
    setTimeout(() => {
      this.cacheFound = false
      this.foundElements = []
    }, 1000)

    window.addEventListener(EVT.list.settingInitialized, () => {
      this.addBorderCSS()
    })

    ppdTask.register(20, 'debugForWorkThumbnail', () => {
      setSetting('debugForWorkThumbnail', !settings.debugForWorkThumbnail)
      toast.show(
        `debugForWorkThumbnail ${settings.debugForWorkThumbnail ? 'On' : 'Off'}`
      )
      this.addBorderCSS()
    })
  }

  /**作品缩略图的选择器 */
  // 选择器的元素必须含有作品的超链接（超链接可以在这个元素上，也可以在这个元素的子元素上）
  protected selectors: string[] = []

  protected foundCallback: Function[] = []
  protected enterCallback: Function[] = []
  protected leaveCallback: Function[] = []
  protected clickCallback: Function[] = []
  protected bookmarkBtnCallback: Function[] = []

  /** 缓存所有已找到的缩略图元素及其参数，用于新注册的回调补充执行 */
  private foundElements: { el: HTMLElement; id: string; isSeries: boolean }[] =
    []
  /** 在初始化 1 秒钟之后，停止缓存已找到的缩略图元素。这是因为其他模块注册 OnFound 回调的时机应该不会晚于 1 秒钟，所以之后就不需要再缓存了，以避免内存增加和泄露的风险 */
  protected cacheFound = true

  private className = 'ppd-workThumbnail'

  /**查找作品缩略图 */
  protected abstract findThumbnail(parent: HTMLElement): void

  /**查找缩略图右下角的收藏按钮 */
  protected findBookmarkBtn(el: HTMLElement): HTMLElement | null {
    if (Config.mobile) {
      // 移动端的收藏按钮不是 button，其容器是 div.bookmark
      return el.querySelector('.bookmark')
    } else {
      // 桌面端的缩略图容器里只有 1 个 button，就是收藏按钮。目前还没有发现有多个 button 的情况
      if (el.querySelector('button svg[width="32"]')) {
        return el.querySelector('button') as HTMLButtonElement
      }

      // 旧版缩略图里，缩略图元素是 div._one-click-bookmark （例如：各种排行榜页面）
      return el.querySelector('div._one-click-bookmark')
    }
  }

  /**为作品缩略图绑定事件 */
  // 注意：在移动端页面，此时获取的 id 可能是空字符串。可以在执行回调时尝试再次获取 id
  // isSeries: 这个 id 是否是系列 id。默认为否，即 id 默认为单个作品的 id。
  // 因为小说的系列经常和单篇小说混在同一个列表里，所以为小说的系列添加了这个标记。
  // 但实际上效果不太好，因为缩略图元素被添加到页面上之后可能会变化，导致 isSeries 状态可能不再准确
  // 所以如果需要判断 isSeries 的话，最好在执行回调时再判断一次
  protected bindEvents(
    el: HTMLElement,
    id: string | '',
    type: 'illusts' | 'novels',
    isSeries = false
  ) {
    // 如果这个缩略图元素、或者它的直接父元素、或者它的直接子元素已经有标记，就跳过它
    // mouseover 这个标记名称不可以修改，因为它在 Pixiv Previewer 里硬编码了
    // https://github.com/xuejianxianzun/PixivBatchDownloader/issues/212
    if (el.dataset.mouseover) {
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

    // 当对一个缩略图元素绑定事件时，在它上面添加标记 data-mouseover="1"，以避免重复绑定事件
    el.dataset.mouseover = '1'
    // 对于非系列作品（即单个作品）的缩略图，添加更多自定义数据属性
    if (!isSeries) {
      el.dataset.workid = id
      el.dataset.worktype = type
    }
    el.classList.add(this.className)

    if (this.cacheFound) {
      this.foundElements.push({ el, id, isSeries })
    }
    this.foundCallback.forEach((cb) => cb(el, id, isSeries))

    el.addEventListener('mouseenter', (ev) => {
      this.enterCallback.forEach((cb) => cb(el, id, ev, isSeries))
    })

    el.addEventListener('mouseleave', (ev) => {
      this.leaveCallback.forEach((cb) => cb(el, ev, isSeries))
    })

    el.addEventListener(
      Config.mobile ? 'touchend' : 'click',
      (ev) => {
        this.clickCallback.forEach((cb) => cb(el, id, ev, isSeries))
      },
      false
    )

    // 查找作品缩略图右下角的收藏按钮
    const bmkBtn = this.findBookmarkBtn(el)
    if (!!bmkBtn) {
      bmkBtn.addEventListener(Config.mobile ? 'touchend' : 'click', (ev) => {
        this.bookmarkBtnCallback.forEach((cb) => cb(el, id, bmkBtn, ev))
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

  /**添加下载器寻找到一个作品缩略图时的回调。
   * 注意：这个回调只会执行一次，因为它不是根据用户操作的事件触发的。
   *
   * 回调函数会接收到以下参数：
   *
   * @el 作品缩略图的元素
   *
   * @id 作品 id（在移动端页面里，此时传递的 id 可能是空字符串 ''）
   *
   * @isSeries 这个 id 是否是系列 id
   */
  public onFound(cb: Function) {
    this.foundCallback.push(cb)
    // 对已找到的元素立即执行一次回调，避免因注册时机晚而遗漏
    this.foundElements.forEach(({ el, id, isSeries }) => cb(el, id, isSeries))
  }

  /**添加鼠标进入作品缩略图时的回调。
   *
   * 回调函数会接收到以下参数：
   *
   * @el 作品缩略图的元素
   *
   * @id 作品 id
   *
   * @ev Event 对象
   *
   * @isSeries 这个 id 是否是系列 id
   */
  public onEnter(cb: Function) {
    this.enterCallback.push(cb)
  }

  /**添加鼠标离开作品缩略图时的回调。
   *
   * 回调函数会接收到以下参数：
   *
   * @el 作品缩略图的元素
   *
   * @ev Event 对象
   *
   * @isSeries 这个 id 是否是系列 id
   *
   * 没有 id 参数，因为鼠标离开时的 id 就是鼠标进入时的 id
   */
  public onLeave(cb: Function) {
    this.leaveCallback.push(cb)
  }

  /**添加鼠标点击作品缩略图时的回调。
   *
   * 回调函数会接收到以下参数：
   *
   * @el 作品缩略图的元素
   *
   * @id 作品 id
   *
   * @ev Event 对象
   *
   * @isSeries 这个 id 是否是系列 id
   */
  public onClick(cb: Function) {
    this.clickCallback.push(cb)
  }

  /**添加鼠标点击缩略图里的收藏按钮时的回调。
   *
   * 回调函数会接收到以下参数：
   *
   * @el 作品缩略图的元素
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

  private styleElement: HTMLStyleElement | null = null
  /** 为作品缩略图显示边框，以便于调试 */
  // 这里的样式是复用的 ShowBorderOnDownloadedWorks 里的样式
  private addBorderCSS() {
    if (!settings.debugForWorkThumbnail) {
      if (this.styleElement) {
        this.styleElement.remove()
        this.styleElement = null
      }
      return
    }

    if (this.styleElement) {
      return
    }

    const cssText = `
    .${this.className} {
      position: relative;           /* 必须 */
      overflow: visible !important; /* 尽量让伪元素可见 */
      z-index: 1;
    }

    .${this.className}::after {
      content: '';
      position: absolute;
      inset: 0px;                  /* 与缩略图元素的区域重叠 */
      /* border 显示在缩略图内，不能显示在外面，否则会因为父级元素的 overflow: hidden 被裁剪，或者因为相邻元素之间没有缝隙，导致交界处的 border 被遮挡 */
      border: 3px solid #07edde;
      pointer-events: none;         /* 不阻挡点击 */
      z-index: 0;                  /* 层级需要大于 -1, 否则容易被图片遮挡 */
    }
`
    this.styleElement = Utils.addStyle(cssText)
  }

  /** 在 debug 模式下，为作品缩略图添加选择器数据 */
  // 但由于查找缩略图的时机早于设置初始化，所以最开始找到的一些缩略图可能不会添加选择器。可以切换到其他页面再切换回来解决
  protected addSelectorData(el: HTMLElement, selector: string) {
    if (settings.debugForWorkThumbnail) {
      el.dataset.selector = selector
    }
  }
}

export { WorkThumbnail }
