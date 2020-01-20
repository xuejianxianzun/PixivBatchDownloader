// 过滤器
import { FilterOption, FilterWh } from './Filter.d'
import { form } from './Settings'
import { lang } from './Lang'
import { log } from './Log'
import { API } from './API'
import { EVT } from './EVT'

// 审查每个作品的数据，决定是否要下载它。下载区域有一些选项是过滤器选项。
class Filter {
  private downType0 = true
  private downType1 = true
  private downType2 = true

  private multipleImageWorks: number = 0 // 多图作品设置

  private filterBMKNum = false // 是否要求收藏数量

  private BMKNum: number = 0 // 输入的收藏数量

  private onlyBmk: boolean = false // 是否只下载收藏的作品

  // 宽高条件
  private setWHSwitch = false
  private filterWh: FilterWh = {
    andOr: '&',
    width: 0,
    height: 0
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

    // 获取多图作品设置
    this.multipleImageWorks = parseInt(form.multipleImageWorks.value)

    // 获取是否设置了收藏数要求
    this.filterBMKNum = form.favNumSwitch.checked
    if (this.filterBMKNum) {
      this.BMKNum = this.getBMKNum()
    }

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
  }

  // 检查作品是否符合过滤器的要求
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  public check(option: FilterOption): boolean {
    // 储存每一项检查的结果. true 表示保留这个作品
    let result: boolean[] = []

    // 检查下载的作品类型设置
    result.push(this.checkDownType(option.illustType))

    // 检查多图作品设置
    result.push(this.checkMultipleImageWorks(option.pageCount))

    // 检查收藏数要求
    result.push(this.checkBMK(option.bookmarkCount))

    // 检查只下载书签作品的要求
    result.push(this.checkOnlyBmk(option.bookmarkData))

    // 检查要排除的 tag
    result.push(this.checkExcludeTag(option.tags))

    // 检查必须包含的 tag
    result.push(this.checkIncludeTag(option.tags))

    // 检查宽高设置
    result.push(this.checkSetWh(option.width, option.height))

    // 检查宽高比设置
    result.push(this.checkRatio(option.width, option.height))

    // 检查 id 范围设置
    result.push(this.checkIdRange(option.id))

    // 检查投稿时间设置
    result.push(this.checkPostDate(option.createDate))

    // 检查首次登场设置
    result.push(this.checkDebut(option.yes_rank))

    // 结果里不包含 false 时，检查通过。只要有一个 false 就不通过
    return !result.includes(false)
  }

  // 获取下载的作品类型设置
  private getDownType() {
    this.downType0 = form.downType0.checked
    this.downType1 = form.downType1.checked
    this.downType2 = form.downType2.checked

    // 如果全部排除则取消任务
    if (!this.downType0 && !this.downType1 && !this.downType2) {
      EVT.fire(EVT.events.crawlError)

      const msg = lang.transl('_checkNotdownTypeAll')
      log.error(msg, 2)
      window.alert(msg)
      throw new Error(msg)
    }

    let notDownTip = ''

    notDownTip += this.downType0 ? '' : lang.transl('_插画')
    notDownTip += this.downType1 ? '' : lang.transl('_漫画')
    notDownTip += this.downType2 ? '' : lang.transl('_动图')

    if (notDownTip) {
      log.warning(lang.transl('_checkNotdownTypeResult') + notDownTip)
    }
  }

  // 获取必须包含的tag
  private getIncludeTag() {
    const result = '' || this.checkTagString(form.needTag.value)
    if (result) {
      log.warning(lang.transl('_设置了必须tag之后的提示') + result)
    }
    return result
  }

  // 获取要排除的tag
  private getExcludeTag() {
    const result = '' || this.checkTagString(form.notNeedTag.value)
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
      height: 0
    }

    const checkWidth = API.checkNumberGreater0(form.setWidth.value)
    const checkHeight = API.checkNumberGreater0(form.setHeight.value)

    // 宽高只要有一个条件大于 0 即可
    if (checkWidth.value > 0 || checkHeight.value > 0) {
      result = {
        andOr: form.setWidthAndOr.value as '&' | '|',
        width: checkWidth ? checkWidth.value : 0,
        height: checkHeight ? checkHeight.value : 0
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
    const check = API.checkNumberGreater0(form.setFavNum.value)

    if (check.result) {
      log.warning(lang.transl('_设置了筛选收藏数之后的提示文字') + check.value)
    }

    return check.value
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

        default:
          return true
      }
    }
  }

  // 检查多图作品设置
  private checkMultipleImageWorks(pageCount: FilterOption['pageCount']) {
    if (pageCount === undefined) {
      return true
    } else {
      if (pageCount > 1) {
        // 是多图
        if (this.multipleImageWorks === -1) {
          // 不下载多图
          return false
        } else {
          return true
        }
      } else {
        // 不是多图
        return true
      }
    }
  }

  // 检查收藏数要求
  private checkBMK(bmk: FilterOption['bookmarkCount']) {
    if (bmk === undefined || !this.filterBMKNum) {
      return true
    } else {
      return bmk >= this.BMKNum
    }
  }

  // 检查作品是否符合【只下载书签作品】的条件,返回值 true 表示包含这个作品
  private checkOnlyBmk(bookmarked: any) {
    // 如果设置了只下载书签作品
    if (this.onlyBmk) {
      return !!bookmarked
    }

    return true
  }

  // 检查用户输入的 tag 内容
  private checkTagString(str: string) {
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

    if (width === undefined) {
      width = 0
    }
    if (height === undefined) {
      height = 0
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

    if (width === undefined) {
      width = 0
    }
    if (height === undefined) {
      height = 0
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
    if (!this.debut) {
      return true
    } else {
      if (yes_rank === 0 || yes_rank === undefined) {
        return true
      } else {
        return false
      }
    }
  }
}
const filter = new Filter()
export { filter }
