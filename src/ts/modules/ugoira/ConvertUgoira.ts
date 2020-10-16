import { EVT } from '../EVT'
import { UgoiraInfo } from '../CrawlResult'
import { toWebM } from './ToWebM'
import { toGIF } from './ToGIF'
import { toAPNG } from './ToAPNG'

// 控制动图转换
class ConvertUgoira {
  constructor() {
    window.addEventListener(EVT.list.downloadStart, () => {
      this.downloading = true
    })
    ;[EVT.list.downloadPause, EVT.list.downloadStop].forEach((event) => {
      window.addEventListener(event, () => {
        this.downloading = false
      })
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data
      if (data.name === 'convertUgoiraThread') {
        this.maxCount = parseInt(data.value) || 1
      }
    })

    window.addEventListener(EVT.list.convertSuccess, () => {
      this.complete()
    })

    window.addEventListener(EVT.list.readZipError, () => {
      this.complete()
    })
  }

  private downloading = true // 是否在下载。如果下载停止了则不继续转换后续任务，避免浪费资源

  private _count: number = 0 // 统计有几个转换任务

  private maxCount = 1 // 允许同时运行多少个转换任务

  private set count(num: number) {
    this._count = num
    EVT.fire(EVT.list.convertChange, this._count)
  }

  private async start(
    file: Blob,
    info: UgoiraInfo,
    type: 'webm' | 'gif' | 'png',
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
}

const converter = new ConvertUgoira()
export { converter }
