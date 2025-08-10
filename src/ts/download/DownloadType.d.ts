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
// 根据浏览器和是否处于隐私窗口内，后台保存文件时，所使用的数据不同：
// 在 Firefox 浏览器里，后台接收 blob，生成 URL 然后下载
// 在 Chrome 浏览器的主窗口里，使用前台生成的 Blob URL 下载
// 在 Chrome 浏览器的隐私窗口里，使用前台生成的 dataURL 下载
export interface SendToBackEndData {
  msg: string
  fileName: string
  id: string
  taskBatch: number
  blob?: Blob
  blobURL: string
  dataURL?: string
}

// 浏览器下载时每个任务的信息
export interface DonwloadSuccessData {
  /**前台生成的 blob URL */
  url: string
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
