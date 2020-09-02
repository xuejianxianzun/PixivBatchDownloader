// 把图片转换成 icon 文件
// icon 文件结构 https://www.cnblogs.com/cswuyg/p/3603707.html

type SizeNumber = 16 | 32 | 48 | 96 | 128 | 256 | 512

type ImageURL = string

interface Opt {
  source: ImageURL | File
  size: SizeNumber[]
  shape: 'square' | 'circle' | 'fillet'
  bleed: boolean
}

interface PngData {
  size: SizeNumber
  buffer: ArrayBuffer
}

// 输入选项
// source 图片的 url，或者一个图片文件（如果使用了图片 url，请注意跨域策略的影响）
// size 尺寸，可以同时使用多个尺寸。你也可以使用自定义尺寸。
// shape 指定图标的形状。square 正方形，circle 圆形，fillet 带有圆角的正方形
// bleed 留白，仅当形状是圆角正方形时生效，可以使图片周围有一些留白。

// 输出
// 转换成功后，返回 icon 文件的 Blob 对象
// 生成的 icon 总是正方形（长和宽相等）。如果图片的长度和宽度不相等，则会以窄边作为基准，从窄边开始裁剪出一个正方形
// 生成的 icon 可以包含多种尺寸的图标。图标都是 32 位 png 图像。

class ImageToIcon {
  public async convert(opt: Opt) {
    return new Promise<Blob>(async (resolve, reject) => {
      // 加载图片
      const img = await this.loadImage(opt.source)
      // 生成各尺寸的 png 图像的数据
      const pngDataArray = await this.createPngBuffer(
        img,
        opt.size,
        opt.shape,
        opt.bleed
      )
      // 创建 ico 文件
      const blob = this.createIcon(pngDataArray)

      resolve(blob)
    })
  }

  private async convertImageURL(source: Opt['source']) {
    return new Promise<string>(async (resolve, reject) => {
      if (typeof source === 'string') {
        // 请求图片，并为其生成 BlobURL，解决图片跨域导致 canvas 污染的问题
        const res = await fetch(source, {
          method: 'get',
          credentials: 'same-origin',
        })
        const blob = await res.blob()
        resolve(URL.createObjectURL(blob))
      } else if (source instanceof File) {
        resolve(URL.createObjectURL(source))
      } else {
        reject('Unrecognized opt.source')
      }
    })
  }

  private async loadImage(source: Opt['source']) {
    return new Promise<HTMLImageElement>(async (resolve, reject) => {
      let imgURL = await this.convertImageURL(source)

      const i = document.createElement('img')
      i.src = imgURL
      i.onload = function () {
        resolve(i)
      }
    })
  }

  private async createPngBuffer(
    img: HTMLImageElement,
    size: SizeNumber[] = [16, 48, 96, 256],
    shape: Opt['shape'] = 'square',
    bleed = true
  ) {
    return new Promise<PngData[]>(async (resolve, reject) => {
      const buffer: PngData[] = []
      let length = size.length

      while (length > 0) {
        const sizeNumber = size[size.length - length]
        const canvas = this.createCanvas(sizeNumber, img)
        // 绘制图像
        this.drawImage(canvas, img, shape, bleed)
        // 把图像转换为 png 图像
        const pngBlob = await this.getPngBlob(canvas)
        // 获取 png 图像的 buffer
        const buf = await pngBlob.arrayBuffer()
        buffer.push({
          size: sizeNumber,
          buffer: buf,
        })

        length--

        if (length === 0) {
          resolve(buffer)
        }
      }
    })
  }

  private createCanvas(size: number, img: HTMLImageElement) {
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    return c
  }

  private drawImage(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    shape: Opt['shape'],
    bleed = true
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('draw error: ctx is null')
      return
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 计算图像被绘制的宽高。比较短的一边占满画布，比较长的一边则根据比例计算绘制的部分
    let dw = 0
    let dh = 0
    // 竖图
    if (img.naturalWidth < img.naturalHeight) {
      dw = canvas.width
      dh = (dw / img.naturalWidth) * img.naturalHeight
    } else {
      // 横图
      dh = canvas.height
      dw = (dh / img.naturalHeight) * img.naturalWidth
    }

    // 绘制方形
    if (shape === 'square') {
      ctx.drawImage(img, 0, 0, dw, dh)
    }

    // 绘制圆形
    if (shape === 'circle') {
      let circle = {
        x: canvas.width / 2,
        y: canvas.width / 2,
        r: canvas.width / 2,
      }
      ctx.save()
      ctx.beginPath()
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false)
      ctx.clip()
      ctx.drawImage(img, 0, 0, dw, dh)
      ctx.restore()
    }

    // 绘制圆角矩形
    if (shape === 'fillet') {
      let x = 0
      let y = 0
      // 当图标尺寸大于 16 时，设置留白距离
      if (bleed && canvas.width > 16) {
        let num = 10 / 256 // 规定留白的比例，即尺寸为 256 时四周留白均为 10 px
        x = Math.ceil(num * canvas.width)
        y = Math.ceil(num * canvas.width)
      }
      // 去掉留白后，最后要保存的图片区域的宽高
      const w = canvas.width - x * 2
      const h = canvas.height - y * 2
      // 圆角的半径，设置为保留区域宽高的 1/8
      const r = Math.floor(w / 8)

      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, 0, 0, dw, dh)
    }

    return ctx
  }

  private async getPngBlob(canvas: HTMLCanvasElement) {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject('blob is null')
        } else {
          resolve(blob)
        }
      })
    })
  }

  private createIcon(pngData: PngData[]) {
    const fileData: ArrayBuffer[] = []

    const fileHeadSize = 6

    // icon 文件头
    const fileHead = new ArrayBuffer(fileHeadSize)
    const v1 = new DataView(fileHead)
    v1.setInt16(0, 0, true) // idReserved
    v1.setInt16(2, 1, true) // idType
    v1.setInt16(4, pngData.length, true) // idCount
    fileData.push(fileHead)

    // 添加 icon 文件入口
    const entrySize = 16
    const entryTotalSize = entrySize * pngData.length
    let fileOffset = fileHeadSize + entryTotalSize
    let fileLength = 0

    for (const d of pngData) {
      fileOffset += fileLength

      const entry = new ArrayBuffer(entrySize)
      const v2 = new DataView(entry)
      v2.setInt8(0, d.size) // Width, in pixels, of the image
      v2.setInt8(1, d.size) // Height, in pixels, of the image
      v2.setInt8(2, 0) // Number of colors in image (0 if >=8bpp)
      v2.setInt8(3, 0) // Reserved ( must be 0)
      v2.setInt16(4, 1, true) // Color Planes
      v2.setInt16(6, 32, true) // Bits per pixel
      v2.setInt32(8, d.buffer.byteLength, true) // How many bytes in this resource?
      v2.setInt32(12, fileOffset, true) // Where in the file is this image?

      fileData.push(entry)

      fileLength = d.buffer.byteLength
    }

    // 添加 png 数据
    for (const d of pngData) {
      fileData.push(d.buffer)
    }

    // 生成 blob 对象
    return new Blob(fileData, {
      type: 'image/vnd.microsoft.icon',
    })
  }
}

const img2ico = new ImageToIcon()
export { img2ico }
