import { API } from '../API'
import { GlossaryItem, NovelSeriesGlossaryItem } from '../crawl/CrawlResult'
import { lang } from '../Language'
import { log } from '../Log'
import { Tools } from '../Tools'
import { Utils } from '../utils/Utils'

interface GlossaryResult {
  id: string
  seriesId: string
  name: string
  /** 所有设定资料的元数据 */
  items: GlossaryItem[]
  /** 这个系列小说里所有可置换的单词的 id 的列表。其 id 存在于 items 里 */
  replaceeItemIds: string[]
}

/**获取系列小说的设定资料 */
class GetNovelGlossarys {
  public async getGlossarys(
    seriesId: string | number,
    interval = 0
  ): Promise<{
    result: GlossaryResult[]
    replaceeItemIds: string[]
  }> {
    // 先获取设定资料的分类、每条设定资料的简略数据
    // 注意：此时每条设定资料缺少 detail 数据（此时为 null），之后会在下面获取并进行填充
    await Utils.sleep(interval)
    const glossaryData = await API.getNovelSeriesGlossary(seriesId)
    const result = glossaryData.body.categories as unknown as GlossaryResult[]
    const replaceeItemIds = glossaryData.body.replaceeItemIds || []

    if (result.length === 0) {
      return { result, replaceeItemIds }
    }

    // 获取每条设定资料的详细数据
    // 测试用例：这个系列小说有 40 条设定资料
    // https://www.pixiv.net/novel/series/1446094/glossary
    // 这个系列的设定资料里有详情和图片：
    // https://www.pixiv.net/novel/series/9114820/glossary
    let total = 0
    for (const categorie of result) {
      for (const item of categorie.items) {
        await Utils.sleep(interval)
        const data = await API.getNovelSeriesGlossaryItem(
          item.seriesId,
          item.id
        )
        item.detail = data.body.item.detail

        total++
        log.log(
          lang.transl('_获取设定资料') + ' ' + total,
          'getNovelGlossary' + seriesId
        )
      }
    }

    return { result, replaceeItemIds }
  }

  /**把设定资料用特定格式存储起来 */
  public storeGlossaryText(data: GlossaryResult[]) {
    const array: string[] = []
    for (const categorie of data) {
      array.push(categorie.name)
      array.push('\n\n')

      for (const item of categorie.items) {
        array.push(item.name)
        array.push('\n')
        array.push(item.overview)
        array.push('\n\n')
        if (item.coverImage) {
          // 如果有图片，就插入特定标记
          array.push(
            Tools.createGlossaryImageFlag(item.coverImage.novelImageId)
          )
          array.push('\n\n')
        }
        if (item.detail) {
          array.push(item.detail)
          array.push('\n\n')
        }
        array.push('----------------------------------------')
        array.push('\n\n')
      }
    }
    if (array.length > 0) {
      return array.join('')
    }
    return ''
  }
}

const getNovelGlossarys = new GetNovelGlossarys()
export { getNovelGlossarys }
