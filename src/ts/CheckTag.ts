import { pageType } from './PageType'
import { toast } from './Toast'
import { setSetting, settings } from './setting/Settings'
import { Utils } from './utils/Utils'

interface TagRenameItem {
  id: number
  tags: string[]
  rule: string
}

interface CheckResult {
  inNotNeedTagList: boolean
  inTagRename: TagRenameItem[]
}

// 当鼠标放在作品页面内的 tag 上时，检查这个 tag 是否存在于下载器的某些 tag 过滤设置里，并显示对应操作和提示
class CheckTag {
  constructor() {
    if (!Utils.isPixiv()) {
      return
    }

    // 由于新打开一个作品页面，以及切换页面时，下载器无法准确知道新的标签列表何时生成，所以用定时器检查
    window.setInterval(() => {
      this.queryElements()
    }, 1000)

    window.addEventListener('scroll', () => {
      this.removePanel()
    })
  }

  private readonly selector = 'footer li a'
  private workTagList: HTMLAnchorElement[] = []
  private activeTag: HTMLAnchorElement = document.createElement('a')

  private panelID = 'xzTagCheckPanel'
  private hiddenPanelTimer: number | undefined

  private queryElements() {
    if (
      pageType.type === pageType.list.Artwork ||
      pageType.type === pageType.list.Novel
    ) {
      const newWorkTagList: HTMLAnchorElement[] = []

      const allA = document.querySelectorAll(
        this.selector
      ) as NodeListOf<HTMLAnchorElement>
      for (const a of allA) {
        newWorkTagList.push(a)
        // 如果一个元素已经保存在列表里了，那么说明已经为它添加过事件了
        // 另外在页面切换时，相同的 tag 会复用元素，所以它的元素和之前的是同一个
        if (!this.workTagList.includes(a)) {
          a.addEventListener('mouseenter', () => {
            window.clearTimeout(this.hiddenPanelTimer)
            this.removePanel()

            const result = this.check(a)
            this.createPanel(a, result)
            this.activeTag = a
          })

          a.addEventListener('mouseleave', () => {
            this.hiddenPanelTimer = window.setTimeout(() => {
              this.removePanel()
            }, 400)
          })
        }
      }
      this.workTagList = newWorkTagList
    }
  }

  /**检查下载器的 tag 过滤设置，决定对这个 tag 应该显示什么提示和操作 */
  // 需要传递 A 标签，用于确定操作面板出现的位置
  private check(a: HTMLAnchorElement) {
    const tag = a.innerText
    const result: CheckResult = {
      inNotNeedTagList: settings.notNeedTag.includes(tag),
      inTagRename: [],
    }

    for (const item of settings.UseDifferentNameRuleIfWorkHasTagList) {
      if (item.tags.includes(tag)) {
        result.inTagRename.push(item)
      }
    }

    return result
  }

  private createPanel(a: HTMLAnchorElement, result: CheckResult) {
    // 创建元素
    const tag = a.innerText
    const html = `
    <div class="xzTipPanelWrap" id="${this.panelID}">
      <div class="notNeedTip">
        <p style="display: ${
          result.inNotNeedTagList ? 'none' : 'block'
        };"><button>屏蔽这个tag</button></p>
        <p style="display: ${
          result.inNotNeedTagList ? 'block' : 'none'
        };"><button>取消屏蔽该tag</button></p>
      </div>

      <div class="renameTiphr hr" style="display: ${
        result.inTagRename.length > 0 ? 'block' : 'none'
      };"></div>

      <div class="renameTip" style="display: ${
        result.inTagRename.length > 0 ? 'block' : 'none'
      };">
        <p>已将该tag重命名为：</p>
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

    const notNeedBtns = panel.querySelectorAll(
      '.notNeedTip button'
    ) as NodeListOf<HTMLButtonElement>
    notNeedBtns[0].onclick = () => {
      this.addToExcludeList(tag)
    }
    notNeedBtns[1].onclick = () => {
      if (window.confirm(`确定要取消屏蔽 ${tag} 吗？`)) {
        this.removeFormExcludeList(tag)
      }
    }

    const ul = panel.querySelector('.renameTip ul')! as HTMLUListElement
    for (const item of result.inTagRename) {
      const li = document.createElement('li')

      const left = document.createElement('span')
      left.textContent = item.rule
      li.append(left)

      const btn = document.createElement('button')
      btn.textContent = '移除'
      btn.onclick = () => {
        if (window.confirm(`确定要取消重命名 ${tag} -> ${item.rule} 吗？`)) {
          this.removeFormTagRename(tag, item.id)
        }
      }
      li.append(btn)

      ul.append(li)
    }

    // 确定位置
    const rectList = a.getClientRects()
    const rect = rectList[0]
    panel.style.left = rect.x + 'px'
    panel.style.top = rect.y + rect.height + 2 + 'px'
    // 上面把 top 加了 2 像素的间距，使其与 tag 文字之间存在一定空隙
    // 这个间距不能太大，否则会导致面板的顶部进入了下方 tag 的文字区域
    // 这会导致鼠标移动到面板的路径中会经过下面的 tag，出现第二个面板（也就是下面的 tag 的面板）

    document.body.appendChild(panel)
  }

  private removePanel() {
    const panel = document.querySelector('#' + this.panelID)
    panel && panel.remove()
  }

  private updatePanel() {
    this.removePanel()
    const result = this.check(this.activeTag)
    this.createPanel(this.activeTag, result)
  }

  /**把这个 tag 添加到 tag 屏蔽列表 */
  private addToExcludeList(tag: string) {
    if (!settings.notNeedTag.includes(tag)) {
      settings.notNeedTag.push(tag)
      setSetting('notNeedTag', settings.notNeedTag)

      toast.warning('屏蔽 ' + tag)

      this.updatePanel()
    }
  }

  /**把这个 tag 从屏蔽列表中移除*/
  private removeFormExcludeList(tag: string) {
    const index = settings.notNeedTag.findIndex((str) => str === tag)
    if (index > -1) {
      settings.notNeedTag.splice(index, 1)
      setSetting('notNeedTag', settings.notNeedTag)

      toast.success('取消屏蔽 ' + tag)

      this.updatePanel()
    }
  }

  /**把这个 tag 从 tag 重命名列表中移除 */
  private removeFormTagRename(tag: string, itemID: number) {
    const itemIndex = settings.UseDifferentNameRuleIfWorkHasTagList.findIndex(
      (item) => item.id === itemID
    )
    if (itemIndex > -1) {
      const item = settings.UseDifferentNameRuleIfWorkHasTagList[itemIndex]
      const index = item.tags.findIndex((str) => str === tag)
      if (index > -1) {
        const rename = item.rule
        item.tags.splice(index, 1)

        // 如果这个规则里的 tag 全都移除了，则删除这条规则
        if (item.tags.length === 0) {
          settings.UseDifferentNameRuleIfWorkHasTagList.splice(itemIndex, 1)
        }

        setSetting(
          'UseDifferentNameRuleIfWorkHasTagList',
          settings.UseDifferentNameRuleIfWorkHasTagList
        )

        toast.success(`移除重命名 ${tag} -> ${rename}`)

        this.updatePanel()
      }
    }
  }
}

new CheckTag()
