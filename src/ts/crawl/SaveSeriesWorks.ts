import { filter, FilterOption } from '../filter/Filter'
import { store } from '../store/Store'
import { SeriesData } from './CrawlResult'

/** 保存系列页面的 API 数据里的作品。
 *
 * 系列页面的 API（https://www.pixiv.net/ajax/series/61267?p=1）返回的数据里：
 * - `body.page.series` 里的才是当前页面的系列作品，但是只有 id 和 order 数据；
 * - `body.thumbnails.illust` 里包含了更详细的数据，并且额外包含了在系列页面里，
 *   显示在作品列表右侧的一些作品，其中有些并不属于当前页面的系列作品。
 *
 * 所以这里先从 `body.page.series` 里取出本页面的作品 id，再从 `body.thumbnails.illust` 里
 * 查找 id 对应的数据，进行过滤，然后把符合要求的作品保存到 store.idList 里。
 */
class SaveSeriesWorks {
  /** 保存一个系列页面里的作品。传入的是系列 API 返回的 body 数据 */
  public async save(body: SeriesData['body']) {
    // 保存本页面的作品的 id 列表
    const idList: string[] = []
    for (const info of body.page.series) {
      idList.push(info.workId)
    }

    // 从 illust 里查找 id 对应的数据，进行过滤
    for (const work of body.thumbnails.illust) {
      if (!idList.includes(work.id)) {
        continue
      }
      if (work.isAdContainer) {
        continue
      }

      // 过滤器进行检查
      const filterOpt: FilterOption = {
        aiType: work.aiType,
        id: work.id,
        isOriginal: work.isOriginal,
        tags: work.tags,
        title: work.title,
        bookmarkData: !!work.bookmarkData,
        width: work.pageCount === 1 ? work.width : 0,
        height: work.pageCount === 1 ? work.height : 0,
        workType: work.illustType,
        userId: work.userId,
        createDate: work.createDate,
        xRestrict: work.xRestrict,
      }

      // 这个 api 的 illust 数据可能是插画也可能是漫画
      if (await filter.check(filterOpt)) {
        store.idList.push({
          type: 'illusts',
          id: work.id,
        })
      }
    }
  }
}

const saveSeriesWorks = new SaveSeriesWorks()
export { saveSeriesWorks }
