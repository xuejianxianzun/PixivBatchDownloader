// 过滤器
import { FilterOption, FilterWh } from './Filter.d'
import { lang } from './Lang'
import { log } from './Log'
import { API } from './API'
import { EVT } from './EVT'
import { states } from './States'
import { settings } from './setting/Settings'
import { blackAndWhiteImage } from './BlackandWhiteImage'

// 审查作品是否符合过滤条件
// 可以根据需要，随时进行审查
class Filter {
  constructor() {
    this.bindEvent()
  }

  private readonly BMKNumMinDef = 0
  private readonly BMKNumMaxDef = 9999999
  private BMKNumMin: number = this.BMKNumMinDef // 最小收藏数量
  private BMKNumMax: number = this.BMKNumMaxDef // 最大收藏数量

  private readonly MB = 1024 * 1024
  private sizeMin = 0
  private sizeMax = 100 * this.MB

  // 宽高条件
  private filterWh: FilterWh = {
    andOr: '&',
    width: 0,
    height: 0,
  }

  private ratioType: string = '0' // 宽高比例的类型

  private postDate: boolean = false // 是否设置投稿时间

  private postDateStart = new Date()

  private postDateEnd = new Date()

  private includeTag: string = '' // 必须包含的 tag

  private excludeTag: string = '' // 要排除的 tag

  // 从下载区域上获取过滤器的各个选项
  public init() {
    // 获取作品类型的设置
    this.getDownType()

    this.getDownTypeByImgCount()

    this.getDownTypeByColor()

    // 获取收藏数设置
    this.getBMKNum()

    // 获取只下载已收藏设置
    this.getOnlyBmk()

    // 获取宽高条件设置
    this.filterWh = this.getSetWh()

    // 获取宽高比设置
    this.ratioType = this.getRatio()

    // 获取 id 范围设置
    this.getIdRange()

    // 获取投稿时间设置
    this.postDate = this.getPostDateSetting()

    // 获取必须包含的tag
    this.includeTag = this.getIncludeTag()

    // 获取要排除的tag
    this.excludeTag = this.getExcludeTag()

    // 获取只下载首次登场设置
    if (states.debut) {
      log.warning(lang.transl('_抓取首次登场的作品Title'))
    }

    this.getSize()
  }

