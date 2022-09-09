import { Colors } from './Colors'

// 可选参数
export interface ToastArgOptional {
  /**设置字体颜色，默认为白色 */
  color?: string
  /**设置背景颜色。默认为浅蓝色，或者是语义所对应的颜色 */
  bgColor?: string
  /**设置提示出现后的停留时间（毫秒），默认 1500 ms */
  stay?: number
  /**出现时的动画效果
   *
   * up 默认值，向上移动一段距离并逐渐显示
   *
   * fade 逐渐显示
   *
   * none 立即显示
   */
  enter?: 'up' | 'fade' | 'none'
  /**消失时的动画效果
   *
   * fade 默认值，逐渐消失
   *
   * up 向上移动一段距离并逐渐消失
   *
   * none 立即消失
   */
  leave?: 'up' | 'fade' | 'none'
  /**提示出现的位置
   *
   * topCenter 默认值，出现在屏幕上方，水平居中
   *
   * center 出现在屏幕正中央（实际上会稍微偏上一点点）
   *
   * mouse 默认值，提示出现在鼠标光标附近
   */
  position?: 'topCenter' | 'center' | 'mouse'
}

// 完整的参数
interface ToastArg {
  msg: string
  color: string
  bgColor: string
  dealy: number
  enter: 'up' | 'fade' | 'none'
  leave: 'up' | 'fade' | 'none'
  position: 'topCenter' | 'center' | 'mouse'
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
    enter: 'up',
    leave: 'fade',
    position: 'mouse',
  }

  private readonly successCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgSuccess,
    dealy: 1500,
    enter: 'up',
    leave: 'fade',
    position: 'mouse',
  }

  private readonly warningCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgWarning,
    dealy: 1500,
    enter: 'up',
    leave: 'fade',
    position: 'mouse',
  }

  private readonly errorCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgError,
    dealy: 1500,
    enter: 'up',
    leave: 'fade',
    position: 'mouse',
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
    span.style.opacity = '0' // 先使提示完全透明

    // 把提示添加到页面上
    span.classList.add(this.tipClassName)
    document.body.appendChild(span)

    // 设置 left，使其居中

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

    // 设置 top
    let lastTop = 0

    if (arg.position === 'topCenter') {
      lastTop = this.minTop
    }
    if (arg.position === 'center') {
      lastTop = window.innerHeight / 2 - this.minTop
    }
    if (arg.position === 'mouse') {
      // 跟随鼠标位置
      // top 值减去一点高度，使文字出现在鼠标上方
      let y = this.mousePosition.y - 40
      if (y < this.minTop) {
        y = this.minTop
      }
      lastTop = y
    }

    // 出现动画
    if (arg.enter === 'none') {
      span.style.top = lastTop + 'px'
      span.style.opacity = '1'
    } else {
      this.enter(span, arg.enter, lastTop)
    }

    // 消失动画
    window.setTimeout(() => {
      if (arg.leave === 'none') {
        span.remove()
      } else {
        this.leave(span, arg.leave, lastTop)
      }
    }, arg.dealy)
  }

  // 提示出现的动画
  private enter(el: HTMLElement, way: 'up' | 'fade', lastTop: number) {
    const startTop = lastTop + this.total // 初始 top 值
    const once = 2
    const total = this.total

    let numberOfTimes = 0 // 执行次数

    const frame = function (timestamp: number) {
      numberOfTimes++

      // 计算总共上移了多少像素
      const move = once * numberOfTimes

      // 计算不透明度
      const opacity = move / total

      if (move <= total && opacity <= 1) {
        if (way === 'up') {
          el.style.top = startTop - move + 'px'
        }

        el.style.opacity = opacity.toString()

        // 请求下一帧
        window.requestAnimationFrame(frame)
      }
    }

    window.requestAnimationFrame(frame)
  }

  // 提示消失的动画
  private leave(el: HTMLElement, way: 'up' | 'fade', lastTop: number) {
    const startTop = lastTop // 初始 top 值
    const once = this.once
    const total = this.total

    let numberOfTimes = 0 // 执行次数

    const frame = function (timestamp: number) {
      numberOfTimes++

      // 计算总共上移了多少像素
      const move = once * numberOfTimes

      // 计算不透明度
      const opacity = 1 - move / total

      if (move < total && opacity > 0) {
        if (way === 'up') {
          el.style.top = startTop - move + 'px'
        }

        el.style.opacity = opacity.toString()

        // 请求下一帧
        window.requestAnimationFrame(frame)
      } else {
        // 动画执行完毕，删除元素
        el.remove()
      }
    }

    window.requestAnimationFrame(frame)
  }
}

const toast = new Toast()
export { toast }
