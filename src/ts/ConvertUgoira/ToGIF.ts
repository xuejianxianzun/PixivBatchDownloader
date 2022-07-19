import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { UgoiraInfo } from '../crawl/CrawlResult'

declare const GIF: any

class ToGIF {
  constructor() {
    this.loadWorkerJS()
  }

  private gifWorkerUrl: string = ''

  private async loadWorkerJS() {
    // 添加 gif 的 worker 文件
    let gifWorker = await fetch(chrome.runtime.getURL('lib/gif.worker.js'))
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

      // 提取图片数据
      const zipFileBuffer = await file.arrayBuffer()
      const indexList = Tools.getJPGContentIndex(zipFileBuffer)
      let imgs = await Tools.extractImage(zipFileBuffer, indexList)

      // 添加帧数据
      imgs.forEach((img, index) => {
        gif.addFrame(img, {
          delay: info.frames![index].delay,
        })
      })

      imgs = null as any

      // 渲染 gif
      gif.render()
    })
  }
}

const toGIF = new ToGIF()
export { toGIF }
