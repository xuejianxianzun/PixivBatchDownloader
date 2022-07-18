import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const UPNG: any

class ToAPNG {
  public async convert(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 提取图片数据
      const zipFileBuffer = await file.arrayBuffer()
      const indexList = Tools.getJPGContentIndex(zipFileBuffer)
      let imgs = await Tools.extractImage(zipFileBuffer, indexList)

      // 添加帧数据
      let arrayBuffList = imgs.map((img) => this.getPNGBuffer(img))
      const delayList = info.frames.map((frame) => frame.delay)

      // 编码
      // https://github.com/photopea/UPNG.js/#encoder
      const pngFile = UPNG.encode(
        arrayBuffList,
        imgs[0].width,
        imgs[0].height,
        0,
        delayList
      ) as ArrayBuffer

      imgs = null as any
      arrayBuffList = null as any

      const blob = new Blob([pngFile], {
        type: 'image/vnd.mozilla.apng',
      })

      EVT.fire('convertSuccess')

      resolve(blob)
    })
  }

  // 获取每一帧的数据，传递给编码器使用
  private getPNGBuffer(img: HTMLImageElement): ArrayBuffer {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // 从画布获取图像绘制后的 Uint8ClampedArray buffer
    return ctx.getImageData(0, 0, img.width, img.height).data.buffer
  }
}

const toAPNG = new ToAPNG()
export { toAPNG }
