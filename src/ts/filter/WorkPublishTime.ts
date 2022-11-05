import { API } from '../API'
import { secretSignal } from '../utils/SecretSignal'
import { Utils } from '../utils/Utils'
import { illustsData } from '../store/workPublishTimeIllusts'
import { novelData as novelsData } from '../store/WorkPublishTimeNovels'

// 获取指定 id 的发布时间范围
class WorkPublishTime {
  constructor() {
    this.illustsLength = illustsData.length
    this.novelsLength = novelsData.length
    this.bindEvents()
  }

  // 数据源是数组结构，里面的每一项都是一个由作品 id 和作品发布时间组成的子数组。如：
  // [[20, 1189343647000], [10000, 1190285376000], [20006, 1190613767000]]

  /**每隔 10000 个作品采集一次数据 */
  private readonly gap = 10000

  private illustsLength = 0
  private novelsLength = 0

  /**获取作品的发布时间范围。
   *
   * 返回值是一个包含 2 个数字的数组，第一个数字是开始时间，第二个数字是结束时间。 */
  public getTimeRange(
    id: number,
    type: 'illusts' | 'novels' = 'illusts'
  ): number[] {
    let start = 0
    let end = 0

    const data = type === 'illusts' ? illustsData : novelsData
    const length = type === 'illusts' ? this.illustsLength : this.novelsLength
    const index = Math.floor(id / this.gap)

    // 如果传入的 id 比最后一条数据更大，则有可能没有与之匹配的记录，此时使用最后一条记录作为其开始时间
    let record1 = data[index]
    if (!record1) {
      start = data[length - 1][1]
      end = new Date().getTime()
      return [start, end]
    }

    // 如果有与传入 id 相匹配的记录，则判断这个记录的 id 传入的 id 哪个大
    // 如果记录的 id 小于等于传入的 id，则此记录的时间作为开始时间，下一条记录的时间作为结束时间
    if (record1[0] <= id) {
      start = record1[1]
      const next = data[index + 1]
      // 如果没有下一条记录，则使用现在的时间作为结束时间
      end = next ? next[1] : new Date().getTime()
      return [start, end]
    } else {
      // 如果记录的 id 大于传入的 id，则此记录的时间作为结束时间，上一条记录的时间作为开始时间
      end = record1[1]
      const prev = data[index - 1]
      // 如果没有上一条记录，则把开始时间设为 0
      start = prev ? prev[1] : 0
      return [start, end]
    }
  }

  private bindEvents() {
    secretSignal.register('ppdtask1', () => {
      // 当前最新数据截止到 2022 年 10 月 29 日，最后一个作品 id 是 102324813
      this.crawlData(1, 102324813)
    })

    secretSignal.register('ppdtask2', () => {
      // 当前最新数据截止到 2022 年 10 月 30 日，最后一个作品 id 是 18628857
      this.crawlData(1, 18628857, 'novels')
    })
  }

  private async crawlData(
    start: number,
    end: number,
    type: 'illusts' | 'novels' = 'illusts'
  ): Promise<number[][]> {
    console.log('start crawl time data')
    const result: number[][] = []

    const min_illust = 20 // 最早的插画作品
    const min_novel = 129 // 最早的小说作品

    let id = start
    if (type === 'illusts' && start < min_illust) {
      id = min_illust
    }
    if (type === 'novels' && start < min_novel) {
      id = min_novel
    }

    while (id < end) {
      const data = await this.crawlWork(id, type)
      result.push(data)
      // 使用下一个接近 10000 倍数的 id 进行下一次抓取
      id = (Math.floor(data[0] / this.gap) + 1) * this.gap
    }

    console.log(result)
    console.log('crawl time data complete')
    const blob = Utils.json2BlobSafe(result)
    const url = URL.createObjectURL(blob)
    Utils.downloadFile(url, `workPublishTime-${type}-${start}-${end}.json`)

    return result
  }

  // 获取指定作品的发布时间
  // 如果抓取出错（如 404 错误），则顺延到下一个作品 id 重试抓取
  private async crawlWork(
    id: number,
    type: 'illusts' | 'novels' = 'illusts'
  ): Promise<number[]> {
    return new Promise(async (resolve) => {
      // 为了避免出现 429 错误，每次抓取之间设置了间隔时间
      window.setTimeout(async () => {
        try {
          const data = await API[
            type === 'illusts' ? 'getArtworkData' : 'getNovelData'
          ](id.toString())
          if (data.error === false) {
            const dateStr = data.body.createDate
            if (!dateStr) {
              return resolve(this.crawlWork(++id, type))
            }
            const time = new Date(dateStr).getTime()
            return resolve([id, time])
          } else {
            return resolve(this.crawlWork(++id, type))
          }
        } catch (error) {
          return resolve(this.crawlWork(++id, type))
        }
      }, 1700)
    })
  }
}

const workPublishTime = new WorkPublishTime()
export { workPublishTime }
