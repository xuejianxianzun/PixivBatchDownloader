import { Config } from './Config'
import { lang } from './Language'
import { theme } from './Theme'
import { Utils } from './utils/Utils'

interface Option {
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

    // ⚠️ 必须把组件插入到页面上，否则它完全不会显示（组件是 position: fixed，直接挂在 body 下）。
    // 以前这一段里还有「先插入 → 读取按钮实际宽度 → 按 输入框宽度 + 按钮宽度 重设 wrap 宽度」的逻辑，
    // 因为那时按钮排在输入框右侧、wrap 的宽度要考虑按钮。现在两端（PC / 移动）都是纵向排列，
    // 宽度完全由 CSS 控制，所以测量逻辑已移除 —— 但「插入 DOM」这一步与宽度无关，不能一起删掉。
    document.body.append(wrap)

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
        return
      }

      // 按 Enter 或 Ctrl + Enter 都提交。
      // ⚠️ 用 ev.key 而不是 ev.code 判断：小键盘的 Enter（ev.code 是 NumpadEnter）的 ev.key 也是 'Enter'，
      // 这样两种 Enter 都能提交。
      if (ev.key !== 'Enter') {
        return
      }

      // 排除其他修饰键：只有「不按修饰键」和「只按 Ctrl」这两种组合会提交，
      // Shift / Alt / Meta（macOS 的 Cmd）以及它们和 Ctrl 的任意组合都不提交。
      if (ev.shiftKey || ev.altKey || ev.metaKey) {
        return
      }

      // 输入法正在组词时（中文、日文的候选框），Enter 是用来确认候选词的，不能当成提交
      if (ev.isComposing || ev.keyCode === 229) {
        return
      }

      // 阻止默认行为：输入框是 textarea 时，按 Enter 默认会插入换行，这里要把它换成提交。
      // 想换行请用 Shift + Enter —— Shift 组合不会被拦截，会保留「插入换行」的默认行为。
      ev.preventDefault()
      // 此时输入框还没有失去焦点，change 事件可能还没触发，所以直接读一次当前的值
      this.value = input.value
      this.submitted = true
      this.remove()
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

  /**当用户提交后（点击提交按钮，或者按 Enter / Ctrl + Enter），返回 value。注意：可能会返回空字符串
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
