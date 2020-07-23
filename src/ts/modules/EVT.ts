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
    pageTypeChange: 'pageTypeChange',
    resetOption: 'resetOption',
    convertChange: 'convertChange',
    previewFileName: 'previewFileName',
    output: 'output',
    hideCenterPanel: 'hideCenterPanel',
    showCenterPanel: 'showCenterPanel',
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
  }

  // 事件发起者的标识列表
  static readonly InitiatorList = {
    resume: 'resume',
  }

  // 触发事件，可以携带数据
  static fire(type: string, data: object | string | number | boolean = '') {
    const event = new CustomEvent(type, {
      detail: { data: data },
    })
    setTimeout(() => {
      window.dispatchEvent(event)
    }, 0)
  }
}

export { EVT }
