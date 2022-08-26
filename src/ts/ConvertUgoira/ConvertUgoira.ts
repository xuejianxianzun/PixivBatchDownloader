import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { UgoiraInfo } from '../crawl/CrawlResult'
import { toWebM } from './ToWebM'
import { toGIF } from './ToGIF'
import { toAPNG } from './ToAPNG'
import { msgBox } from '../MsgBox'
import { lang } from '../Lang'

// 控制动图转换
class ConvertUgoira {
  constructor() {
    this.setMaxCount()
    this.bindEvents()
  }

  private downloading = true // 是否在下载。如果下载停止了则不继续转换后续任务，避免浪费资源

  private _count: number = 0 // 统计有几个转换任务

  private maxCount = 1 // 允许同时运行多少个转换任务

  private readonly msgFlag = 'tipConvertUgoira'

  private bindEvents() {
    window.addEventListener(EVT.list.downloadStart, () => {
      this.downloading = true
      msgBox.resetOnce(this.msgFlag)
    })
    ;[EVT.list.downloadPause, EVT.list.downloadStop].forEach((event) => {
      window.addEventListener(event, () => {
        this.downloading = false
      })
    })

    // 设置发生变化时
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'convertUgoiraThread') {
        this.setMaxCount()
      }
    })

    window.addEventListener(EVT.list.convertSuccess, () => {
      this.complete()
    })

    // 如果转换动图时页面被隐藏了，则显示提示
    document.addEventListener('visibilitychange', () => {
      this.checkHidden()
    })
  }

  private setMaxCount() {
    this.maxCount =
      settings.convertUgoiraThread > 0 ? settings.convertUgoiraThread : 1
  }

  private set count(num: number) {
    this._count = num
    EVT.fire('convertChange', this._count)
    this.checkHidden()
  }

  private async start(
    file: Blob,
    info: UgoiraInfo,
    type: 'webm' | 'gif' | 'png'
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const t = window.setInterval(async () => {
        if (this._count < this.maxCount) {
          window.clearInterval(t)
          if (!this.downloading) {
            return
          }
          this.count = this._count + 1

          if (type === 'gif') {
            resolve(toGIF.convert(file, info))
          } else if (type === 'png') {
            resolve(toAPNG.convert(file, info))
          } else {
            // 如果没有 type 则默认使用 webm
            resolve(toWebM.convert(file, info))
          }
        }
      }, 200)
    })
  }

  private complete() {
    this.count = this._count - 1
  }

  // 转换成 WebM
  public async webm(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return await this.start(file, info, 'webm')
  }

  // 转换成 GIF
  public async gif(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return await this.start(file, info, 'gif')
  }

  // 转换成 APNG
  public async apng(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return await this.start(file, info, 'png')
  }

  private checkHidden() {
    if (this._count > 0 && document.visibilityState === 'hidden') {
      msgBox.once(
        this.msgFlag,
        lang.transl('_转换动图时页面被隐藏的提示'),
        'warning'
      )
    }
  }
}

const convertUgoira = new ConvertUgoira()
export { convertUgoira }
