import { EVT } from '../EVT'
import { store } from '../store/Store'
import { DonwloadSuccessData, SendToBackEndData } from './DownloadType'
import { fileName } from '../FileName'
import { Result } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { Tools } from '../Tools'
import { SendDownload } from './SendDownload'
import { fileNameNormalize } from '../FileNameNormalize'

// 为每个作品创建一个单独的文件，保存这个作品的元数据
class SaveWorkMeta {
  constructor() {
    this.bindEvents()
  }

  // 已经保存了元数据的作品的 id
  // 一个作品里可能有多张图片，所以可能触发多次下载完成事件。这里保存作品 id 来避免重复保存元数据文件
  private savedIds: number[] = []

  private readonly CRLF = '\n' // txt 文件中使用的换行符

  private bindEvents() {
    // 当有作品文件下载成功时，保存其元数据
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.saveMeta(Number.parseInt(successData.id))
    })

    // 当开始新的抓取，以及下载完毕时，清空保存的 id 列表
    const resetIdsEvt = [EVT.list.crawlStart, EVT.list.downloadComplete]
    resetIdsEvt.forEach((evt) => {
      window.addEventListener(evt, () => {
        this.savedIds = []
      })
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

    if (!settings.saveMetaFormatTXT && !settings.saveMetaFormatJSON) {
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
    this.savedIds.push(id)

    // 生成这个数据的路径和文件名
    // 元数据文件默认需要和它对应的图片/小说文件的路径相同，文件名相似，这样它们才能在资源管理器里排在一起，便于查看
    // 如果用户设置了保存到特定文件夹，则元数据文件会保存到指定的文件夹里，文件名不变
    const _fileName = fileName.createFileName(data)
    // 取出后缀名之前的部分
    const index = _fileName.lastIndexOf('.')
    let part1 = _fileName.substring(0, index)

    if (!settings.zeroPadding) {
      // 把 id 字符串换成数字 id，这是为了去除 id 后面可能存在的序号，如 p0
      // 但如果用户启用了在序号前面填充 0，则不替换 id，因为文件名里的 id 后面可能带多个 0，如 p000，用 idNum 去替换的话替换不了后面两个 0
      part1 = part1.replace(data.id, data.idNum.toString())
    }

    // 把路径拆分成文件夹和文件名两部分
    const nameIndex = part1.lastIndexOf('/') + 1
    const folder = this.getFolder(part1.substring(0, nameIndex))
    const name = part1.substring(nameIndex)
    // 拼接出元数据文件的文件名，不包含后缀名
    const metaFileName = folder + name + '-meta'

    this.saveTXT(data, metaFileName)
    this.saveJSON(data, metaFileName)
  }

  /** 获取元数据文件应该保存到的文件夹，结尾带斜线（调用方直接把它和文件名拼接）。
   *
   * @param workFolder 作品文件所在的文件夹，结尾带有斜线（作品文件在下载目录的根目录里时是空字符串） */
  private getFolder(workFolder: string) {
    if (settings.saveMetaFolderType !== 'folder') {
      return workFolder
    }

    // 用户输入的路径里如果没有任何有效字符（例如只输入了斜线），就当作没有设置文件夹，
    // 此时元数据文件依然和作品文件放在同一个文件夹里
    if (!/[^\/\s]/.test(settings.saveMetaFolder)) {
      return workFolder
    }

    // 用户输入的路径可能包含非法字符，需要处理，否则会导致下载失败
    return fileNameNormalize.handleNormalName(settings.saveMetaFolder) + '/'
  }

  private async saveTXT(data: Result, metaFileName: string) {
    if (!settings.saveMetaFormatTXT) {
      return
    }

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
      this.addMeta(
        'AI',
        Tools.getAITypeTextEnglish(checkAITag ? 2 : data.aiType || 0)
      )
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

    // 保存文件
    const blob = new Blob(fileContent, {
      type: 'text/plain',
    })
    SendDownload.noReply(
      blob,
      metaFileName + '.txt',
      Tools.chooseDownloadMethod(!settings.rememberTheLastSaveLocation)
    )
  }

  private async saveJSON(data: Result, metaFileName: string) {
    if (!settings.saveMetaFormatJSON) {
      return
    }

    // 保存文件
    const blob = Utils.json2Blob(data)
    SendDownload.noReply(
      blob,
      metaFileName + '.json',
      Tools.chooseDownloadMethod(!settings.rememberTheLastSaveLocation)
    )
  }
}

new SaveWorkMeta()
