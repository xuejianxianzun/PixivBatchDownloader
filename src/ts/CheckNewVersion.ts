import { EVT } from './EVT'
import { Utils } from './utils/Utils'

// 检查新版本
class CheckNewVersion {
  constructor() {
    this.checkNew()
  }

  private async checkNew() {
    if (!Utils.isPixiv()) {
      return
    }
    // 读取上一次检查的时间，如果超过指定的时间，则检查 GitHub 上的信息
    const timeName = 'xzUpdateTime'
    const verName = 'xzGithubVer'
    const interval = 1000 * 60 * 30 // 30 分钟检查一次

    const lastTime = localStorage.getItem(timeName)
    if (!lastTime || new Date().getTime() - parseInt(lastTime) > interval) {
      // 获取最新的 releases 信息
      const latest = await fetch(
        'https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest'
      )
      const latestJson = await latest.json()
      const latestVer = latestJson.name
      // 保存 GitHub 上的版本信息
      localStorage.setItem(verName, latestVer)
      // 保存本次检查的时间戳
      localStorage.setItem(timeName, new Date().getTime().toString())
    }

    // 获取本地扩展的版本号
    const manifest = await fetch(chrome.runtime.getURL('manifest.json'))
    const manifestJson = await manifest.json()
    const manifestVer = manifestJson.version

    // 比较大小
    const latestVer = localStorage.getItem(verName)
    if (!latestVer) {
      return
    }
    if (this.bigger(latestVer, manifestVer)) {
      EVT.fire('hasNewVer')
    }
  }

  // 传入两个版本号字符串，比较第一个是否比第二个大
  private bigger(a: string, b: string) {
    const _a = a.split('.')
    const _b = b.split('.')

    // 分别比较每一个版本号字段，从主版本号比较到子版本号
    for (let i = 0; i < _a.length; i++) {
      if (_b[i] === undefined) {
        break
      }
      // 一旦某个版本号不相等，就立即返回结果
      if (Number.parseInt(_a[i]) > Number.parseInt(_b[i])) {
        return true
      } else if (Number.parseInt(_a[i]) < Number.parseInt(_b[i])) {
        return false
      }
    }

    return false
  }
}

new CheckNewVersion()
