import { lang } from './Lang'
import { API } from './API'
import { log } from './Log'
import { DOM } from './DOM'
import { centerPanel } from './CenterPanel'
import { EVT } from './EVT'
import { img2ico } from './ImageToIcon'

// 保存用户头像为图标
class SaveAvatarIcon {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.events.saveAvatarIcon, () => {
      this.saveAvatarIcon()
    })
  }

  private async saveAvatarIcon() {
    const userId = DOM.getUserId()
    const userProfile = await API.getUserProfile(userId)
    const bigImg = userProfile.body.imageBig // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
    const fullSizeImg = bigImg.replace('_170', '') // 去掉 170 标记，获取头像图片的原图

    // 生成 ico 文件
    // 尺寸固定为 256，因为尺寸更小的图标如 128 会在 windows 资源管理器里被缩小到 48
    const blob = await img2ico.convert({
      size: 256,
      source: fullSizeImg,
      shape: 'fillet',
    })

    // 直接保存到下载文件夹
    const url = URL.createObjectURL(blob)
    const name = `ico_${userProfile.body.name}_${userId}.ico`
    DOM.downloadFile(url, name)

    log.success('✓ ' + lang.transl('_保存用户头像为图标'))
    centerPanel.close()
  }
}

new SaveAvatarIcon()

export {}
