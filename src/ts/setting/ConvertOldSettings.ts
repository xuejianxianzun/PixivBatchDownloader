type settingKey = string
type oldValue = string
type newValue = string

type StringSettingsMap = Record<settingKey, Record<oldValue, newValue>>

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
