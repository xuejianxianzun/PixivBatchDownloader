import { Utils } from '../utils/Utils'

// 检查图片是否是黑白图片
// 获取图片中 rgb 三色的平均值，如果很接近就判断为黑白图片
// 这是一个不太可靠的方法，在少数情况下，彩色图片可能会被误判为黑白图片
class BlackAndWhiteImage {
  private readonly latitude = 1 // 宽容度

  public async check(imgUrl: string): Promise<boolean> {
    // 加载图片
    let img: HTMLImageElement
    try {
      img = await this.loadImg(imgUrl)
    } catch (error) {
      // loadImg 失败时返回的 reject 会在这里被捕获
      // 直接把这个图片视为彩色图片
      return false
    }

    const imgData = this.getImageData(img)
    // 把图片的像素分为 4 份，依次检查它们的色彩
    const pixel = img.width * img.height
    const part = 4
    // 计算每一份有多少字节。由于像素数量可能不是 4 的整数倍，所以向下舍入
    let eachLength = Math.floor(pixel / part) * 4
    let times = 0

    while (times < part) {
      const start = times * eachLength
      times++
      const end = times * eachLength
      const bool = this.getResult(imgData, start, end)
      // 如果某一部分是彩色图片，就直接返回结果，把整个图片视为彩色图片
      // 如果这一部分是黑白图片，则继续检查下一部分
      if (!bool) {
        return false
      }
    }

    // 因为彩色图片会短路返回，所以执行到这里意味着所有部分都是黑白图片
    return true
  }

  private async loadImg(url: string): Promise<HTMLImageElement> {
    return new Promise(async (resolve, reject) => {
      // 如果传递的是 blobURL 就直接使用
      if (url.startsWith('blob')) {
        resolve(Utils.loadImg(url))
      } else {
        // 不是 blobURL 的话先获取图片
        const res = await fetch(url).catch((error) => {
          // fetch 加载图片可能会失败 TypeError: Failed to fetch
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

  private getImageData(img: HTMLImageElement) {
    const width = img.width
    const height = img.height

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const con = canvas.getContext('2d')!
    con.drawImage(img, 0, 0)
    const imageData = con.getImageData(0, 0, width, height)

    return imageData.data
  }

  /**计算 r g b 三种颜色的平均值，判断是否是黑白图片
   *
   * 返回值 true 为黑白图片，false 为彩色图片
   */
  private getResult(imgData: Uint8ClampedArray, start: number, end: number) {
    // 把 R G B 值分别相加
    let r = 0
    let g = 0
    let b = 0

    const totalLength = end - start
    while (start < end) {
      r += imgData[start]
      g += imgData[start + 1]
      b += imgData[start + 2]
      start = start + 4
    }

    // 求平均值，并取整
    const pixel = totalLength / 4
    r = Math.round(r / pixel)
    g = Math.round(g / pixel)
    b = Math.round(b / pixel)

    // 如果 rgb 值相同则是黑白图片
    if (r === g && g === b) {
      return true
    } else {
      // 如果 rgb 值不相同，则根据宽容度判断是否为黑白图片
      // 因为获取 rgb 的结果时，进行了四舍五入，即使 rgb 非常接近，也可能会相差 1，所以我设置了一个宽容度
      const max = Math.max(r, g, b) // 取出 rgb 中的最大值
      const min = max - this.latitude // 允许的最小值
      // 如果 rgb 三个数值与最小的数值相比，差距都在宽容度之内，则视为黑白图片
      return [r, g, b].every((number) => {
        return number >= min
      })
    }
  }
}

const blackAndWhiteImage = new BlackAndWhiteImage()
export { blackAndWhiteImage }
