import { filter } from '../Filter'
import { FilterOption } from '../Filter.d'
import { NovelData } from '../CrawlResult'
import { store } from '../Store'

class SaveNovelData {
  public async save(data: NovelData) {
    // 小说没有 illustType 属性， 把小说的 illustType 设置为 3，这是为了方便检查
    const illustType = 3

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
      const idNum = parseInt(illustId)
      const title = body.title
      const userid = body.userId
      const user = body.userName
      const bookmarked = !!body.bookmarkData

      // 时间原数据如 "2019-12-18T22:23:37+00:00"
      // 网页上显示的日期是转换成了本地时间的，如北京时区显示为 "2019-12-19"，不是显示原始日期 "2019-12-18"。所以这里转换成本地时区的日期，和网页上保持一致，以免用户困惑。
      const date0 = new Date(body.createDate)
      const y = date0.getFullYear()
      const m = (date0.getMonth() + 1).toString().padStart(2, '0')
      const d = date0.getDate().toString().padStart(2, '0')
      const date = `${y}-${m}-${d}`

      // 保存作品在排行榜上的编号
      let rank = ''
      let testRank = store.getRankList(body.id)
      if (testRank !== undefined) {
        rank = '#' + testRank
      }

      const blob = new Blob([body.content], {
        type: 'text/plain',
      })
      const url = URL.createObjectURL(blob)

      const ext = 'txt'

      // 添加作品信息
      store.addResult({
        id: illustId,
        idNum: idNum,
        thumb: body.coverUrl || undefined,
        dlCount: 1,
        url: url,
        title: title,
        tags: tags,
        user: user,
        userid: userid,
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

const saveNovelData = new SaveNovelData()
export { saveNovelData }
