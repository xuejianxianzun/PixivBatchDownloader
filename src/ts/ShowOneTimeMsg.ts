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

  /** 一次显示多条一次性提示。每条提示按照自己的 key 独立判断，只显示尚未显示过的提示，
   * 多条提示会合并到一个消息框里显示。全都显示过时不显示 */
  public showList(items: { key: SettingKeys; msg: string }[], title?: string) {
    const pending = items.filter((item) => settings[item.key] === true)
    if (pending.length === 0) {
      return
    }
    pending.forEach((item) => setSetting(item.key, false))
    msgBox.show(pending.map((item) => item.msg).join('<br><br>'), {
      title: title ? title : Config.appName + ' Help',
      btn: lang.transl('_我知道了'),
    })
  }
}

const showOneTimeMsg = new ShowOneTimeMsg()
export { showOneTimeMsg }
