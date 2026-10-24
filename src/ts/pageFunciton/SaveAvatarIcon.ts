import { lang } from '../Language'
import { API } from '../API'
import { log } from '../Log'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { img2ico } from '../utils/imageToIcon'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'
import { SendDownload } from '../download/SendDownload'
import { getImg } from '../utils/GetImage'
import { SaveAvatarOption } from './SaveAvatarImage'

// 保存用户头像为图标
class SaveAvatarIcon {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.saveAvatarIcon, () => {
      EVT.fire('closeSettingsPanel')
      this.saveAvatarIcon()
    })
  }

  /** 保存用户头像为图标
   *
   * @param option 可选。传入 `url` 时直接使用它，不再使用 `API.getUserProfile` 返回的头像 URL；
   * 传入用户 id 和用户名时，不再请求用户资料 API。
   * @returns 保存成功时返回 true，失败时返回 false。
   */
  public async saveAvatarIcon(option: SaveAvatarOption = {}): Promise<boolean> {
    const userId = option.userId?.trim() || Tools.getCurrentPageUserId()
    const passedURL = typeof option.url === 'string' ? option.url.trim() : ''
    let userName = option.userName?.trim() || ''

    let bigImg = passedURL // imageBig 并不是头像原图，而是裁剪成 170 px 的尺寸
    if (!bigImg || !userName) {
      // 缺少头像 URL 或用户名时，请求用户资料 API 来获取它们
      const userProfile = await API.getUserProfile(userId)
      bigImg = bigImg || userProfile.body.imageBig
      userName = userName || userProfile.body.name
    }

    // 去掉文件名末尾的 170 标记，获取头像图片的原图
    // 如果 URL 里没有 `_170`，这个替换不会改变它，所以对传入的 URL 也可以执行
    // 注意必须从文件名的末尾去掉这个标记，细节见 Tools.getFullSizeAvatarURL 的说明
    const fullSizeImg = Tools.getFullSizeAvatarURL(bigImg)

    // 加载图片
    const imageBlob = await getImg(fullSizeImg, !option.silent)
    if (!imageBlob) {
      return false
    }
    const imageURL = URL.createObjectURL(imageBlob)

    // 生成 ico 文件
    // 尺寸固定为 256，因为尺寸更小的图标如 128，在 windows 资源管理器里会被缩小到 48 显示
    const blob = await img2ico.convert({
      size: [256],
      source: imageURL,
      shape: 'fillet',
      bleed: true,
    })

    // 使用 downloads API 保存文件
    const name =
      `pixiv users/` + Utils.replaceUnsafeStr(`${userName}_${userId}_icon.ico`)
    await SendDownload.noReply(blob, name, 'downloadsAPI', 'overwrite')

    if (!option.silent) {
      const msg = lang.transl('_保存用户头像为图标')
      log.success('✅' + msg)
      toast.success(msg)
    }

    return true
  }
}

const saveAvatarIcon = new SaveAvatarIcon()
export { saveAvatarIcon }
