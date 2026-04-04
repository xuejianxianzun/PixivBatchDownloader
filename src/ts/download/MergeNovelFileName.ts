import { NovelSeriesData } from '../crawl/CrawlResult'
import { settings } from '../setting/Settings'
import { Tools } from '../Tools'
import { DateFormat } from '../utils/DateFormat'
import { fileName } from '../FileName'

class MergeNovelFileName {
  /**参数 part 只有在这个系列小说分割成多个文件时才需要传递。如果值为 0 不会生效，大于 0 才会生效 */
  public getName(seriesData: NovelSeriesData, part = 0): string {
    let rule = settings.seriesNovelNameRule
    // 所有标记：
    // {series_title}-{series_id}-{user}-{user_id}-{part}-{age}-{age_r}-{AI}-{lang}-{total}-{char_count}-{create_date}-{last_date}-{task_date}-{first_id}-{latest_id}-{tags}-{page_tag}-{page_title}.{ext}

    const body = seriesData.body
    // 生成所有命名标记的值
    const cfg = {
      '{series_title}': {
        value: body.title,
        safe: false,
      },
      '{series_id}': {
        value: body.id,
        safe: true,
      },
      '{user}': {
        value: fileName.RemoveAtFromUsername(body.userName),
        safe: false,
      },
      '{user_id}': {
        value: body.userId,
        safe: true,
      },
      '{part}': {
        // 如果 part 大于 0 就使用 part，否则使用空字符串
        value: part > 0 ? fileName.zeroPadding(part) : '',
        safe: true,
      },
      '{ext}': {
        value: settings.novelSaveAs,
        safe: true,
      },
      '{age}': {
        value: Tools.getAgeLimit(body.xRestrict),
        safe: true,
      },
      '{age_r}': {
        value: Tools.getAgeLimit(body.xRestrict, false),
        safe: true,
      },
      '{AI}': {
        value:
          body.aiType === 2 || Tools.checkAIFromTags(body.tags) ? 'AI' : '',
        safe: true,
      },
      '{lang}': {
        value: body.language,
        safe: true,
      },
      '{total}': {
        value: body.displaySeriesContentCount,
        safe: true,
      },
      '{char_count}': {
        value: body.publishedTotalCharacterCount,
        safe: true,
      },
      '{create_date}': {
        value: rule.includes('{create_date}')
          ? DateFormat.format(body.createDate, settings.dateFormat)
          : '',
        safe: false,
      },
      '{last_date}': {
        value: rule.includes('{last_date}')
          ? DateFormat.format(
              body.lastPublishedContentTimestamp * 1000,
              settings.dateFormat
            )
          : '',
        safe: false,
      },
      '{task_date}': {
        value: rule.includes('{task_date}')
          ? DateFormat.format(new Date(), settings.dateFormat)
          : '',
        safe: false,
      },
      '{first_id}': {
        value: body.firstNovelId,
        safe: true,
      },
      '{latest_id}': {
        value: body.latestNovelId,
        safe: true,
      },
      '{tags}': {
        value: body.tags.join(settings.tagsSeparator),
        safe: false,
      },
      '{page_tag}': {
        value: rule.includes('{page_tag}') ? Tools.getTagFromURL() : '',
        safe: false,
      },
      '{page_title}': {
        value: rule.includes('{page_title}') ? Tools.getPageTitle() : '',
        safe: false,
      },
    }

    // 有些标记可能是空字符串，移除它们
    const mayEmptyList: (keyof typeof cfg)[] = [
      '{part}',
      '{page_tag}',
      '{AI}',
      '{age_r}',
      '{tags}',
    ]
    mayEmptyList.forEach((tag) => {
      if (cfg[tag].value === '') {
        rule = fileName.removeEmptyTag(rule, tag)
      }
    })

    // 如果 {part} 不为空，但命名规则里没有 {part}，则在末尾添加 '-{part}'
    if (cfg['{part}'].value && !rule.includes('{part}')) {
      const name = rule.split('.{ext}')[0]
      rule = name + '-{part}.{ext}'
    }

    // 生成文件名
    let name = fileName.generateFileName(rule, cfg)

    // 处理一些边界情况
    name = fileName.handleEdgeCases(name)

    // 处理文件名长度限制
    const extResult = '.' + cfg['{ext}'].value
    // 截断文件名的时候移除后缀名部分，然后再添加回来，以避免发生截断后缀名的情况
    let part1 = name.split(extResult)[0]
    part1 = fileName.lengthLimit(part1, extResult, cfg['{series_id}'].value)
    name = part1 + extResult

    // 返回结果
    return name
  }
}

const mergeNovelFileName = new MergeNovelFileName()
export { mergeNovelFileName }
