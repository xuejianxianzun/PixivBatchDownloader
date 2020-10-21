import { API } from '../API'
import { filter } from '../Filter'
import { settings } from '../setting/Settings'
import { settingAPI } from '../setting/SettingAPI'
import { FilterOption } from '../Filter.d'
import { ArtworkData } from '../CrawlResult'
import { store } from '../Store'

// 保存单个图片作品的数据
class SaveArtworkData {
  public async save(data: ArtworkData) {
    // 获取需要检查的信息
    const body = data.body
    const fullWidth = body.width // 原图宽度
    const fullHeight = body.height // 原图高度
    const bmk = body.bookmarkCount // 收藏数
    const tagArr = body.tags.tags // 取出 tag 信息
    const tags: string[] = [] // 保存 tag 列表
    const tagsWithTransl: string[] = [] // 保存 tag 列表，附带翻译后的 tag
    const tagsTranslOnly: string[] = [] // 保存翻译后的 tag 列表

    for (const tagData of tagArr) {
      tags.push(tagData.tag)
      tagsWithTransl.push(tagData.tag)
      if (tagData.translation && tagData.translation.en) {
        // 有翻译
        // 不管是什么语种的翻译结果，都保存在 en 属性里
        tagsWithTransl.push(tagData.translation.en)
        tagsTranslOnly.push(tagData.translation.en)
      } else {
        // 无翻译
        // 把原 tag 保存到 tagsTranslOnly 里
        tagsTranslOnly.push(tagData.tag)
      }
    }

    const filterOpt: FilterOption = {
      createDate: body.createDate,
      id: body.id,
      illustType: body.illustType,
      tags: tagsWithTransl,
      pageCount: body.pageCount,
      bookmarkCount: bmk,
      bookmarkData: body.bookmarkData,
      width: fullWidth,
      height: fullHeight,
      mini: body.urls.mini,
    }
    // 这里检查颜色设置是有一个隐患的：因为有些多图作品第一张图的颜色和后面的图片的颜色不一样，但这里检查时只检查第一张的缩略图。如果第一张被排除掉了，那么它后面的图片也就不会被加入抓取结果。

    // 检查通过
    if (await filter.check(filterOpt)) {
      const idNum = parseInt(body.id)
      const title = body.title // 作品标题
      const userid = body.userId // 用户id
      const user = body.userName // 用户名
      const thumb = body.urls.thumb
      const pageCount = body.pageCount
      const bookmarked = !!body.bookmarkData

      // 保存作品在排行榜上的编号
      const rankData = store.getRankList(body.id)
      const rank = rankData ? '#' + rankData : ''

      const seriesTitle = body.seriesNavData ? body.seriesNavData.title : ''
      const seriesOrder = body.seriesNavData
        ? '#' + body.seriesNavData.order
        : ''

      // 储存作品信息
      if (body.illustType !== 2) {
        // 插画或漫画

        // 下载该作品的前面几张
        const dlCount = settingAPI.getDLCount(body.pageCount)

        const imgUrl = body.urls.original // 作品的原图 URL

        const tempExt = imgUrl.split('.')
        const ext = tempExt[tempExt.length - 1]

        // 添加作品信息
        store.addResult({
          id: body.id,
          idNum: idNum,
          thumb: thumb,
          pageCount: pageCount,
          dlCount: dlCount,
          original: imgUrl,
          regular: body.urls.regular,
          small: body.urls.small,
          title: title,
          tags: tags,
          tagsWithTransl: tagsWithTransl,
          tagsTranslOnly: tagsTranslOnly,
          user: user,
          userId: userid,
          fullWidth: fullWidth,
          fullHeight: fullHeight,
          ext: ext,
          bmk: bmk,
          bookmarked: bookmarked,
          date: body.createDate,
          type: body.illustType,
          rank: rank,
          seriesTitle: seriesTitle,
          seriesOrder: seriesOrder,
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

        const ext = settings.ugoiraSaveAs

        store.addResult({
          id: body.id,
          idNum: idNum,
          thumb: thumb,
          pageCount: pageCount,
          original: meta.body.originalSrc,
          regular: meta.body.src,
          small: meta.body.src,
          title: title,
          tags: tags,
          tagsWithTransl: tagsWithTransl,
          tagsTranslOnly: tagsTranslOnly,
          user: user,
          userId: userid,
          fullWidth: fullWidth,
          fullHeight: fullHeight,
          ext: ext,
          bmk: bmk,
          bookmarked: bookmarked,
          date: body.createDate,
          type: body.illustType,
          rank: rank,
          ugoiraInfo: ugoiraInfo,
          seriesTitle: seriesTitle,
          seriesOrder: seriesOrder,
        })
      }
    }
  }
}

const saveArtworkData = new SaveArtworkData()
export { saveArtworkData }
