import { lang } from './Lang'
import { EVT } from './EVT'
import { API } from './API'
import { langTextKeys } from './langText'

// 辅助功能
class Support {
  constructor() {
    this.checkConflict()
    this.supportListenHistory()
    this.listenPageSwitch()
    this.checkNew()
    this.showNew()
    API.updateToken()
  }

  private newTag: langTextKeys = '_xzNew440'

  // 处理和脚本版的冲突
  private checkConflict(): void {
    // 标注自己
    window.sessionStorage.setItem('xz_pixiv_extension', '1')
    // 把脚本版的标记设置为 0，这样脚本版就不会运行
    window.sessionStorage.setItem('xz_pixiv_userscript', '0')
  }

  // 检查新版本
  private async checkNew() {
    // 显示更新按钮
    const show = function () {
      const updateIco = document.querySelector(
        '.centerWrap_top_btn.update'
      )! as HTMLAnchorElement
      updateIco.style.display = 'inline-block'
    }

    // 读取上一次检查的时间，如果超过一小时则检查 GitHub 上的信息
    const lastTime = localStorage.getItem('xzUpdateTime')
    if (
      !lastTime ||
      new Date().getTime() - parseInt(lastTime) > 60 * 60 * 1000
    ) {
      // 获取最新的 releases 信息
      const latest = await fetch(
        'https://api.github.com/repos/xuejianxianzun/PixivBatchDownloader/releases/latest'
      )
      const latestJson = await latest.json()
      const latestVer = latestJson.name
      // 保存 GitHub 上的版本信息
      localStorage.setItem('xzGithubVer', latestVer)
      // 保存本次检查的时间戳
      localStorage.setItem('xzUpdateTime', new Date().getTime().toString())
    }

    // 获取本地扩展的版本号
    const manifest = await fetch(chrome.extension.getURL('manifest.json'))
    const manifestJson = await manifest.json()
    const manifestVer = manifestJson.version
    // 比较大小
    const latestVer = localStorage.getItem('xzGithubVer')
    if (latestVer && manifestVer < latestVer) {
      show()
    }
  }

  // 显示最近更新内容
  private showNew() {
    if (
      window.location.host.includes('pixiv.net') &&
      !localStorage.getItem(this.newTag)
    ) {
      const whatIsNewHtml = `
      <div class="xz_new">
        <p class="title">Powerful Pixiv Downloader ${lang.transl(
          '_最近更新'
        )}</p>
        <p class="content">${lang.transl(this.newTag)}</p>
        <button class="btn">${lang.transl('_确定')}</button>
      </div>`
      document.body.insertAdjacentHTML('afterbegin', whatIsNewHtml)
      const whatIsNewEl = document.querySelector('.xz_new')!
      whatIsNewEl.querySelector('.btn')!.addEventListener('click', () => {
        localStorage.setItem(this.newTag, '1')
        whatIsNewEl.parentNode!.removeChild(whatIsNewEl)
      })
    }
  }

  // 使用无刷新加载的页面需要监听 url 的改变，这里为这些事件添加监听支持
  private supportListenHistory() {
    const element = document.createElement('script')
    element.setAttribute('type', 'text/javascript')
    element.innerHTML = `
    let _wr = function (type) {
      let orig = history[type];
      return function () {
        let rv = orig.apply(this, arguments);
        let e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
    `
    document.head.appendChild(element)
  }

  // 监听页面的无刷新切换。某些页面可以无刷新切换，这时需要进行一些处理
  private listenPageSwitch() {
    // 绑定无刷新切换页面的事件，只绑定一次
    // pixiv 的后退使用 replaceState
    // pushState 判断从列表页进入作品页的情况，popstate 判断从作品页退回列表页的情况
    ;['pushState', 'popstate', 'replaceState'].forEach((item) => {
      window.addEventListener(item, () => {
        EVT.fire(EVT.events.pageSwitch)
      })
    })
  }
}
new Support()
export {}
