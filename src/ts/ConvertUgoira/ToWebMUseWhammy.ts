import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const Whammy: any
// https://github.com/antimatter15/whammy

class ToWebM {
  private worker!: Worker
  private workerReady: Promise<void> | null = null

  constructor() {
    this.workerReady = this.loadWorkerJS()
  }

  private async loadWorkerJS(): Promise<void> {
    const [whammyRes, workerRes] = await Promise.all([
      fetch(browser.runtime.getURL('lib/whammy.js')),
      fetch(browser.runtime.getURL('lib/whammy.worker.js')),
    ])
    const [whammyText, workerText] = await Promise.all([
      whammyRes.text(),
      workerRes.text(),
    ])
    const blob = new Blob(
      ['var window = self;\n', whammyText, '\n', workerText],
      {
        type: 'application/javascript',
      }
    )
    const url = URL.createObjectURL(blob)
    this.worker = new Worker(url)
    URL.revokeObjectURL(url)
    this.worker.onerror = (ev) => {
      console.error('Whammy worker error:', ev)
    }
  }

  public async convert(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    if (
      typeof Worker === 'undefined' ||
      typeof OffscreenCanvas === 'undefined'
    ) {
      const video = await this.convertInMainThread(ImageBitmapList, info)
      EVT.fire('convertSuccess')
      return video
    }

    await this.workerReady

    const blob = await this.encodeInWorker(ImageBitmapList, info)
    EVT.fire('convertSuccess')
    return blob
  }

  private async convertInMainThread(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const width = ImageBitmapList[0].width
      const height = ImageBitmapList[0].height
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = width
      canvas.height = height

      const encoder = new Whammy.Video()

      ImageBitmapList.forEach((imageBitmap, index) => {
        ctx.drawImage(imageBitmap, 0, 0)
        const url = canvas.toDataURL('image/webp', 0.9)
        encoder.add(url, info.frames![index].delay)
      })

      encoder.compile(false, (video: Blob) => {
        resolve(video)
      })
    })
  }

  // 使用 worker 进行绘制和 WebM 编码，避免在主线程上执行 canvas.toDataURL 和 Whammy 编码
  private encodeInWorker(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const id = Date.now() + Math.random()
      const timeoutId = window.setTimeout(() => {
        this.worker.removeEventListener('message', handler)
        reject(new Error('Whammy encoding timeout'))
      }, 120000)

      const handler = (ev: MessageEvent) => {
        if (ev.data.id !== id) return
        window.clearTimeout(timeoutId)
        this.worker.removeEventListener('message', handler)
        if (ev.data.error) {
          reject(new Error(ev.data.error))
        } else if (ev.data.result && typeof ev.data.result.size === 'number') {
          resolve(ev.data.result)
        } else {
          reject(new Error('Invalid Whammy worker response'))
        }
      }

      this.worker.addEventListener('message', handler)
      this.worker.postMessage({
        id,
        bitmaps: ImageBitmapList,
        delays: info.frames!.map((frame) => frame.delay),
        width: ImageBitmapList[0].width,
        height: ImageBitmapList[0].height,
        quality: 0.9,
      })
    })
  }
}

const toWebM = new ToWebM()
export { toWebM }
