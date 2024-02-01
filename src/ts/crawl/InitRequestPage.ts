import { options } from '../setting/Options'
import { InitPageBase } from './InitPageBase'

// 投稿页面
class InitRequestPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected initAny() {
    // 为作品容器添加自定义 className，让显示更大的缩率图功能不那么容易失效
    const allSection = document.querySelectorAll('section')
    for (const section of allSection) {
      if (section.parentElement?.nodeName == 'DIV') {
        section.parentElement.classList.add('requestContainer')
      }
    }
  }

  protected addCrawlBtns() {}

  protected setFormOption() {
    options.hideOption([1])
  }
}

export { InitRequestPage }
