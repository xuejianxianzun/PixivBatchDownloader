import { lang } from '../Language'
import { log } from '../Log'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { blackAndWhiteImage } from './BlackandWhiteImage'
import { mute } from './Mute'
import { blockTagsForSpecificUser } from './BlockTagsForSpecificUser'
import { msgBox } from '../MsgBox'
import { workPublishTime } from './WorkPublishTime'
import { IDTypeString } from '../store/StoreType'
import { Config } from '../Config'
import { downloadRecord, DownloadRecordType } from '../download/DownloadRecord'
import { Utils } from '../utils/Utils'

/** 过滤选项，其中所有字段都是可选的 */
export interface FilterOption {
  /**是否为 AI 生成。0 未知 1 否 2 是 */
  aiType?: 0 | 1 | 2
  id?: number | string
  /**作品类型
   *
   * -1 插画、漫画、动图的合集。也就是只知道是图像作品，但是不能确定是哪种具体的类型
   *
   * 0 插画
   * 1 漫画
   * 2 动图
   * 3 小说
   * undefined 不能确定其类型，或者是系列小说这样不属于单个作品的类型
   */
  workType?: -1 | 0 | 1 | 2 | 3
  /** ID 类型。注意有可能是 novelSeries，一些过滤器不会检查这个类型 */
  IDTypeString?: IDTypeString
  pageCount?: number
  tags?: string[]
  bookmarkCount?: number
  /**是否已收藏。虽然可以传递对象，但在判断时只会判断是否为真 */
  bookmarkData?: any
  width?: number
  height?: number
  yes_rank?: number
  createDate?: string
  mini?: string
  size?: number
  userId?: string
  xRestrict?: 0 | 1 | 2
  title?: string
  seriesTitle?: string
  isOriginal?: boolean | null
}

// 检查作品是否符合过滤条件
class Filter {
  constructor() {}

  private wrongSetting = false

  /** 在日志里输出已启用的过滤选项。返回值表示是否有错误的设置，如果为 true，则不应该开始抓取 */
  public showTip(): boolean {
    this.wrongSetting = false
    this.getDownType()
    this.getDownTypeByAge()
    this.getAIWorkType()
    this.getOriginalType()
    this.getDownTypeByImgCount()
    this.getDownTypeByColor()
    this.getDownTypeByBmked()
    this.getMultiImageWorkImageLimit()
    this.getDownloadedWorks()
    this.getBMKNum()
    this.getSetWh()
    this.getRatio()
    this.getIdRange()
    this.getPostDate()
    this.getIncludeTag()
    this.getExcludeTag()
    this.getTitleInclude()
    this.getTitleExclude()
    this.getBlockList()
    this.getSize()

    if (states.debut) {
      log.warning(lang.transl('_抓取首次登场的作品Title'))
    }

    return this.wrongSetting
  }

  /**检查作品是否符合过滤器的要求，返回值 false 表示不保留这个作品，true 表示保留这个作品 */
  // 注意：这是一个异步函数，所以要使用 await 获取检查结果
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  // 每个过滤器函数里都必须检查参数为 undefined 的情况
  // 每个过滤器函数必须返回一个 boolean 值，true 表示保留这个作品，false 表示排除这个作品
  public async check(option: FilterOption): Promise<boolean> {
    // 检查下载的作品类型设置
    if (!this.checkDownType(option.workType)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_作品类型'),
        'excludeWorkByWorkType'
      )
      return false
    }

