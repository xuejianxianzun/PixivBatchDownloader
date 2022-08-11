import { lang } from '../Lang'
import { API } from '../API'
import { log } from '../Log'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { img2ico } from '../utils/imageToIcon'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'

// 保存用户头像为图标
class SaveAvatarIcon {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.saveAvatarIcon, () => {
      this.saveAvatarIcon()
    })
  }

  private async saveAvatarIcon() {
    const userId = Tools.getUserId()
    const userProfile = await API.getUserProfile(userId)
    const bigImg = userProfile.body.imageBig // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
    const fullSizeImg = bigImg.replace('_170', '') // 去掉 170 标记，获取头像图片的原图

    // 生成 ico 文件
    // 尺寸固定为 256，因为尺寸更小的图标如 128，在 windows 资源管理器里会被缩小到 48 显示
    const blob = await img2ico.convert({
      size: [256],
      source: fullSizeImg,
      shape: 'fillet',
      bleed: true,
    })

    // 直接保存到下载文件夹
    const url = URL.createObjectURL(blob)
    const name = `${userProfile.body.name}_${userId}_icon.ico`
    Utils.downloadFile(url, name)

    const msg = '✓ ' + lang.transl('_保存用户头像为图标')
    log.success(msg)
    toast.success(msg)
    EVT.fire('closeCenterPanel')
  }
}

new SaveAvatarIcon()
