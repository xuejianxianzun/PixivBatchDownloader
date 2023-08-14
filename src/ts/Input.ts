import { Config } from './Config'
import { lang } from './Lang'
import { theme } from './Theme'

interface Option {
  /**可选，输入框的最大宽度。注意：如果页面(或父元素）的宽度不够，输入框的宽度会自动缩小。 */
  width?: number
  /**输入框的 HTML 标签是 input 还是 textarea。默认为 input */
  type?: 'input' | 'textarea'
  /**可选，在输入框上方可以显示一段说明文字 */
  instruction?: string
  /**可选，输入框里显示的占位符 */
  placeholder?: string
  /**可选，传递输入框的默认值。 */
  value?: string
  /**可选，提交按钮里显示的文字。点击按钮时会提交 */
  buttonText?: string
}

class Input {
  /**所有选项皆是可选的 */
  constructor(option?: Option) {
    this.init(option)
  }

  private defultOption: Option = {
    width: 600,
    type: 'input',
    instruction: '',
    placeholder: '',
    value: '',
    buttonText: lang.transl('_提交'),
  }

  public value = ''

  private id = ''

  private init(option?: Option) {
    const _option = Object.assign(this.defultOption, option || {})
    this.value = _option.value!
    this.id = `input` + new Date().getTime()
    this.create(_option)
  }

  private create(option: Option) {
    const example = `<div class="XZInputWrap ?:mobile" id="input1691811888224">
    <p class="XZInputInstruction">instruction</p>
    <div class="XZInputContainer">
      <input type="text" class="XZInput" value="default" placeholder="tip" />
      <textarea class="XZInput" placeholder="tip">default</textarea>
      <button class="XZInputButton">submit</button>
    </div>
  </div>`

    const wrap = document.createElement('div')
    wrap.classList.add('XZInputWrap')
    Config.mobile && wrap.classList.add('mobile')
    wrap.id = this.id
    wrap.style.width = option.width! + 100 + 'px'
    theme.register(wrap)

    if (option.instruction) {
      const p = document.createElement('p')
      p.classList.add('XZInputInstruction')
      p.innerHTML = option.instruction
      wrap.append(p)
    }

    const container = document.createElement('div')
    container.classList.add('XZInputContainer')

    const input = document.createElement(option.type!)
    input.classList.add('XZInput')
    input.setAttribute('placeholder', option.placeholder!)
    input.style.flexBasis = option.width! + 'px'
    if (option.type === 'input') {
      input.setAttribute('type', 'text')
      input.setAttribute('value', option.value!)
    } else {
      input.textContent = option.value!
    }
    container.append(input)

    const button = document.createElement('button')
    button.classList.add('XZInputButton')
    button.textContent = option.buttonText!
    container.append(button)

    wrap.append(container)

    document.body.append(wrap)

    input.focus()
    if (option.value) {
      input.setSelectionRange(option.value.length, option.value.length)
    }

    input.addEventListener('change', () => {
      this.value = input.value
    })

    // 按 Esc 直接移除本组件，并且不会执行 onSubmit 回调
    input.addEventListener('keydown', (ev: any) => {
      if (ev.code === 'Escape') {
        this.remove()
      }
    })

    button.addEventListener('click', () => {
      this.onSubmit()
    })
  }

  /**点击提交按钮时执行此回调函数 */
  public onSubmit() {}

  public remove() {
    const wrap = document.querySelector(`#${this.id}`)
    wrap && wrap.remove()
  }
}

export { Input }
