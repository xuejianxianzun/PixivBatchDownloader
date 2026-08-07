import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { states } from '../store/States'
import { exportSettings, settings } from './Settings'

/** 自动导出设置 */
class AutoExportSettings {
  /** 共享的上次定时导出时间戳 */
  private readonly lastExportTimeStoreName = 'lastAutoExportSettingsTime'

  /** 尚未定时导出时的检查间隔，在 1 - 5 秒之间随机，可减少多个标签页同时导出的概率 */
  private readonly initialCheckInterval =
    1000 + Math.floor(Math.random() * 4001)

  /** 已定时导出一次之后，每隔 10 分钟检查一次 */
  private readonly checkIntervalAfterExport = 10 * 60 * 1000

  /** 防止同一标签页里的异步检查重叠 */
  private checkingTimedExport = false

  /** 是否已存在定时导出记录 */
  private hasTimedExported = false

  constructor() {
    this.bindEvents()
    this.scheduleTimedExportCheck(this.initialCheckInterval)
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
        this.scheduleTimedExportCheck(
          this.hasTimedExported
            ? this.checkIntervalAfterExport
            : this.initialCheckInterval
        )
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
      this.hasTimedExported = !!lastExportTime
      const interval = settings.autoExportSettingsInterval * 60 * 60 * 1000
      if (!lastExportTime || Date.now() - lastExportTime >= interval) {
        await exportSettings()
        await browser.storage.local.set({
          [this.lastExportTimeStoreName]: Date.now(),
        })
        this.hasTimedExported = true
      }
    } finally {
      this.checkingTimedExport = false
    }
  }
}

new AutoExportSettings()
