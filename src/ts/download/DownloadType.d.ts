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
  /**作品 id*/
  id: string
  taskBatch: number
  blob?: Blob
  /**blobURL 必定有值 */
  blobURL: string
  dataURL?: string
}

// 浏览器下载时每个任务的信息
export interface DonwloadSuccessData {
  /** 前台生成的 blob URL */
  blobURLFront: string
  /** 后台也可能会生成 blob URL（主要是在 Firefox 浏览器里） */
  blobURLBack: string
  /** 作品 id */
  id: string
  tabId: number
  uuid: boolean
  /** 当该标记为 true 时，后台不会向前台返回这个文件的下载结果（即不会向前台发送消息）  */
  noReply?: boolean
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
