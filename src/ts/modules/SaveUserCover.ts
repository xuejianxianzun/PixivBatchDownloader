import { lang } from './Lang'
import { API } from './API'
import { log } from './Log'
import { DOM } from './DOM'
import { EVT } from './EVT'
import { Tools } from './Tools'

// 保存用户封面图片
class SaveUserCover {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.saveUserCover, () => {
      this.saveUserCover()
    })
  }

  private async saveUserCover() {
    const userId = DOM.getUserId()
    const userProfile = await API.getUserProfile(userId)
    const bgData = userProfile.body.background
    if (bgData === null) {
      return EVT.fire(EVT.list.sendToast, {
        text: lang.transl('_没有数据可供使用'),
        bgColorType: 'error',
      })
    }

    const bgUrl = bgData.url

    if (!bgUrl) {
      return EVT.fire(EVT.list.sendToast, {
        text: lang.transl('_没有数据可供使用'),
        bgColorType: 'error',
      })
    }

    // 加载文件
    const img = await fetch(bgUrl)
    const blob = await img.blob()

    // 提取后缀名
    const arr = bgUrl.split('.')
    const ext = arr[arr.length - 1]

    // 直接保存到下载文件夹
    const url = URL.createObjectURL(blob)
    const name = `${userProfile.body.name}_${userId}_cover.${ext}`
    Tools.downloadFile(url, name)

    log.success('✓ ' + lang.transl('_保存用户封面'))
    EVT.fire(EVT.list.closeCenterPanel)
  }
}

new SaveUserCover()

export { }
