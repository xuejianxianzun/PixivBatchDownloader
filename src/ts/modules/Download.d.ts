import { WorkInfo } from './Store.d'

export interface downloadArgument {
  data: WorkInfo
  index: number
  progressBarNo: number
  taskBatch: number
}

// 前台向后台发送的任务信息
export interface SendToBackEndData {
  msg: string
  fileUrl: string
  fileName: string
  no: number
  index: number
  taskBatch: number
}

// 浏览器下载时每个任务的信息
export interface DonwloadSuccessData {
  no: number
  url: string
  index: number
  tabId: number
  uuid: boolean
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
