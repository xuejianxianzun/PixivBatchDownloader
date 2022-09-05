import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const UPNG: any

class ToAPNG {
  public async convert(
    ImageBitmapList: ImageBitmap[],
    info: UgoiraInfo
  ): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      const width = ImageBitmapList[0].width
      const height = ImageBitmapList[0].height
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = width
      canvas.height = height

      // 添加帧数据
      let arrayBuffList: ArrayBuffer[] = []
      ImageBitmapList.forEach((imageBitmap) => {
        ctx.drawImage(imageBitmap, 0, 0)
        // 从画布获取图像绘制后的 Uint8ClampedArray buffer
        const buff = ctx.getImageData(0, 0, width, height).data.buffer
        arrayBuffList.push(buff)
      })
      const delayList = info.frames.map((frame) => frame.delay)

      // 编码
      // https://github.com/photopea/UPNG.js/#encoder
      const pngFile = UPNG.encode(
        arrayBuffList,
        width,
        height,
        0,
        delayList
      ) as ArrayBuffer

      arrayBuffList = null as any

      const blob = new Blob([pngFile], {
        type: 'image/vnd.mozilla.apng',
      })

      EVT.fire('convertSuccess')

      resolve(blob)
    })
  }
}

const toAPNG = new ToAPNG()
export { toAPNG }
