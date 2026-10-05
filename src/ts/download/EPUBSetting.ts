import { lang } from '../Language'
import { settings } from '../setting/Settings'
import { ChineseLang } from '../utils/ChineseLang'

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
    // 先按设置取出语言标签，再根据简繁转换设置修正它，最后才用它决定排版方向。
    // 这样排版方向与实际写入 EPUB 的语言始终是一致的
    const langCode = EPUBSetting.applyNovelTextConvert(
      EPUBSetting.getLangCode(novelLang)
    )
    return {
      langCode,
      writingMode: EPUBSetting.getWritingMode(langCode),
    }
  }

  /**
   * 根据简繁转换设置修正语言标签。
   *
   * 转换会改变写入 EPUB 的文字用字，所以语言标签也要跟着变：
   * 例如小说原本是简体中文，开启了「简体转繁体」，那么写入 EPUB 的语言标签应该是 zh-tw。
   *
   * 只影响能判断出字形的中文：其他语言标签、以及无法判断字形的标签（如 zh、空值）
   * 都原样返回，因为这些情况下正文不会转换（见 ConvertNovelText.needConvert）。
   * 原本就已经是目标用字的标签也保持不变。
   */
  static applyNovelTextConvert(langCode: string): string {
    const mode = settings.convertNovelText
    if (mode === 'none') {
      return langCode
    }

    // 这里判断字形的方式必须与 ConvertNovelText.needConvert() 一致，
    // 否则会出现「正文没转换、但语言标签变了」的情况。
    // 未知字形（如 zh）时正文不会转换，所以语言标签也要保持原样
    const script = ChineseLang.getScript(langCode)
    if (script === 'notChinese' || script === 'unknown') {
      return langCode
    }

    if (mode === 'cn2tw') {
      // 原本就是繁体时保持不变
      return script === 'traditional' ? langCode : 'zh-tw'
    }

    // tw2cn：原本就是简体时保持不变
    return script === 'simplified' ? langCode : 'zh-cn'
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
