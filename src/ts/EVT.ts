import { DonwloadSkipData, DonwloadSuccessData } from './download/DownloadType'
import { IDData, Result } from './store/StoreType'
import { OutputData } from './output/OutputPanel'
import { SettingChangeData } from './setting/Settings'
import { Msg } from './MsgBox'

type eventNames = keyof typeof EVT.list

// 管理自定义事件
class EVENT {
  private bindOnceFlagList: string[] = []

  // 只绑定某个事件一次，用于防止事件重复绑定
  // 通过 flag 确认是否是同一个事件
  // 可以执行多次，不会自动解绑
  public bindOnce(flag: string, targetEvt: string, evtFun: Function) {
    const query = this.bindOnceFlagList.includes(flag)
    if (!query) {
      this.bindOnceFlagList.push(flag)
      window.addEventListener(targetEvt, function (ev) {
        evtFun(ev)
      })
    }
  }

  public readonly list = {
    // 当抓取开始时触发
    crawlStart: 'crawlStart',
    // 让下载器抓取特定的 tag，而不是自动获取当前页面的 tag（仅在 tag 搜索页面有效）
    crawlTag: 'crawlTag',
    // 当检查到错误的设置时触发
    wrongSetting: 'wrongSetting',
    // 当获取作品的 id 列表完成时触发
    getIdListFinished: 'getIdListFinished',
    // 获取了作品的 id 列表，需要下载这些 id 列表时使用
    crawlIdList: 'crawlIdList',
    // 当抓取完成时触发。不管结果是否为空都会触发
    crawlFinish: 'crawlFinish',
    // 当抓取结果为空时触发。触发时机晚于 crawlFinish
    crawlEmpty: 'crawlEmpty',
    // store 里每存储一个作品的元数据，就触发一次。如果一个元数据产生了多个结果（多图作品），只触发一次
    addResult: 'addResult',
    // 当抓取完毕之后，抓取结果又发生变化时触发（比如进行多次筛选、改变设置项等，导致结果变化）
    resultChange: 'resultChange',
    // 当进行快速抓取时触发
    quickCrawl: 'quickCrawl',
    // 抓取完毕后，可以准备开始下载时触发
    // 它是一个派生事件，可以由多个其他事件触发
    readyDownload: 'readyDownload',
    // 下载被取消（取消是在尚未开始下载前触发的，它不同于下载停止）
    downloadCancel: 'downloadCancel',
    // 开始下载时触发
    downloadStart: 'downloadStart',
    // 下载状态变成暂停时触发
    downloadPause: 'downloadPause',
    // 请求停止下载
    requestPauseDownload: 'requestPauseDownload',
    // 下载状态变成停止时触发
    downloadStop: 'downloadStop',
    // 当文件在下载阶段下载失败时触发
    // 当动图转换出错时触发
    downloadError: 'downloadError',
    // 当一个文件在下载阶段被跳过时触发
    skipDownload: 'skipDownload',
    // 当浏览器把一个文件保存到本地失败时触发
    saveFileError: 'saveFileError',
    // 当下载的文件传递给浏览器进行保存，并且成功保存之后触发
    // skipDownload 也会触发这个事件
    downloadSuccess: 'downloadSuccess',
    // 下载队列里的所有文件都已经下载并保存完毕，并且没有出错的。如果有出错的，就不会触发这个事件
    downloadComplete: 'downloadComplete',
    // 页面切换
    pageSwitch: 'pageSwitch',
    // 页面切换，并且页面类型变化
    pageSwitchedTypeChange: 'pageSwitchedTypeChange',
    // 页面切换，并且页面类型不变
    pageSwitchedTypeNotChange: 'pageSwitchedTypeNotChange',
    // 程序启动时，设置初始化完毕后触发
    settingInitialized: 'settingInitialized',
    // 请求重置所有设置
    resetSettings: 'resetSettings',
    // 重置所有设置执行完毕
    resetSettingsEnd: 'resetSettingsEnd',
    // 请求导出设置
    exportSettings: 'exportSettings',
    // 请求导入设置
    importSettings: 'importSettings',
    // 当动图转换数量发生变化时触发
    convertChange: 'convertChange',
    // 当读取/解压 zip 文件出错时触发
    readZipError: 'readZipError',
    // 当动图转换成功时触发
    convertSuccess: 'convertSuccess',
    // 指示打开中间面板
    openCenterPanel: 'openCenterPanel',
    // 指示关闭中间面板
    closeCenterPanel: 'closeCenterPanel',
    // 中间面板已打开
    centerPanelOpened: 'centerPanelOpened',
    // 中间面板已关闭
    centerPanelClosed: 'centerPanelClosed',
    // 当清除多图作品时触发
    clearMultiple: 'clearMultiple',
    // 当清除动图作品时触发
    clearUgoira: 'clearUgoira',
    // 当手动删除作品时触发
    deleteWork: 'deleteWork',
    // 当下载器在页面上创建的作品列表全部完成时触发
    worksUpdate: 'worksUpdate',
    // 当需要清空下载记录时触发（指用于检测重复文件的下载记录）
    clearDownloadRecord: 'clearDownloadRecord',
    // 当需要导出下载记录时触发
    exportDownloadRecord: 'exportDownloadRecord',
    // 当需要导入下载记录时触发
    importDownloadRecord: 'importDownloadRecord',
    // 当需要清空断点续传的数据时触发
    clearSavedCrawl: 'clearSavedCrawl',
    // 当从断点续传数据恢复了下载时触发
    resume: 'resume',
    // 当需要导出 csv 文件时触发
    exportCSV: 'exportCSV',
    // 当需要导出抓取结果时触发
    exportResult: 'exportResult',
    // 当需要导出抓取结果时触发
    importResult: 'importResult',
    // 当需要保存用户头像时触发
    saveAvatarImage: 'saveAvatarImage',
    // 当需要保存用户头像为图标时触发
    saveAvatarIcon: 'saveAvatarIcon',
    // 当需要保存用户背景图片时触发
    saveUserCover: 'saveUserCover',
    // 当需要预览文件名时触发
    previewFileName: 'previewFileName',
    // 当需要预览 url 时触发
    showURLs: 'showURLs',
    // 当需要输出面板输出内容时触发
    output: 'output',
    // 当设置表单里的设置项发生变化时触发
    settingChange: 'settingChange',
    // 当下载器检测到有新版本时触发
    hasNewVer: 'hasNewVer',
    // 进入批量收藏模式时触发
    bookmarkModeStart: 'bookmarkModeStart',
    // 批量收藏完成时触发
    bookmarkModeEnd: 'bookmarkModeEnd',
    // 需要单独显示信息时触发
    showMsg: 'showMsg',
    // 需要显示冒泡提示时触发
    sendToast: 'sendToast',
    // 需要清空日志区域时触发
    clearLog: 'clearLog',
    // 选择背景图片
    selectBG: 'selectBG',
    // 清除背景图片
    clearBG: 'clearBG',
    // 点击了下载器在作品缩略图上添加的按钮时触发
    // 其他按钮监听这个事件后隐藏自己，就可以避免其他按钮出现闪烁、残留的问题
    clickBtnOnThumb: 'clickBtnOnThumb',
    // 显示原比例图片时触发
    showOriginSizeImage: 'showOriginSizeImage',
    // 语言类型改变时触发
    langChange: 'langChange',
  }

