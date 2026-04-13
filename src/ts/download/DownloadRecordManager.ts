import { IndexedDB } from '../utils/IndexedDB'
import { lang } from '../Language'
import { log } from '../Log'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'
import { DownloadRecordType } from './DownloadRecord'
import { EVT } from '../EVT'
import { secretSignal } from '../utils/SecretSignal'

/** 导入、导出、清空下载记录 */
class DownloadRecordManager {
  constructor(IDB: IndexedDB, storeNameList: string[]) {
    this.IDB = IDB
    this.storeNameList = storeNameList
    this.bindEvents()
  }

  private IDB: IndexedDB
  private storeNameList: string[]

  private bindEvents() {
    // 导入含有 id 列表的 txt 文件
    secretSignal.register('recordtxt', () => {
      this.importRecordFromTxt()
    })

    // 导入下载记录的按钮
    {
      const btn = document.querySelector('#importDownloadRecord')
      if (btn) {
        btn.addEventListener('click', () => {
          EVT.fire('importDownloadRecord')
        })
      }
    }

    // 监听导入下载记录的事件
    window.addEventListener(EVT.list.importDownloadRecord, () => {
      this.importRecordFromJSON()
    })

    // 导出下载记录的按钮
    {
      const btn = document.querySelector('#exportDownloadRecord')
      if (btn) {
        btn.addEventListener('click', () => {
          EVT.fire('exportDownloadRecord')
        })
      }
    }

    // 监听导出下载记录的事件
    window.addEventListener(EVT.list.exportDownloadRecord, () => {
      this.exportRecord()
    })

    // 清空下载记录的按钮
    {
      const btn = document.querySelector('#clearDownloadRecord')
      if (btn) {
        btn.addEventListener('click', () => {
          EVT.fire('clearDownloadRecord')
        })
      }
    }

    // 监听清空下载记录的事件
    window.addEventListener(EVT.list.clearDownloadRecord, () => {
      this.clearRecords()
    })
  }

  // 清空下载记录
  private async clearRecords() {
    if (window.confirm(lang.transl('确定要清除下载记录吗')) === false) {
      return
    }

    log.log(lang.transl('_清除下载记录'))
    toast.show(lang.transl('_清除下载记录'))

    let total = this.storeNameList.length
    let num = 0

    for (const name of this.storeNameList) {
      log.log(`${lang.transl('_任务进度')} ${num}/${total}`)
      num++
      await this.IDB.clear(name)
    }

    log.log(`${lang.transl('_任务进度')} ${num}/${total}`)
    log.success(lang.transl('_下载记录已清除'))
    toast.success(lang.transl('_下载记录已清除'))
  }

  // 导出下载记录
  private async exportRecord() {
    log.log(lang.transl('_导出下载记录'))
    toast.show(lang.transl('_导出下载记录'))

    let total = this.storeNameList.length
    let num = 0

    let record: DownloadRecordType[] = []
    for (const name of this.storeNameList) {
      log.log(`${lang.transl('_任务进度')} ${num}/${total}`)
      num++
      const r = (await this.IDB.getAll(name)) as DownloadRecordType[]
      record = record.concat(r)
    }
    log.log(`${lang.transl('_任务进度')} ${num}/${total}`)

    if (record.length === 0) {
      log.error(lang.transl('_没有数据可供使用'))
      toast.error(lang.transl('_没有数据可供使用'))
      return
    }

    const resultList = await Utils.json2BlobSafe(record)
    for (const result of resultList) {
      Utils.downloadFile(
        result.url,
        `record-total ${result.total}-${Utils.replaceUnsafeStr(
          new Date().toLocaleString()
        )}.json`
      )
    }

    const msg = lang.transl('_导出成功')
    log.success(msg)
    toast.success(msg)
  }

  // 导入下载记录
  private async importRecord(record: DownloadRecordType[]) {
    log.log(lang.transl('_导入下载记录'))

    // 显示导入进度
    let stored = 0
    let total = record.length

    if (total > 10000) {
      log.warning(lang.transl('_数据较多需要花费一些时间'))
    }

    log.log(`${stored}/${total}`, 'downloadRecordImportProgress')

    console.time('importRecord')
    // 依次处理每个存储库
    for (let index = 0; index < this.storeNameList.length; index++) {
      // 提取出要存入这个存储库的数据
      const data: DownloadRecordType[] = []
      for (const r of record) {
        if (parseInt(r.id[0]) - 1 === index) {
          data.push(r)
        }
      }

      if (data.length === 0) {
        continue
      }

      // 添加数据
      log.log(`${lang.transl('_待处理')} ${data.length}`)
      try {
        // console.time('restoreRecord' + (index + 1))
        await this.IDB.batchAddData(this.storeNameList[index], data, 'id')
        // console.timeEnd('restoreRecord' + (index + 1))

        stored += data.length
        log.log(`${stored}/${total}`, 'downloadRecordImportProgress')
      } catch (error) {
        const errorMsg = (error as any)?.target?.error
        const tip = errorMsg ? errorMsg : error
        log.error(tip)
        msgBox.error(tip)
      }
    }
    console.timeEnd('importRecord')

    if (stored < total) {
      return
    }

    log.success(lang.transl('_导入成功'))
    toast.success(lang.transl('_导入成功'))

    msgBox.success(lang.transl('_导入成功'), {
      title: lang.transl('_导入下载记录'),
    })

    // 时间参考：导入 100000 条下载记录，花费的时间在 30 秒以内。但偶尔会有例外，中途像卡住了一样，很久没动，最后花了两分钟多的时间。
  }

  // 从 json 文件导入
  private async importRecordFromJSON() {
    const record = (await Utils.loadJSONFile().catch((err) => {
      msgBox.error(err)
      return
    })) as DownloadRecordType[]

    if (!record) {
      return
    }

    // 判断格式是否符合要求
    if (
      Array.isArray(record) === false ||
      record[0].id === undefined ||
      record[0].n === undefined
    ) {
      return msgBox.error(lang.transl('_格式错误'))
    }

    this.importRecord(record)
  }

  // 从 txt 文件导入
  // 每行一个文件 id（带序号），以换行分割
  private async importRecordFromTxt() {
    const file = (await Utils.selectFile('.txt'))[0]
    const text = await file.text()

    // 以换行分割
    let split = '\r\n'
    if (!text.includes(split)) {
      split = '\n'
    }
    const arr = text.split(split)

    // 把每一行视为一个 id，进行导入
    const record: DownloadRecordType[] = []
    for (const str of arr) {
      if (str) {
        record.push({
          id: str,
          n: str,
        })
      }
    }
    this.importRecord(record)
  }
}

export { DownloadRecordManager }
