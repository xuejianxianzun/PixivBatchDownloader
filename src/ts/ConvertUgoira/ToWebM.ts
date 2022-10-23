import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const Whammy: any

class ToWebM {
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

      // 创建视频编码器
      const encoder = new Whammy.Video()

      // 添加帧数据
      ImageBitmapList.forEach((imageBitmap, index) => {
        ctx.drawImage(imageBitmap, 0, 0)
        // 把图像转换为 webp 格式的 DataURL，这样 webm 编码器内部可以直接使用，不需要进行一些重复的操作
        // https://github.com/antimatter15/whammy#basic-usage
        const url = canvas.toDataURL('image/webp', 0.9)
        encoder.add(url, info.frames![index].delay)
      })

      // 编码视频
      encoder.compile(false, (video: Blob) => {
        EVT.fire('convertSuccess')
        resolve(video)
      })
    })
  }
}

const toWebM = new ToWebM()
export { toWebM }
