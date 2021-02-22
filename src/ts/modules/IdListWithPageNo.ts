import { store } from './Store'
import { IDData } from './StoreType'
import { Utils } from './utils/Utils'

type IDDataWithPageNo = IDData & {
  page: number
}

// 这是为了解决抓取多个列表页面时，获得的 id 数据顺序混乱的问题
// 这个类会保留每个 id 所处的页码，当抓取完成后，可以把这些 id 按页码顺序排列，保证它们的顺序和页码顺序一致
class IdListWithPageNo {
  // 存储 id 列表，按 flag 不同分别存储
  private allList: {
    [flag: string]: IDDataWithPageNo[]
  } = {}

  // 添加一条记录
  public add(flag: string, idData: IDData, page: number) {
    if (this.allList[flag] === undefined) {
      this.allList[flag] = []
    }
    this.allList[flag].push({
      id: idData.id,
      type: idData.type,
      page: page,
    })
  }

  // 清空记录
  public clear(flag: string) {
    if (this.allList[flag]) {
      delete this.allList[flag]
    }
  }

  // 排序
  private sort(flag: string) {
    if (this.allList[flag]) {
      this.allList[flag].sort(Utils.sortByProperty('page', 'asc'))
    }
  }

  // 转储到 store.idList 里
  // 自动排序
  // 转储之后自动清空
  public store(flag: string) {
    if (this.allList[flag]) {
      this.sort(flag)

      for (const data of this.allList[flag]) {
        store.idList.push({
          id: data.id,
          type: data.type,
        })
      }

      this.clear(flag)
    }
  }

  // 如果没有值，返回的就是 undefined
  public get(flag: string) {
    return this.allList[flag]
  }
}

const idListWithPageNo = new IdListWithPageNo()
export { idListWithPageNo }
