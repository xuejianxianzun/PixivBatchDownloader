import { Colors } from './Colors'
import { Config } from './Config'
import { Utils } from './utils/Utils'

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
   * mouse 默认值，提示出现在鼠标光标附近。
   * 通常用于用户点击了某个元素而启动任务时的提示。
   * 如果这个提示是紧随着用户的点击出现的，推荐使用 mouse 位置。
   *
   * center 出现在屏幕正中央（实际上会稍微偏上一点点）。
   * 通常用于任务完成的提示，或者警告消息。
   * 此时距离用户点击可能已经过去了一段时间，也可能这个任务/警告不是由用户点击而触发的，
   * 所以使用与鼠标位置无关的 center 位置。
   *
   * topCenter 出现在屏幕上方，水平居中。
   * 通常用于任务开始的提示，并且这个任务是下载器自动执行的，不是由用户点击触发的，
   * 所以使用与鼠标位置无关的 center 位置。
   *
   */
  position?: 'mouse' | 'center' | 'topCenter'
}

/**轻提示出现的位置 */
type ToastPosition = ToastArg['position']

/**队列里的一个轻提示元素 */
interface ToastQueueItem {
  /**轻提示元素 */
  el: HTMLElement
  /**这个元素的 top 值 */
  top: number
  /**这个元素的高度 */
  height: number
}

// 完整的参数
// 把所有可选参数变成必须的，并添加 msg 属性
type ToastArg = Required<
  {
    msg: string
  } & ToastArgOptional
>

// 轻提示，只显示文字和背景颜色
// 适用于无需用户进行确认的提示
class Toast {
  constructor() {
    this.successCfg.bgColor = Colors.bgSuccess
    this.warningCfg.bgColor = Colors.bgWarning
    this.errorCfg.bgColor = Colors.bgError

    this.bindEvents()
  }

  private readonly defaultCfg: ToastArg = {
    msg: '',
    color: Colors.white,
    bgColor: Colors.bgBrightBlue,
    stay: 1500,
    enter: 'up',
    leave: 'fade',
    position: 'mouse',
  }

  private readonly successCfg: ToastArg = Utils.deepCopy(this.defaultCfg)
  private readonly warningCfg: ToastArg = Utils.deepCopy(this.defaultCfg)
  private readonly errorCfg: ToastArg = Utils.deepCopy(this.defaultCfg)

  private readonly tipClassName = 'xzToast'

  private mousePosition = { x: 0, y: 0 }
  private readonly minTop = 20
  private readonly gap = 10 // 多个轻提示之间的垂直间距，单位 px

  /**
   * 后出现的轻提示显示在已有提示的下方还是上方
   *
   * below 显示在已有提示的下方
   *
   * above 显示在已有提示的上方
   *
   * 当指定方向上的空间不足时，会显示在另一个方向上
   */
  private readonly stackDirection: 'below' | 'above' = 'above'

  /**每个 position 维护一个队列，里面保存着尚未被移除的轻提示元素 */
  private readonly queues: Record<ToastPosition, ToastQueueItem[]> = {
    topCenter: [],
    center: [],
    mouse: [],
  }

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
    span.textContent = Utils.htmlToText(arg.msg)

    span.style.color = arg.color

    // 设置背景颜色，优先使用 color
    span.style.backgroundColor = arg.bgColor
    span.style.opacity = '0' // 先使提示完全透明

    span.classList.add(this.tipClassName)
    if (Config.mobile) {
      span.classList.add('mobile')
    }

    // 把提示添加到页面上
    document.body.appendChild(span)

    // 设置 left，使其居中

    // 默认的中间点是窗口的中间
    let centerPoint = window.innerWidth / 2

    if (arg.position === 'mouse') {
      // 检查 x、y 都等于 0 的情况
      // 这通常出现在页面刷新后，鼠标还没有移动，因此这两个值是默认值
      // 例如刷新页面后，不移动鼠标，而是直接按快捷键下载作品，就会出现这种情况
      // 这会导致按钮出现在页面左上角（0,0）的位置，影响体验
      // 此时将 position 改为 center
      if (this.mousePosition.x === 0 && this.mousePosition.y === 0) {
        arg.position = 'center'
      } else {
        // 把中间点设置为鼠标所处的位置
        centerPoint = this.mousePosition.x
      }
    }

    // 设置 left
    const rect = span.getBoundingClientRect()
    let left = centerPoint - rect.width / 2
    // 防止提示左侧超出窗口
    const minLeft = 0
    // 防止提示右侧超出窗口。16 是滚动条的宽度，防止提示的右侧被滚动条遮挡
    const maxLeft = window.innerWidth - rect.width - 16
    if (left < minLeft) {
      left = minLeft
    }
    if (left > maxLeft) {
      left = maxLeft
    }
    span.style.left = left + 'px'

    // 设置 top

    // 先计算出这个轻提示原本的 top 值
    let baseTop = 0

    if (arg.position === 'topCenter') {
      baseTop = this.minTop
    }
    if (arg.position === 'center') {
      baseTop = window.innerHeight / 2 - this.minTop
    }
    if (arg.position === 'mouse') {
      // 跟随鼠标位置
      // top 值减去一点高度，使文字出现在鼠标上方
      baseTop = this.mousePosition.y - 40
    }

    // 再检查同一个 position 下是否已经有尚未移除的轻提示
    // 如果有的话就调整 top 值，避免它们重叠在一起
    const lastTop = this.getTop(baseTop, rect.height, arg.position)

    // 把这个轻提示添加到对应的队列里，供之后出现的轻提示计算位置
    this.queues[arg.position].push({
      el: span,
      top: lastTop,
      height: rect.height,
    })

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
    }, arg.stay)
  }

  /**
   * 计算轻提示的 top 值
   * 如果同一个 position 里已经存在尚未被移除的轻提示，就需要调整位置以避免重叠：
   * 优先显示在 stackDirection 指定的方向上，该方向空间不足时显示在另一个方向上
   * @param baseTop 这个轻提示原本的 top 值
   * @param height 这个轻提示的高度
   * @param position 这个轻提示的位置
   */
  private getTop(baseTop: number, height: number, position: ToastPosition) {
    // 把 top 值限制在可视区域里，避免轻提示超出窗口
    const maxTop = window.innerHeight - height - this.minTop
    const clamp = (top: number) => Math.max(this.minTop, Math.min(top, maxTop))

    const queue = this.cleanQueue(position)

    if (queue.length === 0) {
      return clamp(baseTop)
    }

    // 查找已有提示占据的最下端和最上端
    let bottom = 0
    let uppermost = Infinity
    for (const item of queue) {
      bottom = Math.max(bottom, item.top + item.height)
      uppermost = Math.min(uppermost, item.top)
    }

    // 显示在已有提示下方、上方时各自的 top 值，以及这个方向是否放得下
    const below = bottom + this.gap
    const above = uppermost - height - this.gap
    const belowFits = below + height <= window.innerHeight - this.minTop
    const aboveFits = above >= this.minTop

    if (this.stackDirection === 'above') {
      // 上方空间不足时，显示在已有提示的下方
      return aboveFits ? above : clamp(below)
    }

    // 下方空间不足时，显示在已有提示的上方
    return belowFits ? below : clamp(above)
  }

  /**清除指定队列里已经被移除的元素，返回剩余的元素 */
  private cleanQueue(position: ToastPosition) {
    const queue = this.queues[position]

    for (let i = queue.length - 1; i >= 0; i--) {
      if (!queue[i].el.isConnected) {
        queue.splice(i, 1)
      }
    }

    return queue
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
