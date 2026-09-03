import { Config } from '../Config'

// 移动端“轻点(tap)”与“滑动(scroll)”的判别器
//
// 背景：在移动端，触摸事件的 target 在 touchstart 时确定，之后手指滑动也不会改变。
// 所以当用户从作品缩略图上开始滑动页面时，touchend 仍然会在该缩略图上触发。
// 如果此时把 touchend 当作点击处理，就会误选（或误排除）触摸起始位置的作品。
// 另外，浏览器把该手势判定为滚动后，touchend 的 cancelable 为 false，
// 此时调用 ev.preventDefault() 会被忽略，并在控制台输出警告：
// "Ignored attempt to cancel a touchend event with cancelable=false, ..."
//
// 该类通过记录 touchstart 的坐标，并在 touchmove / touchend 时检查位移，
// 把位移超过阈值的触摸判定为“滑动”而非“轻点”。
class TapDetector {
  /** 位移超过这个距离（单位 px）即视为滑动。与浏览器判定滚动的触摸位移阈值一致 */
  private readonly threshold = 10

  private startX = 0
  private startY = 0

  /** 当前触摸手势是否发生了滑动（或已不可能成为轻点） */
  private moved = false

  /** 是否已绑定监听器 */
  private bound = false

  /** 绑定触摸事件监听器。只需调用一次，多次调用不会有副作用 */
  public init() {
    if (this.bound || !Config.mobile) {
      return
    }
    this.bound = true

    // 在捕获阶段监听，确保在任何业务代码的 touchend 处理函数之前更新手势状态
    window.addEventListener(
      'touchstart',
      (ev: TouchEvent) => {
        if (ev.touches.length > 1) {
          // 多指触摸（例如双指缩放）不是轻点
          this.moved = true
          return
        }
        this.startX = ev.touches[0].clientX
        this.startY = ev.touches[0].clientY
        this.moved = false
      },
      true
    )

    window.addEventListener(
      'touchmove',
      (ev: TouchEvent) => {
        if (this.moved) {
          return
        }
        if (this.movedTooFar(ev.touches[0].clientX, ev.touches[0].clientY)) {
          this.moved = true
        }
      },
      true
    )

    window.addEventListener(
      'touchend',
      (ev: TouchEvent) => {
        // touchend 不可取消时，说明浏览器已把这个手势判定为滚动等操作并接管，
        // 此时 preventDefault 会被忽略（即控制台里警告的来源），必然不是轻点
        if (!ev.cancelable) {
          this.moved = true
          return
        }

        // 有些情况下浏览器不会触发 touchmove（例如手势在 touchend 时才判定为滚动），
        // 所以在 touchend 时再检查一次触摸结束点与起始点的距离
        if (!this.moved && ev.changedTouches.length > 0) {
          const touch = ev.changedTouches[0]
          if (this.movedTooFar(touch.clientX, touch.clientY)) {
            this.moved = true
          }
        }
      },
      true
    )

    // 浏览器判定该手势为滚动并接管后，会触发 touchcancel，此时必然不是轻点
    window.addEventListener(
      'touchcancel',
      () => {
        this.moved = true
      },
      true
    )
  }

  /** 当前触摸手势是否为轻点（没有发生滑动） */
  public isTap() {
    return !this.moved
  }

  private movedTooFar(x: number, y: number) {
    return (
      Math.abs(x - this.startX) > this.threshold ||
      Math.abs(y - this.startY) > this.threshold
    )
  }
}

const tapDetector = new TapDetector()

// 在移动端页面里立即启用。只在移动端绑定，桌面端不受影响
if (Config.mobile) {
  tapDetector.init()
}

export { tapDetector }
