// 下载控制
import { EVT } from './EVT'
import { DOM } from './DOM'
import {
  downloadArgument,
  DonwloadSuccessData,
  DonwloadSkipData,
  DownloadedMsg,
  TaskList,
} from './DownloadType'
import { store } from './Store'
import { log } from './Log'
import { lang } from './Lang'
import { Colors } from './Colors'
import { settings } from './setting/Settings'
import { Download } from './Download'
import { progressBar } from './ProgressBar'
import { downloadStates } from './DownloadStates'
import { ShowSkipCount } from './ShowSkipCount'
import { ShowConvertCount } from './ShowConvertCount'
import { BookmarkAfterDL } from './BookmarkAfterDL'
import { resume } from './Resume'
import { states } from './States'
import Config from './Config'
import { toast } from './Toast'
import { Tools } from './Tools'

class DownloadControl {
  constructor() {
    this.createDownloadArea()

    this.listenEvents()

    const skipTipWrap = this.wrapper.querySelector(
      '.skip_tip'
    ) as HTMLSpanElement
    new ShowSkipCount(skipTipWrap)

    const convertTipWrap = this.wrapper.querySelector(
      '.convert_tip'
    ) as HTMLSpanElement
    new ShowConvertCount(convertTipWrap)

    // 只在 p 站内启用下载后收藏的功能
    if (Tools.isPixiv()) {
      const bmkAfterDLTipWrap = this.wrapper.querySelector(
        '.bmkAfterDL_tip'
      ) as HTMLSpanElement
      new BookmarkAfterDL(bmkAfterDLTipWrap)
    }
  }

  private thread = 5 // 同时下载的线程数的默认值
  // 这里默认设置为 5，是因为国内一些用户的下载速度比较慢，所以不应该同时下载很多文件。
  // 最大值由 Config.downloadThreadMax 定义

  private taskBatch = 0 // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载

  private taskList: TaskList = {} // 下载任务列表，使用下载的文件的 id 做 key，保存下载栏编号和它在下载状态列表中的索引

  private errorIdList: string[] = [] // 有任务下载失败时，保存 id

  private downloaded = 0 // 已下载的任务数量

  private wrapper: HTMLDivElement = document.createElement('div')

  private totalNumberEl: HTMLSpanElement = document.createElement('span')

  private statesEl: HTMLSpanElement = document.createElement('span')

  private stop = false // 是否停止下载

  private pause = false // 是否暂停下载

