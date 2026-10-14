import { API } from './API'
import { EVT } from './EVT'
import { lang } from './Language'
import { settings } from './setting/Settings'
import { token } from './Token'
import { toast } from './Toast'

// 给作品点赞。目前只在图像作品的缩略图按钮上使用
class LikeWork {
  /** 给一个作品点赞。
   *
   * 如果启用了“点击点赞按钮时下载作品”，会同时触发快速下载（不会等待点赞请求完成） */
  public async like(id: string) {
    toast.show(lang.transl('_点赞'))

    // 如果启用了“点击点赞按钮时下载作品”，就同时下载这个作品
    if (settings.downloadOnClickLike) {
      EVT.fire('crawlIdList', [
        {
          type: 'illusts',
          id,
        },
      ])
    }

    try {
      const response = await API.addLike(id, 'illusts', token.token)
      if (!response.error) {
        // like API 返回的 is_liked 表示你是否已经给这个作品点赞过了。
        // 如果之前已经赞过，则点赞数不会再次增加
        const isLiked =
          !Array.isArray(response.body) && response.body.is_liked === true
        if (isLiked) {
          toast.warning(lang.transl('_你已经赞过这个作品'))
        } else {
          toast.success(lang.transl('_点赞成功'))
        }
      } else {
        toast.error(lang.transl('_点赞失败'))
      }
    } catch {
      toast.error(lang.transl('_点赞失败'))
    }
  }
}

const likeWork = new LikeWork()
export { likeWork }
