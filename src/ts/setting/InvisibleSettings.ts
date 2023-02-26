import { settings, setSetting, SettingKeys } from './Settings'
import { secretSignal } from '../utils/SecretSignal'
import { log } from '../Log'
import { toast } from '../Toast'

type Cfg = {
  [key in SettingKeys]?: string[]
}

// 管理不可见的设置。通过预设的按键，切换其开关状态
class InvisibleSettings {
  constructor() {
    this.register()
  }

  // ppdss: Powerful Pixiv Downloader Secret Settings
  private readonly cfg: Cfg = {
    createFolderBySl: ['ppdss1', 'switchsl', 'kaiguansl'],
    downloadUgoiraFirst: ['ppdss2', 'dlugoirafirst', 'qw111'],
  }

  private register() {
    for (const [name, codes] of Object.entries(this.cfg)) {
      for (const code of codes!) {
        secretSignal.register(code, () => {
          this.onChange(name as SettingKeys)
        })
      }
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
      const msg = name + ' On'
      log.success(msg)
      toast.success(msg)
    } else {
      const msg = name + ' Off'
      log.warning(msg)
      toast.warning(msg)
    }
  }
}

new InvisibleSettings()
