import { WorkInfo } from './Store.d'

export interface downloadArgument {
  id: string
  data: WorkInfo
  index: number
  progressBarIndex: number
  taskBatch: number
}

// 前台向后台发送的任务信息
export interface SendToBackEndData {
  msg: string
  fileUrl: string
  fileName: string
  id: string
  taskBatch: number
}

// 浏览器下载时每个任务的信息
export interface DonwloadSuccessData {
  url: string
  id: string
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
