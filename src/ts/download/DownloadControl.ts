import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { Tools } from '../Tools'
import {
  downloadArgument,
  DonwloadSuccessData,
  DonwloadSkipData,
  DownloadedMsg,
  TaskList,
} from './DownloadType'
import { store } from '../store/Store'
import { log } from '../Log'
import { lang } from '../Language'
import { setSetting, settings } from '../setting/Settings'
import { Download } from './Download'
import { progressBar } from './ProgressBar'
import { downloadStates } from './DownloadStates'
import { ShowDownloadStates } from './ShowDownloadStates'
import { ShowSkipCount } from './ShowSkipCount'
import './ShowDuplicateLog'
import { ShowConvertCount } from './ShowConvertCount'
import { BookmarkAfterDL } from './BookmarkAfterDL'
import { states } from '../store/States'
import { Config } from '../Config'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { pageType } from '../PageType'
import { msgBox } from '../MsgBox'
import './CheckWarningMessage'
import './DownloadCountWarning'

class DownloadControl {
  constructor() {
    this.createResultBtns()

    this.createDownloadArea()

    this.bindEvents()

    const statusTipWrap = this.wrapper.querySelector(
      '.down_status'
    ) as HTMLSpanElement
    new ShowDownloadStates(statusTipWrap)

    const skipTipWrap = this.wrapper.querySelector(
      '.skip_tip'
    ) as HTMLSpanElement
    new ShowSkipCount(skipTipWrap)

    const convertTipWrap = this.wrapper.querySelector(
      '.convert_tip'
    ) as HTMLSpanElement
    new ShowConvertCount(convertTipWrap)

    // 只在 p 站内启用下载后收藏的功能
    if (Utils.isPixiv()) {
      const bmkAfterDLTipWrap = this.wrapper.querySelector(
        '.bmkAfterDL_tip'
      ) as HTMLSpanElement
      new BookmarkAfterDL(bmkAfterDLTipWrap)
    }
  }

  private wrapper: HTMLDivElement = document.createElement('div')

  /**在插槽里添加的操作抓取结果的按钮 */
  private resultBtns: {
    exportCSV: HTMLButtonElement
    exportJSON: HTMLButtonElement
    importJSON: HTMLButtonElement
  } = {
    exportCSV: document.createElement('button'),
    exportJSON: document.createElement('button'),
    importJSON: document.createElement('button'),
  }

  private thread = 5 // 同时下载的线程数的默认值
  // 这里默认设置为 5，是因为国内一些用户的下载速度比较慢，所以不应该同时下载很多文件。
  // 最大值由 Config.downloadThreadMax 定义

  private taskBatch = 0 // 标记任务批次，每次重新下载时改变它的值，传递给后台使其知道这是一次新的下载

  private taskList: TaskList = {} // 下载任务列表，使用下载的文件的 id 做 key，保存下载栏编号和它在下载状态列表中的索引

  /** 有文件下载失败时，保存 id */
  // 注意这个下载失败指的是 Download 模块里文件下载失败，原因是网络请求失败、动图转换失败。
  // 这不是 SW 让浏览器保存文件时的失败
  private errorIdList: string[] = []

  private downloaded = 0 // 已下载的任务数量

  private stop = false // 是否已经停止下载

  private pause = false // 是否已经暂停下载

  private crawlIdListTimer: undefined | number = undefined

  private checkDownloadTimeoutTimer: undefined | number = undefined

  private readonly uuidTip = 'uuidTip'

  /** 下载过程中被手动排除、等待下载结束后从抓取结果里移除的作品 id。
   *
   * 这些作品的文件在排除时已经被标记为「已完成（跳过）」，所以不会再下载它们。
   * 但要从 store.result 里真正删掉它们必须等到下载结束，否则会让下标错位。 */
  private excludedWorkIdList: number[] = []

