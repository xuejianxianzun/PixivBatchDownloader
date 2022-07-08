import { EVT } from '../EVT'
import { lang } from '../Lang'
import { form } from './Form'
import { settings } from './Settings'

interface WantPageArg {
  text: string
  tip: string
  rangTip: string
}

interface WantPageEls {
  text: HTMLSpanElement
  rangTip: HTMLSpanElement
  input: HTMLInputElement
}

// 可以控制每个设置的隐藏、显示
// 可以设置页数/个数的提示内容
class Options {
  constructor() {
    this.allOption = form.querySelectorAll('.option')

    // 获取“页数/个数”设置的元素
    const wantPageOption = this.getOption(1)!
    this.wantPageEls = {
      text: wantPageOption.querySelector(
        '.setWantPageTip1'
      )! as HTMLSpanElement,
      rangTip: wantPageOption.querySelector(
        '.setWantPageTip2'
      )! as HTMLSpanElement,
      input: wantPageOption.querySelector('.setWantPage')! as HTMLInputElement,
    }

    this.handleShowAdvancedSettings()
    this.bindEvents()
  }

  private allOption: NodeListOf<HTMLElement>

  private wantPageEls: WantPageEls

  // 保持显示的选项的 id
  private readonly whiteList: number[] = [
    1, 2, 4, 13, 17, 32, 44, 50, 51, 57, 64,
  ]

  // 某些页面类型需要隐藏某些选项。当调用 hideOption 方法时，把选项 id 保存起来
  // 优先级高于 whiteList
  private hiddenList: number[] = []

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'showAdvancedSettings') {
        this.handleShowAdvancedSettings()
      }
    })

    const list = [
      EVT.list.pageSwitchedTypeNotChange,
      EVT.list.pageSwitchedTypeChange,
    ]
    list.forEach((ev) => {
      window.addEventListener(ev, () => {
        this.hiddenList = []
        window.setTimeout(() => {
          this.handleShowAdvancedSettings()
        })
      })
    })
  }

  private handleShowAdvancedSettings() {
    for (const option of this.allOption) {
      if (option.dataset.no === undefined) {
        continue
      }

      const no = Number.parseInt(option.dataset.no)

      // 如果需要隐藏高级设置
      if (!settings.showAdvancedSettings) {
        // 如果在白名单中，并且当前页面不需要隐藏它，那么它就是显示的
        if (this.whiteList.includes(no) && !this.hiddenList.includes(no)) {
          this.showOption([no])
        }

        // 如果没有在白名单中，或者当前页面需要隐藏它，就隐藏它
        if (!this.whiteList.includes(no) || this.hiddenList.includes(no)) {
          option.style.display = 'none'
        }
      } else {
        // 如果需要显示高级设置，那么只隐藏当前页面需要隐藏的选项
        if (this.hiddenList.includes(no)) {
          option.style.display = 'none'
        } else {
          this.showOption([no])
        }
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
      this.getOption(number).style.display = display
    }
  }

  // 显示所有选项
  // 在切换不同页面时使用
  public showAllOption() {
    for (const el of this.allOption) {
      el.style.display = 'block'
    }
  }

  // 隐藏指定的选项。参数是数组，传递设置项的编号。
  // 注意：由于这个方法会修改 hiddenList，所以它是有副作用的
  // 这个方法只应该在其他类里面使用，在这个类里不要直接调用它
  public hideOption(no: number[]) {
    this.hiddenList = no
    this.setOptionDisplay(no, 'none')
  }

  // 显示指定的选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
  public showOption(no: number[]) {
    this.setOptionDisplay(no, 'block')
  }

  // 设置 “设置页面/作品数量” 选项的提示和预设值
  public setWantPageTip(arg: WantPageArg) {
    lang.updateText(this.wantPageEls.text, arg.text)

    this.wantPageEls.text.parentElement!.dataset.xztip = arg.tip
    this.wantPageEls.text.parentElement!.dataset.tip = lang.transl(
      arg.tip as any
    )

    // rangTip 可能需要翻译
    if (arg.rangTip.startsWith('_')) {
      lang.updateText(this.wantPageEls.rangTip, arg.rangTip)
    } else {
      // 也可能直接传递了字符串，不需要翻译
      lang.updateText(this.wantPageEls.rangTip, '')
      this.wantPageEls.rangTip.textContent = arg.rangTip
    }
  }
}

const options = new Options()
export { options }
