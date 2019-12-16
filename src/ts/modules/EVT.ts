// 事件类
import { EventList } from './EVT.d'

class EVT {
  static readonly events: EventList = {
    crawlStart: 'crawlStart',
    crawlFinish: 'crawlFinish',
    crawlEmpty: 'crawlEmpty',
    crawlError: 'crawlError',
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
    output: 'output'
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
