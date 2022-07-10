import { UgoiraMetaBody } from './crawl/CrawlResult'
import { API } from "./API"
import { settings } from './setting/Settings'
import { log } from './Log'
import { Utils } from './utils/Utils'
import { Tools } from './Tools'

class PreviewUgoira {
  constructor(id: string | number) {
    this.init(id)
  }

  /**作品 id */
  private id!: string | number
  /**这个动图的 meta 数据 */
  private meta!: UgoiraMetaBody
  /**要使用的动图压缩包的 URL */
  private zipURL!: string
  /**完整的 zip 文件的字节数 */
  private zipLength = 0
  /** 用固定的字节数分割出多个文件片段 */
  private readonly rangeSize = 500000
  /**保存每个文件片段的请求头的值
   * 字符串格式如 'bytes=0-499999'
  */
  private rangeList: string[] = []
  /**把分段加载的 zip 文件合并，保存到这个容器 */
  private zipContent: ArrayBuffer = new ArrayBuffer(0)
  /**所有文件片段是否都加载完毕 */
  private loadend = false
  /**每个 jpg 文件名的开始位置 */
  private jpgFlagIndexList: number[] = []
  /**每个 jpg 文件的数据。按照图片在压缩包里的顺序，储存对应的数据 */
  private jpgFileList: {
    buffer: ArrayBuffer,
    blobURL: string,
    img: HTMLImageElement,
    delay: number
  }[] = []

  // jpg 文件名的长度固定为 10 个字节 000000.jpg
  private readonly jpgNameLength = 10


  private width = 0
  private height = 0
  private canvasWrap!: HTMLElement
  private canvas = document.createElement('canvas')
  private canvasCon = this.canvas.getContext('2d')
  private showCanvas = false

  private async init(id: string | number) {
    console.log('id')
    // 获取这个动图的 meta 数据
    this.id = id
    this.meta = await this.getMeta(this.id)

    // 目前只支持提取 jpg 图片
    if (this.meta.mime_type !== 'image/jpeg') {
      const msg = 'Preview ugoira error: mime type unsupport: ' + this.meta.mime_type
      log.warning(msg)
      console.warn(msg)
      return
    }

    // 设置要使用的 URL
    if (settings.prevWorkSize === 'regular') {
      this.zipURL = this.meta.src
    } else {
      this.zipURL = this.meta.originalSrc
    }

    // 获取动图体积
    this.zipLength = await this.getFileLength()
    console.log('content-length:', this.zipLength)

    // 生成区间
    this.rangeList = this.setRangeList(this.zipLength, this.rangeSize)
    console.log('rangeList', this.rangeList)

    // 加载区间文件数据
    // 由于不完整的 zip 文件现在使用的 zip 库无法解析，所以我需要自己提取 jpg 图片的数据
    for (const range of this.rangeList) {
      const buff = await this.loadRangeFileAsBuff(range)

      // 保存每个片段的文件
      // const newFile = new Blob([buff])
      // const url = URL.createObjectURL(newFile)
      // Utils.downloadFile(url, `${range}.zip`)

      // 把这个文件片段追加到文件容器里
      this.zipContent = this.appendBuff(this.zipContent, buff)

      // 判断整个压缩包是否全部加载完毕
      this.loadend = this.zipContent.byteLength === this.zipLength

      // 提取出每个 jpg 图片的数据
      this.jpgFlagIndexList = this.findJPGFlagIndex(this.zipContent)
      this.extractJPGData(this.zipContent, this.jpgFlagIndexList)
      console.log(this.jpgFileList)

      // 获取图片的宽高
      if (this.jpgFileList.length > 0 && this.width === 0) {
        const size = await this.getImageSize(this.jpgFileList[0].blobURL)
        console.log(size)
        this.width = size.width
        this.height = size.height
      }

      // 显示画布并开始播放动画
      if (this.jpgFileList.length > 0 && !this.showCanvas) {
        this.canvas.width = this.width
        this.canvas.height = this.height
        Tools.insertToHead(this.canvas)
        this.showCanvas = true
        this.play()
      }
    }

    // 保存某个指定图片
    // Utils.downloadFile(this.jpgFileList[0].blobURL, `jpg.jpg`)

    // 保存整个压缩包
    // const newFile = new Blob([this.zipContent])
    // const url = URL.createObjectURL(newFile)
    // Utils.downloadFile(url, `${this.id}.zip`)
  }

  /**把 ArrayBuffer 追加到已存在的 ArrayBuffer 容器里  */
  private appendBuff(target: ArrayBuffer, newBuff: ArrayBuffer) {
    const totalLength = target.byteLength + newBuff.byteLength
    const uint8 = new Uint8Array(totalLength)
    uint8.set(new Uint8Array(target))
    uint8.set(new Uint8Array(newBuff), target.byteLength)
    return uint8.buffer
  }

