import { Result } from '../store/StoreType'

export interface TaskList {
  [id: string]: {
    index: number
    progressBarIndex: number
  }
}

export interface downloadArgument {
  id: string
  result: Result
  index: number
  progressBarIndex: number
  taskBatch: number
}

// 前台向后台发送的任务信息
export interface SendToBackEndData {
  msg: string
  fileURL: string
  fileName: string
  id: string
  taskBatch: number
  blob?: Blob
}

// 浏览器下载时每个任务的信息
export interface DonwloadSuccessData {
  /**前台生成的 blob URL */
  url: string
  /**后台生成的 blob URL，可能为空字符串 */
  url2: string
  id: string
  tabId: number
  uuid: boolean
}

export interface DonwloadSkipData {
  id: string
  type?: Result['type']
  reason:
    | 'duplicate'
    | 'size'
    | 'color'
    | 'widthHeight'
    | '404'
    | '500'
    | 'excludedType'
}

// 所有任务的信息
export interface DonwloadListData {
  [key: number]: DonwloadSuccessData | null
}

// 下载完成后返回的信息
export interface DownloadedMsg {
  msg: string
  data: DonwloadSuccessData
  err?: string
}
