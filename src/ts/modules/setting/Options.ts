import { form } from './Form'

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

// 操作设置表单的选项区域
// 可以控制每个设置的隐藏、显示
// 可以直接设置每个选项的值
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
  }

  private allOption: NodeListOf<HTMLElement>

  private wantPageEls: WantPageEls

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
  public hideOption(no: number[]) {
    this.setOptionDisplay(no, 'none')
  }

  // 显示指定的选项。因为页面无刷新加载，所以一些选项被隐藏后，可能需要再次显示
  public showOption(no: number[]) {
    this.setOptionDisplay(no, 'block')
  }

  // 设置 “设置页面/作品数量” 选项的提示和预设值
  public setWantPageTip(arg: WantPageArg) {
    this.wantPageEls.text.textContent = arg.text
    this.wantPageEls.text.dataset.tip = arg.tip
    this.wantPageEls.rangTip.textContent = arg.rangTip
  }
}

const options = new Options()
export { options }
