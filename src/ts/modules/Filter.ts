import { FilterOption } from './Filter.d'
import { lang } from './Lang'
import { log } from './Log'
import { API } from './API'
import { EVT } from './EVT'
import { states } from './States'
import { settings } from './setting/Settings'
import { blackAndWhiteImage } from './BlackandWhiteImage'

// 检查作品是否符合过滤条件
class Filter {
  constructor() {
    this.bindEvent()
  }

  private readonly BMKNumMinDef = 0
  private readonly BMKNumMaxDef = 9999999
  private readonly MiB = 1024 * 1024

  // 缓存部分开始
  // 为了减少不必要的重复计算，缓存一些计算后的值。当有设置改变时，重新计算缓存的值，所以这些值也是会动态更新的。
  // 可以直接使用的选项不需要缓存;只有需要进行处理后才可以使用的选项需要缓存
  private _BMKNumMin: number = this.BMKNumMinDef // 最小收藏数量
  private _BMKNumMax: number = this.BMKNumMaxDef // 最大收藏数量

  private _sizeMin = 0
  private _sizeMax = 100 * this.MiB

  private _setWidth = 0
  private _setHeight = 0

  private _postDateStart = 0
  private _postDateEnd = 0

  private _needTag: string = ''
  private _notNeedTag: string = ''

  private blockList: string[] = []
  // 缓存部分结束

  private showTip = false // 是否在日志区域输出提示

  // 检查设置项，获取设置的值
  // 如果 showTip 为 true，表示允许在日志区域输出提示
  public init(showTip = false) {
    this.showTip = showTip
    // 获取作品类型的设置
    this.getDownType()
    this.getDownTypeByImgCount()
    this.getDownTypeByColor()

    // 获取收藏数设置
    this.getBMKNum()

    // 获取只下载已收藏设置
    this.getOnlyBmk()

    // 获取宽高条件设置
    this.getSetWh()

    // 获取宽高比设置
    this.getRatio()

    // 获取 id 范围设置
    this.getIdRange()

    // 获取投稿时间设置
    this.getPostDate()

    // 获取必须包含的tag
    this.getIncludeTag()

    // 获取要排除的tag
    this.getExcludeTag()

    // 获取只下载首次登场设置
    if (states.debut) {
      this.logTip(lang.transl('_抓取首次登场的作品Title'))
    }

    // 获取用户阻止名单
    this.getBlockList()

    // 获取文件体积设置
    this.getSize()
  }

  // 检查作品是否符合过滤器的要求
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  // 所有过滤器里，都必须要检查参数为 undefined 的情况
  // 注意：这是一个异步函数，所以要记得使用 await 获取检查结果
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

    // 检查只下载已收藏的要求
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

    // 检查用户阻止名单

    if (!this.checkBlockList(option.userid)) {
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
    // 这一步需要加载图片，需要较长的时间，较躲的资源占用，放到最后检查，以避免无谓的执行
    const blackAndWhiteResult = await this.checkBlackWhite(option.mini)
    if (!blackAndWhiteResult) {
      return false
    }

    return true
  }

  // ---------------- get ---------------- 

  // 获取下载的作品类型设置
  private getDownType() {
    // 如果全部排除则取消任务
    if (
      !settings.downType0 &&
      !settings.downType1 &&
      !settings.downType2 &&
      !settings.downType3
    ) {
      this.throwError(lang.transl('_排除了所有作品类型'))
    }

    let notDownTip = ''

    notDownTip += settings.downType0 ? '' : lang.transl('_插画')
    notDownTip += settings.downType1 ? '' : lang.transl('_漫画')
    notDownTip += settings.downType2 ? '' : lang.transl('_动图')
    notDownTip += settings.downType3 ? '' : lang.transl('_小说')

    if (notDownTip) {
      this.logTip(lang.transl('_排除作品类型') + notDownTip)
    }
  }

  private getDownTypeByImgCount() {
    let notDownTip = ''

    notDownTip += settings.downSingleImg ? '' : lang.transl('_单图作品')
    notDownTip += settings.downMultiImg ? '' : lang.transl('_多图作品')

    if (notDownTip) {
      this.logTip(lang.transl('_排除作品类型') + notDownTip)
    }
  }

  // 获取图像颜色设置
  private getDownTypeByColor() {
    // 如果全部排除则取消任务
    if (!settings.downColorImg && !settings.downBlackWhiteImg) {
      this.throwError(lang.transl('_排除了所有作品类型'))
    }

    let notDownTip = ''

    notDownTip += settings.downColorImg ? '' : lang.transl('_彩色图片')
    notDownTip += settings.downBlackWhiteImg ? '' : lang.transl('_黑白图片')

    if (notDownTip) {
      this.logTip(lang.transl('_排除作品类型') + notDownTip)
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
      return
    }
    this._needTag = this.getTagString(settings.needTag)
    if (this._needTag) {
      this.logTip(lang.transl('_设置了必须tag之后的提示') + this._needTag)
    }
  }

