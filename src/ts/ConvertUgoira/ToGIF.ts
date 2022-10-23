import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const GIF: any

class ToGIF {
  constructor() {
    this.loadWorkerJS()
  }

  private gifWorkerUrl: string = ''

  // 添加转换 GIF 的 worker 文件
  private async loadWorkerJS() {
    let gifWorker = await fetch(chrome.runtime.getURL('lib/gif.worker.js'))
    const gifWorkerBolb = await gifWorker.blob()
    this.gifWorkerUrl = URL.createObjectURL(gifWorkerBolb)
  }

  // 转换成 GIF
  public async convert(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 配置 gif.js
      let gif: any = new GIF({
        workers: 4,
        quality: 10,
        workerScript: this.gifWorkerUrl,
      })

      // 绑定渲染完成事件
      gif.on('finished', (file: Blob) => {
        EVT.fire('convertSuccess')
        resolve(file)
      })

      const width = ImageBitmapList[0].width
      const height = ImageBitmapList[0].height
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = width
      canvas.height = height

      // 添加帧数据
      ImageBitmapList.forEach((imageBitmap, index) => {
        ctx.drawImage(imageBitmap, 0, 0)
        const ImageData = ctx.getImageData(0, 0, width, height)
        gif.addFrame(ImageData, {
          delay: info.frames![index].delay,
        })
      })

      // 渲染 gif
      gif.render()
    })
  }
}

const toGIF = new ToGIF()
export { toGIF }
