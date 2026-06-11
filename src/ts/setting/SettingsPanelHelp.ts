import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { LangTextKey } from '../langText'
import { msgBox } from '../MsgBox'

class SettingsPanelHelp {
  constructor(root: HTMLDivElement) {
    this.root = root
    this.render()
    this.bindEvents()
    this.renderActionVisibility()
  }

  private root: HTMLDivElement
  private actionsWrap!: HTMLDivElement
  private readonly actionEls = new Map<string, HTMLButtonElement>()

  private render() {
    const tipsWrap = document.createElement('div')
    tipsWrap.className = 'settingsPanel_helpTips'
    tipsWrap.innerHTML = `
    <div class="settingsPanel_tipCard" id="tipPinOption">
      <svg class="icon settingsPanel_tipIcon" aria-hidden="true"><use xlink:href="#light-line"></use></svg>
      <div class="settingsPanel_tipText">
        <span class="settingsPanel_tipTextContent" data-xztext="_提示可以置顶选项"></span>
        <button class="settingsPanel_tipConfirm" type="button" data-xztitle="_已确认">
          <svg class="icon" aria-hidden="true"><use xlink:href="#yes"></use></svg>
        </button>
      </div>
    </div>
    <div class="settingsPanel_tipCard" id="tipOpenWikiLinkWrap">
      <svg class="icon settingsPanel_tipIcon" aria-hidden="true"><use xlink:href="#light-line"></use></svg>
      <div class="settingsPanel_tipText">
        <span class="settingsPanel_tipTextContent">
          <span data-xztext="_提示查看wiki页面"></span>
          <button class="settingsPanel_tipConfirm" type="button" data-xztitle="_已确认">
            <svg class="icon" aria-hidden="true"><use xlink:href="#yes"></use></svg>
          </button>
        </span>
      </div>
    </div>
    `
    this.root.append(tipsWrap)

    this.actionsWrap = document.createElement('div')
    this.actionsWrap.className = 'settingsPanel_helpActions'
    this.root.append(this.actionsWrap)

    const actions: {
      id: string
      textKey: LangTextKey
      iconId: string
    }[] = [
      { id: 'wiki', textKey: '_使用手册', iconId: 'book' },
      { id: 'faq', textKey: '_常见问题', iconId: 'help' },
      { id: 'recentUpdates', textKey: '_最近更新', iconId: 'new-2' },
      { id: 'sponsorship', textKey: '_赞助我', iconId: 'heart-line' },
      { id: 'github', textKey: '_github', iconId: 'github' },
      { id: 'discord', textKey: '_Discord', iconId: 'discord' },
      { id: 'qq', textKey: '_QQ群', iconId: 'qq' },
      { id: 'airport', textKey: '_机场推荐', iconId: 'paper-airplane' },
      { id: 'fanbox', textKey: '_fanboxDownloader', iconId: 'box-open' },
      { id: 'thirdParty', textKey: '_第三方库', iconId: 'list' },
      { id: 'reset', textKey: '_重新显示帮助', iconId: 'reset' },
    ]

    actions.forEach((action) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'settingsPanel_helpAction hasRippleAnimation'
      button.dataset.action = action.id
      button.innerHTML = `
      <svg class="icon settingsPanel_helpActionIcon" aria-hidden="true">
        <use xlink:href="#${action.iconId}"></use>
      </svg>
      <span data-xztext="${action.textKey}"></span>
      <span class="ripple"></span>
      `
      this.actionsWrap.append(button)
      this.actionEls.set(action.id, button)
    })
  }

  private bindEvents() {
    this.actionsWrap.addEventListener('click', (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest(
        '.settingsPanel_helpAction'
      ) as HTMLButtonElement | null
      if (!button) {
        return
      }
      this.playRipple(button)
      this.handleAction(button.dataset.action || '')
    })

    window.addEventListener(EVT.list.langChange, () => {
      this.renderActionVisibility()
    })

    window.addEventListener(EVT.list.hasNewVer, () => {
      this.actionEls.get('recentUpdates')?.classList.add('hasUpdate')
    })
  }

  private renderActionVisibility() {
    const onlyShowInZhCN = ['airport', 'qq']
    onlyShowInZhCN.forEach((id) => {
      const btn = this.actionEls.get(id)
      if (btn) {
        btn.style.display = lang.type === 'zh-cn' ? 'flex' : 'none'
      }
    })
  }

  private handleAction(action: string) {
    switch (action) {
      case 'wiki':
        msgBox.show(lang.transl('_使用手册说明'), {
          title: lang.transl('_使用手册'),
        })
        return

      case 'faq': {
        let msg =
          lang.transl('_常见问题说明') + lang.transl('_账户可能被封禁的警告')
        if (Config.mobile) {
          msg += lang.transl('_移动端浏览器可能不会建立文件夹的说明')
        }
        msgBox.show(msg, {
          title: lang.transl('_常见问题'),
        })
        return
      }

      case 'recentUpdates':
        EVT.fire('showRecentUpdates')
        return

      case 'github':
        msgBox.show(lang.transl('_GitHub说明'), {
          title: 'GitHub',
        })
        return

      case 'discord':
        msgBox.show(lang.transl('_Discord说明'), {
          title: 'Discord',
        })
        return

      case 'qq':
        msgBox.show(lang.transl('_QQ群说明'), {
          title: lang.transl('_QQ群'),
        })
        return

      case 'fanbox':
        msgBox.show(lang.transl('_fanboxDownloader的说明'), {
          title: 'Pixiv Fanbox Downloader',
        })
        return

      case 'airport':
        msgBox.show(lang.transl('_机场推荐说明'), {
          title: lang.transl('_机场推荐'),
        })
        return

      case 'sponsorship':
        msgBox.show(lang.transl('_赞助方式提示'), {
          title: lang.transl('_赞助我'),
        })
        return

      case 'thirdParty':
        msgBox.show(lang.transl('_第三方库说明'), {
          title: lang.transl('_第三方库'),
        })
        return

      case 'reset':
        EVT.fire('resetHelpTip')
        return
    }
  }

  private playRipple(button: HTMLButtonElement) {
    if (!button.querySelector('.ripple')) {
      return
    }
    button.classList.remove('ripple-active')
    void button.offsetWidth
    button.classList.add('ripple-active')
    window.setTimeout(() => {
      button.classList.remove('ripple-active')
    }, 650)
  }
}

export { SettingsPanelHelp }
