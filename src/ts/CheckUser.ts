import { API } from './API'
import { EVT } from './EVT'
import { Input } from './Input'
import { lang } from './Lang'
import { pageType } from './PageType'
import { toast } from './Toast'
import { Tools } from './Tools'
import { setSetting, settings } from './setting/Settings'
import { Utils } from './utils/Utils'

interface CheckResult {
  /**这个用户是否在 用户阻止名单 里 */
  isBlock: boolean
  /**如果没有设置过只下载这个用户的最后几张图片，则是 undefined
   * 注意数字可能为 0，这表示设置了数字，只不过值是 0
   */
  notDownloadLastImage?: number
  blockTags?: string[]
}

// 当鼠标放在画师头像上时，检查这个画师是否被屏蔽，以及检查和修改他不下载最后几张图片的设置
class CheckUser {
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
  private readonly enablePage = [
    pageType.list.Following,
    pageType.list.UserHome,
    pageType.list.Home,
    pageType.list.Artwork,
    pageType.list.NewArtworkBookmark,
  ]

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
    if (!this.enablePage.includes(pageType.type) || !this.target) {
      return
    }

    // 在用户主页需要特殊处理，因为这里的用户头像没有超链接
    if (pageType.type === pageType.list.UserHome) {
      // 当鼠标经过头像图片或者名字时，显示面板
      const avatar = document.querySelector('div[size="96"]')
      const h1 = document.querySelector('h1')
      if (this.target === avatar || this.target === h1) {
        this.activeEl = this.target

        const userID = Tools.getCurrentPageUserID()
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
      if (Tools.getCurrentPageUserID() === userID) {
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

    for (const item of settings.DoNotDownloadLastFewImagesList) {
      if (item.uid === Number.parseInt(userID)) {
        result.notDownloadLastImage = item.value
      }
    }

    const blockTags = settings.blockTagsForSpecificUserList.find(
      (item) => item.uid.toString() === userID
    )
    result.blockTags = blockTags ? blockTags.tags : undefined

    return result
  }

  private async createPanel(result: CheckResult, userID: string) {
    this.removePanel()

    // 创建元素
    const html = `
    <div class="xzTipPanelWrap" id="${this.panelID}">
      <div class="notNeedTip">
        <p style="display: ${
          result.isBlock ? 'none' : 'block'
        };"><button>屏蔽该画师 ${userID}</button></p>
        <p style="display: ${
          result.isBlock ? 'block' : 'none'
        };"><button>取消屏蔽该画师</button></p>
      </div>

      <div class="renameTiphr hr"></div>

      <div class="renameTip notDownloadLastImage">
        <ul>
        </ul>
      </div>

      <div class="renameTiphr hr"></div>

      <div class="renameTip blockTags">
        <ul>
        </ul>
      </div>
    </div>`
    const wrap = document.createElement('div')
    wrap.innerHTML = html

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
      if (window.confirm(`确定要取消屏蔽 ${userID} 吗？`)) {
        this.removeBlock(userID)
      }
    }

    // 最后几张不抓取
    {
      const ul = panel.querySelector(
        '.notDownloadLastImage ul'
      )! as HTMLUListElement
      const li = document.createElement('li')
      const left = document.createElement('span')
      const btn = document.createElement('button')
      if (result.notDownloadLastImage === undefined) {
        left.textContent = '添加最后 x 张不抓取'
        btn.textContent = '添加'
      } else {
        left.textContent = `已设置最后 ${result.notDownloadLastImage} 张不抓取`
        btn.textContent = '编辑'
      }

      btn.onclick = () => {
        const input = window.prompt('请输入数字，表示最后 x 张不抓取：', '1')
        // 检测错误的输入
        if (input === null) {
          return toast.error('未输入值，本次操作取消')
        }

        const number = Number.parseInt(input)
        if (isNaN(number) || number < 0) {
          return toast.error('输入有误，请输入大于等于 0 的数字')
        }

        return this.setNotDownloadLastImage(userID, number)
      }

      li.append(left)
      li.append(btn)
      ul.append(li)
    }

    // 针对该用户屏蔽标签
    {
      const ul = panel.querySelector('.blockTags ul')! as HTMLUListElement
      const li = document.createElement('li')
      const left = document.createElement('span')
      const btn = document.createElement('button')
      if (result.blockTags === undefined) {
        // 如果未屏蔽过，则只显示编辑按钮。不添加左侧的说明文字
        btn.textContent = '针对该画师屏蔽 tag'
        btn.onclick = async () => {
          const input = new Input({
            instruction: `针对该画师（${userID}）屏蔽 tag：`,
            placeholder: lang.transl('_tag用逗号分割'),
            type: 'textarea',
          })
          const value = await input.submit()
          if (value === '') {
            return toast.warning('输入为空，所以没有更改设置')
          }

          this.blockTagsForUser(userID, value)
          toast.success(`已针对该画师屏蔽这些 tag：${value}`)
        }
      } else {
        // textContent 里换行符无效，所以这里用 innerText
        left.innerText = `已针对该画师屏蔽：\n${result.blockTags.join(', ')}`
        btn.textContent = '编辑'
        li.append(left)

        btn.onclick = async () => {
          const input = new Input({
            instruction: `针对该画师（${userID}）编辑屏蔽的 tag：<br>如果清空，则将取消对这个画师屏蔽 tag`,
            placeholder: lang.transl('_tag用逗号分割'),
            type: 'textarea',
            value: result.blockTags?.join(','),
          })
          const value = await input.submit()
          if (value === '') {
            this.removeBlockTagsForUser(userID)
            return toast.warning('输入为空，取消对这个画师的屏蔽')
          } else {
            this.blockTagsForUser(userID, value)
            toast.success(`已更新针对该画师屏蔽的 tag：${value}`)
          }
        }
      }

      li.append(btn)
      ul.append(li)
    }

    // 确定位置
    const rectList = this.activeEl.getClientRects()
    const rect = rectList[0]

    // 显示在超链接的上方还是下方
    // 主要是为了避免遮挡 pixiv 本身出现的小卡片
    // 默认显示在下方
    panel.style.top = rect.y + rect.height + 'px'
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
      if (Tools.getCurrentPageUserID() !== userID) {
        showTop = true
      }
    }
    panel.style.left = rect.x + 'px'

    document.body.appendChild(panel)

    if (showTop) {
      // 当面板显示在画师名字上方时，需要减去面板高度，但面板高度是不固定的
      // 所以需要先添加面板到 DOM 上，然后才能获取面板高度，做出调整
      const panelRectList = panel.getClientRects()
      const panelHeight = panelRectList[0].height
      panel.style.top = rect.y - panelHeight + 'px'
    }
  }

