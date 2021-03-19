import { API } from './API'
import { settings } from './setting/Settings'
import { token } from './Token'
import { Tools } from './Tools'

class Bookmark {
  static async getWorkData(type: 'illusts' | 'novels', id: string) {
    return type === 'illusts'
      ? await API.getArtworkData(id)
      : await API.getNovelData(id)
  }

  // 对 API.addBookmark 进行封装
  /**添加收藏
   *
   * 可选参数 tags：可以直接传入这个作品的 tag 列表
   *
   * 如果未传入 tags，但收藏设置要求 tags，则此方法会发送请求获取作品数据
   */
  static async add(id: string, type: 'illusts' | 'novels', tags?: string[]) {
    if (!settings.widthTagBoolean) {
      // 设置了不添加 tag
      tags = []
    } else {
      // 需要添加 tag
      if (!tags) {
        tags = []
        // 如果需要附带 tag，则获取作品数据，提取 tag
        const data = await this.getWorkData(type, id)
        tags = Tools.extractTags(data)
      }
    }

    return API.addBookmark(
      type,
      id,
      tags,
      settings.restrictBoolean,
      token.token
    )
  }
}

export { Bookmark }
