import { API } from './API'
import { filter } from './Filter'
import { setting, form } from './Settings'
import { FilterOption } from './Filter.d'
import { NovelData } from './CrawlResult.d'
import { store } from './Store'

class SaveNovelWorksData {
  public async save(data: NovelData) {
    // 其实小说本来没有 illustType 属性， 把小说的 illustType 设置为 3，这是为了方便检查
    const illustType = 3
    
    const dlCount = 1

    // 获取需要检查的信息
    const body = data.body
    const bmk = body.bookmarkCount // 收藏数
    const tagArr = body.tags.tags // 取出 tag 信息
    const tags: string[] = [] // 保存 tag 列表

    for (const tagData of tagArr) {
      tags.push(tagData.tag)
    }

    const filterOpt: FilterOption = {
      createDate: body.createDate,
      id: body.id,
      illustType: illustType,
      tags: tags,
      bookmarkCount: bmk,
      bookmarkData: body.bookmarkData,
    }

    // 检查通过
    if (await filter.check(filterOpt)) {
      const illustId = body.id
      const idNum = parseInt(body.id)
      const title = body.title // 作品标题
      const userid = body.userId // 用户id
      const user = body.userName // 用户名
      const thumb = body.coverUrl
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
      let testRank = store.getRankList(body.id)
      if (testRank !== undefined) {
        rank = '#' + testRank
      }

      // 储存作品信息

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
          type: illustType,
          rank: rank,
        })
    }
  }
}

const saveNovelWorksData = new SaveNovelWorksData()
export { saveNovelWorksData }
