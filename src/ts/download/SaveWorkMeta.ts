import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { store } from '../store/Store'
import { DonwloadSuccessData, SendToBackEndData } from './DownloadType'
import { fileName } from '../FileName'
import { Result } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { Tools } from '../Tools'
import { Config } from '../Config'

// 为每个作品创建一个 txt 文件，保存这个作品的元数据
class SaveWorkMeta {
  constructor() {
    this.bindEvents()
  }

  // 保存已经下载了元数据的作品的 id
  private savedIds: number[] = []

  private readonly CRLF = '\n' // txt 文件中使用的换行符

  private bindEvents() {
    // 当有作品文件下载成功时，保存其元数据
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.saveMeta(Number.parseInt(successData.id))
    })

    // 当开始新的抓取时，清空保存的 id 列表
    window.addEventListener(EVT.list.crawlStart, () => {
      this.savedIds = []
    })
  }

  // 添加一项元数据
  // 在 name 和 value 后面添加换行符
  private addMeta(name: string, value: string) {
    return `${name}${this.CRLF}${value}${this.CRLF.repeat(2)}`
  }

  private getWorkURL(data: Result) {
    return `https://www.pixiv.net/${data.type === 3 ? 'n' : 'i'}/${data.idNum}`
  }

  private joinTags(tags: String[]) {
    const format = tags.map((tag) => '#' + tag)
    return format.join(this.CRLF)
  }

  // 根据作品类型判断是否需要保存它的元数据
  private checkNeedSave(type: 0 | 1 | 2 | 3): boolean {
    switch (type) {
      case 0:
        return settings.saveMetaType0
      case 1:
        return settings.saveMetaType1
      case 2:
        return settings.saveMetaType2
      case 3:
        return settings.saveMetaType3
      default:
        return false
    }
  }

  private async saveMeta(id: number) {
    // 如果所有类型的作品都不需要保存元数据
    if (
      !settings.saveMetaType0 &&
      !settings.saveMetaType1 &&
      !settings.saveMetaType2 &&
      !settings.saveMetaType3
    ) {
      return
    }

    if (this.savedIds.includes(id)) {
      return
    }

    // 查找这个作品的数据
    const dataSource =
      store.resultMeta.length > 0 ? store.resultMeta : store.result
    const data = dataSource.find((val) => val.idNum === id)
    if (data === undefined) {
      console.error(`Not find ${id} in result`)
      return
    }

    if (this.checkNeedSave(data.type) === false) {
      return
    }

    // 添加文件内容
    const fileContent: string[] = []
    fileContent.push(this.addMeta('ID', data.idNum.toString()))
    fileContent.push(this.addMeta('URL', this.getWorkURL(data)))
    if (data.type !== 3) {
      fileContent.push(this.addMeta('Original', data.original))
    }
    fileContent.push(this.addMeta('Thumbnail', data.thumb))
    fileContent.push(
      this.addMeta('xRestrict', Tools.getXRestrictText(data.xRestrict)!)
    )

    const checkAITag = data.tags.includes('AI生成')
    fileContent.push(
      this.addMeta('AI', Tools.getAITypeText(checkAITag ? 2 : data.aiType || 0))
    )
    fileContent.push(this.addMeta('User', data.user))
    fileContent.push(this.addMeta('UserID', data.userId))
    fileContent.push(this.addMeta('Title', data.title))
    fileContent.push(
      this.addMeta(
        'Description',
        Utils.htmlToText(Tools.replaceATag(data.description))
      )
    )
    fileContent.push(this.addMeta('Tags', this.joinTags(data.tags)))
    if (data.type !== 3) {
      fileContent.push(
        this.addMeta('Size', `${data.fullWidth} x ${data.fullHeight}`)
      )
    }
    fileContent.push(this.addMeta('Bookmark', data.bmk.toString()))
    fileContent.push(this.addMeta('Date', data.date))

    // 生成文件
    const blob = new Blob(fileContent, {
      type: 'text/plain',
    })

    // 生成文件名
    // 元数据文件需要和它对应的图片/小说文件的路径相同，文件名相似，这样它们才能在资源管理器里排在一起，便于查看
    // 定制：保存元数据到Meta文件夹，以作品id命名文件
    const metaFileName = 'Meta/' + data.idNum + '.txt'

    // 发送下载请求

    let dataURL: string | undefined = undefined
    if (Config.sendDataURL) {
      dataURL = await Utils.blobToDataURL(blob)
    }

    // 不检查下载状态，默认下载成功
    const sendData: SendToBackEndData = {
      msg: 'save_description_file',
      fileName: metaFileName,
      id: 'fake',
      taskBatch: -1,
      blobURL: URL.createObjectURL(blob),
      blob: Config.sendBlob ? blob : undefined,
      dataURL,
    }
    browser.runtime.sendMessage(sendData)

    this.savedIds.push(id)
  }
}

new SaveWorkMeta()
