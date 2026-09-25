import { settings } from '../setting/Settings'
import { Utils } from '../utils/Utils'

// 检查图片是否是黑白图片
//
// 判定方法：统计「有颜色的像素」在非白色像素里的占比。有颜色的像素指彩度达到 pixelChroma 的像素，
// 这个占比超过设置项 coloredRatio 就判定为彩色图片。
// 用真实图片校准过：其中黑白图片里的彩色像素占比最大约 22%，而彩色图片里占比最小的一张约 28%，
// 所以设置项的默认值取 25。
//
// 为什么要把白色背景排除掉：人眼判断一张图片是不是彩色图片时，往往会忽略白色背景，
// 只在非白色的像素里去判断。所以白色背景占多少并不重要，重要的是非白色像素里有多少是彩色的。
// 实测这样做之后，误判的数量从 10 个降到 2 个（180 张真实图片）。
//
// 这个占比对颜色的浓淡不敏感，也不受局部颜色特别鲜艳的影响：
// 大面积粉彩、黑白插画上的一小块浓色，都能被如实反映。
// 不再使用「全图平均彩度」是因为它约等于「着色面积 × 颜色浓度」：一块鲜艳的颜色即使面积不大，
// 也能把平均彩度拉得很高，反而会把「黑白为底 + 局部鲜艳颜色」的图片误判成彩色图片。
// 而且「平均彩度」会被画师的用色习惯带偏（同样的图，涂成淡彩或浓彩会得到相反的结论）。
//
//测试用例：这个作品有 5 张图片，前三张是彩色的，后两张是黑白的。
// https://www.pixiv.net/artworks/150109760
//
// 测试用例：白色背景+彩色文字。由于下载器在判断时会去掉白色背景，所以可以正确识别为彩色图片。
// https://www.pixiv.net/artworks/149739527
//
// 测试用例：该用户的图片大多数都是黑白图片，但角色的眼睛是彩色的，有时在背景上也有些色块点缀。需要能把此类图片识别为黑白图片。
// https://www.pixiv.net/users/117954156
// 测试用例：这张图片大部分是黑白的，有部分彩色，但彩色占比不算多，所以把它视为黑白图片。
// https://www.pixiv.net/artworks/148126288
//
// 黑白图片被认为是彩色：
// 有些黑白图片里的彩色占比较大。这是一个比较模糊的界限，把它们视为彩色或黑白皆可。
// 虽然我觉得它们更倾向于黑白图片，但下载器无法做到完全准确的判断。现在把它们判断为彩色是可以接受的
// https://www.pixiv.net/artworks/149732208
// https://www.pixiv.net/artworks/146678818
// 这张图片看起来是灰色的，但整体是偏蓝的很浅的蓝灰色，会被视为彩色图片：
// https://www.pixiv.net/artworks/147846365
//
// 彩色图片被认为是黑白：
// 这个作品的第一张图片我倾向于彩色，但因为环境光太暗，背景里也有很多黑色区域。使用默认设置时会被判断为黑白图片：
// https://www.pixiv.net/artworks/149108301
// 这个作品有大片的黑色背景，彩色内容占比少。使用默认设置时会被判断为黑白图片：
// https://www.pixiv.net/artworks/147983797
// 以上测试都通过了。
class BlackAndWhiteImage {
  /** 单个像素的彩度阈值。彩度达到这个值，就认为这个像素有颜色 */
  // 这个值取得比较低，是为了让低饱和度的淡彩（例如粉彩、浅色皮肤）也能被算作有颜色
  // 这个阈值越低，越容易把淡彩算作有颜色的像素
  // 备注：彩度是这个像素的 R G B 三色的极差（最大值减最小值）。
  // 灰阶像素的 R G B 相等，彩度为 0；颜色越鲜艳，彩度越大（最大 255）。
  private readonly pixelChroma = 10

  /** 检查图片时使用的最大边长。更大的图片会先缩小，以免消耗过多的时间和内存 */
  private readonly maxSize = 256

