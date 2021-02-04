import { Colors } from './Colors'

// 可选参数
export interface ToastArgOptional {
  // 可选，设置字体颜色，默认为白色
  color?: string
  // 可选，设置背景颜色，默认为浅蓝色，或者是语义所对应的颜色
  bgColor?: string
  // 设置提示出现后的停留时间（毫秒）
  // 默认 1000 ms
  stay?: number
  // 消失时的动画效果
  // top 默认,向上移动并逐渐消失
  // fade 逐渐消失
  // none 立即消失
  animation?: 'top' | 'fade' | 'none'
  // 提示出现的位置，默认是 topCenter
  // 如果为 mouse 则提示会出现在鼠标所处位置附近。使用 mouse 时请确保这个提示是由鼠标点击触发的
  position?: 'topCenter' | 'mouse'
}

// 完整的参数
interface ToastArg {
  msg: string
  color: string
  bgColor: string
  dealy: number
  animation: 'top' | 'fade' | 'none'
  position: 'topCenter' | 'mouse'
}

// 轻提示，只显示文字和背景颜色
// 适用于无需用户进行确认的提示
class Toast {
  constructor() {
    this.bindEvents()
  }

  private readonly defaultCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgBrightBlue,
    dealy: 1500,
    animation: 'top',
    position: 'topCenter',
  }

  private readonly successCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgSuccess,
    dealy: 1500,
    animation: 'top',
    position: 'topCenter',
  }

  private readonly warningCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgWarning,
    dealy: 1500,
    animation: 'top',
    position: 'topCenter',
  }

  private readonly errorCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgError,
    dealy: 1500,
    animation: 'top',
    position: 'topCenter',
  }

  private readonly tipClassName = 'xzToast'

  private mousePosition = { x: 0, y: 0 }
  private readonly minTop = 20

  private readonly once = 1 // 每一帧移动多少像素
  private readonly total = 20 // 移动多少像素后消失

  private bindEvents() {
    // 必须是监听 mousemove 而不是 click
    window.addEventListener('mousemove', (ev) => {
      this.mousePosition.x = ev.x
      this.mousePosition.y = ev.y
    })
  }

  public show(msg: string, arg?: ToastArgOptional) {
    this.create(Object.assign({}, this.defaultCfg, arg, { msg: msg }))
  }

  public success(msg: string, arg?: ToastArgOptional) {
    this.create(Object.assign({}, this.successCfg, arg, { msg: msg }))
  }

  public warning(msg: string, arg?: ToastArgOptional) {
    this.create(Object.assign({}, this.warningCfg, arg, { msg: msg }))
  }

  public error(msg: string, arg?: ToastArgOptional) {
    this.create(Object.assign({}, this.errorCfg, arg, { msg: msg }))
  }

  private create(arg: ToastArg) {
    const span = document.createElement('span')
    span.textContent = arg.msg

    span.style.color = arg.color

    // 设置背景颜色，优先使用 color
    span.style.backgroundColor = arg.bgColor

    // 设置位置
    if (arg.position === 'topCenter') {
      span.style.top = this.minTop + 'px'
    } else if (arg.position === 'mouse') {
      // 跟随鼠标位置
      // top 值减去一点高度，使文字出现在鼠标上方
      let y = this.mousePosition.y - 40
      if (y < this.minTop) {
        y = this.minTop
      }
      span.style.top = y + 'px'
    }

    span.classList.add(this.tipClassName)
    document.body.appendChild(span)

    // 把提示添加到页面上之后，再设置 left，使其居中

    // 默认的中间点是窗口的中间
    let centerPoint = window.innerWidth / 2

    if (arg.position === 'mouse') {
      // 把中间点设置为鼠标所处的位置
      centerPoint = this.mousePosition.x
    }

    // 设置 left
    const rect = span.getBoundingClientRect()
    let left = centerPoint - rect.width / 2
    const minLeft = 0 // 防止提示左侧超出窗口
    const maxLeft = window.innerWidth - rect.width // 防止提示右侧超出窗口
    if (left < minLeft) {
      left = minLeft
    }
    if (left > maxLeft) {
      left = maxLeft
    }
    span.style.left = left + 'px'

    // 一定时间后触发使提示消失
    window.setTimeout(() => {
      if (arg.animation === 'none') {
        span.remove()
      } else {
        this.animation(span, arg.animation)
      }
    }, arg.dealy)
  }

  // 让提示消失的动画
  private animation(el: HTMLElement, way: 'top' | 'fade') {
    const startTop = Number.parseInt(window.getComputedStyle(el)['top']) // 初始 top 值
    const once = this.once
    const total = this.total

    let numberOfTimes = 0 // 执行次数

    const frame = function (timestamp: number) {
      numberOfTimes++

      // 计算总共上移了多少像素
      const move = once * numberOfTimes

      // 计算透明度
      const opacity = 1 - move / total

      if (move < total && opacity > 0) {
        if (way === 'top') {
          el.style.top = startTop - move + 'px'
        }

        el.style.opacity = opacity.toString()

        // 请求下一帧
        window.requestAnimationFrame(frame)
      } else {
        // 不再执行动画
        el.remove()
      }
    }

    window.requestAnimationFrame(frame)
  }
}

const toast = new Toast()
export { toast }
