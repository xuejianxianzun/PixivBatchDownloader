import { setSetting, settings, SettingKeys } from '../setting/Settings'
import { LangTextKey } from '../langText'
import { EVT } from '../EVT'

interface TipCardConfig {
  key: SettingKeys
  text: LangTextKey
}

/** 所有提示卡片的配置。key 是控制它是否显示的设置项，text 是卡片正文的 i18n key */
const tipCardConfigs = [
  {
    key: 'tipPinOption',
    text: '_提示可以置顶选项',
  },
  {
    key: 'tipManuallyExcludeWorks',
    text: '_手动排除作品的提示信息',
  },
  {
    key: 'tipHowToCrawlUserWorks',
    text: '_提示怎么抓取一个用户的作品',
  },
  {
    key: 'tipCloseAskFileSaveLocation',
    text: '_建议您关闭询问文件保存位置',
  },
  {
    key: 'tipOpenWikiLink',
    text: '_提示查看wiki页面',
  },
  {
    key: 'tipButtonsOnThumbnail',
    text: '_提示下载器会在缩略图上显示一些按钮',
  },
] as const satisfies readonly TipCardConfig[]

/** 提示卡片的 key。从上面的配置里推导而来，所以传错 key 会在编译期报错 */
type TipCardKey = (typeof tipCardConfigs)[number]['key']

/** 管理设置面板上的一些小提示卡片，默认显示，用户点击确定按钮之后改为隐藏 */
class SettingsPanelTipCard {
  /** 创建指定的提示卡片。调用方可以在需要的时候把它插入到页面里 */
  public use(key: TipCardKey) {
    const item = tipCardConfigs.find((item) => item.key === key)
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
    // 根据设置项的值决定卡片是否显示。
    // 外部也可能隐藏卡片（例如二级分类里没有可见的设置项时），
    // 那种情况由外部给卡片添加 is-context-hidden 类，两者互不干扰
    const updateDisplay = () => {
      div.classList.toggle('is-hidden', settings[item.key] === false)
    }

    // 点击确认按钮之后隐藏提示卡片
    const btn = div.querySelector('button')
    btn!.addEventListener('click', () => {
      setSetting(item.key, false)
      updateDisplay()
    })

    // 监听设置变化，显示或隐藏提示卡片
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === item.key) {
        updateDisplay()
      }
    })

    // 创建时先按当前的设置值设置一次显示状态。
    // 通常设置项初始化时也会触发 settingChange 事件，所以这里主要是一个兜底
    updateDisplay()
  }
}

const settingsPanelTipCard = new SettingsPanelTipCard()
export { settingsPanelTipCard, TipCardKey }
