import { EVT } from './EVT'
import { lang } from './Lang'
import { log } from './Log'

interface Rules {
  [key: string]: () => boolean
}

// 某些国产套壳浏览器不能正常使用本程序。如果检测到该浏览器，则显示提示
// 相关文档： notes/一些国产套壳浏览器使用本程序的情况.md
class CheckUnsupportBrowser {
  constructor() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.check()
    })
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
      // 为什么设置为 88：
      // 1. 下载器使用的 Manifest V2 需要的内核版本最低为 79
      // 2. Cent 浏览器的内核版本是 86，但它即使使用 V2，仍然会在转换 GIF 时出现问题，所以需要提高版本号
      // 3. 未来升级到 Manifest V3 需要的内核版本最低为 88
      const minChromeVer = 88
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

  private check() {
    for (const func of Object.values(this.rules)) {
      if (func()) {
        const msg = lang.transl('_不支持的浏览器')
        log.error(msg)
        return
      }
    }

    if (navigator.userAgent.includes('YaBrowser')) {
      log.warning(lang.transl('_yandex浏览器的警告'))
    }
  }
}

new CheckUnsupportBrowser()
