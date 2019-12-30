// 在标题栏上显示下载器工作状态
import { pageType } from './PageType'

class TitleBar {
  // 本程序的状态会以 [string] 形式添加到 title 最前面，并闪烁提醒
  /*
        ↑ 抓取中
        → 等待下一步操作（tag搜索页）
        ▶  可以开始下载
        ↓ 下载中
        ║ 下载暂停
        ■ 下载停止
        √ 下载完毕
          空格，当需要闪烁标题时使用
        */
  private readonly titleStatus = ['↑', '→', '▶', '↓', '║', '■', '√', ' ']

  private titleTimer: number = 0 // 修改 title 的定时器

  // 检查标题里有没有本程序定义的状态字符
  private titleHasState(status: string = '') {
    if (!status) {
      // 没有传递 status，则检查所有标记
      for (const status of this.titleStatus) {
          const str = `[${status}]`;
          if (document.title.includes(str)) {
              return true;
          }
      }
  }
  else {
      // 检查指定标记
      const str = `[${status}]`;
      return document.title.includes(str);
  }
  return false;
  }

  // 重设 title
  public reset() {
    const type = pageType.getPageType()
    clearInterval(this.titleTimer)
    // 储存标题的 mete 元素。在某些页面不存在，有时也与实际上的标题不一致。
    const ogTitle = document.querySelector(
      'meta[property="og:title"]'
    )! as HTMLMetaElement
    // 无刷新自动加载的页面里，og:title 标签是最早更新标题的，内容也一致。
    if (ogTitle && (type == 1 || type === 2)) {
      document.title = ogTitle.content
    } else {
      // 如果当前 title 里有状态提醒，则设置为状态后面的文字
      if (this.titleHasState()) {
        const index = document.title.indexOf(']')
        document.title = document.title.substr(index + 1, document.title.length)
      }
    }
  }

  // 修改title
  public changeTitle(string: string) {

    const state = `[${string}]`
    // 如果 title 里没有状态，就添加状态
    if (!this.titleHasState()) {
      document.title = `${state} ${document.title}`
    } else {
      // 如果已经有状态了，则替换为新当前传入的状态
      document.title = document.title.replace(/\[.?\]/, state)
    }

    // 当需要执行下一步操作时，闪烁提醒
    if (string === '▶' || string === '→') {
      this.titleTimer = window.setInterval(() => {
        if (this.titleHasState(string)) {
          document.title = document.title.replace(state, '[ ]')
        } else {
          document.title = document.title.replace('[ ]', state)
        }
      }, 500)
    } else {
      clearInterval(this.titleTimer)
    }
  }
}
const titleBar = new TitleBar()
export { titleBar }
