import { lang } from './Lang'
import { API } from './utils/API'
import { log } from './Log'
import { DOM } from './DOM'
import { EVT } from './EVT'
import { Tools } from './Tools'

// 保存用户头像
class SaveAvatarImage {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.saveAvatarImage, () => {
      this.saveAvatarImage()
    })
  }

  private async saveAvatarImage() {
    const userId = DOM.getUserId()
    const userProfile = await API.getUserProfile(userId)
    const bigImg = userProfile.body.imageBig // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
    const fullSizeImg = bigImg.replace('_170', '') // 去掉 170 标记，获取头像图片的原图

    // 加载文件
    const img = await fetch(fullSizeImg)
    const blob = await img.blob()

    // 提取后缀名
    const arr = fullSizeImg.split('.')
    const ext = arr[arr.length - 1]

    // 直接保存到下载文件夹
    const url = URL.createObjectURL(blob)
    const name = `${userProfile.body.name}_${userId}_avatar.${ext}`
    Tools.downloadFile(url, name)

    log.success('✓ ' + lang.transl('_保存用户头像'))
    EVT.fire(EVT.list.closeCenterPanel)
  }
}

new SaveAvatarImage()
