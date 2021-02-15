import { EVT } from './EVT'
import { Result } from './StoreType'
import { lang } from './Lang'
import { Tools } from './Tools'
import { states } from './States'
import { store } from './Store'
import { toast } from './Toast'
import { msgBox } from './MsgBox'
import { filter } from './filter/Filter'

class ImportResult {
  constructor() {
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.importResult, () => {
      if (states.busy) {
        toast.error(lang.transl('_当前任务尚未完成'))
        return
      }

      this.import()
    })
  }

  private async import() {
    const loadedJSON = (await Tools.loadJSONFile().catch((err) => {
      return msgBox.error(err)
    })) as Result[]
    if (!loadedJSON) {
      return
    }

    // 要求是数组并且要有内容
    if (!Array.isArray(loadedJSON) || !loadedJSON.length || !loadedJSON[0]) {
      return toast.error('Format error!')
    }

    // 检查是否含有必须的字段（只检查了一部分）
    const keys = Object.keys(loadedJSON[0])
    const need = ['idNum', 'id', 'original', 'type', 'ext']
    for (const field of need) {
      if (!keys.includes(field)) {
        return toast.error('Format error!')
      }
    }

    // 根据过滤选项，过滤导入的结果
    const temp: Result[] = []
    for (const result of loadedJSON) {
      const check = await filter.check({
        id: result.idNum,
        workType: result.type,
        pageCount: result.pageCount,
        tags: result.tagsWithTransl,
        bookmarkCount: result.bmk,
        bookmarkData: result.bookmarked,
        width: result.fullWidth,
        height: result.fullHeight,
        createDate: result.date,
        userId: result.userId,
      })
      if (check) {
        temp.push(result)
      }
    }

    // 如果没有符合过滤条件的结果
    if (temp.length === 0) {
      msgBox.warning(lang.transl('_没有数据可供使用'))
      return
    }

    // 恢复数据并发送通知
    store.reset()
    store.result = temp

    EVT.fire(EVT.list.resultChange)

    msgBox.success(lang.transl('_导入成功'))
  }
}

new ImportResult()
export {}
