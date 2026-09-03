import { Config } from './Config'
import { lang } from './Language'
import { theme } from './Theme'
import { Utils } from './utils/Utils'

interface Option {
  /**可选，输入框的最大宽度。注意：如果页面(或父元素）的宽度不够，输入框的宽度会自动缩小。 */
  width?: number
  /**输入框的 HTML 标签是 input 还是 textarea。默认为 input */
  type?: 'input' | 'textarea'
  /**仅当输入框为 textarea 时，可以通过 rows 设置高度（行数） */
  rows?: number
  /**可选，在输入框上方可以显示一段说明文字 */
  instruction?: string
  /**可选，输入框里显示的占位符 */
  placeholder?: string
  /**可选，传递输入框的默认值。 */
  value?: string
  /**可选，提交按钮里显示的文字。点击按钮时会提交 */
  submitButtonText?: string
}

class Input {
  /**所有选项皆是可选的 */
  constructor(option?: Option) {
    this.init(option)
  }

  private defultOption: Option = {
    width: 600,
    type: 'input',
    rows: 3,
    instruction: '',
    placeholder: '',
    value: '',
    submitButtonText: lang.transl('_提交'),
  }

  public value = ''

  private id = ''

  private submitted = false
  private cancelled = false

  private init(option?: Option) {
    const _option = Object.assign(this.defultOption, option || {})
    this.value = _option.value!
    this.id = `input` + Date.now()
    this.create(_option)
  }

  private readonly wrapHtmlExample = `
  <div class="XZInputWrap ?:mobile" id="input1691811888224">
    <p class="XZInputInstruction">instruction</p>
    <div class="XZInputContainer">
      <input type="text" class="XZInput" value="default" placeholder="tip" />
      <textarea class="XZInput" placeholder="tip">default</textarea>
      <div class="XZInputButtons">
        <button class="XZInputButton cancel" id="input1691811888224CancelBtn">Cancel</button>
        <button class="XZInputButton" id="input1691811888224SubmitBtn">Submit</button>
      </div>
    </div>
  </div>`

  private create(option: Option) {
    const wrap = document.createElement('div')
    wrap.classList.add('XZInputWrap')
    Config.mobile && wrap.classList.add('mobile')
    wrap.id = this.id
    // 这里设置的宽度是粗略值，后面会再修改
    wrap.style.width = option.width! + 200 + 'px'
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
    // 桌面端：输入框用 flex-basis 指定宽度
    // 移动端：输入框会撑满整个容器宽度（按钮被移到下一行），无需 flex-basis
    if (!Config.mobile) {
      input.style.flexBasis = option.width! + 'px'
    }
    if (option.type === 'input') {
      input.setAttribute('type', 'text')
      input.setAttribute('value', option.value!)
    } else {
      input.textContent = option.value!
      input.setAttribute('rows', option.rows!.toString())
    }
    container.append(input)

    // 两个按钮放入同一个容器，便于在移动端将它们换行到输入框下方
    const buttonsWrap = document.createElement('div')
    buttonsWrap.classList.add('XZInputButtons')

    // 按钮顺序：取消在左、提交在右（网页/浏览器与移动端平台惯例）。
    // 注意 wrap 的宽度测量只累加按钮宽度，不依赖顺序；间距用通用兄弟选择器，也不依赖顺序。
    const cancelButton = document.createElement('button')
    cancelButton.classList.add('XZInputButton', 'cancel', 'hasRippleAnimation')
    cancelButton.innerHTML = `
      <span>${lang.transl('_取消')}</span>
      <span class="ripple"></span>
    `
    cancelButton.id = `xzInputCancelBtn`
    buttonsWrap.append(cancelButton)

    const submitButton = document.createElement('button')
    submitButton.classList.add('XZInputButton', 'hasRippleAnimation')
    submitButton.innerHTML = `
      <span>${option.submitButtonText}</span>
      <span class="ripple"></span>
    `
    submitButton.id = `xzInputSubmitBtn`
    buttonsWrap.append(submitButton)

    container.append(buttonsWrap)

    wrap.append(container)

    // 由于 wrap 宽度要考虑按钮宽度，但按钮宽度不固定，所以要先添加到页面上，获取按钮实际宽度，再调整 wrap 宽度
    // 移动端：按钮在输入框下方，wrap 宽度只需要等于输入框的宽度
    wrap.style.opacity = '0'
    document.body.append(wrap)

    if (Config.mobile) {
      wrap.style.width = option.width! + 'px'
    } else {
      // 根据按钮宽度，重设 wrap 宽度
      const submitRect = submitButton.getClientRects()
      const cancelRect = cancelButton.getClientRects()
      // 14 是按钮的 margin-left 值
      wrap.style.width =
        option.width! +
        14 +
        submitRect[0].width +
        14 +
        cancelRect[0].width +
        'px'
    }
    wrap.style.opacity = '1'

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

    submitButton.addEventListener('click', () => {
      this.submitted = true
      this.remove()
    })

    cancelButton.addEventListener('click', () => {
      this.cancelled = true
      this.remove()
    })
  }

  private remove() {
    const wrap = document.querySelector(`#${this.id}`)
    wrap && wrap.remove()
  }

  /**当用户点击提交按钮后，返回 value。注意：可能会返回空字符串
   * 如果用户点击取消按钮，则抛出 reject
   */
  public async submit(): Promise<string> {
    while (true) {
      await Utils.sleep(100)
      if (this.cancelled) {
        return ''
      }
      if (this.submitted) {
        return this.value
      }
    }
  }
}

export { Input }
