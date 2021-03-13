import { extractImage } from './ExtractImage'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'
import { Utils } from '../utils/Utils'

declare const GIF: any

class ToGIF {
  constructor() {
    this.loadWorkerJS()
  }

  private gifWorkerUrl: string = ''

  private async loadWorkerJS() {
    // 添加 gif 的 worker 文件
    let gifWorker = await fetch(chrome.extension.getURL('lib/gif.worker.js'))
    const gifWorkerBolb = await gifWorker.blob()
    this.gifWorkerUrl = URL.createObjectURL(gifWorkerBolb)
  }

  // 转换成 GIF
  public async convert(file: Blob, info: UgoiraInfo): Promise<Blob> {
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
      let imgList = await this.getFrameData(base64Arr)
      // 添加帧数据
      for (let index = 0; index < imgList.length; index++) {
        gif.addFrame(imgList[index], {
          delay: info.frames![index].delay,
        })
      }

      base64Arr = null as any
      imgList = null as any

      // 渲染 gif
      gif.render()
    })
  }

  // 添加每一帧的数据
  private async getFrameData(imgFile: string[]): Promise<HTMLImageElement[]> {
    const resultList: HTMLImageElement[] = []
    return new Promise(async (resolve, reject) => {
      for (const base64 of imgFile) {
        const img = await Utils.loadImg(base64)
        resultList.push(img)
      }
      resolve(resultList)
    })
  }
}

const toGIF = new ToGIF()
export { toGIF }
