type settingKey = string
type oldValue = string
type newValue = string

type StringSettingsMap = Record<settingKey, Record<oldValue, newValue>>

/** 已经废弃的设置名，以及它的值应当迁移到哪个新的设置名 */
type RenamedSettingsMap = Record<settingKey, settingKey>

/** 旧版本里与「标签不能含有」相关的数据。
 *
 * 其中 notNeedTag 和 tagMatchMode 在新版本里已经不存在，
 * notNeedTagWhole 和 notNeedTagPartial 是新版本新增的，
 * 所以单独声明一份类型，用于迁移旧的设置数据。 */
interface OldExcludeTagData {
  notNeedTag?: string[] | string
  tagMatchMode?: 'whole' | 'partial'
  notNeedTagWhole?: string[] | string
  notNeedTagPartial?: string[] | string
}

// 为了兼容以前的版本的设置，把旧的设置值转换为新版本的设置值
class ConvertOldSettings {
  // 旧设置和新设置的对应关系
  private readonly stringSettingsMap: StringSettingsMap = {
    ratio: {
      '0': 'square',
      '1': 'horizontal',
      '2': 'vertical',
      '3': 'userSet',
    },
    widthTag: {
      '1': 'yes',
      '-1': 'no',
    },
    restrict: {
      '1': 'yes',
      '-1': 'no',
    },
    userSetLang: {
      '-1': 'auto',
      '0': 'zh-cn',
      '1': 'ja',
      '2': 'en',
      '3': 'zh-tw',
      '4': 'ko',
    },
  }

  /** 已经废弃的设置名，以及它的值要迁移到哪个新的设置名。
   *
   * ⚠️ 这里只能根据设置名进行迁移，所以「标签不能含有」一律迁移到全字匹配
   * （旧版本默认就是全字匹配）。如果旧数据里有 tagMatchMode，应当优先用
   * convertExcludeTag 迁移，它会按照 tagMatchMode 分配到正确的输入框。这个映射只是兜底。 */
  private readonly renamedKeys: RenamedSettingsMap = {
    notNeedTag: 'notNeedTagWhole',
  }

  /** 传入设置名，如果它是已经废弃的旧设置名，返回它对应的新设置名；否则返回原设置名。
   *
   * 这样旧版本的设置（来自本地存储或导入的配置文件）里的值会被写入新的设置项，而不是被丢弃。 */
  public convertKey(key: settingKey): settingKey {
    return this.renamedKeys[key] ?? key
  }

  /** 迁移旧版本里「标签不能含有」的设置数据。会直接修改传入的数据。
   *
   * 旧版本只有一个输入框 notNeedTag，用单选的 tagMatchMode 决定匹配模式。
   * 新版本里全字匹配和部分匹配各有一个输入框，所以这里按照 tagMatchMode 的值，
   * 把 notNeedTag 分配给对应的新输入框 —— 这样旧用户升级之后行为不会发生变化。 */
  public convertExcludeTag(data: OldExcludeTagData): void {
    if (data.notNeedTag === undefined) {
      return
    }

    // tagMatchMode 的默认值是 'whole'，所以除 partial 之外都归到全字匹配
    const target =
      data.tagMatchMode === 'partial' ? 'notNeedTagPartial' : 'notNeedTagWhole'

    // 如果新的设置项已经有值（来自更新的版本），就不要覆盖它
    if (data[target] === undefined) {
      data[target] = data.notNeedTag
    }

    // 这两个字段在新版本里已经不存在了，删除它们，以免被当成未知设置而忽略
    delete data.notNeedTag
    delete data.tagMatchMode
  }

  /** 传入设置名和旧的设置值，返回新的设置值 */
  public convertString(key: settingKey, value: oldValue): string {
    const map = this.stringSettingsMap[key]
    // 如果这是一个可以转换的设置
    if (map) {
      // 如果传递的值是旧的设置值，则能够获取到新的设置值
      // 如果传递的值已经是新的设置值，则获取到的是 undefined ，此时不需要转换
      const newValue = map[value]
      if (newValue !== undefined) {
        return newValue
      }
    }

    return value
  }
}

const convertOldSettings = new ConvertOldSettings()

export { convertOldSettings }
