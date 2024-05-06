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
    info: UgoiraInfo,
    fileSize: number
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 配置 gif.js
      let gif: any = new GIF({
        workers: 4,
        quality: this.setQuality(fileSize),
        workerScript: this.gifWorkerUrl,
      })

      // console.time('gif')
      // 绑定渲染完成事件
      gif.on('finished', (file: Blob) => {
        // console.timeEnd('gif')
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

  private MBSize = 1024 * 1024
  /**根据 zip 文件的体积，决定转换动图使的质量 */
  // 使用更小的 quality 可以获得更好的画面质量（颜色质量）
  // 以前下载器使用的都是默认值 10，现在改为体积越小则使用越高的质量，以减少某些动图转换成 GIF 之后色差严重的问题
  private setQuality(fileSize: number) {
    const MB = Math.floor(fileSize / this.MBSize)
    switch (MB) {
      case 0:
        return 1
      case 1:
        return 2
      case 2:
        return 3
      case 3:
        return 4
      case 4:
        return 5
      case 5:
        return 6
      case 6:
        return 7
      case 7:
        return 8
      case 8:
        return 9
      default:
        return 10
    }
  }
}

const toGIF = new ToGIF()
export { toGIF }
