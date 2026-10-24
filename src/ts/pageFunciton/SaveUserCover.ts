import { lang } from '../Language'
import { API } from '../API'
import { log } from '../Log'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { toast } from '../Toast'
import { SendDownload } from '../download/SendDownload'
import { getImg } from '../utils/GetImage'
import { SaveAvatarOption } from './SaveAvatarImage'

// 保存用户封面图片
class SaveUserCover {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.saveUserCover, () => {
      EVT.fire('closeSettingsPanel')
      this.saveUserCover()
    })
  }

  /** 保存用户封面图片
   *
   * @param option 可选。传入 `url` 时直接使用它，不再使用 `API.getUserProfile` 返回的封面 URL；
   * 传入用户 id 和用户名时，不再请求用户资料 API。
   * @returns 保存成功时返回 true，失败时返回 false。
   */
  public async saveUserCover(option: SaveAvatarOption = {}): Promise<boolean> {
    const userId = option.userId?.trim() || Tools.getCurrentPageUserId()
    const passedURL = typeof option.url === 'string' ? option.url.trim() : ''
    let userName = option.userName?.trim() || ''

    let bgUrl: string | undefined = passedURL || undefined
    if (!bgUrl || !userName) {
      // 缺少封面 URL 或用户名时，请求用户资料 API 来获取它们
      const userProfile = await API.getUserProfile(userId)
      bgUrl = bgUrl || userProfile.body.background?.url
      userName = userName || userProfile.body.name
    }

    if (!bgUrl) {
      if (!option.silent) {
        toast.error(lang.transl('_没有数据可供使用'))
      }
      return false
    }

    // 加载图片
    const blob = await getImg(bgUrl, !option.silent)
    if (!blob) {
      return false
    }

    // 提取后缀名
    const arr = bgUrl.split('.')
    const ext = arr[arr.length - 1]

    // 使用 downloads API 保存文件
    const name =
      `pixiv users/` +
      Utils.replaceUnsafeStr(`${userName}_${userId}_cover.${ext}`)
    await SendDownload.noReply(blob, name, 'downloadsAPI', 'overwrite')

    if (!option.silent) {
      const msg = lang.transl('_保存用户封面')
      log.success('✅' + msg)
      toast.success(msg)
    }

    return true
  }
}

const saveUserCover = new SaveUserCover()
export { saveUserCover }
