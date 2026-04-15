import { Config } from '../Config'
import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { settings } from './Settings'
import { Tools } from '../Tools'
import { states } from '../store/States'
import { pinOption } from './PinOptions'
import { showNewIcon } from './ShowNewIcon'
import { Utils } from '../utils/Utils'

/**控制每个设置的隐藏和显示 */
class Options {
  public init(allOption: NodeListOf<HTMLElement>) {
    this.allOption = allOption
    this.bindEvents()

    pinOption.init(allOption)
    showNewIcon.init(allOption)
  }

  private allOption!: NodeListOf<HTMLElement>

  /** 定制的设置项，不在公开版本里显示 */
  private customOptions = [15, 79, 80, 92]

  /** 一些设置在移动端不会生效，所以隐藏它们 */
  // 主要是和作品缩略图相关的一些设置、增强功能
  private hideOnMobile = [18, 68, 55, 71, 62, 40]

  /** 大部分设置在 pixivision 里都不适用，所以需要隐藏它们 */
  private hideOnPixivision = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 21, 22, 23,
    24, 26, 27, 28, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 46, 47,
    48, 49, 50, 51, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
    69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
    88, 89, 90, 91, 92, 94, 95, 96, 98, 99, 100, 101, 102, 103, 104,
  ]

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.display()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      if (!states.settingInitialized) {
        return
      }

      const data = ev.detail.data as any
      if (data.name === 'showAdvancedSettings') {
        this.display()
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      window.setTimeout(() => {
        this.display()
      }, 0)
    })
  }

  /**根据显示/隐藏高级设置来处理每个选项的显示与隐藏 */
  private display() {
    const isPixiv = Utils.isPixiv()
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

      // 然后处理需要始终显示的选项
      if (isPixiv) {
        // 显示白名单里的选项、置顶的选项
        if (
          Config.optionWhiteList.includes(no) ||
          settings.pinnedOptions.includes(no)
        ) {
          this.showOption([no])
          continue
        }
      }

      // 剩余的选项都是高级设置，它们默认是显示的
      // 在 pixivision 上，不处理高级设置，所以剩余的选项都会显示
      if (!isPixiv) {
        continue
      }

      // 在 Pixiv 上，显示或隐藏高级设置
      if (!settings.showAdvancedSettings) {
        this.hideOption([no])
      } else {
        this.showOption([no])
      }
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
      // 抓取多少页面/作品的显示与否不是在这里控制的，所以跳过它们
      if (number === 0 || number === 1) {
        continue
      }
      Tools.getOption(this.allOption, number).style.display = display
    }
  }
}

const options = new Options()
export { options }
