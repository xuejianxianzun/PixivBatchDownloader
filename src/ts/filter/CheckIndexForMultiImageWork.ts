import { lang } from '../Language'
import { log } from '../Log'
import { settings } from '../setting/Settings'

/** 检查多图作品里的某一张图片是否应该保留 */
// 这个过滤器是在 Store 里使用的，所以独立出来了，没有放在 Filter 里
class CheckIndexForMultiImageWork {
  /** 检查多图作品只下载前几张图片 */
  private onlyCrawlFirstFewImages(index: number) {
    if (!settings.onlyCrawlFirstFewImagesSwitch) {
      return true
    }
    return index < settings.onlyCrawlFirstFewImagesCount
  }

  /** 多图作品只抓取后几张图片 */
  private onlyCrawlLastFewImages(index: number, pageCount: number) {
    if (!settings.onlyCrawlLastFewImagesSwitch) {
      return true
    }
    return index >= pageCount - settings.onlyCrawlLastFewImagesCount
  }

  /** 多图作品不抓取前几张图片 */
  private doNotCrawlFirstImages(index: number, pageCount: number) {
    if (!settings.doNotCrawlFirstImagesSwitch) {
      return true
    }
    if (settings.doNotCrawlFirstImagesCount >= pageCount) {
      return index === pageCount - 1
    }
    return index >= settings.doNotCrawlFirstImagesCount
  }

  /** 多图作品不抓取后几张图片 */
  private doNotCrawlLastImages(index: number, pageCount: number) {
    if (!settings.doNotCrawlLastImagesSwitch) {
      return true
    }
    // 如果设置的数字大于作品里的图片数量，那么下载器会保留第一张图片，而非排除整个作品。
    if (settings.doNotCrawlLastImagesCount >= pageCount) {
      return index === 0
    }
    return index < pageCount - settings.doNotCrawlLastImagesCount
  }

  /** 特定用户的多图作品不下载最后几张图片 */
  private forSpecialUser(index: number, pageCount: number, userId: string) {
    const removeLastFew = settings.DoNotDownloadLastFewImagesList.find(
      (item) => item.uid === Number.parseInt(userId)
    )
    if (!removeLastFew) {
      return true
    }
    // 如果设置的数字大于作品里的图片数量，那么只排除最后一张
    // 这个规则与前面的不同，这是特意为之的，因为这是一个定制功能
    if (removeLastFew.value >= pageCount) {
      return index < pageCount - 1
    }
    return index < pageCount - removeLastFew.value
  }

  public check(index: number, pageCount: number, userId: string) {
    // 每个过滤器的 true 都表示保留这个图片，false 表示排除这个图片
    // 排除的优先级高于保留的优先级，也就是说先检查排除的规则，满足任意一个排除规则就直接排除，不再继续检查保留的规则
    // 先检查不抓取特定图片的规则，满足任意一个规则就直接排除，不再继续检查
    const notCrawlFirst = this.doNotCrawlFirstImages(index, pageCount)
    if (!notCrawlFirst) {
      log.warning(
        lang.transl('_下载器排除了多图作品里的部分图片原因') +
          lang.transl('_多图作品不抓取前几张图片'),
        'checkDoNotCrawlFirstImages'
      )
      return false
    }

    const notCrawlLast = this.doNotCrawlLastImages(index, pageCount)
    if (!notCrawlLast) {
      log.warning(
        lang.transl('_下载器排除了多图作品里的部分图片原因') +
          lang.transl('_多图作品不抓取后几张图片'),
        'checkDoNotCrawlLastImages'
      )
      return false
    }

    const forSpecialUser = this.forSpecialUser(index, pageCount, userId)
    if (!forSpecialUser) {
      log.warning(
        lang.transl('_下载器排除了多图作品里的部分图片原因') +
          lang.transl('_特定用户的多图作品不下载最后几张图片'),
        'checkDoNotDownloadLastFewImagesForSpecialUser'
      )
      return false
    }

    // 如果图片没有被“不抓取”规则排除，才会检查“只抓取”的规则

    // 如果没有启用任何只抓取规则，就保留这个图片
    if (
      !settings.onlyCrawlFirstFewImagesSwitch &&
      !settings.onlyCrawlLastFewImagesSwitch
    ) {
      return true
    }

    let and = false
    if (
      settings.onlyCrawlFirstFewImagesSwitch &&
      settings.onlyCrawlLastFewImagesSwitch
    ) {
      // 如果同时启用了两个只抓取规则，则使用 OR（只要满足任意一个只抓取规则就保留）
      // 这意味这用户可以设置同时抓取第一张和最后一张图片，跳过中间的图片
      and = false
    } else {
      // 如果只启用了一个只抓取规则，那么就用 AND，即必须满足两个只抓取条件才保留，这样才能达到只启用一个规则时的预期效果
      and = true
    }

    let reason = ''
    let logKey = ''
    const crawlFirst = this.onlyCrawlFirstFewImages(index)
    if (!crawlFirst) {
      // 如果不满足只抓取的规则，不会立刻排除它，而是继续检查其他的只抓取规则
      reason = lang.transl('_多图作品只抓取前几张图片')
      logKey = 'checkOnlyCrawlFirstFewImages'
    }

    const crawlLast = this.onlyCrawlLastFewImages(index, pageCount)
    if (!crawlLast) {
      reason = lang.transl('_多图作品只抓取后几张图片')
      logKey = 'checkOnlyCrawlLastFewImages'
    }

    const shouldCrawl = and ? crawlFirst && crawlLast : crawlFirst || crawlLast
    if (!shouldCrawl) {
      log.warning(
        lang.transl('_下载器排除了多图作品里的部分图片原因') + reason,
        logKey
      )
    }
    return shouldCrawl
  }
}

const checkIndexForMultiImageWork = new CheckIndexForMultiImageWork()
export { checkIndexForMultiImageWork }
