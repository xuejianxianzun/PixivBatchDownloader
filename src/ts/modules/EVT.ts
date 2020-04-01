// 事件类
interface EventList {
  crawlStart: 'crawlStart'
  crawlFinish: 'crawlFinish'
  crawlEmpty: 'crawlEmpty'
  crawlError: 'crawlError'
  addResult: 'addResult'
  convertChange: 'convertChange'
  previewFileName: 'previewFileName'
  output: 'output'
  hideCenterPanel: 'hideCenterPanel'
  showCenterPanel: 'showCenterPanel'
  downloadStart: 'downloadStart'
  downloadPause: 'downloadPause'
  downloadStop: 'downloadStop'
  download: 'download'
  downloadSucccess: 'downloadSucccess'
  downloadComplete: 'downloadComplete'
  downloadError: 'downloadError'
  pageSwitch: 'pageSwitch'
  pageTypeChange: 'pageTypeChange'
  resetOption: 'resetOption'
  clearMultiple: 'clearMultiple'
  clearUgoira: 'clearUgoira'
  deleteWork: 'deleteWork'
  worksUpdate: 'worksUpdate'
  settingChange: 'settingChange'
  clickRightIcon: 'clickRightIcon'
  destroy: 'destroy'
  convertError: 'convertError'
  skipSaveFile: 'skipSaveFile'
}

class EVT {
  static readonly events: EventList = {
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
  }

  static fire(
    type: keyof EventList,
    data: object | string | number | boolean = ''
  ) {
    const event = new CustomEvent(type, {
      detail: { data: data },
    })
    window.dispatchEvent(event)
  }
}

export { EVT }
