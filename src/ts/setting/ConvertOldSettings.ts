interface Data {
  [key: string]: {
    [key: string]: string
  }
}

// 为了兼容以前的版本的设置，把旧的设置值转换为新版本的设置值
class ConvertOldSettings {
  // 旧设置和新设置的对应关系
  // 为了集中管理，便于使用，写到了一个对象里
  private readonly data: Data = {
    ratio: {
      '0': 'square',
      '1': 'horizontal',
      '2': 'vertical',
      '3': 'userSet',
    },
    idRange: {
      '1': '>',
      '2': '<',
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

  // 传递需要转换的设置的键值
  public convert(key: string, value: string): string {
    const map = this.data[key]
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
