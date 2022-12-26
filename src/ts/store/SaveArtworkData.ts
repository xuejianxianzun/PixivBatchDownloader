import { API } from '../API'
import { filter, FilterOption } from '../filter/Filter'
import { settings } from '../setting/Settings'
import { ArtworkData } from '../crawl/CrawlResult'
import { store } from './Store'
import { Tools } from '../Tools'

// 保存图片作品的数据
class SaveArtworkData {
  public async save(data: ArtworkData) {
    // 获取需要检查的信息
    const body = data.body
    const fullWidth = body.width // 原图宽度
    const fullHeight = body.height // 原图高度
    const bmk = body.bookmarkCount // 收藏数

    const tags: string[] = Tools.extractTags(data) // tag 列表
    const tagsWithTransl: string[] = Tools.extractTags(data, 'both') // 保存 tag 列表，附带翻译后的 tag
    const tagsTranslOnly: string[] = Tools.extractTags(data, 'transl') // 保存翻译后的 tag 列表

    const aiMarkString = Tools.getAIGeneratedMark(body.aiType)
    if (aiMarkString) {
      tags.unshift(aiMarkString)
      tagsWithTransl.unshift(aiMarkString)
      tagsTranslOnly.unshift(aiMarkString)
    }

    const filterOpt: FilterOption = {
      aiType: body.aiType,
      createDate: body.createDate,
      id: body.id,
      workType: body.illustType,
      tags: tagsWithTransl,
      pageCount: body.pageCount,
      bookmarkCount: bmk,
      bookmarkData: body.bookmarkData,
      width: body.pageCount === 1 ? fullWidth : 0,
      height: body.pageCount === 1 ? fullHeight : 0,
      mini: body.pageCount === 1 ? body.urls.mini : undefined,
      userId: body.userId,
      xRestrict: body.xRestrict,
    }
    // 对于多图作品，其宽高和颜色不在这里进行检查。也就是只会在下载时检查。
    // 这是因为在多图作品里，第一张图片的宽高和颜色不能代表剩余的图片。

    // 检查通过
    if (await filter.check(filterOpt)) {
      const idNum = parseInt(body.id)
      const title = body.title // 作品标题
      const userId = body.userId // 用户id
      const user = body.userName // 用户名
      const pageCount = body.pageCount
      const bookmarked = !!body.bookmarkData

      // 保存作品在排行榜上的编号
      const rankData = store.getRankList(body.id)
      const rank = rankData ? rankData : null

      const seriesTitle = body.seriesNavData ? body.seriesNavData.title : ''
      const seriesOrder = body.seriesNavData ? body.seriesNavData.order : null

      // 储存作品信息
      if (body.illustType === 0 || body.illustType === 1) {
        // 插画或漫画
        const imgUrl = body.urls.original // 作品的原图 URL

        const tempExt = imgUrl.split('.')
        const ext = tempExt[tempExt.length - 1]

        // 添加作品信息
        store.addResult({
          aiType: body.aiType,
          id: body.id,
          idNum: idNum,
          // 对于插画和漫画的缩略图，当一个作品包含多个图片文件时，需要转换缩略图 url
          thumb:
            body.pageCount > 1
              ? Tools.convertArtworkThumbURL(body.urls.thumb, 0)
              : body.urls.thumb,
          pageCount: pageCount,
          original: imgUrl,
          regular: body.urls.regular,
          small: body.urls.small,
          title: title,
          description: body.description,
          tags: tags,
          tagsWithTransl: tagsWithTransl,
          tagsTranslOnly: tagsTranslOnly,
          user: user,
          userId: userId,
          fullWidth: fullWidth,
          fullHeight: fullHeight,
          ext: ext,
          bmk: bmk,
          bmkId: body.bookmarkData ? body.bookmarkData.id : '',
          bookmarked: bookmarked,
          date: body.createDate,
          uploadDate: body.uploadDate,
          type: body.illustType,
          rank: rank,
          seriesTitle: seriesTitle,
          seriesOrder: seriesOrder,
          seriesId: body.seriesNavData ? body.seriesNavData!.seriesId : null,
          viewCount: body.viewCount,
          likeCount: body.likeCount,
          commentCount: body.commentCount,
          xRestrict: body.xRestrict,
          sl: body.sl,
        })
      } else if (body.illustType === 2) {
        // 动图
        // 获取动图的信息
        const meta = await API.getUgoiraMeta(body.id)
        // 动图帧延迟数据
        const ugoiraInfo = {
          frames: meta.body.frames,
          mime_type: meta.body.mime_type,
        }

        // 当下载图片的方形缩略图时，它的后缀名从 url 中提取。
        // 此时不应该把它的后缀名设置为动图的保存格式，因为缩略图无法转换成动图
        let ext: string = settings.ugoiraSaveAs
        if (settings.imageSize === 'thumb') {
          const tempExt = body.urls.thumb.split('.')
          ext = tempExt[tempExt.length - 1]
        }

        store.addResult({
          aiType: body.aiType,
          id: body.id,
          idNum: idNum,
          thumb: body.urls.thumb,
          pageCount: pageCount,
          original: meta.body.originalSrc,
          regular: meta.body.src,
          small: meta.body.src,
          title: title,
          description: body.description,
          tags: tags,
          tagsWithTransl: tagsWithTransl,
          tagsTranslOnly: tagsTranslOnly,
          user: user,
          userId: userId,
          fullWidth: fullWidth,
          fullHeight: fullHeight,
          ext: ext,
          bmk: bmk,
          bmkId: body.bookmarkData ? body.bookmarkData.id : '',
          bookmarked: bookmarked,
          date: body.createDate,
          uploadDate: body.uploadDate,
          type: body.illustType,
          rank: rank,
          ugoiraInfo: ugoiraInfo,
          seriesTitle: seriesTitle,
          seriesOrder: seriesOrder,
          viewCount: body.viewCount,
          likeCount: body.likeCount,
          commentCount: body.commentCount,
          xRestrict: body.xRestrict,
          sl: body.sl,
        })
      }
    }
  }
}

const saveArtworkData = new SaveArtworkData()
export { saveArtworkData }
