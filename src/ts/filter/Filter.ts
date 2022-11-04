import { lang } from '../Lang'
import { log } from '../Log'
import { EVT } from '../EVT'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { blackAndWhiteImage } from './BlackandWhiteImage'
import { mute } from './Mute'
import { blockTagsForSpecificUser } from './BlockTagsForSpecificUser'
import { msgBox } from '../MsgBox'
import { workPublishTime } from './WorkPublishTime'
import { WorkTypeString } from '../store/StoreType'

/** 过滤选项，其中所有字段都是可选的 */
export interface FilterOption {
  id?: number | string
  workType?: 0 | 1 | 2 | 3
  workTypeString?: WorkTypeString
  pageCount?: number
  tags?: string[]
  bookmarkCount?: number
  bookmarkData?: any
  width?: number
  height?: number
  yes_rank?: number
  createDate?: string
  mini?: string
  size?: number
  userId?: string
  xRestrict?: 0 | 1 | 2
}

// 检查作品是否符合过滤条件
class Filter {
  constructor() {
    this.bindEvents()
  }

  // 对启用了的过滤选项输出提示
  private showTip() {
    this.getDownType()
    this.getDownTypeByAge()
    this.getDownTypeByImgCount()
    this.getDownTypeByColor()
    this.getDownTypeByBmked()

    this.getMultiImageWorkImageLimit()

    this.getBMKNum()

    this.getSetWh()

    this.getRatio()

    this.getIdRange()

    this.getPostDate()

    this.getIncludeTag()

    this.getExcludeTag()

    if (states.debut) {
      log.warning(lang.transl('_抓取首次登场的作品Title'))
    }

    this.getBlockList()

    this.getSize()
  }

  // 检查作品是否符合过滤器的要求
  // 注意：这是一个异步函数，所以要使用 await 获取检查结果
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  // 每个过滤器函数里都必须检查参数为 undefined 的情况
  // 每个过滤器函数必须返回一个 boolean 值，true 表示保留这个作品，false 表示排除这个作品
  public async check(option: FilterOption): Promise<boolean> {
    // 检查下载的作品类型设置
    if (!this.checkDownType(option.workType)) {
      return false
    }

    if (!this.checkDownTypeByAge(option.xRestrict)) {
      return false
    }

    // 检查单图、多图的下载
    if (!this.checkPageCount(option.workType, option.pageCount)) {
      return false
    }

    // 检查单图、多图的下载
    if (
      !this.checkMultiImageWorkImageLimit(option.workType, option.pageCount)
    ) {
      return false
    }

    // 检查收藏和未收藏的要求
    if (!this.checkDownTypeByBmked(option.bookmarkData)) {
      return false
    }

    // 检查收藏数要求
    if (!this.checkBMK(option.bookmarkCount, option.createDate)) {
      return false
    }

    // 检查要排除的 tag
    if (!this.checkExcludeTag(option.tags)) {
      return false
    }

    // 检查必须包含的 tag
    if (!this.checkIncludeTag(option.tags)) {
      return false
    }

    // 检查宽高设置
    if (!this.checkWidthHeight(option.width, option.height)) {
      return false
    }

    // 检查宽高比设置
    if (!this.checkRatio(option.width, option.height)) {
      return false
    }

    // 检查 id 范围设置
    if (!this.checkIdRange(option.id)) {
      return false
    }

    // 检查用户在 Pixiv 的屏蔽设定
    if (!(await this.checkMuteUser(option.userId))) {
      return false
    }
    if (!(await this.checkMuteTag(option.tags))) {
      return false
    }

    // 检查用户阻止名单
    if (!this.checkBlockList(option.userId)) {
      return false
    }

    // 检查针对特定用户屏蔽的 tags
    if (!this.checkBlockTagsForSpecificUser(option.userId, option.tags)) {
      return false
    }

    // 检查投稿时间设置
    if (!this.checkPostDate(option.createDate)) {
      return false
    }

    // 检查投稿时间设置
    if (!this.checkIdPublishTime(option.id, option.workTypeString)) {
      return false
    }

    // 检查首次登场设置
    if (!this.checkDebut(option.yes_rank)) {
      return false
    }

    // 检查文件体积设置
    if (!this.checkSize(option.size)) {
      return false
    }

    // 检查黑白图片
    // 这一步需要加载图片，需要较长的时间，较多的资源占用，所以放到最后检查
    if (!(await this.checkBlackWhite(option.mini))) {
      return false
    }

    return true
  }

  // ---------------- get ----------------

  // 提示下载的作品类型设置
  private getDownType() {
    // 如果全部排除则取消任务
    if (
      !settings.downType0 &&
      !settings.downType1 &&
      !settings.downType2 &&
      !settings.downType3
    ) {
      this.showWarning(lang.transl('_排除了所有作品类型'))
    }

    const tips = []
    !settings.downType0 && tips.push(lang.transl('_插画'))
    !settings.downType1 && tips.push(lang.transl('_漫画'))
    !settings.downType2 && tips.push(lang.transl('_动图'))
    !settings.downType3 && tips.push(lang.transl('_小说'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.toString())
    }
  }

