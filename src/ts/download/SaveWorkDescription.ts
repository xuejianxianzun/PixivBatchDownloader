import { EVT } from '../EVT'
import { store } from '../store/Store'
import { DonwloadSuccessData } from './DownloadType'
import { fileName } from '../FileName'
import { Result } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { log } from '../Log'
import { toast } from '../Toast'

// 为每个作品创建一个 txt 文件，保存这个作品的元数据
class SaveWorkDescription {
  constructor() {
    this.bindEvents()
  }

  private savedIds: number[] = []
  private hasLinkRegexp = /http[s]:\/\//

  private bindEvents() {
    // 当有作品文件下载成功时，保存其元数据
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.saveOne(Number.parseInt(successData.id))
    })

    // 当开始新的抓取时，清空保存的 id 列表
    window.addEventListener(EVT.list.crawlStart, () => {
      this.savedIds = []
    })

    window.addEventListener(EVT.list.crawlComplete, () => {
      window.setTimeout(() => {
        this.summary()
      }, 50)
    })
  }

  private saveOne(id: number) {
    if (!settings.saveWorkDescription || !settings.saveEachDescription) {
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

    if (data.description === '') {
      return
    }

    // 生成文件
    const desc = Utils.htmlToText(Tools.replaceATag(data.description))
    const blob = new Blob([desc], {
      type: 'text/plain',
    })

    // 如果简介里含有外链，则在文件名最后添加 links 标记
    const hasLink = this.hasLinkRegexp.test(desc)
    const namePart1 = this.createFileName(data)
    const fileName = `${namePart1}-description${hasLink ? '-links' : ''}.txt`

    // 不检查下载状态，默认下载成功
    chrome.runtime.sendMessage({
      msg: 'save_description_file',
      fileUrl: URL.createObjectURL(blob),
      fileName: fileName,
    })

    this.savedIds.push(id)
  }

  /**返回该作品的文件名（不含后缀名），并且把 id 字符串替换为数字 id */
  private createFileName(data: Result) {
    // 生成文件名
    // 元数据文件需要和它对应的图片/小说文件的路径相同，文件名相似，这样它们才能在资源管理器里排在一起，便于查看

    // 生成这个数据的路径和文件名
    const _fileName = fileName.createFileName(data)
    // 取出后缀名之前的部分
    const index = _fileName.lastIndexOf('.')
    let part1 = _fileName.substring(0, index)

    // 把 id 字符串换成数字 id，这是为了去除 id 后面可能存在的序号，如 p0
    if (!settings.zeroPadding) {
      // 但如果用户启用了在序号前面填充 0，则不替换 id，因为文件名里的 id 后面可能带多个 0，如 p000，用 idNum 去替换的话替换不了后面两个 0
      part1 = part1.replace(data.id, data.idNum.toString())
    }

    return part1
  }

  // 抓取完毕后，把所有简介汇总到一个文件里
  private summary() {
    if (!settings.saveWorkDescription || !settings.summarizeDescription) {
      return
    }

    if (store.resultMeta.length === 0) {
      return
    }

    // 生成文件内容
    const noLinkContent: string[] = []
    const hasLinkContent: string[] = []

    // 从 resultMeta 生成数据而非 result
    // 因为 resultMeta 里每个作品只有一条数据，而 result 里可能有多条。使用 resultMeta 不需要去重
    for (const result of store.resultMeta) {
      if (result.description === '') {
        continue
      }

      // 每条结果生成两条文本：
      // 1. 文件名
      // 2. 简介
      const namePart1 = this.createFileName(result)
      const desc = Utils.htmlToText(Tools.replaceATag(result.description))

      const hasLink = this.hasLinkRegexp.test(desc)
      if (hasLink) {
        hasLinkContent.push('links-' + namePart1)
        hasLinkContent.push('\n\n')
        hasLinkContent.push(desc)
        hasLinkContent.push('\n\n')
        hasLinkContent.push('----------')
        hasLinkContent.push('\n\n')
      } else {
        noLinkContent.push(namePart1)
        hasLinkContent.push('\n\n')
        noLinkContent.push(desc)
        noLinkContent.push('\n\n')
        noLinkContent.push('----------')
        noLinkContent.push('\n\n')
      }
    }

    // 生成文件
    // 不带外链的简介放在文件前面，带有外链的简介放在后面
    // 因为这个功能是有人赞助让我添加的，所以要按照他要求的格式做
    const blob = new Blob(noLinkContent.concat(hasLinkContent), {
      type: 'text/plain',
    })

    // 设置 TXT 的文件名
    let txtName = 'description summary.txt'
    const title = Utils.replaceUnsafeStr(Tools.getPageTitle())
    const time = Utils.replaceUnsafeStr(
      store.crawlCompleteTime.toLocaleString()
    )
    // 在文件名里添加时间戳可以避免同名文件覆盖

    // 检查这些作品是否属于同一个画师
    const firstUser = store.resultMeta[0].userId
    const notAllSame = store.resultMeta.some(
      (result) => result.userId !== firstUser
    )
    // 如果不是同一个画师，则将汇总文件直接保存到下载目录里
    if (notAllSame) {
      txtName = `description summary-${title}-${time}.txt`
    } else {
      // 如果是同一个画师，则保存到命名规则创建的第一层目录里，并在文件名里添加画师名字
      const _fileName = fileName.createFileName(store.resultMeta[0])
      const firstPath = _fileName.split('/')[0]
      txtName = `${firstPath}/description summary-user ${store.resultMeta[0].user}-${title}-${time}.txt`
    }

    // 不检查下载状态，默认下载成功
    chrome.runtime.sendMessage({
      msg: 'save_description_file',
      fileUrl: URL.createObjectURL(blob),
      fileName: txtName,
    })

    const msg = `✓ ${lang.transl('_保存作品的简介')}: ${lang.transl(
      '_汇总到一个文件'
    )}`
    log.success(msg)
    toast.success(msg)
  }
}

new SaveWorkDescription()