  // 触发自定义事件，大部分事件都不需要携带数据
  public fire(
    type:
      | 'crawlStart'
      | 'wrongSetting'
      | 'getIdListFinished'
      | 'crawlFinish'
      | 'crawlEmpty'
      | 'resultChange'
      | 'quickCrawl'
      | 'downloadCancel'
      | 'downloadStart'
      | 'downloadPause'
      | 'requestPauseDownload'
      | 'downloadStop'
      | 'saveFileError'
      | 'downloadComplete'
      | 'pageSwitch'
      | 'resetSettings'
      | 'resetSettingsEnd'
      | 'exportSettings'
      | 'importSettings'
      | 'readZipError'
      | 'convertSuccess'
      | 'openCenterPanel'
      | 'closeCenterPanel'
      | 'centerPanelOpened'
      | 'centerPanelClosed'
      | 'clearMultiple'
      | 'clearUgoira'
      | 'worksUpdate'
      | 'clearDownloadRecord'
      | 'exportDownloadRecord'
      | 'importDownloadRecord'
      | 'clearSavedCrawl'
      | 'resume'
      | 'exportCSV'
      | 'exportResult'
      | 'importResult'
      | 'saveAvatarImage'
      | 'saveAvatarIcon'
      | 'saveUserCover'
      | 'previewFileName'
      | 'showURLs'
      | 'hasNewVer'
      | 'bookmarkModeStart'
      | 'bookmarkModeEnd'
      | 'sendToast'
      | 'clearLog'
      | 'selectBG'
      | 'clearBG'
      | 'clickBtnOnThumb'
      | 'showOriginSizeImage'
      | 'langChange'
      | 'settingInitialized'
      | 'readyDownload'
  ): void

  // 对于需要携带数据的事件进行重载

  public fire(type: 'downloadError' | 'crawlTag', data: string): void

  public fire(
    type:
      | 'pageSwitchedTypeChange'
      | 'pageSwitchedTypeNotChange'
      | 'convertChange',
    data: number
  ): void

  public fire(type: 'downloadSuccess', data: DonwloadSuccessData): void

  public fire(type: 'crawlIdList', data: IDData[]): void

  public fire(type: 'addResult', data: Result): void

  public fire(type: 'output', data: OutputData): void

  public fire(type: 'settingChange', data: SettingChangeData): void

  public fire(type: 'deleteWork', data: HTMLElement): void

  public fire(type: 'skipDownload', data: DonwloadSkipData): void

  public fire(type: 'showMsg', data: Msg): void

  // 触发事件，可以携带数据
  // 数据通过 ev.detail.data 获取，如果未传递则是空对象
  public fire(type: eventNames, data?: unknown) {
    const event = new CustomEvent(type, {
      detail: { data: data === undefined ? {} : data },
    })
    window.dispatchEvent(event)
  }
}

const EVT = new EVENT()

export { EVT }
