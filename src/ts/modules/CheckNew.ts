import { EVT } from './EVT'

// 检查新版本
class CheckNew {
  constructor() {
    this.checkNew()
  }

  private async checkNew() {
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
    const manifest = await fetch(chrome.extension.getURL('manifest.json'))
    const manifestJson = await manifest.json()
    const manifestVer = manifestJson.version
    // 比较大小
    const latestVer = localStorage.getItem(verName)
    if (latestVer && manifestVer < latestVer) {
      EVT.fire(EVT.list.hasNewVer)
    }
  }
}

new CheckNew()
