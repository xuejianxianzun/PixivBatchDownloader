import { lang } from './Language'

/**右侧按钮的创建参数 */
export interface RightButtonOptions {
  id: string
  title: string
  icon: string
  order: number
}

/**右侧按钮的注册信息 */
interface RightButtonRegistration {
  element: HTMLButtonElement
  order: number
}

/**管理网页右侧的悬浮按钮 */
class RightButtonManager {
  /**右侧按钮容器 */
  private readonly container: HTMLDivElement

  /**已注册的右侧按钮 */
  private readonly registrations: RightButtonRegistration[] = []

  /**创建右侧按钮容器 */
  constructor() {
    this.container = document.createElement('div')
    this.container.id = 'rightButtonContainer'
    document.body.append(this.container)
  }

  /**创建并注册按钮，然后按 order 从小到大排列 */
  public register(options: RightButtonOptions) {
    const element = document.createElement('button')
    element.type = 'button'
    element.id = options.id
    element.setAttribute('data-xztitle', options.title)
    element.innerHTML = `<svg class="icon" aria-hidden="true">
  <use xlink:href="#${options.icon}"></use>
</svg>`
    element.classList.add('rightButton')
    lang.register(element)
    this.registrations.push({ element, order: options.order })
    this.registrations.sort((a, b) => a.order - b.order)
    this.registrations.forEach(({ element: registeredElement }) => {
      this.container.append(registeredElement)
    })
    return element
  }

  /**显示已注册的按钮 */
  public show(element: HTMLButtonElement) {
    element.style.display = 'flex'
  }

  /**隐藏已注册的按钮 */
  public hide(element: HTMLButtonElement) {
    element.style.display = 'none'
  }
}

const rightButtonManager = new RightButtonManager()
export { rightButtonManager }
