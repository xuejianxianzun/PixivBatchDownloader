import { pageType } from '../PageType'
import { EVT } from '../EVT'

// 管理所有页面的销毁事件
// 页面把自己的 destory 函数注册到这个类里，当页面类型变化时会自动执行对应
class DestroyManager {
  constructor() {
    this.bindEvents()
  }

  private list: Map<number, Function> = new Map()
  private lastType = pageType.type

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      const fun = this.list.get(this.lastType)
      fun && fun()

      this.lastType = pageType.type
    })
  }

  // 接收 destory 函数，并关联到对应的页面类型
  public register(fun: Function) {
    this.list.set(pageType.type, fun)
  }
}

const destroyManager = new DestroyManager()
export { destroyManager }
