// 下载控制
import { EVT } from './EVT'
import { DOM } from './DOM'
import {
  downloadArgument,
  DonwloadSuccessData,
  DownloadedMsg,
  TaskList,
} from './Download.d'
import { store } from './Store'
import { log } from './Log'
import { lang } from './Lang'
import { titleBar } from './TitleBar'
import { Colors } from './Colors'
import { form } from './Settings'
import { Download } from './Download'
import { progressBar } from './ProgressBar'
import { downloadStates } from './DownloadStates'
import { resume } from './Resume'

class DownloadControl {
  constructor() {
    this.createDownloadArea()

    this.listenEvents()
  }

  private readonly downloadThreadMax: number = 5 // 同时下载的线程数的最大值，也是默认值

  private downloadThread: number = this.downloadThreadMax // 同时下载的线程数

  private taskBatch = 0 // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载

  private taskList: TaskList = {} // 下载任务列表，使用下载的文件的 id 做 key，保存下载栏编号和它在下载状态列表中的索引

  private errorIdList: string[] = [] // 有任务下载失败时，保存 id

  private downloaded: number = 0 // 已下载的任务数量

  private convertText = ''

  private reTryTimer: number = 0 // 重试下载的定时器

  private downloadArea: HTMLDivElement = document.createElement('div') // 下载区域

  private totalNumberEl: HTMLSpanElement = document.createElement('span')

  private downStatusEl: HTMLSpanElement = document.createElement('span')

  private convertTipEL: HTMLDivElement = document.createElement('div') // 转换动图时显示提示的元素

  private downloadStop: boolean = false // 是否停止下载

  private downloadPause: boolean = false // 是否暂停下载

  // 返回任务停止状态。暂停和停止都视为停止下载
  public get downloadStopped() {
    return this.downloadPause || this.downloadStop
  }

  private listenEvents() {
    window.addEventListener(EVT.events.crawlStart, () => {
      this.hideDownloadArea()
      this.reset()
    })

    window.addEventListener(EVT.events.crawlFinish, () => {
      this.showDownloadArea()
      this.readyDownload()
    })

    window.addEventListener(EVT.events.skipSaveFile, (ev: CustomEventInit) => {
      const data = ev.detail.data as DonwloadSuccessData
      this.downloadSuccess(data)
    })

    window.addEventListener(EVT.events.downloadError, (ev: CustomEventInit) => {
      const id = ev.detail.data as string
      this.downloadError(id)
    })

    window.addEventListener(EVT.events.convertChange, (ev: CustomEventInit) => {
      const count = ev.detail.data
      if (count > 0) {
        this.convertText = lang.transl('_转换任务提示', count.toString())
      } else {
        this.convertText = ''
      }
      this.convertTipEL.innerHTML = this.convertText
      this.LogDownloadStates()
    })

    // 监听浏览器下载文件后，返回的消息
    chrome.runtime.onMessage.addListener((msg: DownloadedMsg) => {
      if (!this.taskBatch) {
        return
      }
      // 文件下载成功
      if (msg.msg === 'downloaded') {
        // 释放 BLOBURL
        URL.revokeObjectURL(msg.data.url)

        this.downloadSuccess(msg.data)
      } else if (msg.msg === 'download_err') {
        // 浏览器把文件保存到本地时出错
        log.error(
          `${msg.data.id} download error! code: ${msg.err}. The downloader will try to download the file again `
        )
        EVT.fire(EVT.events.saveFileError)
        // 重新下载这个文件
        this.saveFileError(msg.data)
      }

      // UUID 的情况
      if (msg.data && msg.data.uuid) {
        log.error(lang.transl('_uuid'))
      }
    })
  }

  private setDownloaded() {
    this.downloaded = downloadStates.downloadedCount()
    this.LogDownloadStates()

    // 设置下载进度信息
    progressBar.setTotalProgress(this.downloaded)

    // 重置下载进度信息
    if (this.downloaded === 0) {
      this.setDownStateText(lang.transl('_未开始下载'))
    }

    // 所有文件正常下载完毕（跳过下载的文件也算正常下载）
    if (this.downloaded === store.result.length) {
      EVT.fire(EVT.events.downloadComplete)
      this.reset()
      this.setDownStateText(lang.transl('_下载完毕'))
      log.success(lang.transl('_下载完毕'), 2)
      titleBar.change('✓')
    }

    this.checkCompleteWithError()
  }

