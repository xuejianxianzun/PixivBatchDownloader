import { EVT } from './EVT'
import { lang } from './Lang'
import { settings } from './setting/Settings'
import { states } from './store/States'
import { store } from './store/Store'
import { Tools } from './Tools'

class ShowNotification {
  constructor() {
    this.iconURL = chrome.runtime.getURL('icon/logo128.png')
    this.bindEvents()
  }

  private iconURL = ''

  private bindEvents() {
    // 当用户开启“下载完成后显示通知”的提示时，请求权限
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'showNotificationAfterDownloadComplete' && data.value) {
        this.requstPremission()
      }
    })

    // 当下载任务完毕时，显示通知
    window.addEventListener(EVT.list.downloadComplete, () => {
      window.setTimeout(() => {
        // 如果抓取标签列表没有完成，则不显示通知
        // 在一次抓取多个标签时，当最后一个标签下载完之后会解除 crawlTagList 状态，这时可以显示一条通知
        // 如果有等待下载的任务，则不显示通知
        if (
          settings.showNotificationAfterDownloadComplete &&
          !states.crawlTagList &&
          store.waitingIdList.length === 0
        ) {
          this.show(lang.transl('_下载完毕2'), Tools.getPageTitle())
        }
      }, 0)
    })
  }

  public async show(title: string, text: string) {
    await this.requstPremission()
    new Notification(title, {
      body: text,
      // 不设置 tag。如果设置了相同的 tag，那么新的通知会覆盖旧的通知，导致如果有多个页面下载完毕，用户只能看到最后一个页面的通知
      // tag: 'PowerfulPixivDownloader',
      icon: this.iconURL,
    })
  }

  private requstPremission() {
    if (Notification.permission !== 'granted') {
      return Notification.requestPermission()
    }
  }
}

new ShowNotification()
