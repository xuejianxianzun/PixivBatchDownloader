import { API } from './API'
import { filter } from './Filter'
import { setting, form } from './Settings'
import { FilterOption } from './Filter.d'
import { IllustData } from './CrawlResult'
import { store } from './Store'

class SaveImageWorksData {
  public async save(data: IllustData) {
    // 获取需要检查的信息
    const body = data.body
    const fullWidth = body.width // 原图宽度
    const fullHeight = body.height // 原图高度
    const bmk = body.bookmarkCount // 收藏数
    const tagArr = body.tags.tags // 取出 tag 信息
    const tags: string[] = [] // 保存 tag 列表
    const tagTranslation: string[] = [] // 保存 tag 列表，附带翻译后的 tag

    for (const tagData of tagArr) {
      tags.push(tagData.tag)
      tagTranslation.push(tagData.tag)
      if (tagData.translation && tagData.translation.en) {
        tagTranslation.push(tagData.translation.en)
      }
    }

    const filterOpt: FilterOption = {
      createDate: body.createDate,
      id: body.illustId,
      illustType: body.illustType,
      tags: tags,
      pageCount: body.pageCount,
      bookmarkCount: bmk,
      bookmarkData: body.bookmarkData,
      width: fullWidth,
      height: fullHeight,
      mini: body.urls.mini,
    }

    // 检查通过
    if (await filter.check(filterOpt)) {
      const illustId = body.illustId
      const idNum = parseInt(body.illustId)
      const title = body.illustTitle // 作品标题
      const userid = body.userId // 用户id
      const user = body.userName // 用户名
      const thumb = body.urls.thumb
      const pageCount = body.pageCount
      const bookmarked = !!body.bookmarkData

      // 时间原数据如 "2019-12-18T22:23:37+00:00"
      // 网页上显示的日期是转换成了本地时间的，如北京时区显示为 "2019-12-19"，不是显示原始日期 "2019-12-18"。所以这里转换成本地时区的日期，和网页上保持一致，以免用户困惑。
      const date0 = new Date(body.createDate)
      const y = date0.getFullYear()
      const m = (date0.getMonth() + 1).toString().padStart(2, '0')
      const d = date0.getDate().toString().padStart(2, '0')
      const date = `${y}-${m}-${d}`

      let rank = '' // 保存作品在排行榜上的编号
      let testRank = store.getRankList(body.illustId)
      if (testRank !== undefined) {
        rank = '#' + testRank
      }

      // 储存作品信息
      if (body.illustType !== 2) {
        // 插画或漫画

        // 下载该作品的前面几张
        const dlCount = setting.getDLCount(body.pageCount)

        const imgUrl = body.urls.original // 作品的原图 URL

        const tempExt = imgUrl.split('.')
        const ext = tempExt[tempExt.length - 1]

        // 添加作品信息
        store.addResult({
          id: illustId,
          idNum: idNum,
          thumb: thumb,
          pageCount: pageCount,
          dlCount: dlCount,
          url: imgUrl,
          title: title,
          tags: tags,
          tagsTranslated: tagTranslation,
          user: user,
          userid: userid,
          fullWidth: fullWidth,
          fullHeight: fullHeight,
          ext: ext,
          bmk: bmk,
          bookmarked: bookmarked,
          date: date,
          type: body.illustType,
          rank: rank,
        })
      } else if (body.illustType === 2) {
        // 动图
        // 获取动图的信息
        const meta = await API.getUgoiraMeta(illustId)
        // 动图帧延迟数据
        const ugoiraInfo = {
          frames: meta.body.frames,
          mime_type: meta.body.mime_type,
        }

        const ext = form.ugoiraSaveAs.value // 扩展名可能是 webm、gif、zip

        store.addResult({
          id: illustId,
          idNum: idNum,
          thumb: thumb,
          pageCount: pageCount,
          url: meta.body.originalSrc,
          title: title,
          tags: tags,
          tagsTranslated: tagTranslation,
          user: user,
          userid: userid,
          fullWidth: fullWidth,
          fullHeight: fullHeight,
          ext: ext,
          bmk: bmk,
          bookmarked: bookmarked,
          date: date,
          type: body.illustType,
          rank: rank,
          ugoiraInfo: ugoiraInfo,
        })
      }
    }
  }
}

const saveImageWorksData = new SaveImageWorksData()
export { saveImageWorksData }
