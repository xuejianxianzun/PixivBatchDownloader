// 事件类
class EVT {
  // 事件名称列表
  static readonly events = {
    crawlStart: 'crawlStart',
    crawlFinish: 'crawlFinish',
    crawlEmpty: 'crawlEmpty',
    crawlError: 'crawlError',
    addResult: 'addResult',
    downloadStart: 'downloadStart',
    downloadPause: 'downloadPause',
    downloadStop: 'downloadStop',
    download: 'download',
    downloadSucccess: 'downloadSucccess',
    downloadError: 'downloadError',
    downloadComplete: 'downloadComplete',
    pageSwitch: 'pageSwitch',
    pageSwitchedTypeChange: 'pageSwitchedTypeChange',
    pageSwitchedTypeNotChange: 'pageSwitchedTypeNotChange',
    resetOption: 'resetOption',
    convertChange: 'convertChange',
    previewFileName: 'previewFileName',
    output: 'output',
    openCenterPanel: 'openCenterPanel',
    closeCenterPanel: 'closeCenterPanel',
    centerPanelOpened: 'centerPanelOpened',
    centerPanelClosed: 'centerPanelClosed',
    clearMultiple: 'clearMultiple',
    clearUgoira: 'clearUgoira',
    deleteWork: 'deleteWork',
    worksUpdate: 'worksUpdate',
    settingChange: 'settingChange',
    clickRightIcon: 'clickRightIcon',
    destroy: 'destroy',
    convertError: 'convertError',
    skipSaveFile: 'skipSaveFile',
    saveFileError: 'saveFileError',
    hasNewVer: 'hasNewVer',
    restoreDownload: 'restoreDownload',
    DBupgradeneeded: 'DBupgradeneeded',
    clearDownloadRecords: 'clearDownloadRecords',
    saveAvatarIcon: 'saveAvatarIcon',
    clearSavedCrawl: 'clearSavedCrawl',
    resume: 'resume',
  }

  // 触发事件，可以携带数据
  static fire(type: string, data: object | string | number | boolean = '') {
    const event = new CustomEvent(type, {
      detail: { data: data },
    })
    window.dispatchEvent(event)
  }
}

export { EVT }
