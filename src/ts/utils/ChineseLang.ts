/**
 * 判断中文语言标签使用的汉字字形（简体 / 繁体）。
 *
 * 简繁转换和 EPUB 语言标签的修正都需要区分简体与繁体：
 * 原文已经是目标用字时，既不进行转换，也不修改语言标签。
 */

/**
 * 语言标签对应的汉字字形。
 * unknown 表示无法判断：语言标签为空，或者是 zh 这样没有次标签的标签。
 */
type ChineseScript = 'notChinese' | 'simplified' | 'traditional' | 'unknown'

/** 使用繁体汉字的地区次标签 */
const traditionalSubtags = ['tw', 'hk', 'mo']

/** 使用简体汉字的地区次标签 */
const simplifiedSubtags = ['cn', 'sg', 'my']

class ChineseLang {
  /**
   * 判断语言标签使用的汉字字形。
   *
   * - 非中文（`ja`、`ko`、`en` 等）返回 `notChinese`
   * - 是中文但无法判断字形（如 `zh`），以及语言标签为空，返回 `unknown`
   */
  static getScript(langCode?: string): ChineseScript {
    const code = (langCode || '').toLowerCase().trim()
    if (!code) {
      return 'unknown'
    }
    // 主标签必须是 zh。注意不能用 startsWith('zh')，否则 zho 之类会被误判
    if (code !== 'zh' && !code.startsWith('zh-')) {
      return 'notChinese'
    }

    const subtags = code.split('-').slice(1)
    // 先检查字形次标签（hans / hant），它比地区次标签更准确，
    // 因为标签可能是 zh-Hant-CN 这样字形与地区不一致的组合
    for (const subtag of subtags) {
      if (subtag.startsWith('hant')) {
        return 'traditional'
      }
      if (subtag.startsWith('hans')) {
        return 'simplified'
      }
    }
    for (const subtag of subtags) {
      if (traditionalSubtags.includes(subtag)) {
        return 'traditional'
      }
      if (simplifiedSubtags.includes(subtag)) {
        return 'simplified'
      }
    }

    return 'unknown'
  }
}

export { ChineseLang }
export type { ChineseScript }
