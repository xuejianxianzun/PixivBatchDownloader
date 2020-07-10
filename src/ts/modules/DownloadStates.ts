import { store } from './Store'
import { Console } from 'console'

// 下载状态列表，每个下载项有 3 种状态
// -1 未开始下载
// 0 下载中
// 1 下载完成

type DLStatesI = (-1 | 0 | 1)[]

class DownloadStates {

  public states: (-1 | 0 | 1)[] = []

  // 创建新的状态列表
  public init() {
    console.log(store.result)
    this.states = new Array(store.result.length).fill(-1)
  }

  // 统计下载完成的数量
  public downloadedCount(){
    let count = 0
    const length = this.states.length
    for (let i = 0; i < length; i++) {
      if (this.states[i] === 1) {
        count++
      }
    }
    return count
  }

  // 替换所有的状态数据
  // 目前只有在恢复下载的时候使用
  public replace(states:DLStatesI){
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
    console.log(this.states)
    return undefined
  }

  // 设置已下载列表中的标记
  public setState(index: number, value: -1 | 0 | 1) {
    this.states[index] = value
  }

  public reset() {
    this.states = []
  }
}

const downloadStates = new DownloadStates()
export { downloadStates ,DLStatesI}