  // 如果带上下载出错的任务的话，是否已经完成了下载
  private checkCompleteWithError() {
    // 在有文件下载失败的情况下完成了下载，则进入暂停状态
    if (
      this.errorIdList.length > 0 &&
      this.downloaded + this.errorIdList.length === store.result.length
    ) {
      this.pauseDownload()
      // 一定时间后自动开始下载
      setTimeout(() => {
        this.startDownload()
      }, 5000)
    }
  }

  // 显示或隐藏下载区域
  private showDownloadArea() {
    this.downloadArea.style.display = 'block'
  }

  private hideDownloadArea() {
    this.downloadArea.style.display = 'none'
  }

  // 设置下载状态文本，默认颜色为主题蓝色
  private setDownStateText(str: string, color: string = '') {
    const el = document.createElement('span')
    el.textContent = str
    if (color) {
      el.style.color = color
    }
    this.downStatusEl.innerHTML = ''
    this.downStatusEl.appendChild(el)
  }

  private reset() {
    this.downloadPause = false
    this.downloadStop = false
    clearTimeout(this.reTryTimer)
  }

  private createDownloadArea() {
    const html = `<div class="download_area">
    <p> ${lang.transl(
      '_共抓取到n个文件',
      '<span class="fwb blue imgNum">0</span>'
    )}</p>
    
    <div class="centerWrap_btns">
    <button class="startDownload" type="button" style="background:${
      Colors.blue
    };"> ${lang.transl('_下载按钮1')}</button>
    <button class="pauseDownload" type="button" style="background:${
      Colors.yellow
    };"> ${lang.transl(
      '_下载按钮2'
    )}</button>
    <button class="stopDownload" type="button" style="background:${
      Colors.red
    };"> ${lang.transl('_下载按钮3')}</button>
    <button class="copyUrl" type="button" style="background:${
      Colors.green
    };"> ${lang.transl('_复制url')}</button>
    </div>
    <div class="centerWrap_down_tips">
    <p>
    <span>${lang.transl('_当前状态')}</span>
    <span class="down_status blue"><span>${lang.transl(
      '_未开始下载'
    )}</span></span>
    <span class="convert_tip warn"></span>
    </p>
    </div>
    </div>`

    const el = DOM.useSlot('downloadArea', html)
    this.downloadArea = el as HTMLDivElement
    this.downStatusEl = el.querySelector('.down_status ') as HTMLSpanElement
    this.convertTipEL = el.querySelector('.convert_tip') as HTMLDivElement
    this.totalNumberEl = el.querySelector('.imgNum') as HTMLSpanElement

    document.querySelector('.startDownload')!.addEventListener('click', () => {
      this.startDownload()
    })

    document.querySelector('.pauseDownload')!.addEventListener('click', () => {
      this.pauseDownload()
    })

    document.querySelector('.stopDownload')!.addEventListener('click', () => {
      this.stopDownload()
    })

    document.querySelector('.copyUrl')!.addEventListener('click', () => {
      this.showURLs()
    })
  }

  // 显示 url
  private showURLs() {
    if (store.result.length === 0) {
      return alert(lang.transl('_没有数据可供使用'))
    }

    let result = ''
    result = store.result.reduce((total, now) => {
      return (total += now.url + '<br>')
    }, result)

    EVT.fire(EVT.events.output, {
      content: result,
      title: lang.transl('_复制url'),
    })
  }

  // 下载线程设置
  private setDownloadThread() {
    const setThread = parseInt(form.downloadThread.value)
    if (
      setThread < 1 ||
      setThread > this.downloadThreadMax ||
      isNaN(setThread)
    ) {
      // 如果数值非法，则重设为默认值
      this.downloadThread = this.downloadThreadMax
    } else {
      this.downloadThread = setThread // 设置为用户输入的值
    }

    // 如果剩余任务数量少于下载线程数
    if (store.result.length - this.downloaded < this.downloadThread) {
      this.downloadThread = store.result.length - this.downloaded
    }

    // 重设下载进度条
    progressBar.reset(this.downloadThread, this.downloaded)
  }

