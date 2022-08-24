import { lang } from './Lang'
import { Config } from './config/Config'
import { msgBox } from './MsgBox'
import { Utils } from './utils/Utils'
import { EVT } from './EVT'
import { setSetting, settings } from './setting/Settings'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.bindEvents()
  }

  private flag = '13.5.0'

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      // 消息文本要写在 settingInitialized 事件回调里，否则它们可能会被翻译成错误的语言
      let msg = `
      <strong>${lang.transl('_新增命名标记')}：</strong>
      <br>
      <span class="blue">{upload_date}</span> ${lang.transl(
        '_命名标记upload_date'
      )}
      <br>
      <br>
      <strong>${lang.transl('_新增设置项')}：</strong>
      <br>
      1. ${lang.transl('_点击收藏按钮时下载作品')}
      <br>
      2. ${lang.transl('_点击点赞按钮时下载作品')}
      <br>
      ${lang.transl(
        '_你可以在更多选项卡的xx分类里找到它',
        lang.transl('_下载')
      )}`

      // 在更新说明的下方显示赞助提示
      msg += `
      <br>
      <br>
      ${lang.transl('_赞助方式提示')}`

      this.show(msg)
    })
  }

  private show(msg: string) {
    if (Utils.isPixiv() && settings.whatIsNewFlag !== this.flag) {
      msgBox.show(msg, {
        title: Config.appName + ` ${lang.transl('_最近更新')}`,
        btn: lang.transl('_我知道了'),
      })
      setSetting('whatIsNewFlag', this.flag)
    }
  }
}

new ShowWhatIsNew()
