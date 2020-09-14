import { filter } from '../Filter'
import { FilterOption } from '../Filter.d'
import { NovelData } from '../CrawlResult.d'
import { store } from '../Store'
import { settings } from '../setting/Settings'
import { MakeNovelFile } from './MakeNovelFile'

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
    // 小说的标签没有进行翻译，所以没有翻译后的标签

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

      let seriesTitle = body.seriesNavData ? body.seriesNavData.title : ''
      let seriesOrder = body.seriesNavData ? '#' + body.seriesNavData.order : ''

      let ext = settings.novelSaveAs

      let metaArr: string[] = []
      let meta = ''

      if (settings.saveNovelMeta) {
        const pageUrl = `https://www.pixiv.net/novel/show.php?id=${id}`
        const tagsA = []
        for (const tag of tags) {
          tagsA.push('#' + tag)
        }
        metaArr.push(title, user, pageUrl, body.description, tagsA.join('\n'))
        meta = metaArr.join('\n\n') + '\n\n\n'
      }

      let content = this.replaceFlag(meta + body.content)

      let blob: Blob
      if (ext === 'txt') {
        blob = MakeNovelFile.makeTXT(content)
      } else {
        // 创建 epub 文件，如果失败则回滚到 txt
        try {
          blob = await MakeNovelFile.makeEPUB(data, content)
        } catch {
          ext = 'txt'
          blob = MakeNovelFile.makeTXT(content)
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
        tagsWithTransl: tags,
        tagsTranslOnly: tags,
        user: user,
        userId: userid,
        ext: ext,
        bmk: bmk,
        bookmarked: bookmarked,
        date: date,
        type: illustType,
        rank: rank,
        seriesTitle: seriesTitle,
        seriesOrder: seriesOrder,
        novelBlob: blob,
      })
    }
  }

  // '[[jumpuri:予約ページ>https://www.amazon.co.jp/dp/4758092486]]'
  // 替换成
  // '予約ページ（https://www.amazon.co.jp/dp/4758092486）'
  private replaceJumpuri(str: string) {
    let reg = /\[\[jumpuri:(.*?)>(.*?)\]\]/g
    let temp
    while ((temp = reg.exec(str))) {
      str = str.replace(temp[0], `${temp[1].trim()}（${temp[2].trim()}）`)
      reg.lastIndex = 0
    }

    return str
  }

  // > '[[rb:莉莉丝 > Lilith]]'
  // 替换成
  // '莉莉丝（Lilith）'
  private replaceRb(str: string) {
    let reg = /\[\[rb:(.*?)>(.*?)\]\]/g
    let temp
    while ((temp = reg.exec(str))) {
      str = str.replace(temp[0], `${temp[1].trim()}（${temp[2].trim()}）`)
      reg.lastIndex = 0
    }
    return str
  }

  // > '[chapter:标题]'
  // 替换成
  // '标题'
  private replaceChapter(str: string) {
    const reg = /\[chapter:(.*?)\]/g
    let temp
    while ((temp = reg.exec(str))) {
      str = str.replace(temp[0], temp[1])
      reg.lastIndex = 0
    }
    return str
  }

  // > [pixivimage:70551567]
  // 替换成
  // [pixiv image link: <a href="http://pixiv.net/i/70551567" target="_blank">http://pixiv.net/i/70551567</a>]
  private replacePixivImage(str: string) {
    let reg = /\[pixivimage:(.*?)\]/g
    let temp
    while ((temp = reg.exec(str))) {
      const url = `http://pixiv.net/i/${temp[1].trim()}`
      str = str.replace(
        temp[0],
        `[pixiv image link: <a href="${url}" target="_blank">${url}</a>]`
      )
      reg.lastIndex = 0
    }
    return str
  }

  // 对小说里的一些标记进行替换
  private replaceFlag(str: string) {
    str = str.replace(/\[newpage\]/g, '')

    str = this.replaceJumpuri(str)

    str = str.replace(/\[jump:.*?\]/g, '')

    str = this.replaceRb(str)

    str = this.replaceChapter(str)

    str = this.replacePixivImage(str)

    return str
  }
}

const saveNovelData = new SaveNovelData()
export { saveNovelData }
