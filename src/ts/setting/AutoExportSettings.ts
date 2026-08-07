import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { states } from '../store/States'
import { exportSettings, settings } from './Settings'

/** 自动导出设置 */
class AutoExportSettings {
  /** 共享的上次定时导出时间戳 */
  private readonly lastExportTimeStoreName = 'lastAutoExportSettingsTime'

  /** 首次检查是否需要定时导出的延迟时间。在一定时间范围之间随机，可减少多个标签页同时导出的概率 */
  private readonly firstCheckInterval = 1000 + Math.floor(Math.random() * 4001)

  /** 在首次检查之后，后续的检查会使用较长的间隔时间，以避免过于频繁的进行无效检查 */
  private readonly subsequentCheckInterval = 5 * 60 * 1000

  /** 防止同一标签页里的异步检查重叠 */
  private checkingTimedExport = false

  constructor() {
    this.bindEvents()
    this.scheduleTimedExportCheck(this.firstCheckInterval)
  }

  /** 监听本标签页保存设置的事件，以处理“每当设置变化后立即导出”策略 */
  private bindEvents() {
    window.addEventListener(EVT.list.settingsStored, () => {
      if (
        states.settingInitialized &&
        settings.autoExportSettings &&
        settings.autoExportSettingsStrategy === 'onSettingChange'
      ) {
        exportSettings()
      }
    })
  }

  /** 安排下一次定时导出检查 */
  private scheduleTimedExportCheck(interval: number) {
    window.setTimeout(() => {
      this.checkTimedExport().finally(() => {
        this.scheduleTimedExportCheck(this.subsequentCheckInterval)
      })
    }, interval)
  }

  /** 检查是否需要按照定时策略导出 */
  private async checkTimedExport() {
    if (
      this.checkingTimedExport ||
      !states.settingInitialized ||
      !settings.autoExportSettings ||
      settings.autoExportSettingsStrategy !== 'timed'
    ) {
      return
    }

    this.checkingTimedExport = true
    try {
      const data = await browser.storage.local.get(this.lastExportTimeStoreName)
      const lastExportTime = data[this.lastExportTimeStoreName] as
        | number
        | undefined
      const interval = settings.autoExportSettingsInterval * 60 * 60 * 1000
      if (!lastExportTime || Date.now() - lastExportTime >= interval) {
        await exportSettings()
        await browser.storage.local.set({
          [this.lastExportTimeStoreName]: Date.now(),
        })
      }
    } finally {
      this.checkingTimedExport = false
    }
  }
}

new AutoExportSettings()
