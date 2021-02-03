import { EVT } from './EVT'
import { Result } from './Store.d'
import { lang } from './Lang'
import { Tools } from './Tools'
import { states } from './States'
import { store } from './Store'

class ImportResult {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.importResult, () => {
      if (states.busy) {
        EVT.fire(EVT.list.sendToast, {
          text: lang.transl('_当前任务尚未完成'),
          bgColorType: 'error',
        })
        return
      }

      this.import()
    })
  }

  private async import() {
    const loadedJSON = (await Tools.loadJSONFile().catch((err) => {
      return EVT.sendMsg({
        type: 'error',
        msg: err,
      })
    })) as Result[]
    if (!loadedJSON) {
      return
    }

    // 要求是数组并且要有内容
    if (!Array.isArray(loadedJSON) || !loadedJSON.length || !loadedJSON[0]) {
      return EVT.fire(EVT.list.sendToast, {
        text: `Format error!`,
        bgColorType: 'error',
      })
    }

    // 检查是否含有必须的字段（只检查了一部分）
    const keys = Object.keys(loadedJSON[0])
    const need = ['idNum', 'id', 'original', 'type', 'ext']
    for (const field of need) {
      if (!keys.includes(field)) {
        return EVT.fire(EVT.list.sendToast, {
          text: `Format error!`,
          bgColorType: 'error',
        })
      }
    }

    // 恢复数据并发送通知
    store.reset()
    store.result = loadedJSON

    EVT.fire(EVT.list.resultChange)

    EVT.fire(EVT.list.sendToast, {
      text: lang.transl('_导入成功'),
      bgColorType: 'green',
    })
  }
}

new ImportResult()
export { }
