import { extractImage } from './ExtractImage'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'
import { Utils } from '../utils/Utils'

declare const Whammy: any

class ToWebM {
  public async convert(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 创建视频编码器
      const encoder = new Whammy.Video()

      // 获取解压后的图片数据
      let base64Arr = await extractImage
        .extractImageAsDataURL(file, info)
        .catch(() => {
          reject(new Error('Start error'))
        })

      if (!base64Arr) {
        return
      }
      // 生成每一帧的数据
      let canvasList = await this.getFrameData(base64Arr)
      // 添加帧数据
      for (let index = 0; index < canvasList.length; index++) {
        encoder.add(canvasList[index], info.frames![index].delay)
      }

      base64Arr = null as any
      canvasList = null as any

      // 获取生成的视频
      file = await this.encodeVideo(encoder)

      EVT.fire(EVT.list.convertSuccess)

      resolve(file)
    })
  }

  // 获取每一帧的数据，传递给编码器使用
  private async getFrameData(imgFile: string[]): Promise<HTMLCanvasElement[]> {
    const resultList: HTMLCanvasElement[] = []
    return new Promise(async (resolve, reject) => {
      for (const base64 of imgFile) {
        const img = await Utils.loadImg(base64)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        resultList.push(canvas)
      }
      resolve(resultList)
    })
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
