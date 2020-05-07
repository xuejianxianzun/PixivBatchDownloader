import { filter } from '../Filter'
import { FilterOption } from '../Filter.d'
import { NovelData } from '../CrawlResult.d'
import { store } from '../Store'
import { form } from '../Settings'
import { makeEPUB } from './MakeEPUB'

declare const EpubMaker: any

// 保存单个小说作品的数据
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
      const id = body.id
      const idNum = parseInt(id)
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

      let ext = form.novelSaveAs.value

      let metaArr: string[] = []
      let meta = ''

      if (form.saveNovelMeta.checked) {
        const pageUrl = `https://www.pixiv.net/novel/show.php?id=${id}`
        const tagsA = []
        for (const tag of tags) {
          tagsA.push('#' + tag)
        }
        metaArr.push(title, user, pageUrl, tagsA.join('\n'))
        meta = metaArr.join('\n\n') + '\n\n\n'
      }

      let content = meta + body.content

      let blob: Blob
      if (ext === 'txt') {
        blob = this.makeTXT(content)
      } else {
        // 创建 epub 文件，如果失败则回滚到 txt
        try {
          const htmlContnet = content
            .replace(/\n/g, '<br/>')
            .replace(/\[newpage\]/g, '')
          blob = await makeEPUB.make(data, htmlContnet)
        } catch {
          ext = 'txt'
          blob = this.makeTXT(content)
        }
      }

      const url = URL.createObjectURL(blob)

      // 添加作品信息
      store.addResult({
        id: id,
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

  private makeTXT(content: string) {
    return new Blob([content], {
      type: 'text/plain',
    })
  }
}

const saveNovelData = new SaveNovelData()
export { saveNovelData }