  private getDownTypeByAge() {
    // 如果全部排除则取消任务
    if (!settings.downAllAges && !settings.downR18 && !settings.downR18G) {
      this.showWarning(lang.transl('_排除了所有作品类型'))
    }

    const tips = []
    !settings.downAllAges && tips.push(lang.transl('_全年龄'))
    !settings.downR18 && tips.push('R-18')
    !settings.downR18G && tips.push('R-18G')

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.toString())
    }
  }

  private getDownTypeByImgCount() {
    const tips = []
    !settings.downSingleImg && tips.push(lang.transl('_单图作品'))
    !settings.downMultiImg && tips.push(lang.transl('_多图作品'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.toString())
    }
  }

  // 提示图像颜色设置
  private getDownTypeByColor() {
    // 如果全部排除则取消任务
    if (!settings.downColorImg && !settings.downBlackWhiteImg) {
      this.showWarning(lang.transl('_排除了所有作品类型'))
    }

    const tips = []
    !settings.downColorImg && tips.push(lang.transl('_彩色图片'))
    !settings.downBlackWhiteImg && tips.push(lang.transl('_黑白图片'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.toString())
    }
  }

  // 提示下载收藏和未收藏作品的设置
  private getDownTypeByBmked() {
    // 如果全部排除则取消任务
    if (!settings.downNotBookmarked && !settings.downBookmarked) {
      this.showWarning(lang.transl('_排除了所有作品类型'))
    }

    const tips = []
    !settings.downNotBookmarked && tips.push(lang.transl('_未收藏'))
    !settings.downBookmarked && tips.push(lang.transl('_已收藏'))

    if (tips.length > 0) {
      log.warning(lang.transl('_排除作品类型') + tips.toString())
    }
  }

  // 提示多图作品的图片数量限制
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

  // 提示必须包含的tag
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

  // 提示要排除的tag
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

  // 提示宽高设置
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

  // 提示输入的收藏数
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

  // 提示宽高比设置
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

  // 提示 id 范围设置
  private getIdRange() {
    if (!settings.idRangeSwitch) {
      return
    }

    log.warning(`id ${settings.idRange} ${settings.idRangeInput}`)
  }

  // 提示投稿时间设置
  private getPostDate() {
    if (!settings.postDate) {
      return
    }

    if (isNaN(settings.postDateStart) || isNaN(settings.postDateStart)) {
      const msg = lang.transl('_日期时间格式错误')
      this.showWarning(msg)
    } else {
      const start = new Date(settings.postDateStart).toLocaleString()
      const end = new Date(settings.postDateEnd).toLocaleString()
      log.warning(`${lang.transl('_时间范围')}: ${start} - ${end}`)
    }
  }

  // 提示文件体积设置
  private getSize() {
    if (!settings.sizeSwitch) {
      return
    }

    log.warning(`Size: ${settings.sizeMin}MiB - ${settings.sizeMax}MiB`)
  }

  private getBlockList() {
    if (!settings.userBlockList) {
      return
    }

    for (const uid of settings.blockList) {
      if (isNaN(Number.parseInt(uid))) {
        return this.showWarning(lang.transl('_用户ID必须是数字'))
      }
    }

    if (settings.blockList.length > 0) {
      log.warning(
        lang.transl('_用户阻止名单') + ': ' + settings.blockList.toString()
      )
    }
  }

  // ---------------- check ----------------

  // 检查下载的作品类型设置
  private checkDownType(workType: FilterOption['workType']) {
    switch (workType) {
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

  // 检查多图作品的图片数量限制
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
      (workType !== 0 && workType !== 1)
    ) {
      return true
    }

    return pageCount <= settings.multiImageWorkImageLimit
  }

  // 依据图片数量，检查下载的作品类型
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

  // 检查过滤黑白图像设置
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

  // 检查作品是否符合已收藏、未收藏作品的设置
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

  // 检查收藏数要求
  private readonly oneDayTime = 24 * 60 * 60 * 1000 // 一天的毫秒数
  private readonly minimumTime = 4 * 60 * 60 * 1000 // 检查日均收藏数量时，要求作品发表之后经过的时间大于这个值。因为发表之后经过时间很短的作品，其日均收藏数量非常不可靠，所以对于小于这个值的作品不进行日均收藏数量的检查。
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
    const nowTime = new Date().getTime()

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

  // 检查作品是否符合包含 tag 的条件。返回值表示是否保留这个作品。
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

  // 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否保留这个作品。
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

  // 检查作品是否符合过滤宽高的条件
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

  // 检查作品是否符合宽高比条件
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

  // 检查 id 范围设置
  private checkIdRange(id: FilterOption['id']) {
    if (id === undefined || !settings.idRangeSwitch) {
      return true
    }

    const setId = settings.idRangeInput
    let nowId: number

    if (typeof id !== 'number') {
      nowId = parseInt(id)
    } else {
      nowId = id
    }

    if (settings.idRange === '>') {
      return nowId > setId
    } else {
      return nowId < setId
    }
  }

  // 检查投稿时间设置
  private checkPostDate(date: FilterOption['createDate']) {
    if (!settings.postDate || date === undefined) {
      return true
    }

    const _date = new Date(date)
    return (
      _date.getTime() >= settings.postDateStart &&
      _date.getTime() <= settings.postDateEnd
    )
  }

  private checkIdPublishTime(
    id: FilterOption['id'],
    type: FilterOption['workTypeString']
  ) {
    if (id === undefined || !settings.postDate || !type) {
      return true
    }

    const _id = Number.parseInt(id as string)
    const _type = type === 'novels' ? 'novels' : 'illusts'
    const range = workPublishTime.getTimeRange(_id, _type)

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

  // 检查文件体积
  private readonly MiB = 1024 * 1024
  private checkSize(size: FilterOption['size']) {
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

  // 如果设置项的值不合法，则显示提示
  private showWarning(msg: string) {
    EVT.fire('wrongSetting')
    msgBox.error(msg)
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.showTip()
    })
  }
}

const filter = new Filter()
export { filter }
