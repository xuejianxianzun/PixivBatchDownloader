import { extractImage } from './ExtractImage'
import { DOM } from '../DOM'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../CrawlResult'

declare const UPNG: any

class ToAPNG {
  public async convert(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 获取解压后的图片数据
      let base64Arr = await extractImage
        .extractImageAsDataURL(file, info)
        .catch(() => {
          reject(new Error('Start error'))
        })

      if (!base64Arr) {
        return
      }
      // 每一帧的数据
      let arrayBuffList = await this.getFrameData(base64Arr)
      // 延迟数据
      const delayList = []
      for (const d of info.frames) {
        delayList.push(d.delay)
      }
      // 获取宽高
      const img = await DOM.loadImg(base64Arr[0])
      // 编码
      const png = UPNG.encode(
        arrayBuffList,
        img.width,
        img.height,
        0,
        delayList,
      ) as Uint8Array

      base64Arr = null as any
      arrayBuffList = null as any

      const blob = new Blob([png], {
        type: 'image/vnd.mozilla.apng',
      })

      EVT.fire(EVT.list.convertSuccess)

      resolve(blob)
    })
  }

  // 获取每一帧的数据，传递给编码器使用
  private async getFrameData(imgFile: string[]): Promise<ArrayBuffer[]> {
    const resultList: ArrayBuffer[] = []
    return new Promise(async (resolve, reject) => {
      for (const base64 of imgFile) {
        const img = await DOM.loadImg(base64)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const buff = ctx.getImageData(0, 0, img.width, img.height).data.buffer
        resultList.push(buff)
      }
      resolve(resultList)
    })
  }
}

const toAPNG = new ToAPNG()
export { toAPNG }
