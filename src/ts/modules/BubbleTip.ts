import { EVT } from './EVT'
import { Colors, colorType } from './Colors'

// 其他模块可以通过 EVT.list.sendBubbleTip 事件调用此模块，并且一定要传递这个参数
// 可选的参数
export interface BubbleTipArgOptional {
  // text 只能传递文字，不能包含 html 标签
  text: string
  // 可选，使用预定义的颜色
  type?: colorType
  // 可选，使用自定义的颜色
  color?: string
  // 设置提示出现后的停留时间。停留时间过去之后，提示会飘向页面顶部。
  stay?: number
  // 消失时的动画效果
  // 默认 bubble 向上飘动并逐渐消失
  // fade 逐渐消失
  // none 没有动画，立即消失
  animation?: 'bubble' | 'fade' | 'none'
}

// 完整的参数
interface BubbleTipArg {
  text: string
  type: colorType
  color: string
  dealy: number
  animation: 'bubble' | 'fade' | 'none'
}

// 冒泡提示
// 适用于轻量、无需用户进行确认的提示
class BubbleTip {
  constructor() {
    this.bindEvents()
  }

  private defaultCfg: BubbleTipArg = {
    text: '',
    type: 'primary',
    color: '',
    dealy: 1000,
    animation: 'bubble',
  }

  private mousePosition = { x: 0, y: 0 }

  private readonly tipClassName = 'xzBubbleTip'

  private bindEvents() {
    window.addEventListener(EVT.list.sendBubbleTip, (ev: CustomEventInit) => {
      const data = ev.detail.data as BubbleTipArgOptional
      const arg = Object.assign({}, this.defaultCfg, data)
      this.create(arg)
    })

    // 必须是监听 mousemove 而不是 click
    window.addEventListener('mousemove', (ev) => {
      this.mousePosition.x = ev.x
      this.mousePosition.y = ev.y
    })
  }

  private create(arg: BubbleTipArg) {
    const span = document.createElement('span')
    span.textContent = arg.text

    // 颜色设置优先使用 color
    span.style.color = arg.color ? arg.color : Colors[arg.type]

    // top 值减去了大约一行文字的高度，这样文字出现时就处于鼠标上方
    const y = this.mousePosition.y - 28
    span.style.top = y + 'px'

    span.classList.add(this.tipClassName)

    // 把提示添加到页面上
    document.body.appendChild(span)

    // 修正 left，使提示的中间点对齐鼠标点击的位置
    const rect = span.getBoundingClientRect()
    let left = this.mousePosition.x - rect.width / 2
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
        this.animation(span, y, arg.animation)
      }
    }, arg.dealy)
  }

  // 让提示从当前位置飘到页面顶部
  private animation(el: HTMLElement, top: number, way: 'bubble' | 'fade') {
    // 不要给动画设置一个固定的执行总时长，否则根据 top 值的不同，动画的执行速度也不同
    // const total = 3000 x

    const onceMove = 3 // 每一帧移动多少像素
    let numberOfTimes = 0 // 执行次数

    const frame = function (timestamp: number) {
      numberOfTimes++

      // 计算总共上移了多少像素
      const move = onceMove * numberOfTimes

      // 计算透明度
      // 最后乘以的数字是一个加速值，可以让提示以 n 倍的速度变透明
      // 例如设置为 5，那么提示在走完 20% 的距离的时候就已经变得完全透明了
      const opacity = 1 - (move / top) * 5

      if (top - move > 0 && opacity > 0) {
        if (way === 'bubble') {
          el.style.top = top - move + 'px'
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

new BubbleTip()
