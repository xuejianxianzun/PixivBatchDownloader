interface Option {
  /**可选，输入框的宽度。注意，由于包含按钮等元素，整个容器的整体宽度会比这个值更大 */
  width?: number
  /**可选，输入框的高度 */
  height?: number
  /**输入框的 HTML 标签是 input 还是 textarea。默认为 input */
  type?: 'input' | 'textarea'
  /**可选，在输入框上方可以显示一段说明文字 */
  Instruction?: string
  /**可选，输入框里显示的占位符 */
  placeholder?: string
  /**可选，传递输入框的默认值。 */
  value?: string
  /**可选，提交按钮里显示的文字。点击按钮时会提交 */
  buttonText?: string
}

class Input {
  /**所有选项皆是可选的 */
  constructor(option: Option) {
    this.init(option)
  }

  private defultOption: Option = {
    width: 600,
    height: 50,
    type: 'input',
    Instruction: '',
    placeholder: '',
    value: '',
    buttonText: 'submit',
  }

  public value = ''

  private init(option: Option) {
    const _option = Object.assign(this.defultOption, option)
    this.value = _option.value!
    this.create(_option)
  }

  private create(option: Option) {}
}

export { Input }
