import browser from 'webextension-polyfill'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'
import { settings } from '../setting/Settings'

declare const PPDWebP: {
  init(workerUrl: string): void
  encode(
    bitmaps: ImageBitmap[],
    delays: number[],
    options?: { quality?: number; loopCount?: number }
  ): Promise<Blob>
}

class ToWebP {
  constructor() {
    this.loadWorker()
  }

  private async loadWorker() {
    const res = await fetch(browser.runtime.getURL('lib/ppd-webp.worker.js'))
    const blob = await res.blob()
    const workerUrl = URL.createObjectURL(blob)
    PPDWebP.init(workerUrl)
  }

  public async convert(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    const delays = info.frames.map((frame) => frame.delay)

    const blob = await PPDWebP.encode(ImageBitmapList, delays, {
      // 在有损压缩时使用 94 质量。这是比较高的质量了，不过体积依然比无损的 100 小很多
      quality: settings.animatedWebPQuality === 'lossy' ? 0.94 : 1,
      loopCount: 0, // loop forever
    })

    EVT.fire('convertSuccess')
    return blob
  }
}

const toWebP = new ToWebP()
export { toWebP }
