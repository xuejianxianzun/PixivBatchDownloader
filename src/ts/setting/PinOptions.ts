import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'
import { settings, setSetting } from './Settings'

/** 管理置顶的选项 */
class PinOptions {
  public init(allOption: NodeListOf<HTMLElement>) {
    // 不在 pixivision 上启用
    if (!Utils.isPixiv()) {
      return
    }

    this.allOption = allOption
    this.bindEvents()
  }

  private allOption!: NodeListOf<HTMLElement>
  private pinnedClassName = 'pinned'
  /** 保存当前置顶选项的列表 */
  private list!: number[]

  private bindEvents() {
    // 在设置初始化之后，第一次执行 display
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.addPinButton()
      this.display()
      this.list = settings.pinnedOptions.slice()
    })

    // 初始化之后，如果用户修改了置顶选项列表，则再次执行 display
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      if (!states.settingInitialized) {
        return
      }
      const data = ev.detail.data as any
      if (data.name === 'pinnedOptions') {
        // 对比新旧列表，找出有哪些选项被取消了置顶
        const removed = this.list.filter(
          (no) => !settings.pinnedOptions.includes(no)
        )
        // 传入被取消置顶的选项
        this.display(removed)
        // 保存新的列表
        this.list = settings.pinnedOptions.slice()
      }
    })
  }

  /** 在每个选项前面添加置顶按钮 */
  // 对于未置顶的选项，在鼠标经过时添加并显示置顶按钮；对于已置顶的选项，直接显示置顶按钮
  private addPinButton() {
    for (const option of this.allOption) {
      // 跳过分类标题
      if (option.classList.contains('settingCategoryName')) {
        continue
      }

      const no = option.dataset.no
      if (!no) {
        continue
      }
      const noNum = Number.parseInt(no)

      // 已置顶的选项，直接显示置顶按钮
      if (settings.pinnedOptions.includes(noNum)) {
        option.classList.add(this.pinnedClassName)
        this.bindTogglePinEvent(option, noNum)
      } else {
        // 未置顶的选项，在鼠标经过时才会添加置顶按钮，以减少 DOM 元素数量
        option.addEventListener('mouseover', () => {
          this.bindTogglePinEvent(option, noNum)
        })
      }
    }
  }

  private createPinButton(option: HTMLElement) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.classList.add('pinButton')
    btn.textContent = '📌'
    btn.dataset.title = '_置顶'
    lang.register(btn)
    option.insertAdjacentElement('afterbegin', btn)
    return btn
  }

  /** 点击置顶按钮，或者长按选项的名称时，切换该选项的置顶状态 */
  private bindTogglePinEvent(option: HTMLElement, noNum: number) {
    const existingBtn = option.querySelector('.pinButton') as HTMLButtonElement
    if (existingBtn) {
      return
    }

    const btn = this.createPinButton(option)
    btn.addEventListener('click', () => {
      this.tooglePinOption(noNum)
    })

    const a = option.querySelector('a.settingNameStyle') as HTMLAnchorElement
    if (a) {
      Utils.longPress(a, () => {
        this.tooglePinOption(noNum)
      })
    }
  }

  /** 切换该选项的置顶状态 */
  private tooglePinOption(noNum: number) {
    if (settings.pinnedOptions.includes(noNum)) {
      // 已置顶，取消置顶
      settings.pinnedOptions = settings.pinnedOptions.filter(
        (no) => no !== noNum
      )
      toast.warning(lang.transl('_取消置顶'))
    } else {
      // 未置顶，添加置顶
      settings.pinnedOptions.push(noNum)
      toast.success(lang.transl('_已置顶'))
    }

    // 保存设置
    setSetting('pinnedOptions', settings.pinnedOptions)
  }

  /** 设置选项的显示与隐藏 */
  private display(removed: number[] = []) {
    // 倒序遍历，把置顶的选项显示在顶部
    // 如果正序遍历的话，前面的选项（先置顶的选项）会被后置顶的选项挤下去，导致显示的顺序与添加的顺序相反
    for (const no of settings.pinnedOptions.slice().reverse()) {
      const option = Tools.getOption(this.allOption, no)
      if (!option) {
        continue
      }
      option.classList.add(this.pinnedClassName)
      // 总是显示置顶的选项，即使用户没有启用“不显示高级设置”，也依然会显示
      // 但是不处理“抓取多少作品”和“抓取多少页面”，因为它们是根据页面类型来显示或隐藏的，不在这里处理
      if (no !== 0 && no !== 1) {
        option.style.display = 'flex'
      }
      // 在该选项所在的选项卡容器里查找插入点，并把选项显示在插入点后面
      const target = option.parentElement!.querySelector(
        '.pinnedOptionTarget'
      ) as HTMLElement
      target.insertAdjacentElement('afterend', option)
    }

    // 处理被取消置顶的选项
    for (const no of removed) {
      const option = Tools.getOption(this.allOption, no)
      if (!option) {
        continue
      }
      if (!settings.pinnedOptions.includes(no)) {
        // 移除类名
        option.classList.remove(this.pinnedClassName)
        // 如果它不在始终显示的选项里，并且未启用“显示高级设置”，则隐藏它
        if (
          !Config.optionWhiteList.includes(no) &&
          !settings.showAdvancedSettings
        ) {
          option.style.display = 'none'
        }
        // 查找锚点，并把它移动回原来的位置
        const anchor = document.querySelector(
          `.centerWrap_con .optionAnchor[data-for-no="${no}"]`
        ) as HTMLElement
        if (anchor) {
          anchor.insertAdjacentElement('afterend', option)
        }
      }
    }
  }
}

const pinOption = new PinOptions()
export { pinOption }
