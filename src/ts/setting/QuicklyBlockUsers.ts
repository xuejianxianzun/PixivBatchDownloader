import { EVT } from '../EVT'
import { lang } from '../Language'
import { pageType } from '../PageType'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { setSetting, settings } from './Settings'
import { Utils } from '../utils/Utils'

interface CheckResult {
  /**这个用户是否在 用户阻止名单 里 */
  isBlock: boolean
  /**如果没有设置过只下载这个用户的最后几张图片，则是 undefined
   * 注意数字可能为 0，这表示设置了数字，只不过值是 0
   */
  notDownloadLastImage?: number
  blockTags?: string[]
}

// 当鼠标放在画师头像上时，检查这个画师是否被屏蔽，并显示一个浮动面板允许用户快速屏蔽或者取消屏蔽这个画师
class QuicklyBlockUsers {
  constructor() {
    if (!Utils.isPixiv()) {
      return
    }

    document.body.addEventListener('mousemove', (ev) => {
      this.target = ev.target as HTMLElement
      this.fun()
    })

    window.addEventListener('scroll', () => {
      this.removePanel()
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.removePanel()
    })
  }

  // 触发鼠标事件的元素，注意这可能不是 A 标签
  private target: HTMLElement | null = null
  // 如果用户的鼠标停留在用户超链接上，则保存这个 A 标签，这是最后激活的 A 标签
  private activeEl: HTMLElement = document.createElement('a')
  private readonly checkUserLinkReg = /\/users\/(\d+)$/

  private panelID = 'xzUserCheckPanel'
  private hiddenPanelTimer: number | undefined

  private findA(
    el: HTMLElement | null,
    loop: number = 3
  ): HTMLAnchorElement | null {
    if (el === null || loop === 0) {
      return null
    }
    loop = loop - 1

    if (el.nodeName === 'A') {
      return el as HTMLAnchorElement
    }

    return this.findA(el.parentElement, loop)
  }

  private findUserLink() {
    if (
      !settings.userBlockList ||
      !settings.quicklyBlockUsers ||
      !this.target
    ) {
      return
    }

    // 在用户主页需要特殊处理，因为这里的用户头像没有超链接
    if (pageType.type === pageType.list.UserHome) {
      // 当鼠标经过头像图片或者名字时，显示面板
      const avatar = document.querySelector('div[size="96"]')
      const h1 = document.querySelector('h1')
      if (this.target === avatar || this.target === h1) {
        this.activeEl = this.target

        const userID = Tools.getCurrentPageUserId()
        const result = this.checkSettings(userID)
        this.createPanel(result, userID)
        return
      }
    }

    let a = this.findA(this.target, 3)
    if (a === null) {
      return
    }

    const userID = this.findUserID(a)
    if (!userID) {
      return
    }

    // 在画师主页里，如果超链接的用户 ID 就是网址里的 ID，说明这是“主页”按钮链接。
    // 此时不显示面板
    if (pageType.type === pageType.list.UserHome) {
      if (Tools.getCurrentPageUserId() === userID) {
        return
      }
    }

    this.activeEl = a

    const result = this.checkSettings(userID)
    this.createPanel(result, userID)
  }

  private fun = Utils.debounce(() => {
    this.findUserLink()
  }, 100)

  private findUserID(a: HTMLAnchorElement) {
    if (!a || !a.href) {
      return ''
    }

    const test = a.href.match(this.checkUserLinkReg)
    if (test && test.length > 1) {
      return test[1]
    }
    return ''
  }

  /**检查下载器里针对这个用户的设置，决定对这个用户显示什么提示和操作 */
  private checkSettings(userID: string) {
    const result: CheckResult = {
      isBlock: settings.blockList.includes(userID),
      notDownloadLastImage: undefined,
      blockTags: undefined,
    }

    // for (const item of settings.DoNotDownloadLastFewImagesList) {
    //   if (item.uid === Number.parseInt(userID)) {
    //     result.notDownloadLastImage = item.value
    //   }
    // }

    // const blockTags = settings.blockTagsForSpecificUserList.find(
    //   (item) => item.uid.toString() === userID
    // )
    // result.blockTags = blockTags ? blockTags.tags : undefined

    return result
  }

