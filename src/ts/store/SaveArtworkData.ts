import { API } from '../API'
import { checkIndexForMultiImageWork } from '../filter/CheckIndexForMultiImageWork'
import { filter, FilterOption } from '../filter/Filter'
import { settings } from '../setting/Settings'
import { ArtworkData } from '../crawl/CrawlResult'
import { store } from './Store'
import { Tools } from '../Tools'
import { log } from '../Log'
import { Utils } from '../utils/Utils'

// 保存图片作品的数据
class SaveArtworkData {
  public async save(data: ArtworkData, downloadIndexes?: number[]) {
    // 获取需要检查的信息
    const body = data.body
    const fullWidth = body.width // 原图宽度
    const fullHeight = body.height // 原图高度
    const bmk = body.bookmarkCount // 收藏数

    const tags: string[] = Tools.extractTags(data) // tag 列表
    const tagsWithTransl: string[] = Tools.extractTags(data, 'both') // 保存 tag 列表，附带翻译后的 tag
    const tagsTranslOnly: string[] = Tools.extractTags(data, 'transl') // 保存翻译后的 tag 列表

    // 添加“原创”对应的标签
    // 对 Pixiv 行为的说明：
    // 只有当 isOriginal 为 true 时，Pixiv 才会认为这是一个原创作品，并且会在标签列表最前面显示加粗的“原创”标签（具体文字会根据页面显示语言变化）
    // 如果 isOriginal 为 false，那么即使 tags 里有“オリジナル”标签，Pixiv 也不会把这个作品当作原创作品处理
    // PS：如果两个条件都满足，此时 tag 里的“オリジナル”标签不会显示出来，因为已经有加粗显示的“原创”标签了
    // 为了与 Pixiv 的行为保持一致（在标签列表前面显示“原创”标记），下载器也需要进行相同的处理
    if (data.body.isOriginal) {
      const originalMark = Tools.getOriginalMark()
      Tools.unshiftTag(tags, originalMark)
      Tools.unshiftTag(tagsWithTransl, originalMark)
      Tools.unshiftTag(tagsTranslOnly, originalMark)
    }

    // 判断是不是 AI 生成的作品
    let aiType = body.aiType
    if (aiType !== 2) {
      if (Tools.checkAIFromTags(tagsWithTransl)) {
        aiType = 2
      }
    }

    // 添加“AI生成”对应的标签
    const aiMarkString = Tools.getAIGeneratedMark(aiType)
    if (aiMarkString) {
      Tools.unshiftTag(tags, aiMarkString)
      Tools.unshiftTag(tagsWithTransl, aiMarkString)
      Tools.unshiftTag(tagsTranslOnly, aiMarkString)
    }

    const filterOpt: FilterOption = {
      aiType,
      createDate: body.createDate,
      id: body.id,
      isOriginal: body.isOriginal,
      workType: body.illustType,
      tags: tagsWithTransl,
      title: body.title,
      seriesTitle: body.seriesNavData?.title || '',
      pageCount: body.pageCount,
      bookmarkCount: bmk,
      bookmarkData: body.bookmarkData,
      width: body.pageCount === 1 ? fullWidth : 0,
      height: body.pageCount === 1 ? fullHeight : 0,
      // 这里只检查单图作品的缩略图的颜色；多图作品的缩略图将在后续单独检查
      // 之前是使用 mini 网址检查的，但尺寸太小，最大 48px
      // 现在改为使用 small 网址检查，尺寸最大 540px，体积 60 kB 左右
      imageUrl: body.pageCount === 1 ? body.urls.small : undefined,
      userId: body.userId,
      xRestrict: body.xRestrict,
    }

    let checkResult = await filter.check(filterOpt)

    // 在多图作品里，第一张图片的颜色不能代表剩余的图片，所以需要检查每张图片的颜色
    // 注意两个色彩选项都启用时，过滤器不会进行色彩检查（任何图片都能通过），所以此时不需要检查
    let needCheckColor = !(settings.downColorImg && settings.downBlackWhiteImg)
    // 两个选项都未启用时，不检查，并且不保存这个作品
    if (!settings.downColorImg && !settings.downBlackWhiteImg) {
      needCheckColor = false
      checkResult = false
    }

    if (checkResult && needCheckColor && body.pageCount > 1) {
      // 首先确定要检查哪些图片
      let checkList: number[] = []
      if (downloadIndexes && downloadIndexes.length > 0) {
        checkList = downloadIndexes
      } else {
        // 与 Store 里的行为保持一致：先应用多图作品的索引过滤器（例如只下载前几张图片），再检查颜色
        // 因为下面会把 downloadIndexes 传给 Store，而 Store 只在没有收到 downloadIndexes 的时候才应用索引过滤器
        // 这就导致 Store 可能不会应用索引过滤器，而是直接使用 downloadIndexes 里的值。
        // 因此需要在这里先应用索引过滤器，之后就不需要 Store 再去应用了。
        checkList = Array.from({ length: body.pageCount }, (_, i) => i).filter(
          (index) =>
            checkIndexForMultiImageWork.check(
              index,
              body.pageCount,
              body.userId
            )
        )
      }

      // 多图作品的缩略图网址是把第一张图片的 _p0 替换成对应的序号
      // small 是每一张图片都有的缩略图尺寸，mini 和 thumb 只有第一张图片有
      const smallURL = body.urls.small
      if (!smallURL || !smallURL.includes('_p0')) {
        // 网址不符合预期时无法生成其他图片的网址，此时不进行检查
        console.error(`Unexpected thumbnail url: ${body.id} ${smallURL}`)
      } else if (checkList.length > 0) {
        // 储存通过颜色检查的图片索引
        const passList: number[] = []
        // 串行检查
        // 如果使用并行检查的话，会在短时间内加载大量缩略图，请求太密集，可能会导致账号被风控。
        for (const index of checkList) {
          const imageUrl = smallURL.replace('_p0', `_p${index}`)
          const result = await filter.checkBlackWhite(imageUrl)
          if (result) {
            passList.push(index)
          }
          await Utils.sleep(100) // 等待 100 毫秒，避免请求过于密集
        }

        // 如果没有图片通过颜色检查，就不保存这个作品
        if (passList.length === 0) {
          checkResult = false
        } else {
          // 如果有图片通过颜色检查，就只保留通过检查的图片索引
          downloadIndexes = passList
        }
      }
    }

    // 检查通过
    if (checkResult) {
      const idNum = parseInt(body.id)
      const title = body.title // 作品标题
      const userId = body.userId // 用户id
      const user = body.userName // 用户名
      const pageCount = body.pageCount
      const bookmarked = !!body.bookmarkData

      // 保存作品在排行榜上的编号
      const rankData = store.getRankList(body.id)
      const rank = rankData ? rankData : null

      // 系列标题和序号
      const seriesTitle = body.seriesNavData?.title || ''
      const seriesOrder = body.seriesNavData?.order || null

      // 保存作品信息
      const description = Utils.htmlDecode(body.description)

      if (body.illustType === 0 || body.illustType === 1) {
        // 插画或漫画
        const imgUrl = body.urls.original // 作品的原图 URL
        if (imgUrl === null) {
          log.error(`${Tools.createWorkLink(body.id)} URLs are null`)
          return
        }

        const tempExt = imgUrl.split('.')
        const ext = tempExt[tempExt.length - 1]

        store.addResult(
          {
            aiType,
            id: body.id,
            idNum: idNum,
            isOriginal: body.isOriginal,
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
            description: description,
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
          },
          downloadIndexes
        )
      } else if (body.illustType === 2) {
        // 动图
        // 获取动图的信息
        const meta = await API.getUgoiraMeta(body.id)
        // 动图帧延迟数据
        const ugoiraInfo = {
          frames: meta.body.frames,
          mime_type: meta.body.mime_type,
          originalThumbnail: body.urls.original,
        }

        let ext: string = 'zip'
        // 当下载动图的方形缩略图时，从它的 url 里获取图片的扩展名
        if (settings.imageSize === 'thumb') {
          const tempExt = body.urls.thumb.split('.')
          ext = tempExt[tempExt.length - 1]
        }

        store.addResult({
          aiType,
          id: body.id,
          idNum: idNum,
          isOriginal: body.isOriginal,
          pageCount: pageCount,
          // 对于动图，原图是原尺寸的 zip 文件
          // 普通和小图是相同的，是图片最大宽高为 600x600 的 zip 文件
          // 方形缩略图是静态缩略图
          original: meta.body.originalSrc,
          regular: meta.body.src,
          small: meta.body.src,
          thumb: body.urls.thumb,
          title: title,
          description: description,
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