  /** 查找类似于 [000000.jpg] 的标记的位置  */
  // 但是文件结尾有 [000000.jpgPK] 这样的标记，需要排除，因为这是 zip 的文件目录，没有实际内容
  private findJPGFlagIndex(buff: ArrayBuffer) {
    const uint8 = new Uint8Array(buff)

    // 每次查找时，开始的位置
    let findStartPosition = 0
    const indexList: number[] = []

    console.time('findJPGFlagIndex')
    // 这个地方可以优化，用 slice 方法取出后面的未被检查的部分
    while (true) {
      const index = uint8.findIndex((val, index, array) => {
        if (index > findStartPosition && val === 48 && array[index + 7] === 106 && array[index + 8] === 112 && array[index + 9] === 103 && array[index + 10] !== 80) {
          findStartPosition = index + 10
          return true
        }
        return false
      })

      if (index !== -1) {
        indexList.push(index)
      } else {
        break
      }
    }
    console.timeEnd('findJPGFlagIndex')
    // 性能：在我的电脑上，在 500000 字节的数据里查找里面的 8 个 jpg 标记，耗时约 30ms

    console.log('indexList', indexList)
    return indexList
  }

  /** 从 zip 文件里提取出所有 jpg 图片的数据 */
  private extractJPGData(file: ArrayBuffer, indexList: number[]) {
    const uint8 = new Uint8Array(file)

    indexList.forEach((number, index, array) => {
      // 如果这是最后一个标记，并且压缩包没有整个加载完成，则不提取最后一个文件的数据
      // 因为此时最后一个文件的数据很可能是破损的
      if (index === array.length - 1 && !this.loadend) {
        return
      }

      // 如果这张图片没有被保存，才会提取它
      // 如果已经有这个图片的数据，就不再提取它，以节约性能
      if (this.jpgFileList[index] === undefined) {
        // 确定要提取的文件的起始位置
        // 从当前文件名之后开始
        const start = number + this.jpgNameLength
        // 截止下一个文件名之前
        let end = array[index + 1] - 1
        if (index === array.length - 1) {
          // 如果是最后一个 jpg 文件，则截止到 zip 文件的结尾
          // 但是这样它会包含 zip 目录数据，尚不清楚是否会影响图片的使用
          end = file.byteLength
        }
        // slice 方法的 end 不会包含在结果里，所以要 + 1
        const buffer = uint8.slice(start, end + 1).buffer
        const blob = new Blob([buffer], {
          type: 'image/jpeg'
        })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.src = url
        this.jpgFileList[index] = {
          buffer: buffer,
          blobURL: url,
          img: img,
          delay: this.meta.frames[index].delay
        }
      }
    })
  }

  /** 发送 HEAD 请求，获取 zip 压缩包的体积 */
  private getFileLength(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(this.zipURL, {
        method: 'head',
        credentials: 'same-origin'
      })

      const length = response.headers.get('content-length')
      if (!length) {
        throw reject('getFileLength error: get length failed')
      }

      resolve(Number.parseInt(length))
    })
  }

  /**获取该作品的 meta 数据 */
  private getMeta(id: string | number): Promise<UgoiraMetaBody> {
    return new Promise(async (resolve, reject) => {
      const meta = await API.getUgoiraMeta(id as string)
      if (meta.error) {
        throw reject(meta.message)
      }

      resolve(meta.body)
    })
  }

  /** 根据 zip 文件的体积分割出数个区间，生成对应的标记文本 */
  private setRangeList(total: number, rangeSize: number) {
    const result: string[] = []

    // total 是 length，但 start 和 end 是下标
    let start = 0
    let end = 0
    const max = total - 1
    while (end < max) {
      if (start > 0) {
        start++
      }

      end = start + rangeSize - 1
      if (end > max) {
        end = max
      }
      const str = `bytes=${start}-${end}`

      result.push(str)

      start = end
    }

    return result
  }

  /**获取图片的宽高 */
  private async getImageSize(url: string): Promise<{
    width: number
    height: number
  }> {
    return new Promise(async (resolve, reject) => {
      const img = await Utils.loadImg(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    })
  }

  private loadRangeFileAsBuff(range: string): Promise<ArrayBuffer> {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(this.zipURL, {
        method: 'get',
        headers: {
          range: range,
        }
      })
      const buff = await res.arrayBuffer()
      resolve(buff)
    })
  }


  private playIndex = 0
  private playDelay = 0
  private playTimer?: number

  private play() {
    this.playTimer = window.setTimeout(() => {
      this.drawImage(this.canvasCon!, this.jpgFileList[this.playIndex].img)

      this.playDelay = this.jpgFileList[this.playIndex].delay
      this.playIndex++
      if (this.playIndex > this.jpgFileList.length - 1) {
        this.playIndex = 0
      }
      this.play()
    }, this.playDelay)
  }

  private async drawImage(con: CanvasRenderingContext2D, img: HTMLImageElement) {
    // 只播放加载完成的图片，未加载完成的忽略
    if (img.complete) {
      con.drawImage(img, 0, 0, this.width, this.height)
    }
  }

  public destroy() {
    console.log('destroy previewUgoira')
    window.clearTimeout(this.playTimer)
    this.canvas.remove()
    this.zipContent = new ArrayBuffer(0)
    this.jpgFileList = []
    this.jpgFlagIndexList = []
  }
}

export { PreviewUgoira }
