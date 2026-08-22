import { setSetting, SettingKeys } from '../setting/Settings'
import { LangTextKey } from '../langText'
import { EVT } from '../EVT'

interface TipCardConfig {
  key: SettingKeys
  text: LangTextKey
}

/** 管理设置面板上的一些小提示卡片，默认显示，用户点击确定按钮之后改为隐藏 */
class SettingsPanelTipCard {
  private readonly config: TipCardConfig[] = [
    {
      key: 'tipPinOption',
      text: '_提示可以置顶选项',
    },
    {
      key: 'tipManuallyExcludeWorks',
      text: '_手动排除作品的提示信息',
    },
    {
      key: 'tipCloseAskFileSaveLocation',
      text: '_建议您关闭询问文件保存位置',
    },
    {
      key: 'tipOpenWikiLink',
      text: '_提示查看wiki页面',
    },
  ]

  public use(key: string) {
    const item = this.config.find((item) => item.key === key)
    if (!item) {
      return null
    }

    const div = document.createElement('div')
    div.classList.add('settingsPanel_tipCard')
    div.id = item.key
    div.innerHTML = `
    <svg class="icon settingsPanel_tipIcon" aria-hidden="true"><use xlink:href="#light-line"></use></svg>
      <div class="settingsPanel_tipText">
        <span class="settingsPanel_tipTextContent" data-xztext="${item.text}"></span>
        <button class="settingsPanel_tipConfirm" type="button" data-xztitle="_已确认">
          <svg class="icon" aria-hidden="true"><use xlink:href="#yes"></use></svg>
        </button>
      </div>`
    this.bindEvent(div, item)

    return div
  }

  private bindEvent(div: HTMLDivElement, item: TipCardConfig) {
    // 点击确认按钮之后隐藏提示卡片
    const btn = div.querySelector('button')
    btn!.addEventListener('click', () => {
      setSetting(item.key, false)
      div.style.display = 'none'
    })

    // 监听设置变化，显示或隐藏提示卡片
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === item.key) {
        div.style.display = data.value ? 'flex' : 'none'
      }
    })
  }
}

const settingsPanelTipCard = new SettingsPanelTipCard()
export { settingsPanelTipCard }
