import { lang } from '../Language'
import { API } from '../API'
import { log } from '../Log'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'
import { SendDownload } from '../download/SendDownload'
import { getImg } from '../utils/GetImage'

/**
 * 保存用户的图片时的可选参数。
 * 保存用户封面（SaveUserCover）、保存用户头像（SaveAvatarImage）、
 * 保存用户头像为图标（SaveAvatarIcon）都使用这个类型。
 */
export interface SaveAvatarOption {
  /**
   * 图片的 URL。传入有效的图片 URL 时直接使用它，
   * 不再通过 `API.getUserProfile` 获取要使用的图片 URL。
   */
  url?: string
  /** 用户 id。不传时使用当前页面里的用户 id */
  userId?: string
  /** 用户名，用于生成文件名。不传时请求用户资料 API 获取 */
  userName?: string
  /**
   * 为 true 时不输出日志和提示。
   * 批量保存时由调用方统一输出进度和结果，这里不再逐个输出，避免刷屏。
   */
  silent?: boolean
}

// 保存用户头像
class SaveAvatarImage {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.saveAvatarImage, () => {
      EVT.fire('closeSettingsPanel')
      this.saveAvatarImage()
    })
  }

  /** 保存用户头像
   *
   * @param option 可选。传入 `url` 时直接使用它，不再使用 `API.getUserProfile` 返回的头像 URL；
   * 传入用户 id 和用户名时，不再请求用户资料 API。
   * @returns 保存成功时返回 true，失败时返回 false。
   */
  public async saveAvatarImage(
    option: SaveAvatarOption = {}
  ): Promise<boolean> {
    const userId = option.userId?.trim() || Tools.getCurrentPageUserId()
    const passedURL = typeof option.url === 'string' ? option.url.trim() : ''
    let userName = option.userName?.trim() || ''

    let imageURL = passedURL
    if (!imageURL || !userName) {
      // 缺少头像 URL 或用户名时，请求用户资料 API 来获取它们
      const userProfile = await API.getUserProfile(userId)
      imageURL = imageURL || userProfile.body.imageBig
      userName = userName || userProfile.body.name
    }

    // 提取图片的后缀名
    const arr = imageURL.split('.')
    const ext = arr[arr.length - 1]

    // imageBig 网址可能并不是头像原图，而是裁剪成 170 px 的尺寸，所以需要去掉 `_170` 标记，获取原图 URL。
    // 有些头像图片是 gif 格式，也同样去掉 170 标记，以获取头像图片的原图
    // 注意必须从文件名的末尾去掉这个标记，细节见 Tools.getFullSizeAvatarURL 的说明
    const fullSizeImgURL = Tools.getFullSizeAvatarURL(imageURL)

    // 加载图片
    const blob = await getImg(fullSizeImgURL, !option.silent)
    if (!blob) {
      return false
    }

    // 使用 downloads API 保存文件
    const name =
      `pixiv users/` +
      Utils.replaceUnsafeStr(`${userName}_${userId}_avatar.${ext}`)
    await SendDownload.noReply(blob, name, 'downloadsAPI', 'overwrite')

    if (!option.silent) {
      const msg = lang.transl('_保存用户头像')
      log.success('✅' + msg)
      toast.success(msg)
    }

    return true
  }
}

const saveAvatarImage = new SaveAvatarImage()
export { saveAvatarImage }
