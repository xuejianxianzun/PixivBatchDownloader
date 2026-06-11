import { EVT } from '../EVT'
import { lang } from '../Language'
import { LangTextKey } from '../langText'
import { store } from '../store/Store'
import { Utils } from '../utils/Utils'
import { downloadStates } from '../download/DownloadStates'
import { settings, setSetting } from './Settings'
import { FormType } from './FormType'

type DownloadSummaryState = 'start' | 'loading' | 'pause' | 'stop' | 'complete'

/** 在设置面板上始终显示的下载摘要区域 */
class SettingsPanelDownloadSummary {
  constructor(
    wrap: HTMLDivElement,
    form: FormType,
    onStateChanged?: () => void
  ) {
    this.wrap = wrap
    this.form = form
    this.onStateChanged = onStateChanged

    this.stateSVG = this.wrap.querySelector(
      '.settingsPanel_downloadSummaryStateIcon'
    ) as SVGSVGElement
    this.progress = this.wrap.querySelector(
      '.settingsPanel_downloadSummaryProgress'
    ) as HTMLSpanElement
    this.stateIconUse = this.wrap.querySelector(
      '.settingsPanel_downloadSummaryStateIcon use'
    ) as SVGUseElement

    this.bindEvents()
    this.update()
  }

  private wrap: HTMLDivElement
  private form: FormType
  private stateSVG: SVGSVGElement
  private progress: HTMLSpanElement
  private stateIconUse: SVGUseElement
  private state: DownloadSummaryState = 'start'
  private onStateChanged?: () => void

  private bindEvents() {
    this.wrap
      .querySelector('#settingsPanelSummaryStart')
      ?.addEventListener('click', () => this.clickRealButton('#startDownload'))
    this.wrap
      .querySelector('#settingsPanelSummaryPause')
      ?.addEventListener('click', () => this.clickRealButton('#pauseDownload'))
    this.wrap
      .querySelector('#settingsPanelSummaryStop')
      ?.addEventListener('click', () => this.clickRealButton('#stopDownload'))

    const summaryButtons = this.wrap.querySelectorAll(
      '.settingsPanel_downloadSummaryBtn'
    ) as NodeListOf<HTMLButtonElement>
    summaryButtons.forEach((button) => {
      button.addEventListener('mouseleave', () => button.blur())
    })

    window.addEventListener(EVT.list.langChange, () => {
      this.setState(this.state)
    })
    ;[
      EVT.list.crawlStart,
      EVT.list.crawlComplete,
      EVT.list.resultChange,
      EVT.list.resume,
      EVT.list.downloadStart,
      EVT.list.downloadPause,
      EVT.list.downloadStop,
      EVT.list.downloadComplete,
      EVT.list.downloadSuccess,
      EVT.list.skipDownload,
    ].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        this.update()
      })
    })
    ;[
      EVT.list.crawlStart,
      EVT.list.crawlComplete,
      EVT.list.resultChange,
      EVT.list.resume,
      EVT.list.readyDownload,
      EVT.list.downloadCancel,
    ].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        this.setState('start')
      })
    })

    window.addEventListener(EVT.list.downloadStart, () => {
      this.setState('loading')
    })
    window.addEventListener(EVT.list.downloadPause, () => {
      this.setState('pause')
    })
    window.addEventListener(EVT.list.downloadStop, () => {
      this.setState('stop')
    })
    window.addEventListener(EVT.list.downloadComplete, () => {
      this.setState('complete')
    })
    ;[EVT.list.crawlComplete, EVT.list.resume, EVT.list.downloadStart].forEach(
      (eventName) => {
        window.addEventListener(eventName, () => {
          this.expandHomeDownloadSection()
        })
      }
    )
  }

  private update() {
    const total = store.result.length
    const downloaded = total > 0 ? downloadStates.downloadedCount() : 0
    this.progress.textContent = `${downloaded} / ${total}`
    this.wrap.style.display = total > 0 ? 'flex' : 'none'

    if (total === 0) {
      this.setState('start')
      return
    }

    if (downloaded >= total) {
      this.setState('complete')
      return
    }

    if (this.state === 'complete') {
      this.setState('start')
    }
  }

  private setState(state: DownloadSummaryState) {
    this.state = state
    switch (state) {
      case 'loading':
        this.setSummaryState('_正在下载中', 'loading')
        return
      case 'pause':
        this.setSummaryState('_下载已暂停', 'pause')
        return
      case 'stop':
        this.setSummaryState('_下载已停止', 'stop')
        return
      case 'complete':
        this.setSummaryState('_下载完毕', 'complete')
        return
      default:
        this.setSummaryState('_未开始下载', 'start')
        return
    }
  }

  private setSummaryState(textKey: LangTextKey, iconId: string) {
    this.stateSVG.classList.toggle('is-loading', iconId === 'loading')
    this.stateSVG.setAttribute('title', lang.transl(textKey))
    this.stateIconUse.setAttribute('xlink:href', `#${iconId}`)
    this.onStateChanged?.()
  }

  private expandHomeDownloadSection() {
    if (settings.expandedCards.home?.downloadArea) {
      return
    }

    const nextExpandedCards = Utils.deepCopy(settings.expandedCards)
    if (nextExpandedCards.home) {
      nextExpandedCards.home.downloadArea = true
    }
    setSetting('expandedCards', nextExpandedCards)
  }

  private clickRealButton(selector: string) {
    const button = this.form.querySelector(selector) as HTMLButtonElement | null
    button?.click()
  }
}

export { SettingsPanelDownloadSummary }
