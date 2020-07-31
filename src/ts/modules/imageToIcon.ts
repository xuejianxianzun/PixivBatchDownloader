// 传入图片 url，转换成 icon 文件。这是给下载器使用的，所以功能比较简单。
// icon 文件结构 https://www.cnblogs.com/cswuyg/p/3603707.html

interface Opt {
  source: string | HTMLImageElement
  size: 0 | 16 | 32 | 48 | 96 | 128 | 256 | 512
  shape: 'square' | 'circle' | 'fillet'
}

// 输入选项
// source 可以传入一个图片的 url，或者一个已加载完成的 img 元素
// size 指定图标尺寸。0 会让程序自行选择一个最接近的标准尺寸。例如图片宽度是 120 则会使用 96 的尺寸。
// shape 指定图标的形状。square 正方形，circle 圆形，fillet 带有圆角的正方形

// 输出
// 转换成功后，返回 icon 文件的 Blob 对象
// 生成的 icon 总是正方形。如果图片的长度和宽度不相等，则会以窄边作为宽度，从图片的起点裁剪出一个正方形
// 生成的 icon 只会包含一个图标，而不是多个尺寸的多个图标。图标是 32 位 png 图像。

class ImageToIcon {
  public async convert(opt: Opt) {
    return new Promise<Blob>(async (resolve, reject) => {
      // 加载图片
      const img = await this.loadImage(opt.source)
      // 创建画布
      const canvas = this.createCanvas(opt.size, img)
      // 绘制图像
      const ctx = this.draw(canvas, img, opt.shape)
      // 把图像转换为 png 图像
      const pngBlob = await this.getPngBlob(canvas)
      // 获取 png 图像的 buffer
      const buffer = await pngBlob.arrayBuffer()
      // 创建 ico 文件
      const blob = this.createIco(canvas.width, canvas.height, buffer)

      resolve(blob)
    })
  }

  private async loadImage(source: string | HTMLImageElement) {
    return new Promise<HTMLImageElement>(async (resolve, reject) => {
      if (typeof source === 'string') {
        // 请求图片，并为其生成 BlobURL，解决图片跨域导致 canvas 污染的问题
        const res = await fetch(source, {
          method: 'get',
          credentials: 'include',
        })
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        // 创建 img 元素
        const i = document.createElement('img')
        i.src = url
        i.onload = function () {
          resolve(i)
        }
      } else if (source.nodeName === 'IMG') {
        // 直接提供的 img 元素如果其图片是跨域的话，也会有  canvas 污染问题
        resolve(source)
      } else {
        reject('Unrecognized opt.source')
      }
    })
  }

  private createCanvas(size: number, img: HTMLImageElement) {
    // 确定画布尺寸
    if (size === 0) {
      // 使用窄边的长度作为画布尺寸
      if (img.naturalWidth < img.naturalHeight) {
        size = img.naturalWidth
      } else {
        size = img.naturalHeight
      }
      // 使用最接近窄边长度的标准尺寸
      const sizeList = [16, 32, 48, 96, 128, 256, 512]
      for (const num of sizeList) {
        if (size >= num) {
          size = num
        } else {
          break
        }
      }
    }

    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    return c
  }

  private draw(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    shape: Opt['shape']
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
      if (canvas.width > 16) {
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
      ctx.drawImage(img, 0, 0, 256, 256)
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

  private createIco(width: number, height: number, pngBuffer: ArrayBuffer) {
    // ico 文件头
    const fileHead = new ArrayBuffer(6)
    const v1 = new DataView(fileHead)
    v1.setInt16(0, 0, true) // idReserved
    v1.setInt16(2, 1, true) // idType
    v1.setInt16(4, 1, true) // idCount  目前只保存 1 个图标资源

    // 描述图标数据。因为只有 1 个图标资源所以只有 1 份数据
    const imgDataHead = new ArrayBuffer(16)
    const v2 = new DataView(imgDataHead)
    v2.setInt8(0, width) // Width, in pixels, of the image
    v2.setInt8(1, height) // Height, in pixels, of the image
    v2.setInt8(2, 0) // Number of colors in image (0 if >=8bpp)
    v2.setInt8(3, 0) // Reserved ( must be 0)
    v2.setInt16(4, 1, true) // Color Planes
    v2.setInt16(6, 32, true) // Bits per pixel
    v2.setInt32(8, pngBuffer.byteLength, true) // How many bytes in this resource?
    v2.setInt32(12, 22, true) // Where in the file is this image?

    // 生成 blob 对象
    return new Blob([fileHead, imgDataHead, pngBuffer], {
      type: 'image/vnd.microsoft.icon',
    })
  }
}

const img2ico = new ImageToIcon()
export { img2ico }
