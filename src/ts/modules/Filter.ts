// 过滤器
import { FilterOption, FilterWh } from './Filter.d'
import { form } from './Settings'
import { lang } from './Lang'
import { log } from './Log'
import { API } from './API'
import { EVT } from './EVT'
import { blackAndWhiteImage } from './BlackandWhiteImage'

// 审查每个作品的数据，决定是否要存储它
// 可以根据需要，随时进行审查
class Filter {
  private downType0 = true
  private downType1 = true
  private downType2 = true
  private downType3 = true

  private downSingleImg = true
  private downMultiImg = true

  private downColorImg = true
  private downBlackWhiteImg = true

  private filterBMKNum = false // 是否要求收藏数量

  private readonly BMKNumMinDef = 0
  private readonly BMKNumMaxDef = 999999
  private BMKNumMin: number = this.BMKNumMinDef // 最小收藏数量
  private BMKNumMax: number = this.BMKNumMaxDef // 最大收藏数量

  private onlyBmk: boolean = false // 是否只下载收藏的作品

  private sizeSwitch = false
  private readonly MB = 1024 * 1024
  private sizeMin = 0
  private sizeMax = 100 * this.MB

  // 宽高条件
  private setWHSwitch = false
  private filterWh: FilterWh = {
    andOr: '&',
    width: 0,
    height: 0,
  }

  private ratioSwitch = false // 宽高比例设置的开关
  private ratioType: string = '0' // 宽高比例的类型

  private idRangeSwitch = false // id 范围的开关
  private idRange: number = -1 // id 范围，默认不限制

  private postDate: boolean = false // 是否设置投稿时间

  private postDateStart = new Date()

  private postDateEnd = new Date()

  private needTagSwitch = false // 必须包含的 tag 开关
  private includeTag: string = '' // 必须包含的 tag

  private notNeedTagSwitch = false // 要排除的 tag 开关
  private excludeTag: string = '' // 要排除的 tag

  private debut: boolean = false // 只下载首次登场的作品

  // 从下载区域上获取过滤器的各个选项
  public init() {
    // 获取排除作品类型的设置
    this.getDownType()

    this.getDownTypeByImgCount()

    // 获取是否设置了过滤黑白图像
    this.getDownTypeByColor()

    // 获取是否设置了收藏数要求
    this.filterBMKNum = form.BMKNumSwitch.checked
    this.filterBMKNum && this.getBMKNum()
    // 获取是否设置了只下载书签作品
    this.onlyBmk = this.getOnlyBmk()

    // 获取是否设置了宽高条件
    this.setWHSwitch = form.setWHSwitch.checked
    if (this.setWHSwitch) {
      this.filterWh = this.getSetWh()
    }

    // 获取宽高比设置
    this.ratioSwitch = form.ratioSwitch.checked
    if (this.ratioSwitch) {
      this.ratioType = this.getRatio()
    }

    // 获取 id 范围设置
    this.idRangeSwitch = form.idRangeSwitch.checked
    if (this.idRangeSwitch) {
      this.idRange = this.getIdRange()
    }

    // 获取投稿时间设置
    this.postDate = this.getPostDateSetting()

    // 获取必须包含的tag
    this.needTagSwitch = form.needTagSwitch.checked
    if (this.needTagSwitch) {
      this.includeTag = this.getIncludeTag()
    }
    // 获取要排除的tag
    this.notNeedTagSwitch = form.notNeedTagSwitch.checked
    if (this.notNeedTagSwitch) {
      this.excludeTag = this.getExcludeTag()
    }

    // 获取只下载首次登场设置
    this.debut = this.getDebut()

    this.getSize()
  }

