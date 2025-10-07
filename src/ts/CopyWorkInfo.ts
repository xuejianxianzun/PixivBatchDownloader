import { API } from './API'
import { Config } from './Config'
import { ArtworkData, NovelData } from './crawl/CrawlResult'
import { fileName } from './FileName'
import { lang } from './Language'
import { pageType } from './PageType'
import { settings } from './setting/Settings'
import { saveArtworkData } from './store/SaveArtworkData'
import { saveNovelData } from './store/SaveNovelData'
import { IDData } from './store/StoreType'
import { toast } from './Toast'
import { Tools } from './Tools'
import { DateFormat } from './utils/DateFormat'

class CopyWorkInfo {
  public async receive(idData: IDData) {
    const id = idData.id
    const unlisted = pageType.type === pageType.list.Unlisted
    try {
      // 这里不使用 cacheWorkData中的缓存数据，因为某些数据（如作品的收藏状态）可能已经发生变化
      if (idData.type === 'novels') {
        const data = await API.getNovelData(id, unlisted)
        await saveNovelData.save(data)
        this.copy(data)
      } else {
        const data = await API.getArtworkData(id, unlisted)
        await saveArtworkData.save(data)
        this.copy(data)
      }
    } catch (error: Error | any) {
      if (error.status) {
        toast.error(`Error: ${error.status}`)
      } else {
        toast.error(`Failed to request work data`)
      }
    }
  }

  private copy(data: ArtworkData | NovelData) {
    const str = this.convert(data)
    navigator.clipboard.writeText(str)
    toast.success(lang.transl('_已复制'))
  }

  /** 把用户设置的规则转换成结果 */
  // 需要处理命名标记，这类似于生成文件名，但有所不同，因为此时：
  // - 不需要处理不能作为文件名的特殊字符
  // - 不需要建立文件夹，所以不需要处理非法的文件夹路径
  // - 忽略某些命名设置，例如第一张图不带序号、移除用户名中的 @ 符号、创建文件夹相关的设置等
  // - 额外添加了 {lf} 和 {url} 标记
  // - 在每个标签前面加上 # 符号
  // - {id} 等同于 {id_num}，是纯数字
  // - {p_num} 总是 0
  private convert(data: ArtworkData | NovelData) {
    const body = data.body
    const title = Tools.getPageTitle()
    const page_tag = Tools.getTagFromURL()
    const type = 'illustType' in body ? body.illustType : 3
    const tags = Tools.extractTags(data).map((str) => '#' + str)
    const tagsWithTransl = Tools.extractTags(data, 'both').map(
      (str) => '#' + str
    )
    const tagsTranslOnly = Tools.extractTags(data, 'transl').map(
      (str) => '#' + str
    )
    const cfg = {
      '{lf}': '\n',
      '{url}': `https://www.pixiv.net/${type === 3 ? 'n' : 'artworks'}/${body.id}`,
      '{p_title}': title,
      '{page_title}': title,
      '{p_tag}': page_tag,
      '{page_tag}': page_tag,
      '{id}': body.id,
      '{id_num}': body.id,
      '{p_num}': 0,
      '{rank}': 'rank' in data.body ? `#${data.body.rank}` : '',
      '{title}': body.title,
      '{user}': body.userName,
      '{userid}': body.userId,
      '{user_id}': body.userId,
      '{px}': this.getPX(body),
      '{tags}': tags.join(settings.tagsSeparator),
      '{tags_translate}': tagsWithTransl.join(settings.tagsSeparator),
      '{tags_transl_only}': tagsTranslOnly.join(settings.tagsSeparator),
      '{bmk}': body.bookmarkCount,
      '{bmk_id}': body.bookmarkData ? body.bookmarkData.id : '',
      '{bmk_1000}': fileName.getBKM1000(body.bookmarkCount),
      '{like}': body.likeCount,
      '{view}': body.viewCount,
      '{date}': DateFormat.format(body.createDate, settings.dateFormat),
      '{upload_date}': DateFormat.format(body.uploadDate, settings.dateFormat),
      '{task_date}': DateFormat.format(new Date(), settings.dateFormat),
      '{type}': Config.worksTypeName[type],
      '{AI}': body.aiType === 2 || tags.includes('AI生成') ? 'AI' : '',
      '{series_title}': (body as any).seriesTitle || '',
      '{series_order}': (body as any).seriesOrder
        ? '#' + (body as any).seriesOrder
        : '',
      '{series_id}': (body as any).seriesId || '',
      '{sl}': (body as any).sl ?? 0,
    }

    let str = settings.copyWorkInfoFormat
    Object.entries(cfg).forEach(([key, val]) => {
      console.log(`${key}\t${val}`)
      str = str.replace(new RegExp(key, 'g'), val)
    })
    return str
  }

  private getPX(body: ArtworkData['body'] | NovelData['body']) {
    if ('width' in body && 'height' in body) {
      return body.width + 'x' + body.height
    }
    return ''
  }
}

const copyWorkInfo = new CopyWorkInfo()
export { copyWorkInfo }