  // 获取要排除的tag
  private getExcludeTag() {
    if (!settings.notNeedTagSwitch) {
      return
    }
    this._notNeedTag = this.getTagString(settings.notNeedTag)
    if (this._notNeedTag) {
      this.logTip(lang.transl('_设置了排除tag之后的提示') + this._notNeedTag)
    }
  }

  // 获取宽高设置
  private getSetWh() {
    if (!settings.setWHSwitch) {
      return
    }

    const width = API.checkNumberGreater0(settings.setWidth)
    const height = API.checkNumberGreater0(settings.setHeight)

    this._setWidth = width.result ? width.value : 0
    this._setHeight = height.result ? height.value : 0

    if (this._setWidth || this._setHeight) {
      const andOr = settings.setWidthAndOr
        .replace('|', lang.transl('_或者'))
        .replace('&', lang.transl('_并且'))
      const text = `${lang.transl('_宽度')} ${settings.widthHeightLimit} ${this._setWidth
        } ${andOr} ${lang.transl('_高度')} ${settings.widthHeightLimit} ${this._setHeight
        }`
      this.logTip(text)
    }
  }

  // 获取输入的收藏数
  private getBMKNum() {
    if (!settings.BMKNumSwitch) {
      return
    }

    this._BMKNumMin = this.BMKNumMinDef
    this._BMKNumMax = this.BMKNumMaxDef

    const min = API.checkNumberGreater0(settings.BMKNumMin)
    const max = API.checkNumberGreater0(settings.BMKNumMax)

    if (min.result) {
      this._BMKNumMin = min.value
      this.logTip(lang.transl('_收藏数大于') + min.value)
    }

    if (max.result) {
      this._BMKNumMax = max.value
      this.logTip(lang.transl('_收藏数小于') + max.value)
    }
  }

  // 获取只下载已收藏的设置
  private getOnlyBmk() {
    if (settings.setOnlyBmk) {
      this.logTip(lang.transl('_只下载已收藏的提示'))
    }
  }

  // 获取宽高比设置
  private getRatio() {
    if (!settings.ratioSwitch) {
      return '0'
    }

    let result = settings.ratio

    if (result === '1') {
      this.logTip(lang.transl('_设置了宽高比之后的提示', lang.transl('_横图')))
    } else if (result === '2') {
      this.logTip(lang.transl('_设置了宽高比之后的提示', lang.transl('_竖图')))
    } else if (result === '3') {
      // 由用户输入
      const typeNum = parseFloat(settings.userRatio)
      if (isNaN(typeNum)) {
        const msg = lang.transl('_宽高比必须是数字')
        this.throwError(msg)
      } else {
        this.logTip(lang.transl('_输入宽高比') + settings.userRatio)
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
        const msg = 'Error: id range is not a number!'
        this.throwError(msg)
      }
    }

    if (result === '1') {
      this.logTip(`id > ${settings.idRangeInput}`)
    }

    if (result === '2') {
      this.logTip(`id < ${settings.idRangeInput}`)
    }

    return result
  }

  // 获取投稿时间设置
  private getPostDate() {
    if (
      !settings.postDate ||
      settings.postDateStart === '' ||
      settings.postDateEnd === ''
    ) {
      return
    }

    // 判断是否是有效的时间格式
    const postDateStart = new Date(settings.postDateStart)
    const postDateEnd = new Date(settings.postDateEnd)
    // 如果输入的时间可以被转换成有效的时间，则启用
    // 转换时间失败时，值是 Invalid Date，不能转换成数字
    if (isNaN(postDateStart.getTime()) || isNaN(postDateEnd.getTime())) {
      const msg = 'Date format error!'
      this.throwError(msg)
    } else {
      // 转换时间成功
      this._postDateStart = postDateStart.getTime()
      this._postDateEnd = postDateEnd.getTime()
      this.logTip(
        `${lang.transl('_时间范围')}: ${settings.postDateStart} - ${settings.postDateEnd
        }`,
      )
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

      this._sizeMin = min * this.MiB
      this._sizeMax = max * this.MiB

      this.logTip(`Size: ${min}MiB - ${max}MiB`)
    }
  }

  private getBlockList() {
    if (!settings.userBlockList) {
      this.blockList = []
      return
    }

    const temp = settings.blockList.trim().split(',')
    // 因为输入的值只用来比较，没有其他用途，所以不必严格检查 id 的有效性
    this.blockList = temp.filter((val) => {
      return val !== ''
    })

    if (this.blockList.length > 0) {
      this.logTip(lang.transl('_用户阻止名单') + ': ' + this.blockList.join(','))
    }
  }

  // ---------------- check ---------------- 

