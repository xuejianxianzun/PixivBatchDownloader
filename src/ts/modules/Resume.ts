import config from './Config'
import { EVT } from './EVT'
import { store } from './Store'
import { log } from './Log'
import { downloadStates, DLStatesI } from './DownloadStates'
import { Result } from './Store.d'
import { IDB } from './IndexedDB'

interface TaskMeta {
  id: number
  url: string
  part: number
}

interface TaskData {
  id: number
  data: Result[]
}

interface TaskStates {
  id: number
  states: DLStatesI
}

// 断点续传。恢复未完成的下载
class Resume {
  constructor() {
    this.init()
  }

  public flag = false // 指示是否处于恢复模式

  private db!: IDBDatabase
  private metaName = 'taskMeta' // 下载任务元数据的表名
  private dataName = 'taskData' // 下载任务数据的表名
  private statesName = 'taskStates' // 下载状态列表的表名
  private taskId!: number // 为当前任务创建一个 id，操作数据库时使用

  private part: number[] = [] // 储存每个分段里的数据的数量

  private try = 0 // 任务结果是分批储存的，记录每批失败了几次。根据失败次数减少每批的数量

  // 尝试存储抓取结果时，单次存储的数量不能超过这个数字。因为超过这个数字可能会碰到单次存储的上限
  // 由于每个结果的体积可能不同，所以这只是一个预估值
  // 这有助于减少尝试次数。因为存储的思路是存储失败时改为上次数量的 1/2。例如有 100 w 个结果，存储算法会依次尝试存入 100 w、50 w、25 w、12.5 w 以此类推，直到最后有一次能成功存储一批数据。这样的话就进行了 4 次尝试才成功存入一批数据。但通过直接指定一批数据的大小为 onceMax，理想情况下可以只尝试一次就成功存入一批数据。
  // 非理想情况下，即这个数量的结果已经超过了单次存储上限（目前推测这可能会在大量抓取小说、动图时出现；如果抓取的作品大部分是插画、漫画，这个数量的结果应该不可能超出存储上限），那么这不会减少尝试数量，但因为每次尝试存储的数量不会超过这个数字，这依然有助于减少每次尝试时的资源占用、耗费时间。
  private readonly onceMax = 150000

  private readonly putStatesTime = 2000 // 每隔指定时间存储一次最新的下载状态

  private needPutStates = false // 指示是否需要更新存储的下载状态

  private readonly testSave = false // 调试存储状况的开关

  private async init() {
    if (location.hostname.includes('pixivision.net')) {
      return
    }

    this.db = await this.initDB()
    !this.testSave && this.restoreData()
    this.bindEvent()
    this.regularPutStates()
    this.clearExired()
    this.testSave && this.test(1000000)
  }

  // 初始化数据库，获取数据库对象
  private async initDB() {
    // 创建表和索引
    window.addEventListener(EVT.events.DBupgradeneeded, (ev: CustomEventInit) => {
      const db = ev.detail.data.db as IDBDatabase

      if (!db.objectStoreNames.contains(this.metaName)) {
        const metaStore = db.createObjectStore(this.metaName, {
          keyPath: 'id',
        })
        metaStore.createIndex('id', 'id', { unique: true })
        metaStore.createIndex('url', 'url', { unique: true })
      }

      if (!db.objectStoreNames.contains(this.dataName)) {
        const dataStore = db.createObjectStore(this.dataName, {
          keyPath: 'id',
        })
        dataStore.createIndex('id', 'id', { unique: true })
      }

      if (!db.objectStoreNames.contains(this.statesName)) {
        const statesStore = db.createObjectStore(this.statesName, {
          keyPath: 'id',
        })
        statesStore.createIndex('id', 'id', { unique: true })
      }
    })

    return new Promise<IDBDatabase>(async (resolve, reject) => {
      const db = await IDB.open(config.DBName, config.DBVer)
      resolve(db)
    })
  }

