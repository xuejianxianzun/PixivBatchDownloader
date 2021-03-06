import { settings, setSetting, SettingKeys } from './Settings'
import { secretSignal } from '../utils/SecretSignal'
import { log } from '../Log'
import { toast } from '../Toast'

interface List {
  name: SettingKeys
  code: string
}

// 管理不可见的设置。通过预设的按键，切换其开关状态
class InvisibleSettings {
  constructor() {
    this.register()
  }

  private readonly list: List[] = [
    {
      name: 'createFolderBySl',
      code: 'switchsl',
    },
    {
      name: 'createFolderBySl',
      code: 'kaiguansl',
    },
    {
      name: 'downloadUgoiraFirst',
      code: 'dlugoirafirst',
    },
    {
      name: 'downloadUgoiraFirst',
      code: 'qw111',
    },
    {
      name: 'mouseEnterSwitchTabbar',
      code: 'mouseenter',
    },
  ]

  private register() {
    for (const item of this.list) {
      secretSignal.register(item.code, () => {
        this.onChange(item.name)
      })
    }
  }

  private onChange(name: SettingKeys) {
    const nowValue = settings[name]
    if (typeof nowValue !== 'boolean') {
      return
    }

    // 如果查找到了符合的记录，则反转这个设置的值
    const newValue = !settings[name]
    setSetting(name, newValue)

    // 显示提示信息
    if (settings[name]) {
      const msg = name + ' on'
      log.success(msg)
      toast.success(msg)
    } else {
      const msg = name + ' off'
      log.warning(msg)
      toast.warning(msg)
    }
  }
}

new InvisibleSettings()
