import { Utils } from '../utils/Utils'

// 检查图片是否是黑白图片
// 获取图片中 rgb 三色的平均值，如果很接近就判断为黑白图片。这是一个不保证准确的方法
class BlackAndWhiteImage {
  private readonly latitude = 1 // 宽容度

  public async check(imgUrl: string): Promise<boolean> {
    try {
      const img = await this.loadImg(imgUrl)
      const first = this.getResult(this.getColor(img))
      return first
      // 当判断结果是彩色图片的时候，基本不会是误判。但如果结果是黑白图，可能存在误判
    } catch (error) {
      // loadImg 失败时 reject 会在被这里捕获
      // 直接把这个图片判断为彩色图片
      return false
    }
  }

  // 加载图片
  private async loadImg(url: string): Promise<HTMLImageElement> {
    return new Promise(async (resolve, reject) => {
      // 如果传递的是 blobURL 就直接使用
      if (url.startsWith('blob')) {
        resolve(Utils.loadImg(url))
      } else {
        const res = await fetch(url).catch((error) => {
          console.log(error)
          console.log(`Load image error! url: ${url}`)
        })
        // 如果 fetch 加载图片失败，res 会是 undefined
        if (!res) {
          return reject()
        }
        const blob = await res.blob()
        const blobURL = URL.createObjectURL(blob)
        resolve(Utils.loadImg(blobURL))
      }
    })
  }

  // 获取图片中 rgb 三色的平均值
  private getColor(img: HTMLImageElement) {
    const width = img.width
    const height = img.height

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const con = canvas.getContext('2d')!
    con.drawImage(img, 0, 0)
    const imageData = con.getImageData(0, 0, width, height)

    const data = imageData.data

    let r = 0
    let g = 0
    let b = 0

    // 取所有像素的平均值
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        r += data[(width * row + col) * 4]
        g += data[(width * row + col) * 4 + 1]
        b += data[(width * row + col) * 4 + 2]
      }
    }

    // 求取平均值
    r /= width * height
    g /= width * height
    b /= width * height

    // 将最终的值取整
    r = Math.round(r)
    g = Math.round(g)
    b = Math.round(b)

    return [r, g, b]
  }

  // 根据 rgb 的值，判断是否是黑白图片
  private getResult(rgb: number[]) {
    const [r, g, b] = rgb
    // 如果 rgb 值相同则是黑白图片
    if (r === g && g === b) {
      return true
    } else {
      // 如果 rgb 值不相同，则根据宽容度判断是否近似为黑白图片
      // 这是因为获取 rgb 的结果时，进行了四舍五入，即使 rgb 非常接近，也可能会相差 1（未论证）
      const max = Math.max(r, g, b) // 取出 rgb 中的最大值
      const min = max - this.latitude // 允许的最小值
      // 如果 rgb 三个数值与最大的数值相比，差距在宽容度之内，则检查通过
      return [r, g, b].every((number) => {
        return number >= min
      })
    }
  }
}

const blackAndWhiteImage = new BlackAndWhiteImage()
export { blackAndWhiteImage }
