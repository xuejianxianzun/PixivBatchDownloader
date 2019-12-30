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
  toggleForm: 'toggleForm'
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
    clearMultiple: 'clearMultiple',
    clearUgoira: 'clearUgoira',
    deleteWork: 'deleteWork',
    worksUpdate: 'worksUpdate',
    toggleForm: 'toggleForm'
  }

  static fire(
    type: keyof EventList,
    data: object | string | number | boolean = ''
  ) {
    const event = new CustomEvent(type, {
      detail: { data: data }
    })
    window.dispatchEvent(event)
  }
}

export { EVT }
