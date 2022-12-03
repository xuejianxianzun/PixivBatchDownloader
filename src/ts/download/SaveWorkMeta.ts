import { EVT } from '../EVT'
import { store } from '../store/Store'
import { DonwloadSuccessData } from './DownloadType'
import { fileName } from '../FileName'
import { Result } from '../store/StoreType'
import { settings } from '../setting/Settings'

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

  // 替换换行标签，移除 html 标签
  private handleHTML(str: string) {
    return str.replace(/<br \/>/g, this.CRLF).replace(/<\/?.+?>/g, '')
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

  private saveMeta(id: number) {
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
    fileContent.push(this.addMeta('Id', data.idNum.toString()))
    fileContent.push(this.addMeta('Title', data.title))
    fileContent.push(this.addMeta('User', data.user))
    fileContent.push(this.addMeta('UserId', data.userId))
    fileContent.push(this.addMeta('URL', this.getWorkURL(data)))
    fileContent.push(this.addMeta('Tags', this.joinTags(data.tags)))
    fileContent.push(this.addMeta('Date', data.date))
    // description 的标题下面多添加一行空格，便于和 description 内容进行区分
    fileContent.push(
      this.addMeta('Description\n', this.handleHTML(data.description))
    )

    // 生成文件
    const blob = new Blob(fileContent, {
      type: 'text/plain',
    })

    // 生成文件名
    // 元数据文件需要和它对应的图片/小说文件的路径相同，文件名相似，这样它们才能在资源管理器里排在一起，便于查看

    // 生成这个数据的路径和文件名
    const _fileName = fileName.createFileName(data)
    // 取出后缀名之前的部分
    const index = _fileName.lastIndexOf('.')
    let part1 = _fileName.substring(0, index)

    if (!settings.zeroPadding) {
      // 把 id 字符串换成数字 id，这是为了去除 id 后面可能存在的序号，如 p0
      // 但如果用户启用了在序号前面填充 0，则不替换 id，因为文件名里的 id 后面可能带多个 0，如 p000，用 idNum 去替换的话替换不了后面两个 0
      part1 = part1.replace(data.id, data.idNum.toString())
    }
    // 拼接出元数据文件的文件名
    const metaFileName = `${part1}-meta.txt`

    // 发送下载请求
    // 因为我偷懒，所以后台不会返回下载状态，默认为下载成功
    chrome.runtime.sendMessage({
      msg: 'save_description_file',
      fileUrl: URL.createObjectURL(blob),
      fileName: metaFileName,
    })

    this.savedIds.push(id)
  }
}

new SaveWorkMeta()
