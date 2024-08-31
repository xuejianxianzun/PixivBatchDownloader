import { EVT } from '../EVT'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { ArtworkData, NovelData } from './CrawlResult.d'
import { Utils } from '../utils/Utils'
import { Tools } from '../Tools'
import { WorkTypeString } from '../store/StoreType'
import { API } from '../API'

// 当 Pixiv 会员在搜索页面按热门度排序，并且设置了收藏数量时，可以进行优化以减少不必要的抓取
// 原理：当会员使用热门度排序时，Pixiv 返回的数据是按收藏数量从高到低排序的。（但不是严格一致，经常有少量作品顺序不对）
// 假如会员用户在下载器里设置了收藏数量大于 10000，那么当查找到小于 10000 收藏的作品时，就可以考虑停止抓取作品了，因为后面的作品都是收藏数量低于 10000 的了
class VipSearchOptimize {
  constructor() {
    this.bindEvents()
  }

  // 在哪些页面上启用
  private readonly enablePageType: number[] = [
    pageType.list.ArtworkSearch,
    pageType.list.NovelSearch,
  ]
  // 小说搜索页面的列表数据中本身就含有每个作品的收藏数，但是依然需要在这个模块里进行优化处理

  // 只有会员才能使用的排序方式（按热门度排序）
  private readonly vipOrders: string[] = [
    'popular_d',
    'popular_male_d',
    'popular_female_d',
  ]
  // popular_d 受全站欢迎
  // popular_male_d 受男性欢迎
  // popular_female_d 受女性欢迎

  // 是否对这次抓取使用优化策略
  private vipSearchOptimize = false

  private filterFailed = 0 // 连续检查失败的数量。在检查作品是否满足收藏条件时，如果满足就将此计数清零；如果不满足就自增
  private readonly checkNumber = 20 // 连续多少个作品未达到要求时，停止抓取。这是一个猜测值
  // 设置 checkNumber 的原因：Pixiv 按热门度排序返回的数据其实并不是严格按照收藏数量排序的。所以设置一个数字作为处理这个情况的手段：连续多少个作品都不满足要求时，认为后续都是不满足要求的

  private bindEvents() {
    // 启动抓取时设置是否启用优化策略
    window.addEventListener(EVT.list.crawlStart, () => {
      this.vipSearchOptimize = this.setVipOptimize()
      // console.log('vipSearchOptimize: ', this.vipSearchOptimize)
    })

    // 抓取完毕时重置状态
    window.addEventListener(EVT.list.crawlComplete, () => {
      this.reset()
    })
  }

  private reset() {
    this.vipSearchOptimize = false
    this.filterFailed = 0
  }

  /**在抓取列表页阶段，每隔一定页数，接收最后一个作品的 id，检查它的收藏数量，如果收藏数低于指定值，则停止抓取
   *
   * 返回值 true 表示停止抓取
   */
  public async checkWork(
    id: string,
    workType: WorkTypeString
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      // 如果未启用会员搜索优化，或者没有设置收藏数量要求，则不停止抓取
      if (!this.vipSearchOptimize || !settings.BMKNumSwitch) {
        return resolve(false)
      }

      let bmk = 99999999
      if (workType === 'novels') {
        const data = await API.getNovelData(id)
        bmk = data.body.bookmarkCount
      } else {
        const data = await API.getArtworkData(id)
        bmk = data.body.bookmarkCount
      }

      const check = bmk >= settings.BMKNumMin
      console.log(bmk)
      if (!check) {
        console.log('抽查的作品收藏数量低于最低要求，停止抓取')
        return resolve(true)
      }

      return resolve(false)
    })
  }

  /**在抓取作品详情阶段，接收作品数据，判断收藏数量是否达到要求，并据此指示是否应该停止抓取作品
   *
   * 返回值 true 表示停止抓取
   */
  public async checkBookmarkCount(data: NovelData | ArtworkData) {
    // 如果未启用会员搜索优化，或者没有设置收藏数量要求，则不停止抓取
    if (!this.vipSearchOptimize || !settings.BMKNumSwitch) {
      return false
    }

    // 连续多少个作品没有达到要求，则停止抓取
    if (this.filterFailed >= this.checkNumber) {
      return true
    }

    // 在按热门度排序时，作品是按收藏数量从高到低排列的。因此检查作品的收藏数量是否满足用户设置的最小收藏数量
    const check = data.body.bookmarkCount >= settings.BMKNumMin
    // 如果作品的收藏数量小于用户要求的最低收藏数量，那么它就不符合要求
    // 这里不会检查用户设置的最大收藏数量，也不检查日均收藏数量，否则可能在某些情况下出现误判
    // 假设用户设置的收藏数量条件为： >= 100 && <= 200 如果检查最大收藏数量，那么排在最前面的许多作品都不符合要求
    // 所以只检查最小收藏数量

    if (!check) {
      this.filterFailed++
    } else {
      this.filterFailed = 0
    }

    if (this.filterFailed >= this.checkNumber) {
      console.log(`连续 ${this.checkNumber} 个作品没有达到要求，停止抓取`)
    }

    return this.filterFailed >= this.checkNumber
  }

  // 设置是否启用优化策略
  private setVipOptimize() {
    // 判断页面类型
    if (!this.enablePageType.includes(pageType.type)) {
      return false
    }

    // 判断是否是会员
    if (!Tools.isPremium()) {
      return false
    }

    // 判断 order 方式
    const order = Utils.getURLSearchField(window.location.href, 'order')
    // 无排序方式
    if (!order) {
      return false
    }

    const vipOrder = this.vipOrders.includes(order)
    // 不是按热门度排序
    if (!vipOrder) {
      return false
    }

    // 按热门度排序
    // 判断是否启用了收藏数设置，如果是，则启用会员搜索优化
    return settings.BMKNumSwitch
  }
}

const vipSearchOptimize = new VipSearchOptimize()
export { vipSearchOptimize }