  // 抓取完毕之后，已经可以开始下载时，显示必要的信息，并决定是否立即开始下载
  private readyDownload() {
    this.totalNumberEl.textContent = store.result.length.toString()

    this.setDownloaded()

    this.setDownloadThread()

    // 检查 不自动开始下载 的标记
    if (store.states.notAutoDownload) {
      return
    }

    const autoDownload: boolean = form.quietDownload.checked

    if (!autoDownload && !store.states.quickDownload) {
      titleBar.change('▶')
    }

    // 视情况自动开始下载
    if (autoDownload || store.states.quickDownload) {
      this.startDownload()
    }
  }

  // 开始下载
  private startDownload() {
    // 如果正在下载中，或无结果，则不予处理
    if (!store.states.allowWork || store.result.length === 0) {
      return
    }

    // 如果之前没有暂停任务，也没有进入恢复模式，则重新下载
    if (!this.downloadPause && !resume.flag) {
      // 初始化下载状态列表
      downloadStates.initList()
    } else {
      // 从上次中断的位置继续下载
      // 把“使用中”的下载状态重置为“未使用”
      downloadStates.resume()
    }

    // 清空错误 id 列表
    this.errorIdList = []

    this.setDownloaded()

    this.taskBatch = new Date().getTime() // 修改本批下载任务的标记

    // 重置一些数据
    this.downloadPause = false
    this.downloadStop = false
    clearTimeout(this.reTryTimer)
    this.setDownloadThread()

    EVT.fire(EVT.events.downloadStart)

    // 启动或继续下载，建立并发下载线程
    for (let i = 0; i < this.downloadThread; i++) {
      this.createDownload(i)
    }

    this.setDownStateText(lang.transl('_正在下载中'))

    log.log(lang.transl('_正在下载中'))
  }

  // 暂停下载
  private pauseDownload() {
    clearTimeout(this.reTryTimer)

    if (store.result.length === 0) {
      return
    }

    // 停止的优先级高于暂停。点击停止可以取消暂停状态，但点击暂停不能取消停止状态
    if (this.downloadStop === true) {
      return
    }

    if (this.downloadPause === false) {
      // 如果正在下载中
      if (!store.states.allowWork) {
        this.downloadPause = true // 发出暂停信号
        EVT.fire(EVT.events.downloadPause)

        titleBar.change('║')
        this.setDownStateText(lang.transl('_已暂停'), '#f00')
        log.warning(lang.transl('_已暂停'), 2)
      } else {
        // 不在下载中的话不允许启用暂停功能
        return
      }
    }
  }

  // 停止下载
  private stopDownload() {
    clearTimeout(this.reTryTimer)

    if (store.result.length === 0 || this.downloadStop) {
      return
    }

    this.downloadStop = true
    EVT.fire(EVT.events.downloadStop)

    titleBar.change('■')
    this.setDownStateText(lang.transl('_已停止'), '#f00')
    log.error(lang.transl('_已停止'), 2)
    this.downloadPause = false
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
    if (this.downloadPause || this.downloadStop) {
      return false
    }
    const task = this.taskList[data.id]
    // 复位这个任务的状态
    downloadStates.setState(task.index, -1)
    // 建立下载任务，再次下载它
    this.createDownload(task.progressBarIndex)
  }

  private downloadSuccess(data: DonwloadSuccessData) {
    const task = this.taskList[data.id]

    // 更改这个任务状态为“已完成”
    downloadStates.setState(task.index, 1)
    // 发送下载成功的事件
    EVT.fire(EVT.events.downloadSucccess, data)

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
      if (this.downloadPause || this.downloadStop) {
        return false
      }
      // 如果已完成的数量 加上 线程中未完成的数量，仍然没有达到文件总数，继续添加任务
      if (this.downloaded + this.downloadThread - 1 < store.result.length) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  // 在日志上显示下载进度
  private LogDownloadStates() {
    let text = `${this.downloaded} / ${store.result.length}`

    // 追加转换动图的提示
    if (this.convertText) {
      text += ', ' + this.convertText
    }

    log.log(text, 2, false)
  }

  // 查找需要进行下载的作品，建立下载
  private createDownload(progressBarIndex: number) {
    const index = downloadStates.getFirstDownloadItem()
    if (index === undefined) {
      // console.log(downloadStates.states)
      // console.log('getFirstDownloadItem failed')
      // 当已经没有需要下载的作品时，检查是否带着错误完成了下载。
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
}

new DownloadControl()
export {}
