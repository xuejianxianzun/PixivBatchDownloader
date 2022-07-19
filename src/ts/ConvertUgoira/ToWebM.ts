import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const Whammy: any

class ToWebM {
  public async convert(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 创建视频编码器
      const encoder = new Whammy.Video()

      // 提取图片数据
      const zipFileBuffer = await file.arrayBuffer()
      const indexList = Tools.getJPGContentIndex(zipFileBuffer)
      let imgs = await Tools.extractImage(zipFileBuffer, indexList)

      // 添加帧数据
      imgs.forEach((img, index) => {
        // https://github.com/antimatter15/whammy#basic-usage
        encoder.add(this.getImgDataURL(img), info.frames![index].delay)
      })

      imgs = null as any

      // 生成的视频
      file = await this.encodeVideo(encoder)

      EVT.fire('convertSuccess')

      resolve(file)
    })
  }

  // 获取每一帧的数据，传递给编码器使用
  // 把图像转换为 webp 格式的 DataURL，这样 webm 编码器内部可以直接使用，不需要进行一些重复的操作
  // 这样的转换速度是最快的
  private getImgDataURL(img: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL('image/webp', 0.9)
  }

  // 编码视频
  private async encodeVideo(encoder: any) {
    return new Promise<Blob>(function (resolve, reject) {
      encoder.compile(false, function (video: Blob) {
        resolve(video)
      })
    })
  }
}

const toWebM = new ToWebM()
export { toWebM }
