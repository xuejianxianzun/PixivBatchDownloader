import { Msg } from './MsgBox'

const bindOnceFlagList: string[] = []

// 只绑定某个事件一次，用于防止事件重复绑定
// 通过 flag 确认是否是同一个事件
// 可以执行多次，不会自动解绑
function bindOnce(flag: string, targetEvt: string, evtFun: Function) {
  const query = bindOnceFlagList.includes(flag)
  if (!query) {
    bindOnceFlagList.push(flag)
    window.addEventListener(targetEvt, function (ev) {
      evtFun(ev)
    })
  }
}

// 触发自定义事件
class EVT {
  static readonly list = {
    // 当抓取开始时触发
    crawlStart: 'crawlStart',
    // 当检查到错误的设置时触发
    wrongSetting: 'wrongSetting',
    // 当获取作品的 id 列表完成时触发
    getIdListFinished: 'getIdListFinished',
    // 获取了作品的 id 列表，需要下载这些 id 列表时使用
    downloadIdList: 'downloadIdList',
    // 当抓取完成时触发。不管结果是否为空都会触发
    crawlFinish: 'crawlFinish',
    // 当抓取结果为空时触发。触发时机晚于 crawlFinish
    crawlEmpty: 'crawlEmpty',
    // store 里每存储一个作品的元数据，就触发一次。如果一个元数据产生了多个结果（多图作品），只触发一次
    addResult: 'addResult',
    // 当抓取完毕之后，抓取结果又发生变化时触发（比如进行多次筛选、改变设置项等，导致结果变化）
    resultChange: 'resultChange',
    // 当进行快速下载时触发
    QuickDownload: 'QuickDownload',
    // 开始下载时触发
    downloadStart: 'downloadStart',
    // 下载状态变成暂停时触发
    downloadPause: 'downloadPause',
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
    outputCSV: 'outputCSV',
    // 当需要导出抓取结果时触发
    outputResult: 'outputResult',
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
    // 需要清空日志区域时触发
    clearLog: 'clearLog',
  }

  // 触发事件，可以携带数据
  static fire(type: string, data: object | string | number | boolean = {}) {
    const event = new CustomEvent(type, {
      detail: { data: data },
    })
    window.dispatchEvent(event)
  }

  static sendMsg(data: Msg) {
    this.fire(this.list.showMsg, data)
  }

  static bindOnce = bindOnce
}

export { EVT }
