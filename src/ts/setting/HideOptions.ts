import { Config } from '../Config'
import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { Tools } from '../Tools'
import { states } from '../store/States'
import { optionConfigs } from './OptionConfigs'

/** 在初始化和切换页面之后，隐藏一些不该显示的设置项 */
// 备注：它也会把不需要隐藏的设置项都显示出来，不过这是附带的，主要目的还是为了隐藏设置项
class HideOptions {
  public init(allOption: NodeListOf<HTMLElement>) {
    this.allOption = allOption
    this.bindEvents()
  }

  private allOption!: NodeListOf<HTMLElement>

  /** 定制的设置项，不在公开版本里显示 */
  // private customOptions = optionConfigs.options
  // .filter((option) => option.isCustom)
  // .map((option) => option.no)
  // 在红叶版本里不会隐藏这些设置
  private customOptions: number[] = []

  /** 一些设置在移动端不会生效，所以隐藏它们 */
  // 主要是和作品缩略图相关的一些设置、增强功能
  private hideOnMobile = optionConfigs.options
    .filter((option) => option.hideOnMobile)
    .map((option) => option.no)

  /** 大部分设置在 pixivision 里都不适用，所以需要隐藏它们 */
  private hideOnPixivision = optionConfigs.options
    .filter((option) => option.hideOnPixivision)
    .map((option) => option.no)

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.display()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      if (!states.settingInitialized) {
        return
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.display()
    })
  }

  /** 处理每个选项的显示与隐藏 */
  private display() {
    for (const option of this.allOption) {
      if (option.dataset.no === undefined) {
        continue
      }

      const no = Number.parseInt(option.dataset.no)

      // 先判断它是否需要隐藏
      const needHide = this.needHideOption(no)
      if (needHide) {
        this.hideOption([no])
        continue
      }

      this.showOption([no])
    }
  }

  /** 判断是否需要隐藏某个设置 */
  private needHideOption(no: number) {
    if (this.customOptions.includes(no)) {
      return true
    }

    if (Config.mobile) {
      if (this.hideOnMobile.includes(no)) {
        return true
      }
    }

    if (pageType.type === pageType.list.Pixivision) {
      if (this.hideOnPixivision.includes(no)) {
        return true
      }
    }
    return false
  }

  /** 隐藏指定的选项 */
  public hideOption(no: number[]) {
    this.setDisplay(no, 'none')
  }

  /** 显示指定的选项 */
  public showOption(no: number[]) {
    this.setDisplay(no, 'flex')
  }

  /** 显示或隐藏指定的选项 */
  private setDisplay(no: number[], display: string) {
    for (const number of no) {
      const option = Tools.getOption(this.allOption, number)
      if (option) {
        option.style.display = display
      }
    }
  }
}

const hideOptions = new HideOptions()
export { hideOptions }
