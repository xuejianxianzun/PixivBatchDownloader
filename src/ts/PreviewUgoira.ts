import { UgoiraMetaBody } from './crawl/CrawlResult'
import { API } from './API'
import { log } from './Log'
import { settings } from './setting/Settings'
import { Tools } from './Tools'

// 预览动图
class PreviewUgoira {
  constructor(
    id: string | number,
    canvasWrap: HTMLElement,
    prevSize: 'original' | 'regular',
    wrapWidth?: number,
    wrapHeight?: number
  ) {
    if (!settings.previewUgoira) {
      return
    }
    this.id = id
    this.canvasWrap = canvasWrap
    this.prevSize = prevSize
    wrapWidth && (this.wrapWidth = wrapWidth)
    wrapHeight && (this.wrapHeight = wrapHeight)

    this.start()
  }

  /**作品 id */
  private id!: string | number
  /**这个动图的 meta 数据 */
  private meta!: UgoiraMetaBody
  private prevSize: 'original' | 'regular' = 'regular'
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
  /**每个 jpg 文件内容的开始位置 */
  private jpgContentIndexList: number[] = []
  /**每个 jpg 文件的数据。按照图片在压缩包里的顺序，储存对应的数据 */
  private jpgFileList: {
    img: HTMLImageElement
    delay: number
  }[] = []

  // jpg 文件名的长度固定为 10 个字节 000000.jpg
  private readonly jpgNameLength = 10

  private canvasWrap!: HTMLElement
  private wrapWidth = 0
  private wrapHeight = 0
  private canvas = document.createElement('canvas')
  private canvasCon = this.canvas.getContext('2d')
  private canvasIsAppend = false
  private width = 0
  private height = 0

  private destroyed = false

  private async start() {
    // 获取这个动图的 meta 数据
    this.meta = await this.getMeta(this.id)

    // 目前只支持提取 jpg 图片
    if (this.meta.mime_type !== 'image/jpeg') {
      const msg =
        'Preview ugoira error: mime type unsupport: ' + this.meta.mime_type
      log.warning(msg)
      console.warn(msg)
      return
    }

    // 设置要使用的 URL
    if (this.prevSize === 'regular') {
      this.zipURL = this.meta.src
    } else {
      this.zipURL = this.meta.originalSrc
    }

    // 获取动图体积
    this.zipLength = await this.getFileLength()

    // 生成区间
    this.rangeList = this.setRangeList(this.zipLength, this.rangeSize)

    for (const range of this.rangeList) {
      // 加载文件片段
      const buff = await this.loadRangeFileAsBuff(range)

      if (this.destroyed) {
        return
      }

      // 把这个文件片段追加到文件容器里
      this.zipContent = this.appendBuff(this.zipContent, buff)

      // 判断整个压缩包是否全部加载完毕
      this.loadend = this.zipContent.byteLength === this.zipLength

      // 提取出每个 jpg 图片的数据
      // 由于我之前使用的 zip 库无法解析不完整的 zip 文件，所以我需要自己提取 jpg 图片的数据
      this.jpgContentIndexList = Tools.getJPGContentIndex(
        this.zipContent,
        this.jpgContentIndexList
      )
      this.extractJPGData(this.zipContent, this.jpgContentIndexList)

      // 设置画布的宽高
      if (this.jpgFileList.length > 0 && this.width === 0) {
        // 画布的宽高不能超过外部 wrap 的宽高
        // 本来我是打算从 wrap 宽度和动图宽度中取比较小的值
        // const size = await this.getImageSize(this.jpgFileList[0].blobURL)
        // this.width = Math.min(size.width, wrapWidth)
        // this.height = Math.min(size.height, wrapHeight)

        // 但是当预览作品的尺寸为“普通”时，动图的尺寸可能比 wrap 的尺寸小
        // 因为 wrap 显示的普通尺寸是 1200px，但是动图的普通尺寸是 600px
        // 所以我直接让画布使用 wrap 的尺寸了。如果动图比 wrap 小，就会放大到 wrap 的尺寸
        this.width =
          this.wrapWidth || Number.parseInt(this.canvasWrap.style.width)
        this.height =
          this.wrapHeight || Number.parseInt(this.canvasWrap.style.height)
      }

      // 检查是否应该开始播放动画
      // 如果动画的图片总量达到了 30 帧，则等到至少加载了 10 帧之后再开始播放
      // 这样可以减少在刚开始播放时，因可用帧数太少而导致画面看起来抖动（快速循环）的诡异情况
      if (this.meta.frames.length >= 30) {
        this.jpgFileList.length >= 10 && this.startPlay()
      } else if (this.meta.frames.length >= 20) {
        this.jpgFileList.length >= 5 && this.startPlay()
      } else if (this.meta.frames.length >= 10) {
        this.jpgFileList.length >= 4 && this.startPlay()
      } else {
        this.jpgFileList.length >= 1 && this.startPlay()
      }
    }

    // 保存整个压缩包（debug 用）
    // const newFile = new Blob([this.zipContent])
    // const url = URL.createObjectURL(newFile)
    // Utils.downloadFile(url, `${this.id}.zip`)
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

  /** 发送 HEAD 请求，获取 zip 压缩包的体积 */
  private getFileLength(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(this.zipURL, {
        method: 'head',
        credentials: 'same-origin',
      })

      const length = response.headers.get('content-length')
      if (!length) {
        throw reject('getFileLength error: get length failed')
      }

      resolve(Number.parseInt(length))
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

  private loadRangeFileAsBuff(range: string): Promise<ArrayBuffer> {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(this.zipURL, {
        method: 'get',
        headers: {
          range: range,
        },
      })
      const buff = await res.arrayBuffer()
      resolve(buff)
    })
  }