  // 检查作品是否符合过滤器的要求
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  // 所有过滤器里，都必须要检查参数为 undefined 的情况
  // 这是一个异步函数，所以要记得使用 await 获取检查结果
  public async check(option: FilterOption): Promise<boolean> {
    // 检查下载的作品类型设置
    if (!this.checkDownType(option.illustType)) {
      return false
    }

    // 检查单图、多图的下载
    if (!this.checkPageCount(option.illustType, option.pageCount)) {
      return false
    }

    // 检查收藏数要求
    if (!this.checkBMK(option.bookmarkCount)) {
      return false
    }

    // 检查只下载书签作品的要求
    if (!this.checkOnlyBmk(option.bookmarkData)) {
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
    if (!this.checkSetWh(option.width, option.height)) {
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

    // 检查投稿时间设置
    if (!this.checkPostDate(option.createDate)) {
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
    // 这一步需要加载图片，需要较长的时间，较大的资源占用，放到最后检查，以避免无谓的执行
    const blackAndWhiteResult = await this.checkBlackWhite(option.mini)
    if (!blackAndWhiteResult) {
      return false
    }

    return true
  }

  // 当需要时抛出错误
  private throwError(msg: string) {
    EVT.fire(EVT.events.crawlError)
    log.error(msg, 2)
    window.alert(msg)
    throw new Error(msg)
  }

  // 获取下载的作品类型设置
  private getDownType() {
    // 如果全部排除则取消任务
    if (
      !settings.downType0 &&
      !settings.downType1 &&
      !settings.downType2 &&
      !settings.downType3
    ) {
      this.throwError(lang.transl('_checkNotdownTypeAll'))
    }

    let notDownTip = ''

    notDownTip += settings.downType0 ? '' : lang.transl('_插画')
    notDownTip += settings.downType1 ? '' : lang.transl('_漫画')
    notDownTip += settings.downType2 ? '' : lang.transl('_动图')
    notDownTip += settings.downType3 ? '' : lang.transl('_小说')

    if (notDownTip) {
      log.warning(lang.transl('_checkNotdownTypeResult') + notDownTip)
    }
  }

  private getDownTypeByImgCount() {
    let notDownTip = ''

    notDownTip += settings.downSingleImg ? '' : lang.transl('_单图作品')
    notDownTip += settings.downMultiImg ? '' : lang.transl('_多图作品')

    if (notDownTip) {
      log.warning(lang.transl('_checkNotdownTypeResult') + notDownTip)
    }
  }

  // 获取图像颜色设置
  private getDownTypeByColor() {
    // 如果全部排除则取消任务
    if (!settings.downColorImg && !settings.downBlackWhiteImg) {
      this.throwError(lang.transl('_checkNotdownTypeAll'))
    }

    let notDownTip = ''

    notDownTip += settings.downColorImg ? '' : lang.transl('_彩色图片')
    notDownTip += settings.downBlackWhiteImg ? '' : lang.transl('_黑白图片')

    if (notDownTip) {
      log.warning(lang.transl('_checkNotdownTypeResult') + notDownTip)
    }
  }

  // 获取用户输入的 tag 内容
  private getTagString(str: string) {
    let result = ''
    if (str) {
      let tempArr = str.split(',')
      // 如果用户在末尾也输入了逗号，则会产生一个空值，去掉它
      if (tempArr[tempArr.length - 1] === '') {
        tempArr.pop()
      }
      result = tempArr.join(',')
    }
    return result
  }

  // 获取必须包含的tag
  private getIncludeTag() {
    if (!settings.needTagSwitch) {
      return ''
    }
    const result = this.getTagString(settings.needTag)
    if (result) {
      log.warning(lang.transl('_设置了必须tag之后的提示') + result)
    }
    return result
  }

  // 获取要排除的tag
  private getExcludeTag() {
    if (!settings.notNeedTagSwitch) {
      return ''
    }
    const result = this.getTagString(settings.notNeedTag)
    if (result) {
      log.warning(lang.transl('_设置了排除tag之后的提示') + result)
    }
    return result
  }

  // 获取过滤宽高的设置
  private getSetWh() {
    let result: FilterWh = {
      andOr: '&',
      width: 0,
      height: 0,
    }

    if (!settings.setWHSwitch) {
      return result
    }

    const checkWidth = API.checkNumberGreater0(settings.setWidth)
    const checkHeight = API.checkNumberGreater0(settings.setHeight)

    // 宽高只要有一个条件大于 0 即可
    if (checkWidth.value > 0 || checkHeight.value > 0) {
      result = {
        andOr: settings.setWidthAndOr,
        width: checkWidth ? checkWidth.value : 0,
        height: checkHeight ? checkHeight.value : 0,
      }

      log.warning(
        lang.transl('_宽度设置') +
        result.width +
        result.andOr
          .replace('|', lang.transl('_或者'))
          .replace('&', lang.transl('_并且')) +
        lang.transl('_高度设置') +
        result.height
      )
    }

    return result
  }

  // 获取输入的收藏数
  private getBMKNum() {
    if (!settings.BMKNumSwitch) {
      return
    }

    this.BMKNumMin = this.BMKNumMinDef
    this.BMKNumMax = this.BMKNumMaxDef

    const min = API.checkNumberGreater0(settings.BMKNumMin)
    const max = API.checkNumberGreater0(settings.BMKNumMax)

    if (min.result) {
      this.BMKNumMin = min.value
      log.warning(lang.transl('_收藏数大于') + min.value)
    }

    if (max.result) {
      this.BMKNumMax = max.value
      log.warning(lang.transl('_收藏数小于') + max.value)
    }
  }

  // 获取只下载书签作品的设置
  private getOnlyBmk() {
    if (settings.setOnlyBmk) {
      log.warning(lang.transl('_只下载已收藏的提示'))
    }
  }

  // 获取宽高比设置
  private getRatio() {
    if (!settings.ratioSwitch) {
      return '0'
    }

    let result = settings.ratio

    if (result === '1') {
      log.warning(lang.transl('_设置了宽高比之后的提示', lang.transl('_横图')))
    } else if (result === '2') {
      log.warning(lang.transl('_设置了宽高比之后的提示', lang.transl('_竖图')))
    } else if (result === '3') {
      // 由用户输入
      const typeNum = parseFloat(settings.userRatio)
      if (isNaN(typeNum)) {
        const msg = lang.transl('_宽高比必须是数字')
        window.alert(msg)
        throw new Error(msg)
      } else {
        log.warning(lang.transl('_输入宽高比') + settings.userRatio)
      }
    }

    return result
  }

  // 获取 id 范围设置
  private getIdRange() {
    if (!settings.idRangeSwitch) {
      return
    }

    const result = settings.idRange

    if (result === '1' || result === '2') {
      let id = parseInt(settings.idRangeInput)
      if (isNaN(id)) {
        EVT.fire(EVT.events.crawlError)

        const msg = 'id is not a number!'
        window.alert(msg)
        log.error(msg)
        throw new Error(msg)
      }
    }

    if (result === '1') {
      log.warning(`id > ${settings.idRangeInput}`)
    }

    if (result === '2') {
      log.warning(`id < ${settings.idRangeInput}`)
    }

    return result
  }

  // 获取投稿时间设置
  private getPostDateSetting() {
    if (!settings.postDate) {
      return false
    } else {
      // 如果启用了此设置，需要判断是否是有效的时间格式
      const postDateStart = new Date(settings.postDateStart)
      const postDateEnd = new Date(settings.postDateEnd)
      // 如果输入的时间可以被转换成有效的时间，则启用
      // 转换时间失败时，值是 Invalid Date，不能转换成数字
      if (isNaN(postDateStart.getTime()) || isNaN(postDateEnd.getTime())) {
        EVT.fire(EVT.events.crawlError)

        const msg = 'Date format error!'
        log.error(msg)
        window.alert(msg)
        throw new Error(msg)
      } else {
        // 转换时间成功
        this.postDateStart = postDateStart
        this.postDateEnd = postDateEnd
        log.warning(
          `${lang.transl('_时间范围')}: ${settings.postDateStart} - ${settings.postDateEnd
          }`
        )
        return true
      }
    }
  }

  // 获取文件体积设置
  private getSize() {
    if (settings.sizeSwitch) {
      let min = parseFloat(settings.sizeMin)
      isNaN(min) && (min = 0)

      let max = parseFloat(settings.sizeMax)
      isNaN(max) && (min = 100)

      // 如果输入的最小值比最大值还要大，则交换它们的值
      if (min > max) {
        ;[min, max] = [max, min]
      }

      this.sizeMin = min * this.MB
      this.sizeMax = max * this.MB

      log.warning(`Size: ${min}MB - ${max}MB`)
    }
  }

  // 检查下载的作品类型设置
  private checkDownType(illustType: FilterOption['illustType']) {
    if (illustType === undefined) {
      return true
    } else {
      switch (illustType) {
        case 0:
          return settings.downType0 ? true : false
        case 1:
          return settings.downType1 ? true : false
        case 2:
          return settings.downType2 ? true : false
        case 3:
          return settings.downType3 ? true : false
        default:
          return true
      }
    }
  }

  // 依据图片数量，检查下载的作品类型
  private checkPageCount(
    illustType: FilterOption['illustType'],
    pageCount: FilterOption['pageCount']
  ) {
    // 判断单图、多图时，只对插画、漫画生效，否则跳过检查
    if (illustType !== 0 && illustType !== 1) {
      return true
    }

    if (illustType === undefined || pageCount === undefined) {
      return true
    }

    if (pageCount === 1 && settings.downSingleImg) {
      return true
    }

    if (pageCount > 1 && settings.downMultiImg) {
      return true
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

    return (result && settings.downBlackWhiteImg) || (!result && settings.downColorImg)
  }

  // 检查收藏数要求
  private checkBMK(bmk: FilterOption['bookmarkCount']) {
    if (bmk === undefined || !settings.BMKNumSwitch) {
      return true
    } else {
      return bmk >= this.BMKNumMin && bmk <= this.BMKNumMax
    }
  }

  // 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
  private checkOnlyBmk(bookmarked: any) {
    if (bookmarked === undefined || !settings.setOnlyBmk) {
      return true
    }

    return !!bookmarked
  }

  // 检查作品是否符合包含 tag 的条件, 如果设置了多个 tag，需要作品里全部包含。返回值表示是否保留这个作品。
  private checkIncludeTag(tags: FilterOption['tags']) {
    if (!settings.needTagSwitch || !this.includeTag || tags === undefined) {
      return true
    }

    let result = false
    let tempArr = this.includeTag.split(',')

    // 如果设置了必须的 tag
    if (tempArr.length > 0) {
      let tagNeedMatched = 0
      const tempTags = new Set()
      // 如果不区分大小写的话，Fate/grandorder 和 Fate/GrandOrder 会被算作符合两个 tag，所以用 Set 结构去重。测试 id 51811780
      for (const tag of tags) {
        tempTags.add(tag.toLowerCase())
      }

      for (const tag of tempTags) {
        for (const need of tempArr) {
          if (tag === need.toLowerCase()) {
            tagNeedMatched++
            break
          }
        }
      }

      // 如果全部匹配
      if (tagNeedMatched >= tempArr.length) {
        result = true
      }
    } else {
      result = true
    }

    return result
  }

  // 检查作品是否符合排除 tag 的条件, 只要作品包含其中一个就排除。返回值表示是否保留这个作品。
  private checkExcludeTag(tags: FilterOption['tags']) {
    if (!settings.notNeedTagSwitch || !this.excludeTag || tags === undefined) {
      return true
    }

    let result = true
    let tempArr = this.excludeTag.split(',')

    // 如果设置了排除 tag
    if (tempArr.length > 0) {
      for (const tag of tags) {
        for (const notNeed of tempArr) {
          if (tag.toLowerCase() === notNeed.toLowerCase()) {
            result = false
            break
          }
        }
      }
    }

    return result
  }

  // 检查作品是否符合过滤宽高的条件
  private checkSetWh(
    width: FilterOption['width'],
    height: FilterOption['height']
  ) {
    if (!settings.setWHSwitch) {
      return true
    }

    if (width === undefined || height === undefined) {
      return true
    }

    if (this.filterWh.width > 0 || this.filterWh.height > 0) {
      // 如果宽高都小于要求的宽高
      if (width < this.filterWh.width && height < this.filterWh.height) {
        return false
      } else {
        if (this.filterWh.andOr === '|') {
          // 判断or的情况
          if (width >= this.filterWh.width || height >= this.filterWh.height) {
            return true
          } else {
            return false
          }
        } else if (this.filterWh.andOr === '&') {
          // 判断and的情况
          if (width >= this.filterWh.width && height >= this.filterWh.height) {
            return true
          } else {
            return false
          }
        }
      }
    }
    return true
  }

  // 检查作品是否符合宽高比条件
  private checkRatio(
    width: FilterOption['width'],
    height: FilterOption['height']
  ) {
    if (!settings.ratioSwitch) {
      return true
    }

    if (width === undefined || height === undefined) {
      return true
    }

    if (this.ratioType === '1') {
      return width / height > 1
    } else if (this.ratioType === '2') {
      return width / height < 1
    } else {
      return width / height >= parseFloat(settings.userRatio)
    }
  }

  // 检查 id 范围设置
  private checkIdRange(id: FilterOption['id']) {
    if (id === undefined || !settings.idRangeSwitch) {
      return true
    }

    const nowId = parseInt(id.toString())
    const setId = parseInt(settings.idRangeInput)

    if (settings.idRange === '1') {
      // 大于
      return nowId > setId
    } else if (settings.idRange === '2') {
      // 小于
      return nowId < setId
    } else {
      return true
    }
  }

  // 检查投稿时间设置
  private checkPostDate(date: FilterOption['createDate']) {
    if (!this.postDate || date === undefined) {
      return true
    } else {
      const nowDate = new Date(date)
      if (nowDate >= this.postDateStart && nowDate <= this.postDateEnd) {
        return true
      } else {
        return false
      }
    }
  }

  // 检查首次登场设置
  // yes_rank 是昨日排名，如果为 0，则此作品是“首次登场”的作品
  private checkDebut(yes_rank: FilterOption['yes_rank']) {
    if (!states.debut || yes_rank === undefined) {
      // 如果没有要求首次登场，或者没有此数据
      return true
    } else {
      // 要求首次登场
      if (yes_rank === 0 || yes_rank === undefined) {
        return true
      } else {
        return false
      }
    }
  }

  // 检查文件体积
  private checkSize(size: FilterOption['size']) {
    if (!settings.sizeSwitch || size === undefined) {
      return true
    }
    return size >= this.sizeMin && size <= this.sizeMax
  }

  private bindEvent() {
    window.addEventListener(EVT.events.crawlStart, () => {
      this.init()
    })

    window.addEventListener(EVT.events.resume, () => {
      // 当需要恢复下载时，初始化过滤器。否则过滤器不会进行过滤
      this.init()
    })
  }
}

const filter = new Filter()
export { filter }
