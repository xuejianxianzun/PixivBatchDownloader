import { lang } from '../Lang'
import { API } from '../API'
import { log } from '../Log'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'

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
    const imageURL = userProfile.body.imageBig

    // 提取图片的后缀名
    const arr = imageURL.split('.')
    const ext = arr[arr.length - 1]

    // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
    // 如果是 gif 格式，则不生成其大图 url，因为生成的大图是静态图。不知道 gif 头像是否有大图，以及其 url 是什么样的
    // 如果是其他格式，则去掉 170 标记，获取头像图片的原图
    const fullSizeImgURL =
      ext === 'gif' ? imageURL : imageURL.replace('_170', '')

    // 加载文件
    const img = await fetch(fullSizeImgURL)
    const blob = await img.blob()

    // 直接保存到下载文件夹
    const url = URL.createObjectURL(blob)
    const name = `${userProfile.body.name}_${userId}_avatar.${ext}`
    Utils.downloadFile(url, name)

    const msg = '✓ ' + lang.transl('_保存用户头像')
    log.success(msg)
    toast.success(msg)
    EVT.fire('closeCenterPanel')
  }
}

new SaveAvatarImage()