  private async setNotDownloadLastImage(
    userID: string | number,
    number: number
  ) {
    // 自动判断，如果之前没有设置过这个画师，则新建一条规则
    if (typeof userID === 'string') {
      userID = Number.parseInt(userID)
    }

    let msg = ''
    const find = settings.DoNotDownloadLastFewImagesList.find(
      (item) => item.uid === userID
    )
    if (find) {
      find.value = number
      msg = `添加成功：最后 ${number} 张不抓取`
    } else {
      const userName = await Tools.getUserName(userID)
      const data = {
        uid: userID,
        user: userName,
        value: number,
      }
      settings.DoNotDownloadLastFewImagesList.push(data)
      msg = `修改成功：最后 ${number} 张不抓取`
    }

    setSetting(
      'DoNotDownloadLastFewImagesList',
      settings.DoNotDownloadLastFewImagesList
    )

    toast.success(msg)

    this.removePanel()
  }

  private removePanel() {
    const panel = document.querySelector('#' + this.panelID)
    panel && panel.remove()
  }

  private addBlock(userID: string) {
    if (!settings.blockList.includes(userID)) {
      settings.blockList.push(userID)
      setSetting('blockList', settings.blockList)

      toast.warning('添加屏蔽 ' + userID)

      this.removePanel()
    }
  }

  private removeBlock(userID: string) {
    const index = settings.blockList.findIndex((str) => str === userID)
    if (index > -1) {
      settings.blockList.splice(index, 1)
      setSetting('blockList', settings.blockList)

      toast.success('取消屏蔽 ' + userID)

      this.removePanel()
    }
  }

  private async blockTagsForUser(userID: string, str: string) {
    const uid = Number.parseInt(userID)
    const tags = Utils.string2array(str)

    const index = settings.blockTagsForSpecificUserList.findIndex(
      (item) => item.uid.toString() === userID
    )
    // 新增
    if (index === -1) {
      const user = await Tools.getUserName(uid)
      const item = {
        uid: uid,
        user: user,
        tags: tags,
      }
      settings.blockTagsForSpecificUserList.push(item)
      setSetting('blockTagsForSpecificUserList', [
        ...settings.blockTagsForSpecificUserList,
      ])
    } else {
      // 更新已有
      settings.blockTagsForSpecificUserList[index].tags = tags
      setSetting('blockTagsForSpecificUserList', [
        ...settings.blockTagsForSpecificUserList,
      ])
    }
  }

  private removeBlockTagsForUser(userID: string) {
    const index = settings.blockTagsForSpecificUserList.findIndex(
      (item) => item.uid.toString() === userID
    )
    if (index > -1) {
      settings.blockTagsForSpecificUserList.splice(index, 1)
      setSetting('blockTagsForSpecificUserList', [
        ...settings.blockTagsForSpecificUserList,
      ])
    }
  }
}

new CheckUser()
