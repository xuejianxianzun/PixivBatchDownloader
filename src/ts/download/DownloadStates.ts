import { EVT } from '../EVT'
import { states } from '../store/States'
import { store } from '../store/Store'
import { Result } from '../store/StoreType'

// 每个任务会在数组中的对应位置用一个数字表示它的下载状态。数字和含义：
// -1 未开始下载
// 0 下载中
// 1 下载完成
type DLStatesI = (-1 | 0 | 1)[]

// 下载状态列表
class DownloadStates {
  constructor() {
    this.bindEvents()
  }

  public states: DLStatesI = []

  private bindEvents() {
    // 初始化下载状态
    const evs = [EVT.list.crawlComplete, EVT.list.resultChange]
    for (const ev of evs) {
      window.addEventListener(ev, () => {
        // 有未完成的下载任务时（正在下载或已暂停），不因为 resultChange 而重置下载状态。
        // 重置会把所有文件的状态清成「未开始」，而这时下载还没结束，进度不应该被丢弃。
        // 注意这个判断必须写在事件回调里：注册监听时这些状态还没有变化，写在循环里不会生效
        if (ev === EVT.list.resultChange && states.hasDownloadTask) {
          return
        }

        this.init()
      })
    }
  }

  // 创建新的状态列表
  public init() {
    this.states = new Array(store.result.length).fill(-1)
  }

  // 统计下载完成的数量
  public downloadedCount() {
    let count = 0
    const length = this.states.length
    for (let i = 0; i < length; i++) {
      if (this.states[i] === 1) {
        count++
      }
    }
    return count
  }

  // 接受传入的状态数据
  // 目前只有在恢复下载的时候使用
  public replace(states: DLStatesI) {
    this.states = states
  }

  // 恢复之前的下载任务
  // 这会把之前的“下载中”标记复位到“未开始下载”，以便再次下载
  public resume() {
    const length = this.states.length
    for (let i = 0; i < length; i++) {
      if (this.states[i] === 0) {
        this.setState(i, -1)
      }
    }
  }

  // 获取第一个“未开始下载”标记的索引
  public getFirstDownloadItem() {
    const length = this.states.length
    for (let i = 0; i < length; i++) {
      if (this.states[i] === -1) {
        this.setState(i, 0)
        return i
      }
    }
    return undefined
  }

  // 设置已下载列表中的标记
  public setState(index: number, value: -1 | 0 | 1) {
    this.states[index] = value
  }

  /** 移除指定下标的状态项。
   * 用于下载结束后整理抓取结果时，同步缩短状态列表，保持下标与 result 一一对应。
   * 传入的下标需要按升序排列。 */
  public removeItems(indexes: number[]) {
    // 从后往前删，避免删除时影响后面还没处理的下标
    for (let i = indexes.length - 1; i >= 0; i--) {
      this.states.splice(indexes[i], 1)
    }
  }

  /** 把当前的状态列表转换成「文件 id → 下载状态」的映射。
   *
   * 抓取结果被整体重建时（如在结果中筛选、手动删除作品），状态列表的下标就不再对应原来的文件，
   * 所以在重建前调用它保存映射，重建完成后再用 remapTo 写回。
   * 这样已经下载完成的文件不会因为重建而需要重新下载，状态列表的长度也始终与 store.result 一致
   * （长度不一致会让下载时读到 store.result 之外的下标）。
   *
   * @param storeResult 重建前的 store.result，用来把下标映射回文件 id */
  public createStateMap(storeResult: Result[]): Map<string, -1 | 0 | 1> {
    const map: Map<string, -1 | 0 | 1> = new Map()
    storeResult.forEach((result, index) => {
      map.set(result.id, this.states[index] ?? -1)
    })
    return map
  }

  /** 按照重建后的抓取结果重建状态列表，并从 map 里还原每个文件原本的状态。
   *
   * 只有「已下载完成（1）」会被保留：重建时不会有文件正在传输（0），
   * 也不应该让尚未下载的文件变成已完成。map 里找不到的文件视为「未开始下载」。 */
  public remapTo(newResult: Result[], map: Map<string, -1 | 0 | 1>) {
    this.states = newResult.map((result) => (map.get(result.id) === 1 ? 1 : -1))
  }

  public clear() {
    this.states = []
  }
}

const downloadStates = new DownloadStates()
export { downloadStates, DLStatesI }
