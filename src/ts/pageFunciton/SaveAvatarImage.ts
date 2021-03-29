import { lang } from '../Lang'
import { API } from '../API'
import { log } from '../Log'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'

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
    const userId = Tools.getUserId()
    const userProfile = await API.getUserProfile(userId)
    // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
    // 去掉 170 标记，获取头像图片的原图
    const fullSizeImgURL = userProfile.body.imageBig.replace('_170', '')

    // 加载文件
    const img = await fetch(fullSizeImgURL)
    const blob = await img.blob()

    // 提取后缀名
    const arr = fullSizeImgURL.split('.')
    const ext = arr[arr.length - 1]

    // 直接保存到下载文件夹
    const url = URL.createObjectURL(blob)
    const name = `${userProfile.body.name}_${userId}_avatar.${ext}`
    Utils.downloadFile(url, name)

    log.success('✓ ' + lang.transl('_保存用户头像'))
    EVT.fire('closeCenterPanel')
  }
}

new SaveAvatarImage()
