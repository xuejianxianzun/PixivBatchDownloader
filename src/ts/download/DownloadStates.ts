import { EVT } from '../EVT'
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

  public clear() {
    this.states = []
  }
}

const downloadStates = new DownloadStates()
export { downloadStates, DLStatesI }