  // 检查下载的作品类型设置
  private checkDownType(illustType: FilterOption['illustType']) {
    if (illustType === undefined) {
      return true
    }

    const name = ('downType' + illustType) as
      | 'downType0'
      | 'downType1'
      | 'downType2'
      | 'downType3'
    return settings[name]
  }

  // 依据图片数量，检查下载的作品类型
  private checkPageCount(
    illustType: FilterOption['illustType'],
    pageCount: FilterOption['pageCount'],
  ) {
    if (illustType === undefined || pageCount === undefined) {
      return true
    }

    // 将动图视为单图
    if (illustType === 2) {
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

  // 检查收藏数要求
  private checkBMK(bmk: FilterOption['bookmarkCount']) {
    if (bmk === undefined || !settings.BMKNumSwitch) {
      return true
    }

    return bmk >= this._BMKNumMin && bmk <= this._BMKNumMax
  }

  // 检查作品是否符合【只下载已收藏】的条件,返回值 true 表示包含这个作品
  private checkOnlyBmk(bookmarked: any) {
    if (bookmarked === undefined || !settings.setOnlyBmk) {
      return true
    }

    return !!bookmarked
  }

  // 检查作品是否符合包含 tag 的条件。返回值表示是否保留这个作品。
  private checkIncludeTag(tags: FilterOption['tags']) {
    if (!settings.needTagSwitch || !this._needTag || tags === undefined) {
      return true
    }

    let result = false
    // 把设置的包含的 tag 转换成小写，生成数组
    const needTags = this._needTag.split(',').map(val => {
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
    if (!settings.notNeedTagSwitch || !this._notNeedTag || tags === undefined) {
      return true
    }

    let result = true
    const notNeedTags = this._notNeedTag.split(',').map(val => {
      return val.toLowerCase()
    })

    // 如果设置了排除 tag
    if (notNeedTags.length > 0) {
      for (const tag of tags) {
        for (const notNeed of notNeedTags) {
          if (tag.toLowerCase() === notNeed) {
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
    height: FilterOption['height'],
  ) {
    if (!settings.setWHSwitch) {
      return true
    }

    // 缺少必要的参数
    if (width === undefined || height === undefined) {
      return true
    }

    // 未设置宽高，或者设置的宽高都不合法
    if (this._setWidth === 0 && this._setHeight === 0) {
      return true
    }

    if (settings.widthHeightLimit === '>=') {
      // 大于等于
      if (settings.setWidthAndOr === '&') {
        return width >= this._setWidth && height >= this._setHeight
      } else {
        return width >= this._setWidth || height >= this._setHeight
      }
    } else if (settings.widthHeightLimit === '<=') {
      // 小于等于
      if (settings.setWidthAndOr === '&') {
        return width <= this._setWidth && height <= this._setHeight
      } else {
        return width <= this._setWidth || height <= this._setHeight
      }
    } else {
      // 精确等于
      if (settings.setWidthAndOr === '&') {
        return width === this._setWidth && height === this._setHeight
      } else {
        return width === this._setWidth || height === this._setHeight
      }
    }
  }

  // 检查作品是否符合宽高比条件
  private checkRatio(
    width: FilterOption['width'],
    height: FilterOption['height'],
  ) {
    if (!settings.ratioSwitch) {
      return true
    }

    if (width === undefined || height === undefined) {
      return true
    }

    if (settings.ratio === '1') {
      return width / height > 1
    } else if (settings.ratio === '2') {
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
    if (
      !settings.postDate ||
      date === undefined ||
      !this._postDateStart ||
      !this._postDateEnd
    ) {
      return true
    }

    const nowDate = new Date(date)
    return (
      nowDate.getTime() >= this._postDateStart &&
      nowDate.getTime() <= this._postDateEnd
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

  private checkBlockList(userid: FilterOption['userid']) {
    if (!settings.userBlockList || userid === undefined) {
      return true
    }

    // 如果阻止名单里有这个用户 id，则返回 false 表示阻止这个作品
    return !this.blockList.includes(userid)
  }

  // 检查文件体积
  private checkSize(size: FilterOption['size']) {
    if (!settings.sizeSwitch || size === undefined) {
      return true
    }
    return size >= this._sizeMin && size <= this._sizeMax
  }

  // 在日志区域输出提示
  private logTip(str: string) {
    if (!this.showTip) {
      return
    }
    log.warning(str)
  }

  // 如果设置项的值不合法，则抛出错误
  private throwError(msg: string) {
    EVT.fire(EVT.list.wrongSetting)
    log.error(msg, 2)
    EVT.sendMsg({
      msg: msg,
      type: 'error',
    })
    throw new Error(msg)
  }

  private bindEvent() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.init(true)
    })

    for (const ev of [EVT.list.settingChange, EVT.list.resume]) {
      window.addEventListener(ev, () => {
        this.init()
      })
    }
  }
}

const filter = new Filter()
export { filter }