  // 恢复未完成任务的数据
  private async restoreData() {
    // 如果当前不允许展开工作（也就是在抓取或者在下载），则不恢复数据
    if (!store.states.allowWork) {
      return
    }

    // 1 获取任务的元数据
    const meta = await IDB.get(this.metaName, this.getURL(), 'url') as TaskMeta | null
    if (!meta) {
      this.flag = false
      return
    }

    log.warning('Restoring crawl results')

    this.taskId = meta.id

    // 2 恢复抓取结果

    // 生成每批数据的 id 列表
    const dataIdList: number[] = this.createIdList(meta.id, meta.part)
    // 读取全部数据并恢复
    const promiseList = []
    for (const id of dataIdList) {

      promiseList.push(IDB.get(this.dataName, id))
    }

    await Promise.all(promiseList).then((res) => {
      store.result = []
      const r = res as TaskData[]
      for (const taskData of r) {
        for (const data of taskData.data) {
          store.result.push(data)
        }
      }
    })

    // 3 恢复下载状态
    const data = (await IDB.get(
      this.statesName,
      this.taskId
    )) as TaskStates

    if (data) {
      downloadStates.replace(data.states)
    }

    // 恢复模式就绪
    this.flag = true

    log.success('Crawl results have been restored', 2)

    // 发出抓取完毕的信号
    EVT.fire(EVT.events.crawlFinish, {
      initiator: EVT.InitiatorList.resume,
    })
  }

  private bindEvent() {
    // 抓取完成时，保存这次任务的数据
    window.addEventListener(
      EVT.events.crawlFinish,
      async (ev: CustomEventInit) => {
        if (ev.detail.data.initiator === EVT.InitiatorList.resume) {
          // 如果这个事件是这个类自己发出的，则不进行处理
          return
        }
        // 首先检查这个网址下是否已经存在有数据，如果有数据，则清除之前的数据，保持每个网址只有一份数据
        const taskData = await IDB.get(this.metaName, this.getURL(), 'url') as TaskMeta | null

        if (taskData) {
          await IDB.delete(this.metaName, taskData.id)
          await IDB.delete(this.statesName, taskData.id)
        }

        this.taskId = new Date().getTime()

        log.warning('Saving crawl results')

        // 保存本次任务的数据
        this.part = []
        await this.saveTaskData()

        // 保存 meta 数据
        const metaData = {
          id: this.taskId,
          url: this.getURL(),
          part: this.part.length,
        }

        IDB.add(this.metaName, metaData)

        // 保存 states 数据
        const statesData = {
          id: this.taskId,
          states: downloadStates.states,
        }
        IDB.add(this.statesName, statesData)

        log.success('The crawl results have been saved', 2)
      }
    )

    // 当有文件下载完成时，更新下载状态
    window.addEventListener(EVT.events.downloadSucccess, () => {
      this.needPutStates = true
    })

    // 任务下载完毕时，清除这次任务的数据
    window.addEventListener(EVT.events.downloadComplete, async () => {
      const meta = (await IDB.get(this.metaName, this.taskId)) as TaskMeta

      if (!meta) {
        return
      }

      IDB.delete(this.metaName, this.taskId)
      IDB.delete(this.statesName, this.taskId)

      const dataIdList = this.createIdList(this.taskId, meta.part)
      for (const id of dataIdList) {
        IDB.delete(this.dataName, id)
      }
      this.flag = false
    })

    // 开始新的抓取时，取消恢复模式
    window.addEventListener(EVT.events.crawlStart, () => {
      this.flag = false
    })

    // 切换页面时，重新检查恢复数据
    window.addEventListener(EVT.events.pageSwitch, () => {
      this.flag = false
      this.restoreData()
    })
  }

  // 定时 put 下载状态
  private async regularPutStates() {
    setInterval(() => {
      if (this.needPutStates) {
        const statesData = {
          id: this.taskId,
          states: downloadStates.states,
        }
        this.needPutStates = false
        IDB.put(this.statesName, statesData)
      }
    }, this.putStatesTime)
  }

