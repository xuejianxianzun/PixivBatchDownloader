// 可以用字母和数字组成隐藏口令，注册到这个模块，当用户输入隐藏口令时执行回调函数
class SecretSignal {
  constructor() {
    this.bindEvents()
  }

  private list: {
    code: string
    cb: Function
  }[] = []

  // 允许的按键：字母键，数字键，小键盘数字键
  // "KeyX"
  // "Digit9"
  // "Numpad1"
  private codePrefix = ['Key', 'Digit', 'Numpad']

  private input = ''

  public register(code: string, cb: Function) {
    this.list.push({
      code,
      cb,
    })
  }

  private bindEvents() {
    window.addEventListener('keydown', (ev) => {
      // 不保存控制按键，不保存输入状态中的按键
      if (
        !ev.code ||
        ev.altKey ||
        ev.ctrlKey ||
        ev.metaKey ||
        ev.shiftKey ||
        ev.isComposing
      ) {
        return
      }

      // 保存字母和数字的按键
      for (const prefix of this.codePrefix) {
        if (
          ev.code.startsWith(prefix) &&
          ev.code.length === prefix.length + 1
        ) {
          // 如果字符串长度超过限制，则移除前面的一部分字符
          if (this.input.length > 99) {
            this.input = this.input.slice(80)
          }
          const key = ev.code[ev.code.length - 1].toLowerCase()
          this.input += key
          this.check()
        }
      }
    })
  }

  private check() {
    for (const item of this.list) {
      if (this.input.endsWith(item.code)) {
        item.cb()
      }
    }
  }
}

const secretSignal = new SecretSignal()
export { secretSignal }
