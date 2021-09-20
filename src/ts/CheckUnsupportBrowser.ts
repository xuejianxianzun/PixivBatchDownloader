import { log } from './Log'

interface Rules {
  [key: string]: () => boolean
}

// 某些国产套壳浏览器不能正常使用本程序。如果检测到该浏览器，则显示提示
// 相关文档： notes/一些国产套壳浏览器使用本程序的情况.md
class CheckUnsupportBrowser {
  constructor() {
    this.check()
  }

  private rules: Rules = {
    // "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36 SE 2.X MetaSr 1.0"
    Sougou: function () {
      return navigator.userAgent.includes(' SE ')
    },
    // "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.25 Safari/537.36 Core/1.70.3872.400 QQBrowser/10.8.4455.400"
    QQ: function () {
      return navigator.userAgent.includes('QQBrowser')
    },
    // "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3947.100 Safari/537.36 2345Explorer/10.21.0.21486"
    '2345': function () {
      return navigator.userAgent.includes('2345Explorer')
    },
    All: function () {
      // 如果这个浏览器的 Chrome 内核的版本号较低，也会显示提示
      // 为什么设置为 80：
      // 1. 下载器使用的浏览器 API 需要浏览器的内核版本最低为 79
      // 2. 猎豹浏览器内核版本是 79，符合上一个条件，但是它存在问题，所以要排除它，于是 79 也不可用
      const minChromeVer = 80
      const test = navigator.userAgent.match(/Chrome\/(\d*)/)
      if (test && test[1]) {
        const ver = Number.parseInt(test[1])
        if (ver < minChromeVer) {
          return true
        }
      }
      return false
    },
  }

  private readonly tipText =
    '你的浏览器可能不能正常使用这个扩展程序。<br>如果你在使用中遇到问题，请安装最新版本的 Chrome 浏览器，然后在 Chrome 浏览器上使用这个扩展。'

  private check() {
    for (const func of Object.values(this.rules)) {
      if (func()) {
        return log.warning(this.tipText)
      }
    }
  }
}

new CheckUnsupportBrowser()