  private listenEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.hideDownloadArea()
      this.reset()
    })

    for (const ev of [
      EVT.list.crawlFinish,
      EVT.list.resultChange,
      EVT.list.resume,
    ]) {
      window.addEventListener(ev, () => {
        window.setTimeout(() => {
          this.readyDownload()
        }, 0)
      })
    }

    window.addEventListener(EVT.list.skipDownload, (ev: CustomEventInit) => {
      const data = ev.detail.data as DonwloadSkipData
      this.downloadOrSkipAFile(data)
    })

    window.addEventListener(EVT.list.downloadError, (ev: CustomEventInit) => {
      const id = ev.detail.data as string
      this.downloadError(id)
    })

    // 监听浏览器返回的消息
    chrome.runtime.onMessage.addListener((msg: DownloadedMsg) => {
      if (!this.taskBatch) {
        return
      }
      // 文件下载成功
      if (msg.msg === 'downloaded') {
        // 释放 BLOBURL
        URL.revokeObjectURL(msg.data.url)

        // 发送下载成功的事件
        EVT.fire(EVT.list.downloadSuccess, msg.data)

        this.downloadOrSkipAFile(msg.data)
      } else if (msg.msg === 'download_err') {
        // 浏览器把文件保存到本地时出错
        log.error(
          `${msg.data.id} download error! code: ${msg.err}. The downloader will try to download the file again `
        )
        EVT.fire(EVT.list.saveFileError)
        // 重新下载这个文件
        // 但并不确定能否如预期一样重新下载这个文件
        this.saveFileError(msg.data)
      }

      // UUID 的情况
      if (msg.data && msg.data.uuid) {
        log.error(lang.transl('_uuid'))
      }
    })

    window.addEventListener(EVT.list.downloadComplete, () => {
      log.success(lang.transl('_下载完毕'), 2)
      toast.success(lang.transl('_下载完毕2'))
    })
  }

  private createDownloadArea() {
    const html = `<div class="download_area">
    <p> ${lang.transl(
      '_共抓取到n个文件',
      '<span class="fwb blue imgNum">0</span>'
    )}</p>
    
    <div class="centerWrap_btns">
    <button class="startDownload" type="button" style="background:${
      Colors.bgBlue
    };"> ${lang.transl('_开始下载')}</button>
    <button class="pauseDownload" type="button" style="background:${
      Colors.bgYellow
    };"> ${lang.transl('_暂停下载')}</button>
    <button class="stopDownload" type="button" style="background:${
      Colors.bgRed
    };"> ${lang.transl('_停止下载')}</button>
    <button class="copyUrl" type="button" style="background:${
      Colors.bgGreen
    };"> ${lang.transl('_复制url')}</button>
    </div>
    <div class="download_status_text_wrap">
    <span>${lang.transl('_当前状态')}</span>
    <span class="down_status">${lang.transl('_未开始下载')}</span>
    <span class="skip_tip warn"></span>
    <span class="convert_tip warn"></span>
    <span class="bmkAfterDL_tip green"></span>
    </div>
    </div>`

    this.wrapper = DOM.useSlot('downloadArea', html) as HTMLDivElement
    this.statesEl = this.wrapper.querySelector(
      '.down_status'
    ) as HTMLSpanElement
    this.totalNumberEl = this.wrapper.querySelector(
      '.imgNum'
    ) as HTMLSpanElement

    this.wrapper
      .querySelector('.startDownload')!
      .addEventListener('click', () => {
        this.startDownload()
      })

    this.wrapper
      .querySelector('.pauseDownload')!
      .addEventListener('click', () => {
        this.pauseDownload()
      })

    this.wrapper
      .querySelector('.stopDownload')!
      .addEventListener('click', () => {
        this.stopDownload()
      })

    this.wrapper.querySelector('.copyUrl')!.addEventListener('click', () => {
      EVT.fire(EVT.list.showURLs)
    })
  }

  // 抓取完毕之后，已经可以开始下载时，显示必要的信息，并决定是否立即开始下载
  private readyDownload() {
    if (states.busy) {
      return
    }

    if (store.result.length === 0) {
      return progressBar.reset(0)
    }

    this.showDownloadArea()

    this.totalNumberEl.textContent = store.result.length.toString()

    this.setDownloaded()

    this.setDownloadThread()

    // 检查 不自动开始下载 的标记
    if (states.notAutoDownload) {
      return
    }

    // 视情况自动开始下载
    if (
      settings.quietDownload ||
      states.quickDownload ||
      states.downloadFromViewer
    ) {
      this.startDownload()
    }
  }

  // 开始下载
  private startDownload() {
    if (!this.pause && !resume.flag) {
      // 如果之前没有暂停任务，也没有进入恢复模式，则重新下载
      // 初始化下载状态列表
      downloadStates.init()
    } else {
      // 从上次中断的位置继续下载
      // 把“使用中”的下载状态重置为“未使用”
      downloadStates.resume()
    }

    this.reset()

    this.setDownloaded()

    this.taskBatch = new Date().getTime() // 修改本批下载任务的标记

    this.setDownloadThread()

    EVT.fire(EVT.list.downloadStart)

    // 建立并发下载线程
    for (let i = 0; i < this.thread; i++) {
      this.createDownload(i)
    }

    this.setDownStateText(lang.transl('_正在下载中'))

    log.success(lang.transl('_正在下载中'))
  }

  // 暂停下载
  private pauseDownload() {
    if (store.result.length === 0) {
      return
    }

    // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
    if (this.stop === true) {
      return
    }

    if (this.pause === false) {
      // 如果正在下载中
      if (states.busy) {
        this.pause = true
        this.setDownStateText(lang.transl('_已暂停'), '#f00')
        log.warning(lang.transl('_已暂停'), 2)

        EVT.fire(EVT.list.downloadPause)
      } else {
        // 不在下载中的话不允许启用暂停功能
        return
      }
    }
  }

  // 停止下载
  private stopDownload() {
    if (store.result.length === 0 || this.stop) {
      return
    }

    this.stop = true
    this.setDownStateText(lang.transl('_已停止'), '#f00')
    log.error(lang.transl('_已停止'), 2)
    this.pause = false

    EVT.fire(EVT.list.downloadStop)
  }

  private downloadError(id: string) {
    this.errorIdList.push(id)

    // 是否继续下载
    const task = this.taskList[id]
    const no = task.progressBarIndex
    if (this.checkContinueDownload()) {
      this.createDownload(no)
    }
  }

  private saveFileError(data: DonwloadSuccessData) {
    if (this.pause || this.stop) {
      return false
    }
    const task = this.taskList[data.id]
    // 复位这个任务的状态
    downloadStates.setState(task.index, -1)
    // 建立下载任务，再次下载它
    this.createDownload(task.progressBarIndex)
  }

  private downloadOrSkipAFile(data: DonwloadSuccessData | DonwloadSkipData) {
    const task = this.taskList[data.id]

    // 更改这个任务状态为“已完成”
    downloadStates.setState(task.index, 1)

    // 统计已下载数量
    this.setDownloaded()

    // 是否继续下载
    const no = task.progressBarIndex
    if (this.checkContinueDownload()) {
      this.createDownload(no)
    }
  }

  // 当一个文件下载成功或失败之后，检查是否还有后续下载任务
  private checkContinueDownload() {
    // 如果没有全部下载完毕
    if (this.downloaded < store.result.length) {
      // 如果任务已停止
      if (this.pause || this.stop) {
        return false
      }
      // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
      if (this.downloaded + this.thread - 1 < store.result.length) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  // 设置下载线程数量
  private setDownloadThread() {
    const setThread = settings.downloadThread
    if (
      setThread < 1 ||
      setThread > Config.downloadThreadMax ||
      isNaN(setThread)
    ) {
      // 如果数值非法，则重设为默认值
      this.thread = Config.downloadThreadMax
    } else {
      this.thread = setThread // 设置为用户输入的值
    }

    // 如果剩余任务数量少于下载线程数
    if (store.result.length - this.downloaded < this.thread) {
      this.thread = store.result.length - this.downloaded
    }

    // 重设下载进度条
    progressBar.reset(this.thread, this.downloaded)
  }

  // 查找需要进行下载的作品，建立下载
  private createDownload(progressBarIndex: number) {
    const index = downloadStates.getFirstDownloadItem()
    if (index === undefined) {
      // 当已经没有需要下载的作品时，检查是否带着错误完成了下载
      // 如果下载过程中没有出错，就不会执行到这个分支
      return this.checkCompleteWithError()
    } else {
      const workData = store.result[index]
      const data: downloadArgument = {
        id: workData.id,
        data: workData,
        index: index,
        progressBarIndex: progressBarIndex,
        taskBatch: this.taskBatch,
      }

      // 保存任务信息
      this.taskList[workData.id] = {
        index,
        progressBarIndex: progressBarIndex,
      }

      // 建立下载
      new Download(progressBarIndex, data)
    }
  }

  private setDownloaded() {
    this.downloaded = downloadStates.downloadedCount()

    const text = `${this.downloaded} / ${store.result.length}`
    log.log(text, 2, false)

    // 设置下载进度条
    progressBar.setTotalProgress(this.downloaded)

    if (this.downloaded === 0) {
      this.setDownStateText(lang.transl('_未开始下载'))
    }

    // 所有文件正常下载完毕（跳过下载的文件也算正常下载）
    if (this.downloaded === store.result.length) {
      window.setTimeout(() => {
        // 延后触发下载完成的事件。因为下载完成事件是由上游事件（跳过下载，或下载成功事件）派生的，如果这里不延迟触发，可能导致其他模块先接收到下载完成事件，后接收到上游事件。
        EVT.fire(EVT.list.downloadComplete)
      }, 0)
      this.reset()
      this.setDownStateText(lang.transl('_下载完毕'), Colors.textSuccess)
    }

    this.checkCompleteWithError()
  }

  // 在有下载出错的任务的情况下，是否已经完成了下载
  private checkCompleteWithError() {
    if (
      this.errorIdList.length > 0 &&
      this.downloaded + this.errorIdList.length === store.result.length
    ) {
      // 进入暂停状态，一定时间后自动开始下载，重试下载出错的文件
      this.pauseDownload()
      setTimeout(() => {
        this.startDownload()
      }, 3000)
    }
  }

  // 设置下载状态文本，默认颜色为主题蓝色
  private setDownStateText(text: string, color: string = Colors.bgBlue) {
    this.statesEl.textContent = text
    this.statesEl.style.color = color
  }

  private reset() {
    this.pause = false
    this.stop = false
    this.errorIdList = []
  }

  private showDownloadArea() {
    this.wrapper.style.display = 'block'
  }

  private hideDownloadArea() {
    this.wrapper.style.display = 'none'
  }
}

new DownloadControl()
