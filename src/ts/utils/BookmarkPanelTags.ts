import type { BookmarkPanelCommonTag } from '../setting/Settings'

// 收藏操作面板里，标签相关的纯逻辑。
// 把它们单独放在这里，是为了能脱离 DOM 进行测试。

/**把输入框里的文本解析为标签列表
 *
 * - 使用英语逗号 `,` 分隔每一项
 * - 每一项会移除开头的一个 `#`（只移除第一个）
 * - 移除 `#` 之后为空的项会被丢弃；两侧的空白字符会被去掉
 */
export function parseTagInput(input: string): string[] {
  if (!input) {
    return []
  }

  const result: string[] = []
  for (const str of input.split(',')) {
    // 先去掉两侧的空白，再移除开头的一个 #
    const tag = str.trim().replace(/^#/, '')
    if (tag) {
      result.push(tag)
    }
  }
  return result
}

/**把本次使用的标签记录到“常用的标签”列表里，返回新的列表
 *
 * 已存在的标签使其次数 + 1；之前没有的标签，count 的默认值是 1。列表没有长度限制。
 *
 * ⚠️ 返回的是一个新的数组，不会修改传入的列表（设置里的值应该整体替换，而不是就地修改）
 */
export function recordCommonTags(
  list: BookmarkPanelCommonTag[],
  tags: string[]
): BookmarkPanelCommonTag[] {
  const result = list.map((item) => ({ tag: item.tag, count: item.count }))

  for (const tag of tags) {
    const find = result.find((item) => item.tag === tag)
    if (find) {
      find.count++
    } else {
      result.push({ tag, count: 1 })
    }
  }

  return result
}

/**按使用次数降序排序，返回排在前面的标签（最多 max 个） */
export function sortCommonTags(
  list: BookmarkPanelCommonTag[],
  max: number
): string[] {
  return list
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, max)
    .map((item) => item.tag)
}
