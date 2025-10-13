import { Config } from '../Config'
import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { settings } from './Settings'

/**控制每个设置的隐藏和显示 */
class Options {
  public init(allOption: NodeListOf<HTMLElement>) {
    this.allOption = allOption
    this.bindEvents()
  }

  private allOption!: NodeListOf<HTMLElement>

  /**始终保持显示的选项 */
  private readonly whiteList: number[] = [2, 4, 13, 17, 32, 44, 50, 51, 57, 64]

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'showAdvancedSettings') {
        this.handleShowAdvancedSettings()
        this.alwaysHideSomeOption()
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      window.setTimeout(() => {
        this.handleShowAdvancedSettings()
        this.alwaysHideSomeOption()
      }, 0)
    })
  }

  // 总是隐藏某些设置
  private alwaysHideSomeOption() {
    this.hideOption([79, 80])

    // 某些设置在移动端不会生效，所以隐藏它们
    // 主要是和作品缩略图相关的一些设置、增强功能
    if (Config.mobile) {
      this.hideOption([18, 68, 55, 71, 62, 40])
    }

    // 大部分设置在 pixivision 里都不适用，所以需要隐藏它们
    if (pageType.type === pageType.list.Pixivision) {
      options.hideOption([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 21, 22,
        23, 24, 26, 27, 28, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44,
        46, 47, 48, 49, 50, 51, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
        66, 67, 68, 69, 70, 71, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
        85, 86, 87, 88, 89,
      ])
    }
  }

  private handleShowAdvancedSettings() {
    for (const option of this.allOption) {
      if (option.dataset.no === undefined) {
        continue
      }

      const no = Number.parseInt(option.dataset.no)

      // 如果需要隐藏高级设置
      if (!settings.showAdvancedSettings) {
        // 然后判断是否在白名单里
        if (this.whiteList.includes(no)) {
          this.showOption([no])
        } else {
          this.hideOption([no])
        }
      } else {
        // 如果需要显示高级设置
        this.showOption([no])
      }
    }
  }

  // 使用编号获取指定选项的元素
  private getOption(no: number) {
    for (const option of this.allOption) {
      if (option.dataset.no === no.toString()) {
        return option
      }
    }
    throw `Not found this option: ${no}`
  }

  // 显示或隐藏指定的选项
  private setOptionDisplay(no: number[], display: string) {
    for (const number of no) {
      // 抓取多少页面/作品的显示与否不是在这里控制的，所以跳过它们
      if (number === 0 || number === 1) {
        continue
      }
      this.getOption(number).style.display = display
    }
  }

  // 显示所有选项
  // 在切换不同页面时使用
  public showAllOption() {
    for (const el of this.allOption) {
      el.style.display = 'flex'
    }
  }

  // 隐藏指定的选项。参数是数组，传递设置项的编号。
  public hideOption(no: number[]) {
    this.setOptionDisplay(no, 'none')
  }

  // 显示指定的选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
  public showOption(no: number[]) {
    this.setOptionDisplay(no, 'flex')
  }
}

const options = new Options()
export { options }
