import { lang } from './Lang'
import { Config } from './Config'
import { msgBox } from './MsgBox'
import { settings, setSetting, SettingKeys } from './setting/Settings'

// 用消息框显示一次性的提示
class ShowHelp {
  public show(settingKey: SettingKeys, msg: string) {
    if (settings[settingKey] === true) {
      setSetting(settingKey, false)
      msgBox.show(msg, {
        title: Config.appName + ' Help',
        btn: lang.transl('_我知道了'),
      })
    }
  }
}

const showHelp = new ShowHelp()
export { showHelp }
