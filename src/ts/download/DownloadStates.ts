import { EVT } from '../EVT'
import { states } from '../store/States'
import { store } from '../store/Store'

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

  public clear() {
    this.states = []
  }
}

const downloadStates = new DownloadStates()
export { downloadStates, DLStatesI }