  private async createPanel(result: CheckResult, userID: string) {
    this.removePanel()

    // 创建浮动面板的元素
    const html = `
    <div class="xzTipPanelWrap" id="${this.panelID}">
      <div class="notNeedTip">
        <p style="display: ${
          result.isBlock ? 'none' : 'block'
        };"><button><span class="mr4" data-xztext="_屏蔽该用户"></span>${userID}</button></p>
        <p style="display: ${
          result.isBlock ? 'block' : 'none'
        };"><button><span class="mr4" data-xztext="_取消屏蔽该用户"></span></button></p>
      </div>
    </div>`
    const wrap = document.createElement('div')
    wrap.innerHTML = html
    lang.register(wrap)

    // 绑定事件
    const panel = wrap.querySelector('#' + this.panelID)! as HTMLDivElement
    panel.addEventListener('mouseenter', () => {
      window.clearTimeout(this.hiddenPanelTimer)
    })
    panel.addEventListener('mouseleave', () => {
      this.removePanel()
    })

    // 屏蔽用户
    const blockBtns = panel.querySelectorAll(
      '.notNeedTip button'
    ) as NodeListOf<HTMLButtonElement>
    blockBtns[0].onclick = () => {
      this.addBlock(userID)
    }
    blockBtns[1].onclick = () => {
      this.removeBlock(userID)
    }

    // 确定位置
    const rectList = this.activeEl.getClientRects()
    const rect = rectList[0]

    // 显示在超链接的上方还是下方
    // 主要是为了避免遮挡 pixiv 本身出现的小卡片
    // 默认显示在下方
    // 有时 activeEl 元素的高度为 0(这经常发生在一些用户头像上)，此时使用 24 px 的高度, 避免浮动面板遮挡住头像
    let top = rect.y + (rect.height || 24)
    panel.style.top = top + 'px'
    // 检测需要显示在上方的情况
    let showTop = false
    if (rect.y < 470) {
      // 如果顶部剩余空间不足，则 pixiv 的卡片可能显示在下方，此时让面板显示在上方
      // 但是这个数值不是固定的，因为不管是关注的还是没关注的用户，它们的卡片高度都可能不同
      // pixiv 会根据实际高度调整显示在上方或者下方，下载器不能精确预知卡片位置
      // 所以有时候可能仍然会与卡片重叠
      showTop = true
    }
    if (pageType.type === pageType.list.UserHome) {
      // 在画师主页里，如果超链接的用户 ID 不是地址栏里的 ID，则是底部弹出的推荐关注画师
      // 面板需要显示在上方
      if (Tools.getCurrentPageUserId() !== userID) {
        showTop = true
      }
    }
    panel.style.left = rect.x + 'px'

    document.body.appendChild(panel)

    const panelRectList = panel.getClientRects()
    const panelHeight = panelRectList[0].height

    if (showTop) {
      // 当面板显示在画师名字上方时，需要减去面板高度，但面板高度是不固定的
      // 所以需要先添加面板到 DOM 上，然后才能获取面板高度，做出调整
      top = rect.y - panelHeight
      if (top < 0) {
        top = 0
      }
      panel.style.top = top + 'px'
    } else {
      // 当面板显示在下方时，防止其显示在可视区域之下
      // 发生时这个情况，说明目标元素位于可视区域底部，此时面板显示在下方的话会导致看不到面板，因此需要上提一些
      // 数字 16 是考虑到底部滚动条的高度，避免面板被滚动条遮挡
      if (top + panelHeight > window.innerHeight) {
        top = window.innerHeight - panelHeight - 16
      }
      panel.style.top = top + 'px'
    }
  }

  private removePanel() {
    const panel = document.querySelector('#' + this.panelID)
    panel && panel.remove()
  }

  private addBlock(userID: string) {
    if (!settings.blockList.includes(userID)) {
      settings.blockList.push(userID)
      setSetting('blockList', settings.blockList)
      toast.warning(`${lang.transl('_已添加屏蔽')} ${userID}`)
      this.removePanel()
    }
  }

  private removeBlock(userID: string) {
    const index = settings.blockList.findIndex((str) => str === userID)
    if (index > -1) {
      settings.blockList.splice(index, 1)
      setSetting('blockList', settings.blockList)
      toast.success(`${lang.transl('_已取消屏蔽')} ${userID}`)
      this.removePanel()
    }
  }
}

new QuicklyBlockUsers()
