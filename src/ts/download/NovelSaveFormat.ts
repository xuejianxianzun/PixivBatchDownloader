import { settings } from '../setting/Settings'

/** 小说保存格式 */
type NovelSaveFormatType = 'epub' | 'txt'

/**
 * 计算用户选择的小说保存格式（派生设置项）。
 *
 * ⚠️ 不要绕过本模块直接读取 novelSaveAsEPUB / novelSaveAsTXT：
 * 用户可能取消勾选全部格式，此时本模块会兜底为 epub。
 */
class NovelSaveFormat {
  /** 返回要使用的格式列表，至少有一项。
   *
   * ⚠️ 顺序有意义：epub 必须排在最前面，它会被当作默认格式（见 getDefaultFormat）。
   * 抓取结果的 ext、文件名生成的扩展名、下载记录的扩展名都使用默认格式 */
  public getFormats(): NovelSaveFormatType[] {
    const formats: NovelSaveFormatType[] = []
    if (settings.novelSaveAsEPUB) {
      formats.push('epub')
    }
    if (settings.novelSaveAsTXT) {
      formats.push('txt')
    }
    // 用户可能取消勾选全部格式；兜底为 epub，保证至少保存一种格式
    return formats.length > 0 ? formats : ['epub']
  }

  /** 返回默认格式（= 格式列表的第一项，epub 优先）。
   * 用于：抓取结果的 ext、文件名生成的扩展名基准、下载记录的扩展名 */
  public getDefaultFormat(): NovelSaveFormatType {
    return this.getFormats()[0]
  }
}

const novelSaveFormat = new NovelSaveFormat()
export { novelSaveFormat }
