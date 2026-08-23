import browser from 'webextension-polyfill'
import { EVT } from './EVT'

// 浏览器命令名 -> EVT 事件名的映射
// 下载器只根据稳定的命令名执行动作，不直接解析用户实际使用的按键
const commandMap: Record<string, string> = {
  'toggle-settings-panel': EVT.list.commandToggleSettingsPanel,
  'start-default-crawl': EVT.list.commandStartDefaultCrawl,
  'toggle-select-work': EVT.list.commandToggleSelectWork,
  'toggle-exclude-work': EVT.list.commandToggleExcludeWork,
  'toggle-preview-work': EVT.list.commandTogglePreviewWork,
  'quick-download': EVT.list.commandQuickDownload,
  'quick-bookmark': EVT.list.commandQuickBookmark,
  'copy-work-info': EVT.list.commandCopyWorkInfo,
}

// 统一的命令接收层：把 background 转发的浏览器命令分发为语义化 EVT 事件
// 各功能模块通过监听对应的 EVT 事件来执行动作，而不是各自注册 runtime.onMessage
browser.runtime.onMessage.addListener((msg: any) => {
  if (msg && msg.msg === 'ppdCommand' && typeof msg.command === 'string') {
    const eventName = commandMap[msg.command]
    if (eventName) {
      EVT.fire(eventName as any)
    }
  }
})
