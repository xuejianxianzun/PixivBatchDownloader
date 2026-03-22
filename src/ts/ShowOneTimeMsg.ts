import { lang } from './Language'
import { Config } from './Config'
import { msgBox } from './MsgBox'
import { settings, setSetting, SettingKeys } from './setting/Settings'

class ShowOneTimeMsg {
  /** 用 msgBox 显示一次性的提示。显示之后会自动修改设置，以后不再显示 */
  public show(settingKey: SettingKeys, msg: string, title?: string) {
    if (settings[settingKey] === true) {
      setSetting(settingKey, false)
      msgBox.show(msg, {
        title: title ? title : Config.appName + ' Help',
        btn: lang.transl('_我知道了'),
      })
    }
  }
}

const showOneTimeMsg = new ShowOneTimeMsg()
export { showOneTimeMsg }
