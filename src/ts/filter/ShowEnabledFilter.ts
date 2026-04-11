import { lang } from '../Language'
import { log } from '../Log'
import { states } from '../store/States'
import { settings } from '../setting/Settings'
import { msgBox } from '../MsgBox'

// 在日志里显示已启用的过滤器
class ShowEnabledFilter {
  private wrongSetting = false
  /** 如果设置项的值不合法，显示提示 */
  private error(msg: string) {
    msg = '❌' + msg
    this.wrongSetting = true
    log.error(msg.replace('<br>', ''))
    msgBox.error(msg, {
      title: lang.transl('_抓取条件不正确'),
    })
  }

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
    this.getDoNotCrawlDownloadedWorks()
    this.getMultiImageWorkImageLimit()
    this.getCrawlFirstFewImages()
    this.getDoNotCrawlLastImage()
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
      log.warning('🛸' + lang.transl('_抓取首次登场的作品Title'))
    }

    return this.wrongSetting
  }

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

  /** 提示多图作品只下载前几张图片 */
  // 这个设置项会在这里显示提示，但不会在这里进行检查，因为它是在生成抓取结果时生效的
  private getCrawlFirstFewImages() {
    if (settings.firstFewImagesSwitch) {
      log.warning(
        '🛸' +
          `${lang.transl('_多图作品只下载前几张图片')}: ${settings.firstFewImages}`
      )
    }
  }

  /** 提示不抓取多图作品的最后一张图片 */
  // 这个设置项会在这里显示提示，但不会在这里进行检查，因为它是在生成抓取结果时生效的
  private getDoNotCrawlLastImage() {
    if (settings.doNotDownloadLastImageOfMultiImageWork) {
      log.warning('🛸' + `${lang.transl('_不抓取多图作品的最后一张图片')}`)
    }
  }

  /** 提示多图作品的图片数量限制 */
  private getMultiImageWorkImageLimit() {
    if (!settings.multiImageWorkImageLimitSwitch) {
      return
    }

    if (settings.multiImageWorkImageLimit > 0) {
      log.warning(
        '🛸' +
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
        '🛸' +
          lang.transl('_设置了必须tag之后的提示') +
          settings.needTag.toString()
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
        '🛸' +
          lang.transl('_设置了排除tag之后的提示') +
          settings.notNeedTag.toString()
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
        '🛸' +
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
        '🛸' +
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
      log.warning('🛸' + text)
    }
  }

  /** 提示不抓取下载过的作品 */
  private getDoNotCrawlDownloadedWorks() {
    if (!settings.DonotCrawlAlreadyDownloadedWorks) {
      return
    }

    log.warning('🛸' + lang.transl('_不抓取下载过的作品'))
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
      log.warning('🛸' + lang.transl('_收藏数大于') + min)
    }

    if (max >= 0) {
      log.warning('🛸' + lang.transl('_收藏数小于') + max)
    }

    if (average >= 0 && settings.BMKNumAverageSwitch) {
      log.warning('🛸' + `${lang.transl('_日均收藏数量')} >= ${average}`)
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
          '🛸' +
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
    log.warning('🛸' + array.join(' '))
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
      log.warning('🛸' + `${lang.transl('_时间范围')}: ${start} - ${end}`)
    }
  }

  /** 提示文件体积设置 */
  private getSize() {
    if (!settings.sizeSwitch) {
      return
    }

    log.warning(
      '🛸' +
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
        '🛸' +
          lang.transl('_用户阻止名单') +
          ': ' +
          settings.blockList.toString()
      )
    }
  }
}

const showEnabledFilter = new ShowEnabledFilter()
export { showEnabledFilter }