  // 检查作品是否符合过滤器的要求
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  // 所有过滤器里，都必须要检查参数为 undefined 的情况
  public async check(option: FilterOption): Promise<boolean> {
    // 检查下载的作品类型设置
    if (!this.checkDownType(option.illustType)) {
      return false
    }

    // 检查图片张数是否允许下载
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

    // 检查首次登场设置
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
    this.downType0 = form.downType0.checked
    this.downType1 = form.downType1.checked
    this.downType2 = form.downType2.checked
    this.downType3 = form.downType3.checked

    // 如果全部排除则取消任务
    if (
      !this.downType0 &&
      !this.downType1 &&
      !this.downType2 &&
      !this.downType3
    ) {
      this.throwError(lang.transl('_checkNotdownTypeAll'))
    }

    let notDownTip = ''

    notDownTip += this.downType0 ? '' : lang.transl('_插画')
    notDownTip += this.downType1 ? '' : lang.transl('_漫画')
    notDownTip += this.downType2 ? '' : lang.transl('_动图')
    notDownTip += this.downType3 ? '' : lang.transl('_小说')

    if (notDownTip) {
      log.warning(lang.transl('_checkNotdownTypeResult') + notDownTip)
    }
  }

  private getDownTypeByImgCount() {
    this.downSingleImg = form.downSingleImg.checked
    this.downMultiImg = form.downMultiImg.checked

    let notDownTip = ''

    notDownTip += this.downSingleImg ? '' : lang.transl('_单图作品')
    notDownTip += this.downMultiImg ? '' : lang.transl('_多图作品')

    if (notDownTip) {
      log.warning(lang.transl('_checkNotdownTypeResult') + notDownTip)
    }
  }

  // 获取图像颜色设置
  private getDownTypeByColor() {
    this.downColorImg = form.downColorImg.checked
    this.downBlackWhiteImg = form.downBlackWhiteImg.checked

    // 如果全部排除则取消任务
    if (!this.downColorImg && !this.downBlackWhiteImg) {
      this.throwError(lang.transl('_checkNotdownTypeAll'))
    }

    let notDownTip = ''

    notDownTip += this.downColorImg ? '' : lang.transl('_彩色图片')
    notDownTip += this.downBlackWhiteImg ? '' : lang.transl('_黑白图片')

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
    const result = '' || this.getTagString(form.needTag.value)
    if (result) {
      log.warning(lang.transl('_设置了必须tag之后的提示') + result)
    }
    return result
  }

  // 获取要排除的tag
  private getExcludeTag() {
    const result = '' || this.getTagString(form.notNeedTag.value)
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

    const checkWidth = API.checkNumberGreater0(form.setWidth.value)
    const checkHeight = API.checkNumberGreater0(form.setHeight.value)

    // 宽高只要有一个条件大于 0 即可
    if (checkWidth.value > 0 || checkHeight.value > 0) {
      result = {
        andOr: form.setWidthAndOr.value as '&' | '|',
        width: checkWidth ? checkWidth.value : 0,
        height: checkHeight ? checkHeight.value : 0,
      }

      log.warning(
        lang.transl('_设置了筛选宽高之后的提示文字p1') +
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
    this.BMKNumMin = this.BMKNumMinDef
    this.BMKNumMax = this.BMKNumMaxDef

    const min = API.checkNumberGreater0(form.BMKNumMin.value)
    const max = API.checkNumberGreater0(form.BMKNumMax.value)

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
    const result = form.setOnlyBmk.checked
    if (result) {
      log.warning(lang.transl('_只下载已收藏的提示'))
    }
    return result
  }

  // 获取宽高比设置
  private getRatio() {
    let result = form.ratio.value

    if (result === '1') {
      log.warning(lang.transl('_设置了宽高比之后的提示', lang.transl('_横图')))
    } else if (result === '2') {
      log.warning(lang.transl('_设置了宽高比之后的提示', lang.transl('_竖图')))
    } else if (result === '3') {
      // 由用户输入
      const typeNum = parseFloat(form.userRatio.value)
      if (isNaN(typeNum)) {
        result = '0'
        form.ratio.value = result
        window.alert(lang.transl('_宽高比必须是数字'))
      } else {
        log.warning(lang.transl('_输入宽高比') + form.userRatio.value)
      }
    }

    return result
  }

  // 获取 id 范围设置
  private getIdRange() {
    const result = parseInt(form.idRange.value)

    if (result === 1 || result === 2) {
      let id = parseInt(form.idRangeInput.value)
      if (isNaN(id)) {
        EVT.fire(EVT.events.crawlError)

        const msg = 'id is not a number!'
        window.alert(msg)
        log.error(msg)
        throw new Error(msg)
      }
    }

    if (result === 1) {
      log.warning(`id > ${form.idRangeInput.value}`)
    }

    if (result === 2) {
      log.warning(`id < ${form.idRangeInput.value}`)
    }

    return result
  }

  // 获取投稿时间设置
  private getPostDateSetting() {
    if (form.postDate.checked === false) {
      return false
    } else {
      // 如果启用了此设置，需要判断是否是有效的时间格式
      const postDateStart = new Date(form.postDateStart.value)
      const postDateEnd = new Date(form.postDateEnd.value)
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
          `${lang.transl('_时间范围')}: ${form.postDateStart.value} - ${
            form.postDateEnd.value
          }`
        )
        return true
      }
    }
  }