  /** 被视为白色背景的阈值。一个像素的 R G B 三个值都大于这个值时，认为它是白色背景 */
  // 白色背景不参与检查，因为人眼判断图片是不是彩色图片时，往往会忽略白色背景
  private readonly whiteValue = 250

  /** alpha 低于这个值的像素被视为透明像素，不参与检查 */
  private readonly alphaThreshold = 16

  /** 检查图片是否为黑白图片。返回值 true 表示它是黑白图片，false 是彩色图片 */
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

    return !this.isColorImage(imgData)
  }

  private async loadImg(url: string): Promise<HTMLImageElement> {
    // 如果传递的是 blobURL 就直接使用
    if (url.startsWith('blob')) {
      return Utils.loadImg(url)
    } else {
      // 不是 blobURL 的话先获取图片
      const res = await fetch(url).catch((error) => {
        // fetch 加载图片可能会失败 TypeError: Failed to fetch
        console.log(`Load image error! url: ${url}`)
      })
      // 如果 fetch 加载图片失败
      if (!res || !res.ok) {
        throw new Error(`Failed to load image! url: ${url}`)
      }
      const blob = await res.blob()
      const blobURL = URL.createObjectURL(blob)
      // 图片加载完成之后释放 blobURL，避免抓取大量图片时堆积许多 blobURL 占用内存
      return Utils.loadImg(blobURL).then((img) => {
        URL.revokeObjectURL(blobURL)
        return img
      })
    }
  }

  /** 把图片绘制到 canvas 上，获取它的像素数据 */
  private getImageData(img: HTMLImageElement): Uint8ClampedArray {
    // 图片可能是原图，尺寸很大（下载文件时传入的就是原图的 blobURL）。
    // 这里按比例缩小尺寸过大的图片，因为检查整张原图需要的时间和内存都比较多
    const scale = Math.min(1, this.maxSize / Math.max(img.width, img.height))
    const width = Math.max(1, Math.round(img.width * scale))
    const height = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const con = canvas.getContext('2d')!
    con.drawImage(img, 0, 0, width, height)
    const imageData = con.getImageData(0, 0, width, height)

    return imageData.data
  }

  /** 检查像素数据是否来自彩色图片。返回值 true 为彩色图片，false 为黑白图片 */
  private isColorImage(imgData: Uint8ClampedArray): boolean {
    // 设置里的数值是百分数，所以在这里除以 100
    const ratio = settings.coloredRatio / 100
    const pixel = imgData.length / 4

    // 非白色像素的数量要检查完所有像素之后才能确定，所以这里先用全部像素的数量算一个上限，
    // 用来提前结束检查：非白色像素不会多于全部像素，所以「彩色像素 ÷ 全部像素」已经超过阈值时，
    // 「彩色像素 ÷ 非白色像素」必然也超过阈值
    const coloredLimitForAll = pixel * ratio

    // 非白色、非透明的像素数量
    let total = 0
    let colored = 0

    for (let i = 0; i < imgData.length; i = i + 4) {
      // 透明像素没有颜色，不参与检查
      if (imgData[i + 3] < this.alphaThreshold) {
        continue
      }

      const r = imgData[i]
      const g = imgData[i + 1]
      const b = imgData[i + 2]
      // 用 R G B 的极差表示这个像素的彩度
      const max = r > g ? (r > b ? r : b) : g > b ? g : b
      const min = r < g ? (r < b ? r : b) : g < b ? g : b

      // 白色背景不参与检查
      if (min > this.whiteValue) {
        continue
      }
      total++

      if (max - min >= this.pixelChroma) {
        colored++
        if (colored > coloredLimitForAll) {
          return true
        }
      }
    }

    // 整张图片都是白色背景或透明像素时，视为黑白图片
    if (total === 0) {
      return false
    }

    // 只比较非白色像素里彩色像素的占比
    return colored / total > ratio
  }
}

const blackAndWhiteImage = new BlackAndWhiteImage()
export { blackAndWhiteImage }
