import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

class ToAPNG {
  private worker!: Worker
  private workerReady: Promise<void> | null = null

  private async loadWorker(): Promise<void> {
    // 把 pako.min.js、UPNG.js 和 worker 脚本合并成一个 blob
    // UPNG.js 在编码时依赖 pako 的 deflate，所以必须先加载 pako
    const [pakoRes, upngRes, workerRes] = await Promise.all([
      fetch(browser.runtime.getURL('lib/pako.min.js')),
      fetch(browser.runtime.getURL('lib/UPNG.js')),
      fetch(browser.runtime.getURL('lib/apng.worker.js')),
    ])
    const [pakoText, upngText, workerText] = await Promise.all([
      pakoRes.text(),
      upngRes.text(),
      workerRes.text(),
    ])
    const blob = new Blob([pakoText, '\n', upngText, '\n', workerText], {
      type: 'application/javascript',
    })
    const url = URL.createObjectURL(blob)
    this.worker = new Worker(url)
    URL.revokeObjectURL(url)
    this.worker.onerror = (ev) => {
      console.error('APNG worker error:', ev)
    }
  }

  public async convert(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    if (!this.workerReady) {
      this.workerReady = this.loadWorker()
    }
    await this.workerReady

    const width = ImageBitmapList[0].width
    const height = ImageBitmapList[0].height
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    })! as CanvasRenderingContext2D
    canvas.width = width
    canvas.height = height

    // 提取每帧的像素数据
    let arrayBuffList: ArrayBuffer[] = []
    ImageBitmapList.forEach((imageBitmap) => {
      ctx.drawImage(imageBitmap, 0, 0)
      // 从画布获取图像绘制后的 Uint8ClampedArray buffer
      const buff = ctx.getImageData(0, 0, width, height).data.buffer
      arrayBuffList.push(buff as any)
    })
    const delayList = info.frames.map((frame) => frame.delay)

    // 在 worker 中编码，避免阻塞主线程
    // https://github.com/photopea/UPNG.js/#encoder
    const pngFile = await this.encodeInWorker(
      arrayBuffList,
      width,
      height,
      delayList
    )

    const blob = new Blob([pngFile], {
      type: 'image/vnd.mozilla.apng',
    })

    EVT.fire('convertSuccess')
    arrayBuffList = null as any
    return blob
  }

  // 使用自增 ID 区分并发请求，确保多线程转换时响应能正确匹配
  private messageId = 0

  private encodeInWorker(
    arrayBuffList: ArrayBuffer[],
    width: number,
    height: number,
    delayList: number[]
  ): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId
      const timeoutId = window.setTimeout(() => {
        this.worker.removeEventListener('message', handler)
        reject(new Error('APNG encoding timeout'))
      }, 120000)
      const handler = (ev: MessageEvent) => {
        if (ev.data.id !== id) return
        window.clearTimeout(timeoutId)
        this.worker.removeEventListener('message', handler)
        if (ev.data.error) {
          reject(new Error(ev.data.error))
        } else if (!(ev.data.result instanceof ArrayBuffer)) {
          reject(new Error('Invalid APNG worker response'))
        } else {
          resolve(ev.data.result)
        }
      }
      this.worker.addEventListener('message', handler)
      // 以 Transferable 方式传递 ArrayBuffer，零拷贝转移所有权
      this.worker.postMessage(
        { id, arrayBuffList, width, height, delayList },
        arrayBuffList
      )
    })
  }
}

const toAPNG = new ToAPNG()
export { toAPNG }