  /**把 ArrayBuffer 追加到已存在的 ArrayBuffer 容器里  */
  private appendBuff(target: ArrayBuffer, newBuff: ArrayBuffer) {
    const totalLength = target.byteLength + newBuff.byteLength
    const uint8 = new Uint8Array(totalLength)
    uint8.set(new Uint8Array(target))
    uint8.set(new Uint8Array(newBuff), target.byteLength)
    return uint8.buffer
  }

  /** 从 zip 文件里提取出所有 jpg 图片的数据 */
  private extractJPGData(file: ArrayBuffer, indexList: number[]) {
    indexList.forEach((number, index, array) => {
      // 如果这是最后一个标记，并且压缩包没有整个加载完成，则不提取最后一个文件的数据
      // 因为此时最后一个文件的数据很可能是破损的
      if (index === array.length - 1 && !this.loadend) {
        return
      }

      // 如果这张图片没有被保存，才会提取它
      // 如果已经有这个图片的数据，就不再提取它，以提高性能
      if (this.jpgFileList[index] === undefined) {
        // 确定要提取的文件的起始位置
        // 从当前文件名之后开始
        const start = number
        // 截止下一个文件名之前
        // 删除不需要的数据：
        // 30 字节的是 zip 文件的数据，虽然没有实际影响，但还是去掉
        // 10 字节的是下一个 jpg 的文件名
        let end = array[index + 1] - 30 - this.jpgNameLength
        if (index === array.length - 1) {
          // 如果是最后一个 jpg 文件，则截止到 zip 文件的结尾
          // 这导致它会包含 zip 的目录数据，但是不会影响图片的显示
          end = file.byteLength
        }
        // slice 方法的 end 不会包含在结果里
        const buffer = file.slice(start, end)
        const blob = new Blob([buffer], {
          type: 'image/jpeg',
        })
        const url = URL.createObjectURL(blob)

        // 下载这张图片（debug 用）
        // Utils.downloadFile(url, `${index}.jpg`)

        const img = new Image(this.width, this.height)
        img.src = url
        this.jpgFileList[index] = {
          img: img,
          delay: this.meta.frames[index].delay,
        }
      }
    })
  }

  private startPlay() {
    if (this.jpgFileList.length > 0 && !this.canvasIsAppend) {
      this.addCanvas()
      this.canvasIsAppend = true
      this.animationID = window.requestAnimationFrame(this.play)
    }
  }

  private addCanvas() {
    const oldCanvas = this.canvasWrap.querySelector('canvas')
    if (oldCanvas) {
      oldCanvas.remove()
    }
    this.canvas.style.display = 'none'
    this.canvasWrap.append(this.canvas)
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  private playIndex = 0
  private playDelay = 0
  private lastPlayTime = 0
  private animationID = 0
  private play = (timestamp: number) => {
    if (this.lastPlayTime === 0) {
      this.lastPlayTime = timestamp
    }

    // 计算自上次执行之后，是否到了该执行下一次动画的时间
    if (timestamp - this.lastPlayTime >= this.playDelay) {
      // 如果要播放的图片尚未加载完成，则等到下一次动画帧再执行
      const img = this.jpgFileList[this.playIndex].img
      if (!img.complete) {
        return (this.animationID = window.requestAnimationFrame(this.play))
      }

      this.canvasCon!.drawImage(img, 0, 0, this.width, this.height)

      // 绘制出第一张图片之后，才能显示 canvas 并隐藏之前的 img
      // 如果过早的隐藏 img 并显示 canvas，会导致闪烁（因为 img 先隐藏，此时 canvas 还没有绘制图像）
      if (this.playIndex === 0) {
        this.canvas.style.display = 'inline-block'
        const img = this.canvasWrap.querySelector('img')
        if (img) {
          img.style.display = 'none'
        }
      }

      this.playDelay = this.jpgFileList[this.playIndex].delay
      this.playIndex++
      if (this.playIndex > this.jpgFileList.length - 1) {
        this.playIndex = 0
      }

      // 记录最后一次执行动画的时间
      this.lastPlayTime = timestamp
    }

    this.animationID = window.requestAnimationFrame(this.play)
  }

  public destroy() {
    this.destroyed = true
    window.cancelAnimationFrame(this.animationID)
    this.canvas.remove()
    this.zipContent = new ArrayBuffer(0)
    this.jpgFileList = []
    this.jpgContentIndexList = []
  }
}

export { PreviewUgoira }