  // 类型守卫
  private isDownloadedMsg(msg: any): msg is DownloadedMsg {
    return !!msg.msg
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.hideResultBtns()
      this.hideDownloadArea()
      this.reset()
      // 抓取结果会被重置，上一轮记录的待移除作品也就没有意义了
      this.excludedWorkIdList = []
    })

    for (const ev of [
      EVT.list.crawlComplete,
      EVT.list.resultChange,
      EVT.list.resume,
    ]) {
      window.addEventListener(ev, (ev) => {
        // 如果在下载完成后或者暂停、停止之后修改了抓取结果（可能的原因是用户手动排除了作品），则不再触发开始下载流程
        if (
          ev.type === 'resultChange' &&
          (states.downloadCompleteOrStop || this.pause)
        ) {
          return
        }

        // 当恢复了未完成的抓取数据时，将下载状态设置为暂停
        this.pause = ev.type === 'resume'
        //  resultChange 事件不需要打开下载面板，这是因为手动排除功能可能会频繁触发此事件，如果显示下载面板，那么会频繁打断用户的操作，影响用户体验。
        const openPanel = ev.type !== 'resultChange'

        // 让开始下载的方法进入事件队列，以便让其他模块里监听上述事件的代码先执行完毕
        window.setTimeout(() => {
          this.readyDownload(openPanel)
        }, 0)
      })
    }

    // 下载过程中，用户手动排除了一个作品
    window.addEventListener(
      EVT.list.manuallyExcludeWork,
      this.handleExcludedWork
    )

    // 下载结束时，把被排除的作品从抓取结果里真正移除
    for (const ev of [EVT.list.downloadComplete, EVT.list.downloadStop]) {
      window.addEventListener(ev, this.removeExcludedWorks)
    }

    window.addEventListener(EVT.list.skipDownload, (ev: CustomEventInit) => {
      // 跳过下载的文件不会触发 downloadSuccess 事件
      const data = ev.detail.data as DonwloadSkipData
      this.downloadOrSkipAFile(data)
    })

    window.addEventListener(EVT.list.downloadError, (ev: CustomEventInit) => {
      const id = ev.detail.data as string
      this.downloadError(id)
    })

    window.addEventListener(EVT.list.requestPauseDownload, (ev) => {
      // 请求暂停下载
      this.pauseDownload()
    })

    // 如果下载器让浏览器保存文件到本地，但是之后没有收到回应（不知道文件是否有成功保存），这会导致下载进度卡住
    // 常见原因：浏览器显示了另存为窗口，但用户一直没有处理（即另存为窗口一直显示），所以浏览器不会告诉下载器文件的保存结果，导致等待超时
    window.addEventListener(EVT.list.sendBrowserDownload, () => {
      window.clearTimeout(this.checkDownloadTimeoutTimer)
      this.checkDownloadTimeoutTimer = window.setTimeout(() => {
        const msg =
          lang.transl('_可能发生了错误请刷新页面重试') +
          '<br>' +
          lang.transl('_下载卡住的提示')
        log.warning(msg, 'mayError')
      }, 300000)
    })

    const clearDownloadTimeoutTimerList = [
      EVT.list.downloadComplete,
      EVT.list.downloadError,
      EVT.list.downloadPause,
      EVT.list.downloadStop,
      EVT.list.downloadSuccess,
      EVT.list.crawlStart,
    ]
    clearDownloadTimeoutTimerList.forEach((evt) => {
      window.addEventListener(evt, () => {
        window.clearTimeout(this.checkDownloadTimeoutTimer)
      })
    })

    // 监听浏览器返回的消息
    browser.runtime.onMessage.addListener((msg: any) => {
      if (!this.isDownloadedMsg(msg)) {
        return
      }

      // 旧批次的结果也需要释放前台 Blob URL，但不能影响当前任务。
      if (
        (msg.msg === 'downloaded' || msg.msg === 'download_err') &&
        msg.data?.blobURLFront
      ) {
        URL.revokeObjectURL(msg.data.blobURLFront)
      }
      if (!this.taskBatch || msg.data?.taskBatch !== this.taskBatch) {
        return
      }

      // 提示文件名变成了UUID 的情况
      // 注意：有些文件是不会返回消息的，所以它们不会触发这个提示
      if (msg.data?.uuid) {
        log.log(lang.transl('_uuid'), 'filenameUUID')
        // 显示作品 id 和异常的文件名，方便用户重新下载这些文件
        // 由于此时不确定这个 id 的类型，所以不显示作品链接，只显示 id
        const tip = lang.transl(
          '_显示作品id和异常的文件名',
          msg.data.id,
          msg.data.browserSetFilename || ''
        )
        // 一个 id 可能产生多个文件，所以可能显示多条提示，这是正常的。不需要给 log 语句添加 key
        log.warning(tip)

        msgBox.once(this.uuidTip, lang.transl('_uuid'), 'show')

        // 一旦检测到文件名异常，就会暂停下载
        this.pauseDownload()
      }

      // 检测扩展名是 .jfif 的情况
      if (msg.data?.browserSetFilename?.endsWith('.jfif')) {
        log.warning(lang.transl('_提示扩展名为jfif的问题'), 'filenameJFIF')
      }

      // 文件下载成功
      if (msg.msg === 'downloaded') {
        try {
          // 发送下载成功的事件
          EVT.fire('downloadSuccess', msg.data)

          this.downloadOrSkipAFile(msg.data)
        } catch (error) {
          // 捕获此分支内的异常，避免事件监听器或推进逻辑的错误导致任务卡住却没有提示
          console.error('downloaded 分支执行出错', error)
        }
        // console.log('downloaded', msg.data.id )
      } else if (msg.msg === 'download_err') {
        // 浏览器把文件保存到本地失败

        // 无效文件名等建立请求时的错误不会因为自动重试而消失。
        if (msg.saveRequestFailed) {
          // API 拒绝原因不是固定错误码，作为文本显示，避免插入 HTML。
          let reason = msg.runtimeError || msg.err || 'unknown'
          reason = Utils.escapeHTML(reason)
          log.error(
            lang.transl(
              '_save_file_request_failed_tip',
              Tools.createWorkLink(msg.data.id),
              reason
            )
          )
          EVT.fire('saveFileError')
          this.pauseDownload()
          return
        }

        // 用户操作导致下载取消的情况，跳过这个文件，不再重试保存它。触发条件如：
        // 用户在浏览器弹出“另存为”对话框时取消保存
        // 用户让 IDM 转接这个下载时
        if (msg.err === 'USER_CANCELED') {
          log.error(
            lang.transl(
              '_user_canceled_tip',
              Tools.createWorkLink(msg.data.id),
              msg.err || 'unknown'
            )
          )

          this.downloadOrSkipAFile(msg.data)
          return
        }

        // 其他原因，下载器会重试保存这个文件
        const errorDetail = msg.runtimeError || msg.err || 'unknown'
        log.error(
          lang.transl(
            '_save_file_failed_tip',
            Tools.createWorkLink(msg.data.id),
            errorDetail
          )
        )

        if (msg.err === 'FILE_FAILED') {
          log.error(lang.transl('_可能是文件名太长'))
        }

        EVT.fire('saveFileError')
        // 重新下载这个文件
        // 但并不确定能否如预期一样重新下载这个文件
        this.saveFileError(msg.data)
      }
    })

    // 当下载完毕，或者抓取结果为空时，检查是否有等待下载的任务
    const checkWaitingIdListEvents = [
      EVT.list.downloadComplete,
      EVT.list.crawlEmpty,
    ]
    checkWaitingIdListEvents.forEach((evt) => {
      window.addEventListener(evt, () => {
        // 如果有等待中的下载任务，则开始下载等待中的任务
        if (store.waitingIdList.length === 0) {
          toast.success(lang.transl('_下载完毕'), {
            position: 'center',
          })

          // 通知后台清除保存的此标签页的 idList
          browser.runtime.sendMessage({
            msg: 'clearDownloadsTempData',
          })
        } else {
          // 下载等待中的任务
          window.clearTimeout(this.crawlIdListTimer)
          this.crawlIdListTimer = window.setTimeout(() => {
            const idList = [...store.waitingIdList]
            store.waitingIdList = []
            EVT.fire('crawlIdList', idList)
          }, 0)
        }
      })
    })
  }

  private createDownloadArea() {
    const html = `<div class="download_area">
    <div class="centerWrap_btns">
      <slot data-name="downloadControlBtns"></slot>
    </div>
    <div class="download_status_text_wrap">
      <span data-xztext="_当前状态"></span>
      <span class="down_status" data-xztext="_未开始下载"></span>
      <span class="skip_tip warn"></span>
      <span class="convert_tip warn"></span>
      <span class="bmkAfterDL_tip green"></span>
    </div>
    </div>`

    this.wrapper = Tools.useSlot('downloadArea', html) as HTMLDivElement
    lang.register(this.wrapper)

    // 添加按钮
    Tools.addBtn(
      'downloadControlBtns',
      '_开始下载',
      '',
      'startDownload',
      'primary',
      'success'
    ).addEventListener('click', () => {
      this.startDownload()
    })

    Tools.addBtn(
      'downloadControlBtns',
      '_暂停下载',
      '',
      'pauseDownload',
      'primary',
      'warning'
    ).addEventListener('click', () => {
      this.pauseDownload()
    })

    Tools.addBtn(
      'downloadControlBtns',
      '_停止下载',
      '',
      'stopDownload',
      'primary',
      'danger'
    ).addEventListener('click', () => {
      this.stopDownload()
    })

    Tools.addBtn(
      'downloadControlBtns',
      '_复制url',
      '',
      'copyURLs',
      'secondary',
      'brand'
    ).addEventListener('click', () => {
      EVT.fire('showURLs')
    })
  }

  private createResultBtns() {
    // 只在 pixiv 上添加这些按钮
    if (Utils.isPixiv()) {
      // 导入抓取结果
      this.resultBtns.importJSON = Tools.addBtn(
        'exportResult',
        '_导入抓取结果',
        '',
        'importCrawlResults',
        'secondary',
        'brand'
      )
      // 导入抓取结果的按钮始终显示，因为它需要始终可用。
      // 导出抓取结果的按钮只有在可以准备下载时才显示

      this.resultBtns.importJSON.addEventListener(
        'click',
        () => {
          EVT.fire('importResult')
        },
        false
      )

      // 导出抓取结果
      this.resultBtns.exportJSON = Tools.addBtn(
        'exportResult',
        '_导出抓取结果',
        '',
        'exportCrawlResultsJSON',
        'secondary',
        'brand'
      )
      this.resultBtns.exportJSON.style.display = 'none'

      this.resultBtns.exportJSON.addEventListener(
        'click',
        () => {
          EVT.fire('exportResult')
        },
        false
      )

      // 导出 csv
      this.resultBtns.exportCSV = Tools.addBtn(
        'exportResult',
        '_导出csv',
        '',
        'exportCrawlResultsCSV',
        'secondary',
        'brand'
      )
      this.resultBtns.exportCSV.style.display = 'none'

      this.resultBtns.exportCSV.addEventListener(
        'click',
        () => {
          EVT.fire('exportCSV')
        },
        false
      )
    }
  }

  /** 抓取完毕之后更新状态，并决定是否立即开始下载 */
  private readyDownload(openPanel = true) {
    if (states.busy) {
      return
    }
    if (store.result.length === 0) {
      return progressBar.reset(0)
    }

    if (settings.downloadUgoiraFirst) {
      store.resultMeta.sort(Tools.sortUgoiraFirst)
      store.result.sort(Tools.sortUgoiraFirst)
    }

    EVT.fire('readyDownload')

    this.showResultBtns()

    this.showDownloadArea()

    this.setDownloaded()

    this.setDownloadThread()

    // 是否自动开始下载

    // 在插画漫画搜索页面里，如果启用了“预览搜索页面的筛选结果”
    if (
      pageType.type === pageType.list.ArtworkSearch &&
      settings.previewResult
    ) {
      // 对于普通下载任务，阻止自动下载
      if (!states.quickCrawl && !states.crawlTagList) {
        openPanel && EVT.fire('openSettingsPanel')
        return
      }
    }

    // 处理快速下载任务
    if (states.quickCrawl || states.crawlTagList) {
      if (settings.autoStartDownloadForQuickDownload) {
        this.startDownload()
      } else {
        // 如果快速下载任务被设置为不自动开始下载，则打开设置面板，告诉用户抓取已经完成，并且可以手动开始下载
        // 如果快速下载任务可以自动开始下载，则不需要打开设置面板，这样减少了对用户的打扰。而且快速下载任务的抓取结果通常是小批量的，可以很快下载完毕，所以不需要打开设置面板来查看下载进度。
        openPanel && EVT.fire('openSettingsPanel')
      }
    } else {
      // 处理普通下载任务
      if (settings.autoStartDownload) {
        this.startDownload()
      }

      // 普通下载任务总是会打开设置面板
      openPanel && EVT.fire('openSettingsPanel')
    }
  }

  // 开始下载
  private startDownload() {
    if (states.busy) {
      return toast.error(lang.transl('_当前任务尚未完成'))
    }

    if (store.result.length === 0) {
      return toast.error(lang.transl('_没有可用的抓取结果'))
    }

    if (this.pause) {
      // 从上次中断的位置继续下载
      // 把“使用中”的下载状态重置为“未使用”
      downloadStates.resume()
    } else {
      // 如果之前没有暂停任务，也没有进入恢复模式，则重新下载
      // 初始化下载状态列表
      downloadStates.init()
    }

    this.reset()
    this.taskBatch = Date.now() // 修改本批下载任务的标记
    this.taskList = {} // 重置下载任务列表

    msgBox.resetOnce(this.uuidTip)

    this.setDownloaded()

    this.setDownloadThread()

    EVT.fire('downloadStart')

    // 建立并发下载线程
    for (let i = 0; i < this.thread; i++) {
      window.setTimeout(() => {
        this.createDownload(i)
      }, 0)
    }

    toast.show(lang.transl('_开始下载'))
    log.log(lang.transl('_正在下载中'))

    if (Config.mobile) {
      log.warning(lang.transl('_移动端浏览器可能不会建立文件夹的说明'))
      if (Config.isFirefox) {
        log.warning(lang.transl('_在移动版Firefox上提示无法可靠的批量下载'))
      }
    }
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
        log.warning('⏸️' + lang.transl('_下载已暂停'))
        // 输出空字符串，起到占据一个空行的效果，使得日志看起来更清晰
        log.log('')

        EVT.fire('downloadPause')
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
    log.error('🛑' + lang.transl('_下载已停止'))
    // 输出空字符串，起到占据一个空行的效果，使得日志看起来更清晰
    log.log('')
    this.pause = false

    EVT.fire('downloadStop')
  }

  private downloadError(id: string) {
    this.errorIdList.push(id)

    // 是否继续下载
    const task = this.taskList[id]
    const no = task.progressBarIndex
    if (this.checkContinueDownload()) {
      this.createDownload(no)
    } else {
      this.checkCompleteWithError()
    }
  }

  private setDownloaded() {
    this.downloaded = downloadStates.downloadedCount()

    // 显示下载进度
    const text = `${this.downloaded} / ${store.result.length}`
    log.log('➡️' + text, 'downloadProgress')

    // 设置总下载进度条
    progressBar.setTotalProgress(this.downloaded)

    store.remainingDownload = store.result.length - this.downloaded

    // 所有文件正常下载完毕（跳过下载的文件也算正常下载）
    if (this.downloaded === store.result.length) {
      log.persistentRefresh('downloadProgress')
      log.success('✅' + lang.transl('_下载完毕'))
      // 输出空字符串，起到占据一个空行的效果，使得日志看起来更清晰
      log.log('')

      window.setTimeout(() => {
        // 延后触发下载完成的事件。因为下载完成事件是由上游事件（跳过下载，或下载成功事件）派生的，如果这里不延迟触发，可能导致其他模块先接收到下载完成事件，后接收到上游事件。
        EVT.fire('downloadComplete')
      }, 0)
      this.reset()
    }

    this.checkCompleteWithError()
  }

  /** 下载任务进行中（正在下载或已暂停）一个作品被手动排除时，让它不再被下载。
   *
   * 这里不修改 store.result 数组本身，而是把该作品「尚未开始下载」的文件标记为已完成
   * （下载器把跳过下载的文件也视为正常下载），这样下载队列、进度分母和完成判定都不需要改动。
   *
   * 正在下载的文件（状态 0）不处理：它的下标已经被下载任务持有，改动下标会连累其它文件。
   * 已经下载完成的文件（状态 1）也不处理：文件已经在本地了。
   *
   * 真正从抓取结果里删除放到 removeExcludedWorks() 里做，那时下载已经结束，改动下标是安全的。 */
  private handleExcludedWork = (event: CustomEventInit) => {
    // 只有「下载任务存在」（正在下载或已暂停）时才需要在这里处理。
    // 其他情况下（抓取中、空闲、书签模式中）ExcludeWork 会直接调用 removeWorkById
    if (!states.hasDownloadTask) {
      return
    }

    const id = event.detail.data.id as string
    const type = event.detail.data.type as string
    // 只跳过系列小说：它的 id 是系列 id 而不是作品 id（而且理论上可能与某个作品 id 数值相同），
    // 在抓取结果里找不到对应的记录。而不在下载中时排除系列也是同样结果（removeWorkById 找不到），
    // 所以这里保持什么都不做，两边行为一致。
    // 小说本身同样是一条抓取结果，需要正常处理
    if (!id || type === 'novelSeries') {
      return
    }

    const idNum = Number.parseInt(id)
    if (Number.isNaN(idNum)) {
      return
    }

    // 找出这个作品在抓取结果里占用的文件下标
    const indexes: number[] = []
    store.result.forEach((result, index) => {
      if (result.idNum === idNum) {
        indexes.push(index)
      }
    })

    if (indexes.length === 0) {
      // 它没有抓取结果，不需要处理
      return
    }

    // 把尚未开始下载的文件标记为已完成，使下载器跳过它们
    for (const index of indexes) {
      if (downloadStates.states[index] === -1) {
        downloadStates.setState(index, 1)
      }
    }

    // 这些文件如果之前下载出错过，它们的 id 会留在 errorIdList 里（保存的是文件级 id）。
    // 现在它们已被跳过、不会再重试，所以要一并移除，否则会让 checkCompleteWithError 的等式
    // （downloaded + errorIdList.length === store.result.length）提前成立，可能触发一次多余的
    // 「暂停 + 重试」流程
    if (this.errorIdList.length > 0) {
      const errorIds = new Set(indexes.map((index) => store.result[index].id))
      this.errorIdList = this.errorIdList.filter((id) => !errorIds.has(id))
    }

    // 从作品列表里移除，让用户看到的抓取结果立即更新
    // 注意：这里不能触发 resultChange 事件。否则 DownloadStates 会重建状态列表、把下载进度清零，
    // 而且 DownloadControl 自己监听该事件后会重新进入准备下载的流程，可能把下过的文件再下一次
    store.resultMeta = store.resultMeta.filter(
      (result) => result.idNum !== idNum
    )

    this.excludedWorkIdList.push(idNum)

    // 刷新下载进度与完成判定（被跳过的文件同样计入已完成数量）。
    // 暂停时不刷新：setDownloaded 会在「全部完成」时调用 reset() 而清掉暂停状态，
    // 还可能走出错重试的流程自动开始下载。恢复下载时这些数字会被重新计算。
    if (!states.downloadPaused) {
      this.setDownloaded()
    }

    log.warning('⏭️' + lang.transl('_用户排除了一个作品下载器会在之后跳过它'))
    toast.error(lang.transl('_已从抓取结果中移除'))
  }

  /** 下载结束后，把被排除的作品从抓取结果里真正移除。
   *
   * 这时已经没有正在下载的文件，删除数组元素不会再造成下标错位。
   *
   * 注意不要触发 resultChange 事件：它会让 DownloadStates 重建状态列表，
   * 也会让 DownloadControl 自己重新进入准备下载的流程，可能把已经下载完的文件再下一次。 */
  private removeExcludedWorks = () => {
    if (this.excludedWorkIdList.length === 0) {
      return
    }

    for (const idNum of this.excludedWorkIdList) {
      // 移除该作品的所有文件，并同步移除下载状态列表里对应的项，保持两者下标一一对应
      const removedIndexes = store.removeWorkFromResult(idNum)
      downloadStates.removeItems(removedIndexes)
      // resultMeta 里该作品在排除时就已经移除了，这里重复移除是幂等的
    }

    this.excludedWorkIdList = []

    // 结果数量变小了，同步一下剩余的下载数量
    store.remainingDownload = Math.max(
      0,
      store.result.length - downloadStates.downloadedCount()
    )
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
      setSetting('downloadThread', Config.downloadThreadMax)
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

  private async saveFileError(data: DonwloadSuccessData) {
    if (this.pause || this.stop) {
      return false
    }

    const taskBatch = this.taskBatch
    await Utils.sleep(3000)
    // 等待期间可能暂停、停止或重新开始，不能继续旧任务的重试。
    if (this.pause || this.stop || this.taskBatch !== taskBatch) {
      return false
    }
    const task = this.taskList[data.id]
    if (!task) {
      return false
    }
    // 复位这个任务的状态
    downloadStates.setState(task.index, -1)
    // 建立下载任务，再次下载它
    this.createDownload(task.progressBarIndex)
  }

  private downloadOrSkipAFile(data: DonwloadSuccessData | DonwloadSkipData) {
    const task = this.taskList[data.id]

    try {
      // 更改这个任务状态为“已完成”
      downloadStates.setState(task.index, 1)

      // 统计已下载数量
      this.setDownloaded()

      // 是否继续下载
      const no = task.progressBarIndex
      if (this.checkContinueDownload()) {
        this.createDownload(no)
      }
    } catch (error) {
      // 捕获推进任务时的异常，避免任务卡住却没有提示
      console.error('downloadOrSkipAFile 执行出错', error)
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

  // 查找需要进行下载的作品，建立下载
  private createDownload(progressBarIndex: number) {
    const index = downloadStates.getFirstDownloadItem()
    if (index === undefined) {
      // 当已经没有需要下载的作品时，检查是否带着错误完成了下载
      // 如果下载过程中没有出错，就不会执行到这个分支
      return this.checkCompleteWithError()
    } else {
      const workData = store.result[index]
      const argument: downloadArgument = {
        id: workData.id,
        result: workData,
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
      new Download(progressBarIndex, argument, index)
    }
  }

  // 在有下载出错的情况下，是否已经完成了下载
  private async checkCompleteWithError() {
    if (
      this.errorIdList.length > 0 &&
      this.downloaded + this.errorIdList.length === store.result.length
    ) {
      // 进入暂停状态，等待一段时间后自动开始下载，重试下载出错的文件
      this.pauseDownload()
      log.log(lang.transl('_稍后会重试下载失败的文件'))
      await Utils.sleep(2000)
      this.startDownload()
    }
  }

  private reset() {
    this.pause = false
    this.stop = false
    this.errorIdList = []
    this.downloaded = 0
  }

  private showDownloadArea() {
    this.wrapper.style.display = 'block'
  }

  private hideDownloadArea() {
    this.wrapper.style.display = 'none'
  }

  private showResultBtns() {
    this.resultBtns.exportJSON.style.display = 'flex'
    this.resultBtns.exportCSV.style.display = 'flex'
  }

  private hideResultBtns() {
    this.resultBtns.exportJSON.style.display = 'none'
    this.resultBtns.exportCSV.style.display = 'none'
  }
}

new DownloadControl()