  // 获取首次登场设置
  private getDebut() {
    const result = form.debut.value === '1'
    if (result) {
      log.warning(lang.transl('_抓取首次登场的作品Title'))
    }

    return result
  }

  // 获取文件体积设置
  private getSize() {
    this.sizeSwitch = form.sizeSwitch.checked
    if (this.sizeSwitch) {
      let min = parseFloat(form.sizeMin.value)
      isNaN(min) && (min = 0)

      let max = parseFloat(form.sizeMax.value)
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
          return this.downType0 ? true : false
        case 1:
          return this.downType1 ? true : false
        case 2:
          return this.downType2 ? true : false
        case 3:
          return this.downType3 ? true : false
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

    if (pageCount === 1 && this.downSingleImg) {
      return true
    }

    if (pageCount > 1 && this.downMultiImg) {
      return true
    }

    return false
  }

  // 检查过滤黑白图像设置
  private async checkBlackWhite(imgUrl: FilterOption['mini']) {
    // 如果没有图片网址，或者没有排除任何一个选项，则不检查
    if (!imgUrl || (this.downColorImg && this.downBlackWhiteImg)) {
      return true
    }

    // result 为 true，表示它是黑白图片，false 是彩色图片
    const result = await blackAndWhiteImage.check(imgUrl)

    return (result && this.downBlackWhiteImg) || (!result && this.downColorImg)
  }

  // 检查收藏数要求
  private checkBMK(bmk: FilterOption['bookmarkCount']) {
    if (bmk === undefined || !this.filterBMKNum) {
      return true
    } else {
      return bmk >= this.BMKNumMin && bmk <= this.BMKNumMax
    }
  }

  // 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
  private checkOnlyBmk(bookmarked: any) {
    if (bookmarked === undefined || !this.onlyBmk) {
      return true
    }

    return !!bookmarked
  }

  // 检查作品是否符合包含 tag 的条件, 如果设置了多个 tag，需要作品里全部包含。返回值表示是否保留这个作品。
  private checkIncludeTag(tags: FilterOption['tags']) {
    if (!this.needTagSwitch || !this.includeTag || tags === undefined) {
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
    if (!this.notNeedTagSwitch || !this.excludeTag || tags === undefined) {
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
    if (!this.setWHSwitch) {
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
    if (!this.ratioSwitch) {
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
      return width / height >= parseFloat(form.userRatio.value)
    }
  }

  // 检查 id 范围设置
  private checkIdRange(id: FilterOption['id']) {
    if (id === undefined || !this.idRangeSwitch) {
      return true
    }

    const nowId = parseInt(id.toString())
    const setId = parseInt(form.idRangeInput.value)

    if (this.idRange === 1) {
      // 大于
      return nowId > setId
    } else if (this.idRange === 2) {
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
    if (!this.debut || yes_rank === undefined) {
      return true
    } else {
      if (yes_rank === 0 || yes_rank === undefined) {
        return true
      } else {
        return false
      }
    }
  }

  // 检查文件体积
  private checkSize(size: FilterOption['size']) {
    if (!this.sizeSwitch || size === undefined) {
      return true
    }

    return size >= this.sizeMin && size <= this.sizeMax
  }
}

const filter = new Filter()
export { filter }
