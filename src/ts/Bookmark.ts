import { API } from './API'
import { lang } from './Lang'
import { log } from './Log'
import { settings } from './setting/Settings'
import { toast } from './Toast'
import { token } from './Token'
import { Tools } from './Tools'

// 对 API.addBookmark 进行封装
class Bookmark {
  static async getWorkData(type: 'illusts' | 'novels', id: string) {
    return type === 'illusts'
      ? await API.getArtworkData(id)
      : await API.getNovelData(id)
  }

  /**添加收藏
   *
   * 可选参数 tags：可以直接传入这个作品的 tag 列表
   *
   * 如果未传入 tags，但收藏设置要求 tags，则此方法会发送请求获取作品数据
   *
   * 可选参数 needAddTag：控制是否添加 tag。缺省时使用 settings.widthTagBoolean
   *
   * 可选参数 restrict：指示这个收藏是否为非公开收藏。缺省时使用 settings.restrictBoolean
   *
   */
  static async add(
    id: string,
    type: 'illusts' | 'novels',
    tags?: string[],
    needAddTag?: Boolean,
    restrict?: Boolean
  ) {
    const _needAddTag =
      needAddTag === undefined ? settings.widthTagBoolean : !!needAddTag
    if (_needAddTag) {
      // 需要添加 tags
      if (tags === undefined) {
        // 如果未传递 tags，则请求作品数据来获取 tags
        const data = await this.getWorkData(type, id)
        tags = Tools.extractTags(data)
      }
    } else {
      // 不需要添加 tags
      tags = []
    }

    const _restrict =
      restrict === undefined ? settings.restrictBoolean : !!restrict

    const request = API.addBookmark(id, type, tags, _restrict, token.token)

    let status = 0
    await request.then((res) => {
      status = res.status
    })
    // 如果状态码为 400，则表示当前 token 无效，需要重新获取 token，然后重新添加收藏
    if (status === 400) {
      await token.reset()
      return await API.addBookmark(id, type, tags, _restrict, token.token)
    }

    if (status === 429) {
      toast.error(lang.transl('_添加收藏失败'), {
        position: 'topCenter',
      })
      log.error(
        `${Tools.createWorkLink(id, type === 'illusts')} ${lang.transl(
          '_添加收藏失败'
        )}. ${lang.transl('_错误代码')}${status}.`
      )
    }

    // 返回状态码
    return status
  }
}

export { Bookmark }
