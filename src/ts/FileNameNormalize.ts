import { settings } from './setting/Settings'
import { Utils } from './utils/Utils'

/**
 * 文件名规范化。
 *
 * 这里的方法原本在 FileName 模块里，现在挪到这个独立的模块里，这样其他模块可以不加载 FileName 就使用它们。
 *
 * ⚠️ 不要在 FileName 之外的地方为了「规范化文件名」而 import FileName：
 * FileName 会加载 SetUserName，而 SetUserName 在模块加载时就需要设置面板里的 slot
 * （setUserNameSlot），在设置面板创建之前加载它会抛出 "No such slot" 并导致内容脚本初始化失败。
 * 本模块只依赖 Settings 和 Utils，所以可以在任何时候被加载。
 */
class FileNameNormalize {
  // 不能出现在文件名开头的一些特定字符
  private readonly checkStartCharList = ['/', ' ']

  // 检查文件名开头是否含有特定字符
  private checkStartChar(str: string) {
    for (const check of this.checkStartCharList) {
      if (str.startsWith(check)) {
        return true
      }
    }
    return false
  }

  /** 移除文件名开头的特定字符 */
  public removeStartChar(str: string) {
    while (this.checkStartChar(str)) {
      for (const check of this.checkStartCharList) {
        if (str.startsWith(check)) {
          str = str.replace(check, '')
        }
      }
    }
    return str
  }

  /** 如果任意一层路径或文件名是 Windows 保留文件名，则在其后添加这个字符串 */
  private readonly addStr = '[WindowsReservedName]'

  /** 处理一些边界情况 */
  public handleEdgeCases(string: string) {
    // 处理连续的 / 有时候两个斜线中间的字段是空值，最后就变成两个斜线挨在一起了
    string = string.replace(/\/{2,100}/g, '/')

    // 对每一层路径和文件名进行处理
    const parts = string.split('/')

    for (let i = 0; i < parts.length; i++) {
      // 去掉每层路径首尾的空格
      // 把每层路径头尾的 . 替换成全角的．因为 Chrome 不允许头尾使用 .
      parts[i] = parts[i].trim().replace(/^\./g, '．').replace(/\.$/g, '．')

      // 处理路径是 Windows 保留文件名的情况（不需要处理扩展名）
      parts[i] = Utils.handleWindowsReservedName(parts[i], this.addStr)
    }

    // 经过上面的遍历处理后，数组里可能会有空字符串，需要在合并时去除
    string = parts.filter((part) => part !== '').join('/')
    return string
  }

  /** 这是提供给其他模块使用的方法。如果其他模块自行拼接了一些内容作为文件名（而不是由 FileName 从命名规则里生成的），
   * 可以调用这个方法对文件名进行一些基本的处理，以免因为文件名非法而导致文件下载失败。
   *
   * @param name 文件名，可以包含文件夹路径（路径分隔符会被保留）
   */
  public handleNormalName(name: string) {
    // 保留路径分隔符，否则 `pixiv users/xxx.jpg` 里的 / 会被替换成全角字符，导致文件夹失效
    name = Utils.replaceUnsafeStr(name, true)

    // 移除 Emoji。这可能会导致一些标记的值变成空字符串，所以需要放在前面执行，以便后续处理空字符串的情况
    if (settings.removeEmoji) {
      name = Utils.removeEmojis(name)
    }

    // 移除文件名开头的不可用的特殊字符
    name = this.removeStartChar(name)

    // 如果文件名的尾部是 / 则去掉
    if (name.endsWith('/')) {
      name = name.substring(0, name.length - 1)
    }

    // 处理连续的 /
    name = name.replace(/\/{2,100}/g, '/')

    // 处理一些边界情况
    name = this.handleEdgeCases(name)

    if (!name) {
      name = Date.now().toString()
    }

    return name
  }
}

const fileNameNormalize = new FileNameNormalize()
export { fileNameNormalize }
