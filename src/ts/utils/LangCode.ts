/**
 * 判断语言标签是否在用户填写的语言列表里。
 *
 * 下载器里有多个功能需要按语言标签匹配用户填写的列表，例如 EPUB 的竖排语言列表、
 * 只下载指定语言的小说。集中在这里实现，避免多处实现的行为出现差异。
 */

/**
 * 判断语言标签是否在指定的语言列表里。列表项如 ja、zh-tw。
 *
 * 匹配时不区分大小写，并忽略首尾空格，所以用户可以随意书写。
 */
function isLangInList(langCode: string, list: string[]): boolean {
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

export { isLangInList }