    if (!this.checkDownTypeByAge(option.xRestrict)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_年龄限制'),
        'excludeWorkByAge'
      )
      return false
    }

    if (!this.checkAIWorkType(option.aiType, option.tags)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_AI作品'),
        'excludeWorkByAIType'
      )
      return false
    }

    if (!this.checkOriginalType(option.isOriginal, option.tags)) {
      return false
    }

    // 检查单图、多图的下载
    if (!this.checkPageCount(option.workType, option.pageCount)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_图片数量'),
        'excludeWorkByPageCount'
      )
      return false
    }

    // 检查多图作品的图片数量限制
    if (
      !this.checkMultiImageWorkImageLimit(option.workType, option.pageCount)
    ) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_多图作品的图片数量上限'),
        'excludeWorkByMultiImageWorkImageLimit'
      )
      return false
    }

    // 检查收藏和未收藏的要求
    if (!this.checkDownTypeByBmked(option.bookmarkData)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_收藏状态'),
        'excludeWorkByAge'
      )
      return false
    }

    // 检查收藏数要求
    if (!this.checkBMK(option.bookmarkCount, option.createDate)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_收藏数量'),
        'excludeWorkByBookmarkCount'
      )
      return false
    }

    // 检查要排除的 tag
    if (!this.checkExcludeTag(option.tags)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_不能含有tag'),
        'excludeWorkByExcludeTag'
      )
      return false
    }

    // 检查必须包含的 tag
    if (!this.checkIncludeTag(option.tags)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_必须含有tag'),
        'excludeWorkByIncludeTag'
      )
      return false
    }

    if (!this.checkExcludeTitle(option.title)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_标题不能含有'),
        'excludeWorkByExcludeTitle'
      )
      return false
    }

    if (!this.checkExcludeSeriesTitle(option.seriesTitle)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_系列标题不能含有'),
        'excludeWorkByExcludeSeriesTitle'
      )
      return false
    }

    if (!this.checkIncludeTitle(option.title)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_标题必须含有'),
        'excludeWorkByIncludeTitle'
      )
      return false
    }

    // 检查宽高设置
    if (!this.checkWidthHeight(option.width, option.height)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_图片的宽高'),
        'excludeWorkByWidthHeight'
      )
      return false
    }

    // 检查宽高比设置
    if (!this.checkRatio(option.width, option.height)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_图片的宽高比例'),
        'excludeWorkByRatio'
      )
      return false
    }

    // 检查 id 范围设置
    if (!this.checkIdRange(option.id, option.IDTypeString)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_id范围'),
        'excludeWorkByIdRange'
      )
      return false
    }

    // 检查用户在 Pixiv 的屏蔽设定
    if (!(await this.checkMuteUser(option.userId))) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_你屏蔽了这个用户'),
        'excludeWorkByMuteUser'
      )
      return false
    }

    if (!(await this.checkMuteTag(option.tags))) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_你屏蔽了它的标签'),
        'excludeWorkByMuteTag'
      )
      return false
    }

    // 检查用户阻止名单
    if (!this.checkBlockList(option.userId)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_用户阻止名单'),
        'excludeWorkByBlockList'
      )
      return false
    }

    // 检查针对特定用户屏蔽的 tags
    if (!this.checkBlockTagsForSpecificUser(option.userId, option.tags)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_针对特定用户屏蔽tag'),
        'excludeWorkByBlockTagsForSpecificUser'
      )
      return false
    }

    // 检查投稿时间设置
    if (!this.checkPostDate(option.createDate)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_投稿时间'),
        'excludeWorkByPostDate'
      )
      return false
    }

    // 检查投稿时间设置
    if (!this.checkIdPublishTime(option.id, option.IDTypeString)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_投稿时间'),
        'excludeWorkByPostDate'
      )
      return false
    }

    // 检查首次登场设置
    if (!this.checkDebut(option.yes_rank)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_它不是首次登场的作品'),
        'excludeWorkByDebut'
      )
      return false
    }

    // 检查这个作品是否下载过
    if (!(await this.checkDownloadedWorks(option.id, option.IDTypeString))) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') +
          lang.transl('_不抓取下载过的作品'),
        'excludeWorkByDownloadedWorks'
      )
      return false
    }

    // 检查文件体积设置
    if (!this.checkFileSize(option.size)) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_文件体积限制'),
        'excludeWorkByFileSize'
      )
      return false
    }

    // 检查黑白图片
    // 这一步需要加载图片，需要较长的时间，较多的资源占用，所以放到最后检查
    if (!(await this.checkBlackWhite(option.mini))) {
      log.warning(
        lang.transl('_下载器排除了一些作品原因') + lang.transl('_图片色彩'),
        'excludeWorkByBlackWhite'
      )
      return false
    }

    return true
  }

  // ---------------- get ----------------

  /** 提示下载的作品类型设置 */
  private getDownType() {
    // 如果全部排除则取消任务
    if (
      !settings.downType0 &&
      !settings.downType1 &&
      !settings.downType2 &&
      !settings.downType3
    ) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_作品类型')
      )
    }

    const tips = []
    !settings.downType0 && tips.push(lang.transl('_插画'))
    !settings.downType1 && tips.push(lang.transl('_漫画'))
    !settings.downType2 && tips.push(lang.transl('_动图'))
    !settings.downType3 && tips.push(lang.transl('_小说'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  private getDownTypeByAge() {
    // 如果全部排除则取消任务
    if (!settings.downAllAges && !settings.downR18 && !settings.downR18G) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_年龄限制')
      )
    }

    const tips = []
    !settings.downAllAges && tips.push(lang.transl('_全年龄'))
    !settings.downR18 && tips.push('R-18')
    !settings.downR18G && tips.push('R-18G')

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  private getAIWorkType() {
    // 如果全部排除则取消任务
    if (
      !settings.AIGenerated &&
      !settings.notAIGenerated &&
      !settings.UnknownAI
    ) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_AI作品')
      )
    }

    const tips = []
    !settings.AIGenerated && tips.push(lang.transl('_AI生成'))
    !settings.notAIGenerated && tips.push(lang.transl('_非AI生成'))
    !settings.UnknownAI && tips.push(lang.transl('_未知') + '(AI)')

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  private getOriginalType() {
    // 如果全部排除则取消任务
    if (!settings.crawlOriginalWork && !settings.crawlNonOriginalWork) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_原创作品')
      )
    }

    const tips = []
    !settings.crawlOriginalWork && tips.push(lang.transl('_原创'))
    !settings.crawlNonOriginalWork && tips.push(lang.transl('_非原创'))
    !settings.looseMatchOriginal && tips.push(lang.transl('_宽松匹配'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  private getDownTypeByImgCount() {
    // 如果全部排除则取消任务
    if (!settings.downSingleImg && !settings.downMultiImg) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_图片数量')
      )
    }

    const tips = []
    !settings.downSingleImg && tips.push(lang.transl('_单图作品'))
    !settings.downMultiImg && tips.push(lang.transl('_多图作品'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  /** 提示图像颜色设置 */
  private getDownTypeByColor() {
    // 如果全部排除则取消任务
    if (!settings.downColorImg && !settings.downBlackWhiteImg) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_图片色彩')
      )
    }

    const tips = []
    !settings.downColorImg && tips.push(lang.transl('_彩色图片'))
    !settings.downBlackWhiteImg && tips.push(lang.transl('_黑白图片'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  /** 提示下载收藏和未收藏作品的设置 */
  private getDownTypeByBmked() {
    // 如果全部排除则取消任务
    if (!settings.downNotBookmarked && !settings.downBookmarked) {
      return this.error(
        lang.transl('_排除了所有作品类型') + ': <br>' + lang.transl('_收藏状态')
      )
    }

    const tips = []
    !settings.downNotBookmarked && tips.push(lang.transl('_未收藏'))
    !settings.downBookmarked && tips.push(lang.transl('_已收藏'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.join(', '))
    }
  }

  /** 提示多图作品的图片数量限制 */
  private getMultiImageWorkImageLimit() {
    if (!settings.multiImageWorkImageLimitSwitch) {
      return
    }

    if (settings.multiImageWorkImageLimit > 0) {
      log.warning(
        lang.transl('_多图作品的图片数量上限') +
          '：' +
          settings.multiImageWorkImageLimit
      )
    }
  }

  /** 提示必须包含的tag */
  private getIncludeTag() {
    if (!settings.needTagSwitch) {
      return
    }

    if (settings.needTag.length > 0) {
      log.warning(
        lang.transl('_设置了必须tag之后的提示') + settings.needTag.toString()
      )
    }
  }

  /** 提示要排除的tag */
  private getExcludeTag() {
    if (!settings.notNeedTagSwitch) {
      return
    }

    if (settings.notNeedTag.length > 0) {
      log.warning(
        lang.transl('_设置了排除tag之后的提示') + settings.notNeedTag.toString()
      )
    }
  }

  /** 提示标题必须包含 */
  private getTitleInclude() {
    if (!settings.titleIncludeSwitch) {
      return
    }

    if (settings.titleIncludeList.length > 0) {
      log.warning(
        lang.transl('_标题必须含有') +
          ': ' +
          settings.titleIncludeList.join(',')
      )
    }
  }

  /** 提示标题不能包含 */
  private getTitleExclude() {
    if (!settings.titleExcludeSwitch) {
      return
    }

    if (settings.titleExcludeList.length > 0) {
      log.warning(
        lang.transl('_标题不能含有') +
          ': ' +
          settings.titleExcludeList.join(',')
      )
    }
  }

  /** 提示宽高设置 */
  private getSetWh() {
    if (!settings.setWHSwitch) {
      return
    }

    if (settings.setWidth || settings.setHeight) {
      const andOr = settings.setWidthAndOr
        .replace('|', lang.transl('_或者'))
        .replace('&', lang.transl('_并且'))
      const text = `${lang.transl('_宽度')} ${settings.widthHeightLimit} ${
        settings.setWidth
      } ${andOr} ${lang.transl('_高度')} ${settings.widthHeightLimit} ${
        settings.setHeight
      }`
      log.warning(text)
    }
  }

  /** 提示不抓取下载过的作品 */
  private getDownloadedWorks() {
    if (!settings.DonotCrawlAlreadyDownloadedWorks) {
      return
    }

    log.warning(lang.transl('_不抓取下载过的作品'))
  }

  /** 提示输入的收藏数 */
  private getBMKNum() {
    if (!settings.BMKNumSwitch) {
      return
    }

    const min = settings.BMKNumMin
    const max = settings.BMKNumMax
    const average = settings.BMKNumAverage

    if (min >= 0) {
      log.warning(lang.transl('_收藏数大于') + min)
    }

    if (max >= 0) {
      log.warning(lang.transl('_收藏数小于') + max)
    }

    if (average >= 0 && settings.BMKNumAverageSwitch) {
      log.warning(`${lang.transl('_日均收藏数量')} >= ${average}`)
    }
  }

  /** 提示宽高比设置 */
  private getRatio() {
    if (!settings.ratioSwitch) {
      return
    }

    switch (settings.ratio) {
      case 'square':
        log.warning(
          lang.transl('_设置了宽高比之后的提示', lang.transl('_正方形'))
        )
        break
      case 'horizontal':
        log.warning(
          lang.transl('_设置了宽高比之后的提示', lang.transl('_横图'))
        )
        break
      case 'vertical':
        log.warning(
          lang.transl('_设置了宽高比之后的提示', lang.transl('_竖图'))
        )
        break
      case 'userSet':
        log.warning(
          lang.transl('_宽高比') +
            ` ${settings.userRatioLimit} ` +
            settings.userRatio
        )
        break
    }
  }

  /** 提示 id 范围设置 */
  private getIdRange() {
    if (!settings.idRangeSwitch) {
      return
    }

    const array: string[] = []
    array.push(lang.transl('_id范围') + ': ')
    array.push(
      lang.transl('_图像作品') +
        ' ' +
        settings.idRangeComparisonForImageWorks +
        ' ' +
        settings.idRangeValueForImageWorks +
        ','
    )
    array.push(
      lang.transl('_小说') +
        ' ' +
        settings.idRangeComparisonForNovelWorks +
        ' ' +
        settings.idRangeValueForNovelWorks +
        ','
    )
    array.push(
      lang.transl('_系列小说') +
        ' ' +
        settings.idRangeComparisonForNovelSeries +
        ' ' +
        settings.idRangeValueForNovelSeries
    )
    log.warning(array.join(' '))
  }

  /** 提示投稿时间设置 */
  private getPostDate() {
    if (!settings.postDate) {
      return
    }

    if (isNaN(settings.postDateStart) || isNaN(settings.postDateStart)) {
      this.error(
        lang.transl('_日期时间格式错误') + ': <br>' + lang.transl('_投稿时间')
      )
    } else {
      const start = new Date(settings.postDateStart).toLocaleString()
      const end = new Date(settings.postDateEnd).toLocaleString()
      log.warning(`${lang.transl('_时间范围')}: ${start} - ${end}`)
    }
  }

  /** 提示文件体积设置 */
  private getSize() {
    if (!settings.sizeSwitch) {
      return
    }

    log.warning(
      `${lang.transl('_文件体积限制')}: ${settings.sizeMin}MiB - ${settings.sizeMax}MiB`
    )
  }

  private getBlockList() {
    if (!settings.userBlockList) {
      return
    }

    for (const uid of settings.blockList) {
      if (isNaN(Number.parseInt(uid))) {
        return this.error(
          lang.transl('_用户ID必须是数字') +
            ': <br>' +
            lang.transl('_用户阻止名单')
        )
      }
    }

    if (settings.blockList.length > 0) {
      log.warning(
        lang.transl('_用户阻止名单') + ': ' + settings.blockList.toString()
      )
    }
  }

  // ---------------- check ----------------

  /** 检查下载的作品类型设置 */
  private checkDownType(workType: FilterOption['workType']) {
    switch (workType) {
      case -1:
        return settings.downType0 || settings.downType1 || settings.downType2
      case 0:
        return settings.downType0
      case 1:
        return settings.downType1
      case 2:
        return settings.downType2
      case 3:
        return settings.downType3
      default:
        return true
    }
  }

  private checkDownTypeByAge(xRestrict?: FilterOption['xRestrict']) {
    switch (xRestrict) {
      case 0:
        return settings.downAllAges
      case 1:
        return settings.downR18
      case 2:
        return settings.downR18G
      default:
        return true
    }
  }

  private checkAIWorkType(
    aiType?: FilterOption['aiType'],
    tags?: FilterOption['tags']
  ) {
    if (tags?.includes('AI生成')) {
      return settings.AIGenerated
    }

    switch (aiType) {
      case 0:
        return settings.UnknownAI
      case 1:
        return settings.notAIGenerated
      case 2:
        return settings.AIGenerated
      default:
        return true
    }
  }

  /** 检查多图作品的图片数量限制 */
  private checkMultiImageWorkImageLimit(
    workType: FilterOption['workType'],
    pageCount: FilterOption['pageCount']
  ) {
    // 此过滤条件只检查插画和漫画，只对多图作品生效。如果图片数量小于 2 则不检查
    if (
      !settings.multiImageWorkImageLimitSwitch ||
      settings.multiImageWorkImageLimit < 1 ||
      pageCount === undefined ||
      pageCount < 2 ||
      workType === undefined ||
      workType === 2 ||
      workType === 3
    ) {
      return true
    }

    // 如果作品类型是 0 1 -1 中的一个，并且图片数量大于等于 2，则检查图片数量是否在设置的限制范围内
    return pageCount <= settings.multiImageWorkImageLimit
  }

  /** 依据图片数量，检查下载的作品类型 */
  private checkPageCount(
    workType: FilterOption['workType'],
    pageCount: FilterOption['pageCount']
  ) {
    if (workType === undefined || pageCount === undefined) {
      return true
    }

    // 将动图视为单图
    if (workType === 2) {
      pageCount = 1
    }

    if (pageCount === 1) {
      return settings.downSingleImg
    }

    if (pageCount > 1) {
      return settings.downMultiImg
    }

    return false
  }

  /** 检查过滤黑白图像设置 */
  private async checkBlackWhite(imgUrl: FilterOption['mini']) {
    // 如果没有图片网址，或者没有排除任何一个选项，则不检查
    if (!imgUrl || (settings.downColorImg && settings.downBlackWhiteImg)) {
      return true
    }

    // result 为 true，表示它是黑白图片，false 是彩色图片
    const result = await blackAndWhiteImage.check(imgUrl)

    return (
      (result && settings.downBlackWhiteImg) ||
      (!result && settings.downColorImg)
    )
  }

  /** 检查原创作品条件 */
  private checkOriginalType(
    isOriginal: FilterOption['isOriginal'],
    tags: FilterOption['tags']
  ) {
    // 如果没有传递 isOriginal，或者没有排除任何一个选项，则不检查
    if (
      isOriginal === undefined ||
      (settings.crawlOriginalWork && settings.crawlNonOriginalWork)
    ) {
      return true
    }

    // 检查作品是否是原创作品
    let _original: boolean | undefined = undefined

    // 如果 isOriginal 是 true，则说明它是原创作品
    if (isOriginal) {
      _original = true
    } else {
      // isOriginal 不是 true
      // 如果启用了宽松匹配，则从 tags 检查是否含有特定标签，如果有的话也认为它是原创作品
      if (settings.looseMatchOriginal && tags) {
        // 因为有些作品虽然没有被标记为原创作品，但在标签里会标记为原创，这些作品也应该算作原创作品。例如：
        // https://www.pixiv.net/artworks/142565679
        for (const tag of tags) {
          if (Config.originalTags.includes(tag)) {
            _original = true
            break
          }
        }
      } else {
        // 如果没有启用宽松匹配
        if (isOriginal === false) {
          _original = false
        } else {
          // 如果是 null，则保留它，因为此时无法判断它是否是原创作品
          return true
        }
      }
    }

    if (_original) {
      if (!settings.crawlOriginalWork) {
        log.warning(
          lang.transl('_下载器排除了一些作品原因') +
            lang.transl('_它是原创作品'),
          'excludeWorkByOriginalType1'
        )
      }
      return settings.crawlOriginalWork
    } else {
      if (!settings.crawlNonOriginalWork) {
        log.warning(
          lang.transl('_下载器排除了一些作品原因') +
            lang.transl('_它是非原创作品'),
          'excludeWorkByOriginalType2'
        )
      }
      return settings.crawlNonOriginalWork
    }
  }

  /** 检查作品是否符合已收藏、未收藏作品的设置 */
  private checkDownTypeByBmked(bookmarked: any) {
    // 如果没有参数，或者都没有排除
    if (bookmarked === undefined) {
      return true
    }

    if (settings.downNotBookmarked && settings.downBookmarked) {
      return true
    }

    if (!settings.downNotBookmarked && settings.downBookmarked) {
      // 只下载已收藏
      return !!bookmarked
    } else if (settings.downNotBookmarked && !settings.downBookmarked) {
      // 只下载未收藏
      return !bookmarked
    }

    return false
  }

  private readonly oneDayTime = 24 * 60 * 60 * 1000 // 一天的毫秒数
  private readonly minimumTime = 4 * 60 * 60 * 1000 // 检查日均收藏数量时，要求作品发表之后经过的时间大于这个值。因为发表之后经过时间很短的作品，其日均收藏数量非常不可靠，所以对于小于这个值的作品不进行日均收藏数量的检查。

  /** 检查收藏数要求 */
  private checkBMK(
    bmk: FilterOption['bookmarkCount'],
    date: FilterOption['createDate']
  ) {
    if (bmk === undefined || !settings.BMKNumSwitch) {
      return true
    }

    // 检查收藏数量是否达到设置的最大值、最小值范围
    const checkNumber = bmk >= settings.BMKNumMin && bmk <= settings.BMKNumMax

    // 如果没有设置检查日均收藏，就直接返回收藏数量的检查结果
    if (!settings.BMKNumAverageSwitch || date === undefined) {
      return checkNumber
    }

    // 检查日均收藏
    const createTime = new Date(date).getTime()
    const nowTime = Date.now()

    // 如果作品发表时间太短（小于 4 小时）
    if (nowTime - createTime < this.minimumTime) {
      // 如果 4 小时里的收藏数量已经达到要求，则保留这个作品
      // 如果 4 小时里的收藏数量没有达到要求，则不检查继续它的日均收藏数量，返回收藏数量的检查结果
      return bmk >= settings.BMKNumAverage ? true : checkNumber
    }

    const day = (nowTime - createTime) / this.oneDayTime // 计算作品发表以来的天数
    const average = bmk / day
    const checkAverage = average >= settings.BMKNumAverage

    // 返回结果。收藏数量和日均收藏并不互斥，两者只要有一个满足条件就会保留这个作品
    return checkNumber || checkAverage
  }

  /** 检查作品是否符合包含 tag 的条件。返回值表示是否保留这个作品。 */
  private checkIncludeTag(tags: FilterOption['tags']) {
    if (
      !settings.needTagSwitch ||
      settings.needTag.length === 0 ||
      tags === undefined
    ) {
      return true
    }

    let result = false
    // 把设置的包含的 tag 转换成小写，生成数组
    const needTags = settings.needTag.map((val) => {
      return val.toLowerCase()
    })

    // 如果设置了必须的 tag
    if (needTags.length > 0) {
      // 把处理的 tag 变成小写，并且去重
      // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
      const workTags: Set<string> = new Set()
      for (const tag of tags) {
        workTags.add(tag.toLowerCase())
      }

      // 全部包含
      if (settings.needTagMode === 'all') {
        let tagNeedMatched = 0
        for (const tag of workTags) {
          for (const need of needTags) {
            if (tag === need) {
              tagNeedMatched++
              break
            }
          }
        }

        // 如果全部匹配
        if (tagNeedMatched >= needTags.length) {
          result = true
        }
      } else {
        // 包含任意一个
        for (const tag of workTags.values()) {
          if (needTags.includes(tag)) {
            result = true
            break
          }
        }
      }
    } else {
      result = true
    }

    return result
  }

  /** 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否保留这个作品。 */
  private checkExcludeTag(tags: FilterOption['tags']) {
    if (
      !settings.notNeedTagSwitch ||
      settings.notNeedTag.length === 0 ||
      tags === undefined
    ) {
      return true
    }

    const notNeedTags = settings.notNeedTag.map((str) => str.toLowerCase())

    for (const tag of tags) {
      for (const notNeed of notNeedTags) {
        // 部分匹配
        if (settings.tagMatchMode === 'partial') {
          if (tag.toLowerCase().includes(notNeed)) {
            // 如果检查到了排除的 tag，进行复查

            // 使用空格对 tag 进行分词，尝试提高准确率
            // 例如：用户本意是排除腐向作品（bl），但是如果作品的 tag 是 Strike the Blood 或者 Blue Poison 都会导致作品被排除。这是错误的。
            // 所以在有分词的情况下，应当对分词进行全等匹配以提高准确度
            const words = tag.split(' ')
            if (words.length > 1) {
              // 如果 tag 有空格，依次使用每个分词进行全词匹配。如果有任一一个 tag 被匹配到则排除这个作品
              if (words.some((word) => word.toLowerCase() === notNeed)) {
                return false
              }
            } else {
              // 如果 tag 没有空格，直接返回结果
              return false
            }
          }
        } else {
          // 全词匹配
          if (tag.toLowerCase() === notNeed) {
            return false
          }
        }
      }
    }

    return true
  }

  /** 检查作品标题是否含有不能包含的字符 */
  private checkExcludeTitle(title: FilterOption['title']) {
    if (
      !settings.titleExcludeSwitch ||
      settings.titleExcludeList.length === 0 ||
      !title
    ) {
      return true
    }

    for (const word of settings.titleExcludeList) {
      if (title.includes(word.toLowerCase())) {
        return false
      }
    }

    return true
  }

  /** 检查系列标题是否含有必须的字符 */
  private checkExcludeSeriesTitle(seriesTitle: FilterOption['seriesTitle']) {
    if (
      !settings.alsoCheckSeriesTitle ||
      !settings.titleExcludeSwitch ||
      settings.titleExcludeList.length === 0 ||
      !seriesTitle
    ) {
      return true
    }

    for (const word of settings.titleExcludeList) {
      if (seriesTitle.includes(word.toLowerCase())) {
        return false
      }
    }

    return true
  }

  /** 检查作品标题是否含有必须的字符 */
  private checkIncludeTitle(title: FilterOption['title']) {
    if (
      !settings.titleIncludeSwitch ||
      settings.titleIncludeList.length === 0 ||
      !title
    ) {
      return true
    }

    for (const word of settings.titleIncludeList) {
      if (title.includes(word.toLowerCase())) {
        return true
      }
    }

    return false
  }

  /** 检查作品是否符合过滤宽高的条件 */
  private checkWidthHeight(
    width: FilterOption['width'],
    height: FilterOption['height']
  ) {
    if (
      !settings.setWHSwitch ||
      width === undefined ||
      height === undefined ||
      width === 0 ||
      height === 0
    ) {
      return true
    }

    const setWidth = settings.setWidth
    const setHeight = settings.setHeight

    // 未设置宽高，或者设置的宽高都不合法
    if (setWidth === 0 && setHeight === 0) {
      return true
    }

    if (settings.widthHeightLimit === '>=') {
      // 大于等于
      if (settings.setWidthAndOr === '&') {
        return width >= setWidth && height >= setHeight
      } else {
        return width >= setWidth || height >= setHeight
      }
    } else if (settings.widthHeightLimit === '<=') {
      // 小于等于
      if (settings.setWidthAndOr === '&') {
        return width <= setWidth && height <= setHeight
      } else {
        return width <= setWidth || height <= setHeight
      }
    } else {
      // 精确等于
      if (settings.setWidthAndOr === '&') {
        return width === setWidth && height === setHeight
      } else {
        return width === setWidth || height === setHeight
      }
    }
  }

  /** 检查作品是否符合宽高比条件 */
  private checkRatio(
    width: FilterOption['width'],
    height: FilterOption['height']
  ) {
    if (
      !settings.ratioSwitch ||
      width === undefined ||
      height === undefined ||
      width === 0 ||
      height === 0
    ) {
      return true
    }

    switch (settings.ratio) {
      case 'square':
        return width === height
      case 'horizontal':
        return width / height > 1
      case 'vertical':
        return width / height < 1
      case 'userSet':
        switch (settings.userRatioLimit) {
          case '>=':
            return width / height >= settings.userRatio
          case '=':
            return width / height === settings.userRatio
          case '<=':
            return width / height <= settings.userRatio
        }
    }
  }

  /** 检查 id 范围设置 */
  private checkIdRange(
    id: FilterOption['id'],
    type: FilterOption['IDTypeString']
  ) {
    if (!settings.idRangeSwitch || id === undefined || !type) {
      return true
    }

    if (typeof id === 'string') {
      id = Number.parseInt(id)
    }

    if (type === 'illusts' || type === 'manga' || type === 'ugoira') {
      if (settings.idRangeComparisonForImageWorks === '>') {
        return id > settings.idRangeValueForImageWorks
      } else {
        return id < settings.idRangeValueForImageWorks
      }
    } else if (type === 'novels') {
      if (settings.idRangeComparisonForNovelWorks === '>') {
        return id > settings.idRangeValueForNovelWorks
      } else {
        return id < settings.idRangeValueForNovelWorks
      }
    } else if (type === 'novelSeries') {
      if (settings.idRangeComparisonForNovelSeries === '>') {
        return id > settings.idRangeValueForNovelSeries
      } else {
        return id < settings.idRangeValueForNovelSeries
      }
    }

    return true
  }

  /** 检查投稿时间设置 */
  private checkPostDate(date: FilterOption['createDate']) {
    if (!settings.postDate || date === undefined) {
      return true
    }

    const time = new Date(date).getTime()
    return time >= settings.postDateStart && time <= settings.postDateEnd
  }

  private checkIdPublishTime(
    id: FilterOption['id'],
    type: FilterOption['IDTypeString']
  ) {
    if (
      id === undefined ||
      !settings.postDate ||
      !type ||
      type === 'novelSeries'
    ) {
      return true
    }

    const _id = Number.parseInt(id as string)
    const _type = type === 'novels' ? 'novels' : 'illusts'
    const range = workPublishTime.getTimeRange(_id, _type)
    // console.log(new Date(range[0]).toLocaleString())
    // console.log(new Date(range[1]).toLocaleString())

    // 如果返回的数据中的开始时间大于用户设置的结束时间，则检查不通过
    // 如果返回的数据中的结束时间小于用户设置的开始时间，则检查不通过
    if (range[0] > settings.postDateEnd || range[1] < settings.postDateStart) {
      return false
    }

    // 如果两条记录的时间差大于用户设置的时间差，此时的数据不可采信。将其通过
    if (range[1] - range[0] >= settings.postDateEnd - settings.postDateStart) {
      return true
    }

    // 如果两条记录的时间范围与用户设置的时间范围只有部分重叠，此时的数据不可采信。将其通过
    if (
      range[0] < settings.postDateStart &&
      range[1] > settings.postDateStart &&
      range[1] < settings.postDateEnd
    ) {
      return true
    }
    if (
      range[0] > settings.postDateStart &&
      range[0] < settings.postDateEnd &&
      range[1] > settings.postDateEnd
    ) {
      return true
    }

    // 达到这里的数据是可信的，不会发生误判
    return (
      range[0] >= settings.postDateStart && range[1] <= settings.postDateEnd
    )
  }

  // 检查首次登场设置
  // yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
  private checkDebut(yes_rank: FilterOption['yes_rank']) {
    if (!states.debut || yes_rank === undefined) {
      return true
    }

    return yes_rank === 0
  }

  private checkBlockList(userId: FilterOption['userId']) {
    if (!settings.userBlockList || userId === undefined) {
      return true
    }

    // 如果阻止名单里有这个用户 id，则返回 false 表示阻止这个作品
    return !settings.blockList.includes(userId)
  }

  private readonly MiB = 1024 * 1024
  /** 检查文件体积 */
  private checkFileSize(size: FilterOption['size']) {
    if (!settings.sizeSwitch || size === undefined) {
      return true
    }
    return (
      size >= settings.sizeMin * this.MiB && size <= settings.sizeMax * this.MiB
    )
  }

  private async checkMuteUser(userId: FilterOption['userId']) {
    if (userId === undefined) {
      return true
    }
    return !(await mute.checkUser(userId))
  }

  private async checkMuteTag(tags: FilterOption['tags']) {
    if (tags === undefined) {
      return true
    }

    // 一旦检查到某个 tag 存在于 mute 列表里，就排除这个作品
    for (const tag of tags) {
      if (await mute.checkTag(tag)) {
        return false
      }
    }

    return true

    // return !(tags.some((mute.checkTag.bind(mute))))
  }

  private checkBlockTagsForSpecificUser(
    userId: FilterOption['userId'],
    tags: FilterOption['tags']
  ) {
    if (
      !settings.blockTagsForSpecificUser ||
      userId === undefined ||
      tags === undefined
    ) {
      return true
    }

    // 对结果取反
    return !blockTagsForSpecificUser.check(userId, tags)
  }

  /** 检查这个作品是否存在下载记录，并决定是否要跳过它 */
  // 不会检查系列小说，因为下载器没有保存系列小说的下载记录
  // 注意：这个检查只应该在抓取阶段进行；在抓取之后保存作品数据和下载阶段不应该检查它。因为在下载时检查它的话就相当于启用了“不下载重复文件”。目前后续阶段调用过滤器时没有传递 IDTypeString 选项，所以没有影响。
  private async checkDownloadedWorks(
    id: FilterOption['id'],
    type: FilterOption['IDTypeString']
  ): Promise<boolean> {
    if (
      !settings.DonotCrawlAlreadyDownloadedWorks ||
      !id ||
      !type ||
      type === 'novelSeries'
    ) {
      return true
    }

    // 插画、漫画需要在 id 后面添加 _p0 来查询下载记录。动图、小说直接使用 id 查询即可
    // 但实际上在抓取图像作品时，这里接收到的类型往往不是精确的分类，而是笼统的 illusts，所以无法准确判断
    // 例如：动图在这里传递的类型通常是 illusts，此时不应该添加 _p0
    let record: DownloadRecordType | null
    if (type === 'ugoira' || type === 'novels') {
      // 动图和小说使用 id 查询
      record = await downloadRecord.getRecord(id.toString())
    } else {
      // 其他情况，可能是插画、漫画、动图
      // 先添加 _p0 查询，这符合大部分情况
      record = await downloadRecord.getRecord(id + '_p0')
      if (record === null) {
        // 如果查询不到，则使用 id 再查询一次
        record = await downloadRecord.getRecord(id.toString())
      }
    }
    // console.log(id, type)
    // console.log('download record', record)
    // 如果没有记录，则抓取这个作品
    if (record === null) {
      return true
    }

    // 虽然下载记录里没有区分小说和图像作品，但可以通过扩展名判断是不是小说文件
    // 如果没有文件名，就无法判断作品类型，此时不抓取它
    if (!record.n) {
      return false
    }

    const ext = Utils.getExtension(record.n)
    // 没有扩展名时，无法判断作品类型
    if (!ext) {
      return false
    }

    if (Config.novelExtensions.includes(ext)) {
      // 这是小说的记录，如果传入的类型也是小说，则是完全匹配
      return !(type === 'novels')
    } else {
      // 这是图像作品的记录，如果传入的类型不是小说，则是完全匹配
      return !(type !== 'novels')
    }
  }

  /** 如果设置项的值不合法，显示提示 */
  private error(msg: string) {
    this.wrongSetting = true
    log.error(msg.replace('<br>', ''))
    msgBox.error(msg, {
      title: lang.transl('_抓取条件不正确'),
    })
  }
}

const filter = new Filter()
export { filter }