  // 存储抓取结果
  private async saveTaskData() {
    return new Promise(async (resolve, reject) => {
      // 每一批任务的第一次执行会尝试保存所有剩余数据(0.5 的 0 次幂是 1)
      // 如果出错了，则每次执行会尝试保存上一次数据量的一半，直到这次存储成功
      // 之后继续进行下一批任务（如果有）
      let tryNum = Math.floor(store.result.length * Math.pow(0.5, this.try))
      // 如果这批尝试数据大于指定数量，则设置为指定数量
      tryNum > this.onceMax && (tryNum = this.onceMax)
      let data = {
        id: this.numAppendNum(this.taskId, this.part.length),
        data: store.result.slice(
          this.getPartTotal(),
          this.getPartTotal() + tryNum
        ),
      }

      try {
        // 当成功存储了一批数据时
        await IDB.add(this.dataName, data)
        this.part.push(data.data.length) // 记录这一次保存的结果数量
        this.try = 0 // 重置已尝试次数

        // 任务数据全部添加完毕
        if (this.getPartTotal() >= store.result.length) {
          // console.log('add complete')
          resolve()
        } else {
          // 任务数据没有添加完毕，继续添加
          resolve(this.saveTaskData())
        }
      } catch (error) {
        // 当存储失败时
        console.error(error)
        if (error.target && error.target.error && error.target.error.message) {
          const msg = error.target.error.message as string
          if (msg.includes('too large')) {
            // 体积超大
            // 尝试次数 + 1 ，进行下一次尝试
            this.try++
            resolve(this.saveTaskData())
          } else {
            // 未知错误，不再进行尝试
            this.try = 0
            log.error('IndexedDB: ' + msg)
            reject(error)
          }
        }
      }
    })
  }

  // 清除过期的数据
  private async clearExired() {
    // 数据的过期时间，设置为 30 天。30*24*60*60*1000
    const expiryTime = 2592000000
    const nowTime = new Date().getTime()

    const callback = (item: IDBCursorWithValue | null) => {
      if (item) {
        const data = item.value as TaskMeta
        // 检查数据是否过期
        if (nowTime - data.id > expiryTime) {
          IDB.delete(this.metaName, data.id)
          IDB.delete(this.statesName, data.id)

          const dataIdList = this.createIdList(data.id, data.part)
          for (const id of dataIdList) {
            IDB.delete(this.dataName, id)
          }
        }
        item.continue()
      }
    }

    IDB.openCursor(this.metaName, callback)
  }

  // 计算 part 数组里的数字之和
  private getPartTotal() {
    if (this.part.length === 0) {
      return 0
    }

    return this.part.reduce((prev, curr) => {
      return prev + curr
    })
  }

  // 处理本页面的 url
  private getURL() {
    return window.location.href.split('#')[0]
  }

  // 在数字后面追加数字
  // 用于在 task id  后面追加序号数字(part)
  private numAppendNum(id: number, num: number) {
    return parseInt(id.toString() + num)
  }

  // 根据 taskMeta 里的 id 和 part 数量，生成 taskData 里对应的数据的 id 列表
  private createIdList(taskid: number, part: number) {
    // part 记录数据分成了几部分，所以是从 1 开始的，而不是从 0 开始
    // 生成的 id 的结尾是从 0 开始增加的
    const arr = []
    let start = 0
    while (start < part) {
      arr.push(this.numAppendNum(taskid, start))
      start++
    }
    return arr
  }

  // 添加指定数量的测试数据，模拟抓取完毕事件，用于调试存储情况
  // 这个数据由于 id 是重复的，所以不能正常下载
  private test(num: number) {
    while (num > 0) {
      store.result.push({
        bmk: 1644,
        bookmarked: false,
        date: '2020-07-11',
        dlCount: 1,
        ext: 'jpg',
        fullHeight: 1152,
        fullWidth: 2048,
        id: '82900613_p0',
        idNum: 82900613,
        novelBlob: null,
        pageCount: 1,
        rank: '',
        seriesOrder: '',
        seriesTitle: '',
        tags: [
          '女の子',
          'バーチャルYouTuber',
          'にじさんじ',
          '本間ひまわり',
          'にじさんじ',
          '本間ひまわり',
        ],
        tagsTranslated: [
          '女の子',
          '女孩子',
          'バーチャルYouTuber',
          '虚拟YouTuber',
          'にじさんじ',
          '彩虹社',
          '本間ひまわり',
          '本间向日葵',
          'にじさんじ',
          '彩虹社',
          '本間ひまわり',
          '本间向日葵',
        ],
        thumb:
          'https://i.pximg.net/c/250x250_80_a2/custom-thumb/img/2020/07/11/17/05/41/82900613_p0_custom1200.jpg',
        title: '本間ひまわり',
        type: 0,
        ugoiraInfo: null,
        url:
          'https://i.pximg.net/img-original/img/2020/07/11/17/05/41/82900613_p0.jpg',
        user: 'らっち。',
        userId: '10852879',
      })
      num--
    }
    EVT.fire(EVT.events.crawlFinish)
  }
}

const resume = new Resume()
export { resume }
