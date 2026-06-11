import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { optionConfigs } from './OptionConfigs'

/** 在新添加的设置上显示 new 角标 */
class ShowOptionsNewFlag {
  public init(allOption: NodeListOf<HTMLElement>) {
    this.allOption = allOption
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.showNewIcon()
    })
  }

  private allOption!: NodeListOf<HTMLElement>

  // 90 天内添加的设置项，显示 new 角标
  private readonly newRange = 7776000000
  private readonly badgeClassName = 'settingsPanel_newBadge'

  /**显示 new 角标 */
  private showNewIcon() {
    const now = Date.now()
    optionConfigs.options.forEach((option) => {
      if (option.addedAt && now - option.addedAt <= this.newRange) {
        const el = Tools.getOption(this.allOption, option.no)
        if (el) {
          el.classList.add('new')
          this.addBadgeEl(el)
        }
      }
    })
  }

  private addBadgeEl(optionEl: HTMLElement) {
    if (!optionEl.classList.contains('settingsPanel_optionCard')) {
      return
    }
    if (optionEl.querySelector(`.${this.badgeClassName}`)) {
      return
    }

    const badge = document.createElement('span')
    badge.className = this.badgeClassName
    badge.setAttribute('aria-hidden', 'true')
    badge.innerHTML = `
    <svg class="icon settingsPanel_newBadgeIcon" aria-hidden="true">
      <use xlink:href="#new"></use>
    </svg>
    `
    optionEl.append(badge)
  }
}

const showOptionsNewFlag = new ShowOptionsNewFlag()
export { showOptionsNewFlag }
