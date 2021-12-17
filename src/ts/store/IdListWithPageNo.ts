import { store } from './Store'
import { IDData } from './StoreType'
import { Utils } from '../utils/Utils'

type IDDataWithPageNo = IDData & {
  page: number
}

// 这是为了解决抓取多个列表页面时，获得的 id 数据顺序混乱的问题
// 这个类会保留每个 id 所处的页码。抓取完成后可以把这些 id 按页码顺序排列，保证 id 的顺序和在页码里的顺序一致
class IdListWithPageNo {
  // 存储 id 列表，按 pageId 不同分别存储
  private allList: {
    [pageId: number]: IDDataWithPageNo[]
  } = {}

  // 添加一条记录
  public add(pageId: number, idData: IDData, page: number) {
    if (this.allList[pageId] === undefined) {
      this.allList[pageId] = []
    }
    this.allList[pageId].push({
      id: idData.id,
      type: idData.type,
      page: page,
    })
  }

  // 清空记录
  public clear(pageId: number) {
    if (this.allList[pageId]) {
      delete this.allList[pageId]
    }
  }

  // 排序
  private sort(pageId: number) {
    if (this.allList[pageId]) {
      this.allList[pageId].sort(Utils.sortByProperty('page', 'asc'))
    }
  }

  // 转储到 store.idList 里
  // 自动排序
  // 转储之后自动清空
  public store(pageId: number) {
    if (this.allList[pageId]) {
      this.sort(pageId)

      for (const data of this.allList[pageId]) {
        store.idList.push({
          id: data.id,
          type: data.type,
        })
      }

      this.clear(pageId)
    }
  }

  // 如果没有值，返回的就是 undefined
  public get(pageId: number) {
    return this.allList[pageId]
  }
}

const idListWithPageNo = new IdListWithPageNo()
export { idListWithPageNo }
