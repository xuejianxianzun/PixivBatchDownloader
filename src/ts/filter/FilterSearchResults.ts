import { settings } from '../setting/Settings'
import { EVT } from '../EVT'
import {
  NovelSearchData,
  SearchData as imageSearchData,
} from '../crawl/CrawlResult'
import { filter, FilterOption } from './Filter'
import { Tools } from '../Tools'

// 单个图像/漫画作品的类型
type ImageWork = imageSearchData['body']['illust']['data'][number]
// 单个小说作品的类型
type NovelWork = NovelSearchData['body']['novel']['data'][number]
// 两者的联合类型
type Work = ImageWork | NovelWork

// 类型守卫：如果 work 对象有 illustType 属性，就是 ImageWork
function isImageWork(work: Work): work is ImageWork {
  return (work as ImageWork).illustType !== undefined
}

/** 拦截 API 的请求，检查搜索结果的数据，过滤掉不符合要求的作品 */
class FilterSearchResults {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    // 当这个设置变化时，通知注入脚本
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'filterSearchResults') {
        window.postMessage(
          {
            source: 'pixiv-downloader-content-script',
            setEnable: settings.filterSearchResults,
          },
          window.location.origin
        )
      }
    })

    // 接收注入脚本发送过来的数据
    window.addEventListener('message', async (event) => {
      if (
        event.source === window &&
        event.data.source === 'pixiv-downloader-inject-script'
      ) {
        const { url, requestId, dataToFilter } = event.data
        // 如果不需要处理，则直接返回原数据
        if (!settings.filterSearchResults || !url || !this.needFilter(url)) {
          return this.postResult(requestId, dataToFilter)
        }

        // 过滤数据
        // 第一次执行过滤时比较慢，要 200 ms 左右，之后就很快，只需要几毫秒
        await this.filterData(dataToFilter)

        // 返回数据
        this.postResult(requestId, dataToFilter)
      }
    })
  }

  private async filterData(data: imageSearchData | NovelSearchData) {
    if (!data || !data.body) {
      return
    }

    const workListKeys = ['illustManga', 'illust', 'manga', 'novel'] as const

    for (const key of workListKeys) {
      const workListContainer = (data.body as any)[key]
      if (workListContainer && Array.isArray(workListContainer.data)) {
        const list: Work[] = workListContainer.data

        const filterResults = await Promise.all(
          list.map((work) => {
            let option: FilterOption

            // 根据作品类型设置不同的过滤选项
            if (isImageWork(work)) {
              // 图像作品
              option = {
                aiType: work.aiType,
                id: work.id,
                workType: work.illustType,
                workTypeString: Tools.getWorkTypeString(work.illustType),
                tags: work.tags,
                title: work.title,
                bookmarkData: work.bookmarkData,
                createDate: work.createDate,
                width: work.width,
                height: work.height,
                pageCount: work.pageCount,
                userId: work.userId,
                xRestrict: work.xRestrict,
                mini: work.url,
              }
            } else {
              // 小说作品
              option = {
                aiType: work.aiType,
                id: work.id,
                workType: 3,
                workTypeString: 'novels',
                tags: work.tags,
                title: work.title,
                bookmarkData: work.bookmarkData,
                userId: work.userId,
                createDate: work.createDate,
                xRestrict: work.xRestrict,
              }
            }
            return filter.check(option)
          })
        )
        workListContainer.data = list.filter((_, index) => filterResults[index])
        console.log('过滤后的作品数量：', workListContainer.data.length)
      }
    }
  }

  /**将处理完的数据响应回去 */
  private postResult(requestId: string, filteredData: any) {
    window.postMessage(
      {
        source: 'pixiv-downloader-content-script',
        requestId,
        filteredData,
      },
      window.location.origin
    )
  }

  // 需要拦截的 API 列表，都是搜索页面里的 API
  private readonly apiList = [
    'ajax/search/top/',
    'ajax/search/illustrations/',
    'ajax/search/artworks/',
    'ajax/search/manga/',
    'ajax/search/novels/',
  ]

  private needFilter(url: string) {
    return this.apiList.some((api) => url.includes(api))
  }
}

new FilterSearchResults()
