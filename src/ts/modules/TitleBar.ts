// 在标题栏上显示任务状态的标记
import { pageType } from './PageType'
import { EVT } from './EVT'

/*
本程序的标记会以 [flag] 形式添加到 title 最前面
flag 及其含义如下：
↑ 抓取中
→ 等待下一步操作（搜索页）
▶ 可以开始下载
↓ 下载中
║ 下载暂停
■ 下载停止
✓ 下载完毕
*/
const flags = {
  crawling: '↑',
  waiting: '→',
  readyDownload: '▶',
  downloading: '↓',
  paused: '║',
  stopped: '■',
  completed: '✓',
  space: ' ',
}

type FlagList = keyof typeof flags

class TitleBar {
  constructor() {
    this.bindEvent()
  }

  private timer: number = 0 // title 闪烁时，使用的定时器

  private bindEvent() {
    window.addEventListener(EVT.events.crawlStart, () => {
      this.set('crawling')
    })

    window.addEventListener(EVT.events.worksUpdate, () => {
      this.set('waiting')
    })

    for (const ev of [EVT.events.crawlFinish, EVT.events.resume]) {
      window.addEventListener(ev, () => {
        this.set('readyDownload')
      })
    }

    window.addEventListener(EVT.events.downloadStart, () => {
      this.set('downloading')
    })

    window.addEventListener(EVT.events.downloadComplete, () => {
      this.set('completed')
    })

    window.addEventListener(EVT.events.downloadPause, () => {
      this.set('paused')
    })

    window.addEventListener(EVT.events.downloadStop, () => {
      this.set('stopped')
    })
    window.addEventListener(EVT.events.crawlEmpty, () => {
      this.reset()
    })
  }

  // 检查标题里是否含有标记
  private includeFlag(flag: string = '') {
    if (!flag) {
      // 没有传递标记，则检查所有标记
      for (const flga of Object.values(flags)) {
        const str = `[${flga}]`
        if (document.title.includes(str)) {
          return true
        }
      }
    } else {
      // 检查指定标记
      const str = `[${flag}]`
      return document.title.includes(str)
    }
    return false
  }

  // 重设 title
  private reset() {
    const type = pageType.getPageType()
    clearInterval(this.timer)
    // 储存标题的 mete 元素。在某些页面不存在，有时也与实际上的标题不一致。
    const ogTitle = document.querySelector(
      'meta[property="og:title"]'
    )! as HTMLMetaElement
    // 在一些自动加载的页面里，og:title 标签是最早更新标题的，内容也一致。
    if (ogTitle && (type == 1 || type === 2 || type === 13)) {
      document.title = ogTitle.content
    } else {
      // 如果当前 title 里有标记，则设置为标记后面的文字
      if (this.includeFlag()) {
        const index = document.title.indexOf(']')
        document.title = document.title.substr(index + 1, document.title.length)
      }
    }
  }

  // 在标题上显示指定标记
  private set(flagName: FlagList) {
    const flag = flags[flagName]
    const text = `[${flag}]`
    // 如果 title 里没有标记，就添加标记
    if (!this.includeFlag()) {
      document.title = `${text} ${document.title}`
    } else {
      // 如果已经有标记了，则替换为新当前传入的标记
      document.title = document.title.replace(/\[.?\]/, text)
    }

    // 可以开始下载，或者等待下一步操作，进行闪烁提醒
    if (flagName === 'readyDownload' || flagName === 'waiting') {
      this.flashing(flag)
    } else {
      clearInterval(this.timer)
    }
  }

  // 闪烁提醒，其实是把给定的标记替换成空白，来回切换
  private flashing(flag: string) {
    clearInterval(this.timer)
    const text = `[${flag}]`
    const whiteSpace = `[${flags.space}]`
    this.timer = window.setInterval(() => {
      if (this.includeFlag(flag)) {
        // 如果含有标记，就替换成空白
        document.title = document.title.replace(text, whiteSpace)
      } else {
        if (this.includeFlag(flags.space)) {
          // 如果含有空白，就替换成标记
          document.title = document.title.replace(whiteSpace, text)
        } else {
          // 如果都没有，一般是页面切换了，标题被重置了，取消闪烁
          clearInterval(this.timer)
        }
      }
    }, 500)
  }
}
new TitleBar()
export {}
