import { filter, FilterOption } from '../filter/Filter'
import { NovelData } from '../crawl/CrawlResult'
import { store } from './Store'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'

// 保存单个小说作品的数据
class SaveNovelData {
  public async save(data: NovelData) {
    // 小说没有 illustType 属性， 把小说的 illustType 设置为 3，这是为了方便检查
    const illustType = 3

    // 获取需要检查的信息
    const body = data.body
    const bmk = body.bookmarkCount // 收藏数

    const tags: string[] = Tools.extractTags(data) // tag 列表
    // 小说的标签没有进行翻译，所以没有翻译后的标签

    // 添加“原创”对应的标签
    if (data.body.isOriginal) {
      const originalMark = Tools.getOriginalMark()
      Tools.unshiftTag(tags, originalMark)
    }

    // 判断是不是 AI 生成的作品
    let aiType = body.aiType
    if (aiType !== 2) {
      if (Tools.checkAIFromTags(tags)) {
        aiType = 2
      }
    }

    // 添加“AI生成”对应的标签
    const aiMarkString = Tools.getAIGeneratedMark(aiType)
    if (aiMarkString) {
      Tools.unshiftTag(tags, aiMarkString)
    }

    const filterOpt: FilterOption = {
      aiType,
      createDate: body.createDate,
      id: body.id,
      workType: illustType,
      tags: tags,
      title: body.title,
      seriesTitle: body.seriesNavData?.title || '',
      bookmarkCount: bmk,
      bookmarkData: body.bookmarkData,
      userId: body.userId,
      xRestrict: body.xRestrict,
    }

    // 检查通过
    if (await filter.check(filterOpt)) {
      const id = body.id
      const idNum = parseInt(id)
      const title = body.title
      const userId = body.userId
      const user = body.userName
      const bookmarked = !!body.bookmarkData

      // 保存作品在排行榜上的编号
      const rankData = store.getRankList(id)
      const rank = rankData ? rankData : null

      // 系列标题和序号
      const seriesTitle = body.seriesNavData?.title || ''
      const seriesOrder = body.seriesNavData?.order || null

      // 这个 description 是保存到抓取结果里的，尽量保持原样，所以保留了 html 标签
      const description = Utils.htmlDecode(body.description)

      // descriptionNoHtmlTag 保存在 novelMeta.description 里
      // 它会在生成的小说里显示，供读者阅读，所以移除了 html 标签，只保留纯文本
      // 处理后，换行标记是 \n 而不是 <br/>
      const descriptionNoHtmlTag = Tools.replaceEPUBDescription(
        Utils.htmlToText(description)
      )

      // 提取嵌入的图片资源
      const embeddedImages = Tools.extractEmbeddedImages(data)

      // 保存作品信息
      store.addResult({
        aiType,
        id: id,
        idNum: idNum,
        thumb: body.coverUrl || undefined,
        title: title,
        description: description,
        tags: tags,
        tagsWithTransl: tags,
        tagsTranslOnly: tags,
        user: user,
        userId: userId,
        // 这里的 ext 并不重要，下载时会根据 novelSaveAs 设置自动生成对应的数据
        ext: settings.novelSaveAs,
        bmk: bmk,
        bmkId: body.bookmarkData ? body.bookmarkData.id : '',
        bookmarked: bookmarked,
        date: body.createDate,
        uploadDate: body.uploadDate,
        type: illustType,
        rank: rank,
        seriesTitle: seriesTitle,
        seriesOrder: seriesOrder,
        seriesId: body.seriesNavData ? body.seriesNavData!.seriesId : null,
        viewCount: body.viewCount,
        likeCount: body.likeCount,
        commentCount: body.commentCount,
        novelMeta: {
          id: body.id,
          title: title,
          content: Tools.replaceNovelContentFlag(body.content),
          description: descriptionNoHtmlTag,
          coverUrl: body.coverUrl,
          createDate: body.createDate,
          uploadDate: body.uploadDate,
          userName: body.userName,
          embeddedImages: embeddedImages,
          tags: tags,
        },
        xRestrict: body.xRestrict,
      })
    }
  }
}

const saveNovelData = new SaveNovelData()
export { saveNovelData }
