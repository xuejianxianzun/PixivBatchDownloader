import { lang } from '../Language'
import { settings } from '../setting/Settings'

/** EPUB 文件里实际使用的排版方向 */
// 文档：notes/EPUB 电子书多语言排版指南.md
// 哪些语言习惯使用竖排，见这个指南。下载器不写死语言，而是让用户填写语言列表
// （epubVerticalLangList），默认值参考了该指南
type EPUBWritingMode = 'horizontal' | 'vertical'

/**
 * 根据设置计算 EPUB 文件实际使用的语言标签与排版方向。
 *
 * ⚠️ 排版方向**不能**直接读取 `settings.epubWritingMode`，因为
 * `verticalForLangList`（只对 epubVerticalLangList 里的语言使用竖排）必须
 * 先算出实际使用的语言标签才能判断。所有需要排版方向的地方都走这里。
 */
class EPUBSetting {
  /** 计算 EPUB 实际使用的语言标签。当获取不到来源对应的语言时，回退到下载器的界面语言 */
  static getLangCode(novelLang?: string): string {
    if (settings.epubLangSource === 'custom') {
      return settings.epubCustomLang || lang.type
    }
    if (settings.epubLangSource === 'novelLang') {
      return novelLang || lang.type
    }
    return lang.type
  }

  /** 计算 EPUB 实际使用的排版方向。必须先算出语言标签，再用它判断 */
  static getWritingMode(langCode: string): EPUBWritingMode {
    if (settings.epubWritingMode === 'vertical') {
      return 'vertical'
    }
    if (settings.epubWritingMode === 'verticalForLangList') {
      return EPUBSetting.isLangInList(langCode, settings.epubVerticalLangList)
        ? 'vertical'
        : 'horizontal'
    }
    return 'horizontal'
  }

  /** 一次性算出语言标签和排版方向 */
  static resolve(novelLang?: string): {
    langCode: string
    writingMode: EPUBWritingMode
  } {
    const langCode = EPUBSetting.getLangCode(novelLang)
    return {
      langCode,
      writingMode: EPUBSetting.getWritingMode(langCode),
    }
  }

  /** 判断语言标签是否在用户指定的语言列表里。列表项如 ja、zh-tw */
  private static isLangInList(langCode: string, list: string[]): boolean {
    const code = (langCode || '').toLowerCase().trim()
    if (!code) {
      return false
    }
    return (list || []).some((item) => {
      const target = (item || '').toLowerCase().trim()
      if (!target) {
        return false
      }
      // 完全匹配（ja === ja），或者列表项只写了主标签（zh 匹配 zh-tw 的 zh 部分）
      return code === target || code.startsWith(target + '-')
    })
  }
}

export { EPUBSetting }
