// 转换动图
import { EVT } from './EVT'
import { UgoiraInfo } from './CrawlResult.d'

declare const zip: any

declare const Whammy: any

declare const GIF: any

class ConvertUgoira {
  constructor() {
    this.loadWorkerJS()

    window.addEventListener(EVT.events.downloadStart, () => {
      this.downloading = true
    })
    ;[EVT.events.downloadPause, EVT.events.downloadStop].forEach((event) => {
      window.addEventListener(event, () => {
        this.downloading = false
      })
    })

    window.addEventListener(EVT.events.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data
      if (data.name === 'convertUgoiraThread') {
        this.maxCount = parseInt(data.value) || 1
      }
    })

    window.addEventListener(EVT.events.convertError, () => {
      this.complete()
    })
  }

  private gifWorkerUrl: string = ''

  private downloading = true // 是否在下载。如果下载停止了则不继续转换后续任务，避免浪费资源

  private count: number = 0 // 统计有几个转换任务

  private maxCount = 1 // 允许同时运行多少个转换任务

  private set setCount(num: number) {
    this.count = num
    EVT.fire(EVT.events.convertChange, this.count)
  }

  private async loadWorkerJS() {
    if ('zip' in window === false) {
      return
    }

    // 添加 zip 的 worker 文件
    let zipWorker = await fetch(chrome.extension.getURL('lib/z-worker.js'))
    const zipWorkerBolb = await zipWorker.blob()
    const zipWorkerUrl = URL.createObjectURL(zipWorkerBolb)
    zip.workerScripts = {
      inflater: [zipWorkerUrl],
    }

    // 添加 gif 的 worker 文件
    let gifWorker = await fetch(chrome.extension.getURL('lib/gif.worker.js'))
    const gifWorkerBolb = await gifWorker.blob()
    this.gifWorkerUrl = URL.createObjectURL(gifWorkerBolb)
  }

  // 解压 zip 文件
  private async readZip(
    zipFile: any,
    ugoiraInfo: UgoiraInfo
  ): Promise<string[]> {
    return new Promise(function (resolve, reject) {
      zip.createReader(
        new zip.BlobReader(zipFile),
        (zipReader: any) => {
          // 读取成功时的回调函数，files 保存了文件列表的信息
          zipReader.getEntries((files: object[]) => {
            // 创建数组，长度与文件数量一致
            const imgFile = new Array(files.length)
            // 获取每个文件的数据。因为这个操作是异步的，所以必须检查图片数量
            files.forEach((file: any) => {
              file.getData(
                new zip.Data64URIWriter(ugoiraInfo.mime_type),
                (data: string) => {
                  const fileNo = parseInt(file.filename)
                  imgFile[fileNo] = data
                  // 把图片按原编号存入对应的位置。这是因为我怀疑有时候 zip.Data64URIWriter 的回调顺序不一致，直接 push 可能导致图片的顺序乱掉
                  for (let i = 0; i < imgFile.length; i++) {
                    // 检测到空值说明没有添加完毕，退出循环
                    if (!imgFile[i]) {
                      break
                    }
                    // 如果检查到最后一项，说明添加完毕
                    if (i === imgFile.length - 1) {
                      resolve(imgFile)
                    }
                  }
                }
              )
            })
          })
        },
        (message: any) => {
          EVT.fire(EVT.events.convertError)
          reject(new Error('ReadZIP error: ' + message))
        }
      )
    })
  }

  // 添加每一帧的数据
  private async getFrameData(
    imgFile: string[],
    type: string = 'webm'
  ): Promise<HTMLCanvasElement[] | HTMLImageElement[]> {
    const resultList = new Array(imgFile.length)
    return new Promise(function (resolve, reject) {
      const drawImg = function (index: number) {
        const img = new Image()

        img.onload = function (event) {
          // 处理视频
          if (type === 'webm') {
            const canvasEl = document.createElement('canvas')
            const ctx = canvasEl.getContext('2d')!
            canvasEl.width = img.width
            canvasEl.height = img.height
            ctx.drawImage(img, 0, 0)
            resultList[index] = canvasEl
          }
          // 处理 gif
          if (type === 'gif') {
            resultList[index] = img
          }

          // 继续下一个
          if (index < imgFile.length - 1) {
            index++
            drawImg(index)
          } else {
            resolve(resultList)
          }
        }

        img.src = imgFile[index]
      }

      // onload 完成时的顺序和添加事件时的顺序不一致，为了避免图片顺序乱掉，这里逐个添加每个图片
      drawImg(0)
    })
  }

  // 编码视频
  private async encodeVideo(encoder: any) {
    return new Promise(function (resolve, reject) {
      encoder.compile(false, function (video: Blob) {
        resolve(video)
      })
    })
  }

  // 开始转换，这一步主要是解压文件
  private async start(file: Blob, info: UgoiraInfo): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const t = window.setInterval(async () => {
        if (this.count < this.maxCount) {
          window.clearInterval(t)
          if (!this.downloading) {
            return
          }
          this.setCount = this.count + 1
          // 将压缩包里的图片转换为 base64 字符串
          await this.readZip(file, info)
            .then((data: string[]) => {
              resolve(data)
            })
            .catch(() => {
              reject(new Error('readZip error'))
            })
        }
      }, 200)
    })
  }

  private complete() {
    this.setCount = this.count - 1
  }

  // 转换成 webm
  public async webm(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 创建视频编码器
      const encoder = new Whammy.Video()

      // 获取解压后的图片数据
      let base64Arr = await this.start(file, info).catch(() => {
        reject(new Error('Start error'))
      })

      if (!base64Arr) {
        return
      }
      // 生成每一帧的数据
      let canvasData = await this.getFrameData(base64Arr)
      // 添加帧数据
      for (let index = 0; index < canvasData!.length; index++) {
        const base64 = canvasData![index]
        encoder.add(base64, info.frames![index].delay)
      }

      base64Arr = null as any
      canvasData = null as any

      // 获取生成的视频
      file = (await this.encodeVideo(encoder)) as Blob

      this.complete()

      resolve(file)
    })
  }

  // 转换成 gif
  public async gif(file: Blob, info: UgoiraInfo): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      // 配置 gif.js
      let gif: any = new GIF({
        workers: 4,
        quality: 10,
        workerScript: this.gifWorkerUrl,
      })

      // 绑定渲染完成事件
      gif.on('finished', (file: Blob) => {
        this.complete()
        resolve(file)
      })

      // 获取解压后的图片数据
      let base64Arr = await this.start(file, info).catch(() => {
        reject(new Error('Start error'))
      })

      if (!base64Arr) {
        return
      }

      // 生成每一帧的数据
      let imgData = await this.getFrameData(base64Arr, 'gif')
      // 添加帧数据
      for (let index = 0; index < imgData!.length; index++) {
        gif.addFrame(imgData![index], {
          delay: info.frames![index].delay,
        })
      }

      base64Arr = null as any
      imgData = null as any

      // 渲染 gif
      gif.render()
    })
  }
}

const converter = new ConvertUgoira()
export { converter }
