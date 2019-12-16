// 过滤器
import { FilterOption, FilterWh } from './Filter.d'
import { ui } from './UI'
import { lang } from './Lang'
import { log } from './Log'
import { API } from './API'

// 审查每个作品的数据，决定是否要下载它。下载区域有一些选项是过滤器选项。
class Filter {
  private notdownType: string = '' // 设置不要下载的作品类型

  private includeTag: string = '' // 必须包含的tag的列表

  private excludeTag: string = '' // 要排除的tag的列表

  private BMKNum: number = 0 // 要求收藏达到指定数量

  private onlyBmk: boolean = false // 是否只下载收藏的作品

  // 宽高条件
  private filterWh: FilterWh = {
    andOr: '&',
    width: 0,
    height: 0
  }

  private ratioType: string = '0' // 宽高比例的类型

  private debut: boolean = false // 只下载首次登场的作品

  // 从下载区域上获取过滤器的各个选项
  public init() {
    // 检查排除作品类型的设置
    this.notdownType = this.getNotDownType()

    // 检查是否设置了收藏数要求
    this.BMKNum = this.getBmkNum()

    // 检查是否设置了只下载书签作品
    this.onlyBmk = this.getOnlyBmk()

    // 检查是否设置了宽高条件
    this.filterWh = this.getSetWh()

    // 检查宽高比设置
    this.ratioType = this.getRatio()

    // 获取必须包含的tag
    this.includeTag = this.getIncludeTag()

    // 获取要排除的tag
    this.excludeTag = this.getExcludeTag()

    // 检查是否设置了只下载首次登场
    this.debut = this.getDebut()
  }

  // 检查作品是否符合过滤器的要求
  // 想要检查哪些数据就传递哪些数据，不需要传递 FilterOption 的所有选项
  public check(option: FilterOption): boolean {
    // 储存每一项检查的结果. true 表示保留这个作品
    let result: boolean[] = []

    // 检查排除类型设置
    result.push(this.checkNotDownType(option.illustType))

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

    // 检查首次登场设置
    result.push(this.checkDebut(option.yes_rank))

    // 结果里不包含 false 时，检查通过。只要有一个 false 就不通过
    return !result.includes(false)
  }

  // 获取排除类型
  private getNotDownType() {
    let result = ui.getNotDownType()

    // 如果全部排除则取消任务
    if (result.includes('012')) {
      // notdownType 的结果是顺序的，所以可以直接查找 012
      window.alert(lang.transl('_checkNotdownTypeResult1弹窗'))
      const msg = lang.transl('_checkNotdownTypeResult1Html')
      log.error(msg, 2)
      throw new Error(msg)
    }

    // 排除了至少一种时，显示提示
    if (result.includes('0') || result.includes('1') || result.includes('2')) {
      log.warning(
        lang.transl('_checkNotdownTypeResult3Html') +
          result
            .replace('0', lang.transl('_插画'))
            .replace('1', lang.transl('_漫画'))
            .replace('2', lang.transl('_动图'))
      )
    }

    return result
  }

  // 获取必须包含的tag
  private getIncludeTag() {
    const result = '' || this.checkTagString(ui.form.needTag.value)
    if (result) {
      log.warning(lang.transl('_设置了必须tag之后的提示') + result)
    }
    return result
  }

  // 获取要排除的tag
  private getExcludeTag() {
    const result = '' || this.checkTagString(ui.form.notNeedTag.value)
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

    const checkWidth = API.checkNumberGreater0(ui.form.setWidth.value)
    const checkHeight = API.checkNumberGreater0(ui.form.setHeight.value)

    // 宽高只要有一个条件大于 0 即可
    if (checkWidth.value > 0 || checkHeight.value > 0) {
      result = {
        andOr: ui.form.setWidthAndOr.value as '&' | '|',
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

  // 获取收藏数要求
  private getBmkNum() {
    const check = API.checkNumberGreater0(ui.form.setFavNum.value)

    if (check.result) {
      log.warning(lang.transl('_设置了筛选收藏数之后的提示文字') + check.value)
    }

    return check.value
  }

  // 获取只下载书签作品的设置
  private getOnlyBmk() {
    const result = ui.form.setOnlyBmk.checked
    if (result) {
      log.warning(lang.transl('_只下载已收藏的提示'))
    }
    return result
  }

  // 获取宽高比的设置
  private getRatio() {
    let result = ui.form.ratio.value

    if (result === '1') {
      log.warning(lang.transl('_设置了宽高比之后的提示', lang.transl('_横图')))
    } else if (result === '2') {
      log.warning(lang.transl('_设置了宽高比之后的提示', lang.transl('_竖图')))
    } else if (result === '3') {
      // 由用户输入
      const typeNum = parseFloat(ui.form.userRatio.value)
      if (isNaN(typeNum)) {
        result = '0'
        ui.form.ratio.value = result
        window.alert(lang.transl('_宽高比必须是数字'))
      } else {
        log.warning(lang.transl('_输入宽高比') + ui.form.userRatio.value)
      }
    }

    return result
  }

  // 获取首次登场设置
  private getDebut() {
    const result = ui.form.debut.value === '1'
    if (result) {
      log.warning(lang.transl('_抓取首次登场的作品Title'))
    }

    return result
  }

  // 检查排除类型设置
  private checkNotDownType(illustType: FilterOption['illustType']) {
    if (illustType === undefined) {
      return true
    } else {
      if (this.notdownType.includes(illustType.toString())) {
        return false
      } else {
        return true
      }
    }
  }

  // 检查收藏数要求
  private checkBMK(bmk: FilterOption['bookmarkCount']) {
    if (bmk === undefined) {
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
    let result = false

    if (!this.includeTag || tags === undefined) {
      return true
    }

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
    let result = true

    if (!this.excludeTag || tags === undefined) {
      return true
    }

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
    if (width === undefined) {
      width = 0
    }
    if (height === undefined) {
      height = 0
    }

    if (this.ratioType === '0') {
      return true
    } else if (this.ratioType === '1') {
      return width / height > 1
    } else if (this.ratioType === '2') {
      return width / height < 1
    } else {
      return width / height >= parseFloat(ui.form.userRatio.value)
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
