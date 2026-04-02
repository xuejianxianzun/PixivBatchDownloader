import { API } from '../API'
import { secretSignal } from '../utils/SecretSignal'
import { Utils } from '../utils/Utils'
import { illustsData } from '../store/WorkPublishTimeIllusts'
import { novelsData } from '../store/WorkPublishTimeNovels'
import { log } from '../Log'

// 数据源是二维数组，里面的每一项都是一个由作品 id 和作品发布时间组成的子数组。如：
// [[20, 1189343647000], [10000, 1190285376000], [20006, 1190613767000]]

class WorkPublishTime {
  constructor() {
    this.illustsLength = illustsData.length
    this.novelsLength = novelsData.length

    secretSignal.register('ppdtask1', async () => {
      await this.crawlData('illusts')
      await this.crawlData('novels')
    })
  }

  /**每隔 10000 个作品采集一次发布时间数据 */
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
    const data = type === 'illusts' ? illustsData : novelsData
    const length = type === 'illusts' ? this.illustsLength : this.novelsLength
    const index = Math.floor(id / this.gap)

    // 如果传入的 id 匹配到最后一条记录，则将结束时间设置为现在
    if (index >= length - 1) {
      return [data[length - 1][1], Date.now()]
    }

    // 如果传入的 id 匹配到第一条记录，则直接返回数据
    if (index === 0) {
      return [data[0][1], data[1][1]]
    }

    const record = data[index]
    // 如果有与传入 id 相匹配的记录，则判断这个记录的 id 与传入的 id 哪个大
    // 如果记录的 id 等于传入的 id，则直接返回其时间戳
    if (record[0] === id) {
      return [record[1], record[1]]
    } else if (record[0] < id) {
      // 如果记录的 id 小于传入的 id，则此记录的时间作为开始时间，下一条记录的时间作为结束时间
      // 此时必然有下一条记录，因为前面已经处理了没有下一条记录的情况
      return [record[1], data[index + 1][1]]
    } else {
      // 如果记录的 id 大于传入的 id，则此记录的时间作为结束时间，上一条记录的时间作为开始时间
      // 此时必然有上一条记录，因为前面已经处理了没有上一条记录的情况
      return [data[index - 1][1], record[1]]
    }
  }

  /** 获取插画或小说分类里新增的数据 */
  private async crawlData(
    type: 'illusts' | 'novels' = 'illusts'
  ): Promise<number[][]> {
    // 从已保存的数据里获取开始抓取的 id
    const historyData = type === 'illusts' ? illustsData : novelsData
    const start = historyData[historyData.length - 1][0] + this.gap

    // 通过 API 获取结束 id
    const option = {
      lastId: '0',
      limit: '20',
      type: '',
      r18: 'false',
    }
    let end = 0
    try {
      if (type === 'illusts') {
        option.type = 'illust'
        const data = await API.getNewIllustData(option)
        end = Number(data.body.illusts[0].id)
      } else {
        const data = await API.getNewNovelData(option)
        end = Number(data.body.novels[0].id)
      }
    } catch (error) {
      log.error('API error when get new data for crawl work publish time')
      return []
    }

    log.success(`🚀start crawl ${type} time data`)
    log.log(`start id: ${start}<br>end id: ${end}`)

    const min_illust = 20 // 最早的插画作品
    const min_novel = 129 // 最早的小说作品
    const result: number[][] = []

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
    log.success(`✅crawl time data complete`)
    log.log(`total: ${result.length} records`)
    log.log('')

    if (result.length === 0) {
      return result
    }

    const resultList = await Utils.json2BlobSafe(result)
    for (const result of resultList) {
      Utils.downloadFile(
        result.url,
        `workPublishTime-${type}-${start}-${end}.json`
      )
    }

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
      }, 1600)
    })
  }
}

const workPublishTime = new WorkPublishTime()
export { workPublishTime }
