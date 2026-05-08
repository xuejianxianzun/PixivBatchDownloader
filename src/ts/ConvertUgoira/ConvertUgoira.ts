import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { UgoiraInfo } from '../crawl/CrawlResult'
import { toWebM } from './ToWebM'
import { toWebP } from './ToWebP'
import { toGIF } from './ToGIF'
import { toAPNG } from './ToAPNG'
import { Tools } from '../Tools'
import { states } from '../store/States'
import { Utils } from '../utils/Utils'

// 控制动图转换
class ConvertUgoira {
  constructor() {
    this.setMaxCount()
    this.bindEvents()
  }

  /** 统计有多少个转换任务在同时执行 */
  private _count: number = 0

  /** 同时运行的转换任务的上限 */
  private maxCount = 1

  /** 缓存每个作品的 ImageBitmap 列表，key 为作品 id */
  private readonly imageBitmapCache = new Map<number, ImageBitmap[]>()

  /** 当前正在转换中的作品 id 集合 */
  private readonly convertingIds = new Set<number>()

  /** 保存清理缓存的定时器，key 为作品 id */
  private readonly clearCacheTimers = new Map<number, number>()

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'convertUgoiraThread') {
        this.setMaxCount()
      }
    })

    window.addEventListener(EVT.list.convertSuccess, () => {
      this.complete()
    })
  }

  private setMaxCount() {
    this.maxCount =
      settings.convertUgoiraThread > 0 ? settings.convertUgoiraThread : 1
  }

  private set count(num: number) {
    this._count = num
    EVT.fire('convertChange', this._count)
  }

  /** 生成或从缓存中获取 ImageBitmap 列表 */
  private async getImageBitmapList(
    file: Blob,
    id: number
  ): Promise<ImageBitmap[]> {
    if (this.imageBitmapCache.has(id)) {
      return this.imageBitmapCache.get(id)!
    }

    const zipFileBuffer = await file.arrayBuffer()
    const indexList = Tools.getJPGContentIndex(zipFileBuffer)
    const imageBitmapList = await Tools.extractImage(
      zipFileBuffer,
      indexList,
      'ImageBitmap'
    )
    this.imageBitmapCache.set(id, imageBitmapList)
    return imageBitmapList
  }

  private async start(
    file: Blob,
    info: UgoiraInfo,
    type: 'webm' | 'webp' | 'gif' | 'png',
    id: number
  ): Promise<Blob> {
    while (true) {
      await Utils.sleep(200)
      // 如果已经停止下载，就不添加这个任务，避免浪费资源
      // 此时不用返回真正的 Blob 对象，因为停止下载时，Download 里也不会执行后续操作了
      if (!states.downloading) {
        return '' as any
      }

      if (this._count < this.maxCount) {
        this.count = this._count + 1

        // 把这个 id 添加到转换中的 id 列表里，并取消清理它的缓存的定时器
        this.convertingIds.add(id)
        window.clearTimeout(this.clearCacheTimers.get(id))

        const imageBitmapList = await this.getImageBitmapList(file, id)

        if (type === 'gif') {
          return toGIF.convert(imageBitmapList, info, file.size)
        } else if (type === 'png') {
          return toAPNG.convert(imageBitmapList, info)
        } else if (type === 'webp') {
          return toWebP.convert(imageBitmapList, info)
        } else {
          // 默认使用 webm 格式
          return toWebM.convert(imageBitmapList, info)
        }
      }
    }
  }

  private complete() {
    this.count = this._count - 1
  }

  // 转换成 WebM
  public async webm(file: Blob, info: UgoiraInfo, id: number): Promise<Blob> {
    // WebM 视频的帧延迟不能大于 32767 ms，否则就无法转换成功
    // 其他格式没有这个问题
    info.frames.forEach((frame) => {
      if (frame.delay > 32767) {
        // 直接修改原始数据
        frame.delay = 32767
      }
    })

    // 另一个已知问题：
    // 如果图片高度是奇数，那么视频在播放时可能会在边缘出现一条绿线（视播放器和解码器的情况而定，也可能不会出现绿线）。这是 VP9 编码器的处理方式导致的（对奇数尺寸向下取整），不是下载器的问题，目前我也不打算处理。
    // 例如 https://www.pixiv.net/artworks/144266793 的图片高度为 281 px，就会有这个问题。
    // 原因：
    // 如果图片的宽度或高度是奇数（尤其是高度），VP9/WebM 编码时容易在边缘（通常是底部）出现一条绿线。
    // 这是因为 YUV 4:2:0 格式和 VP9 超级块对齐的要求导致的：
    // 1. 编码器在内部会对奇数尺寸进行对齐处理（最常见的是向下取偶数，如 281 → 280）。
    // 2. 容器中记录的分辨率可能是 281px，但实际编码的图像内容只有 280px。
    // 3. 最后一行（或填充区域）没有有效像素数据，在解码/渲染时就表现为绿色条。
    // 这不是 bug，而是视频编码的常见兼容性问题（H.264/H.265 也有类似要求）。
    // 播放器渲染链路（尤其是某些内置解码器 + Renderer）处理 padding 不够完美时，就会露出绿线。

    const blob = await this.start(file, info, 'webm', id)
    this.clearCache(id)
    return blob
  }

  // 转换成 WebP
  public async webp(file: Blob, info: UgoiraInfo, id: number): Promise<Blob> {
    const blob = await this.start(file, info, 'webp', id)
    this.clearCache(id)
    return blob
  }

  // 转换成 GIF
  public async gif(file: Blob, info: UgoiraInfo, id: number): Promise<Blob> {
    const blob = await this.start(file, info, 'gif', id)
    this.clearCache(id)
    return blob
  }

  // 转换成 APNG
  public async apng(file: Blob, info: UgoiraInfo, id: number): Promise<Blob> {
    const blob = await this.start(file, info, 'png', id)
    this.clearCache(id)
    return blob
  }

  /** 从转换中列表移除 id，并在一定时间后清理不再使用的 ImageBitmap 缓存 */
  private clearCache(id: number) {
    this.convertingIds.delete(id)

    // 延迟一定时间，检查不再使用的 id，并清除其缓存。
    // 因为一个 id 可能需要执行多次转换格式的操作，所以在一次转换任务完成后，可能接下来还要使用缓存。因此不能立刻清除缓存，而是需要等一段时间，等可能的后续转换任务也完成了之后再清除缓存。
    window.clearTimeout(this.clearCacheTimers.get(id))
    this.clearCacheTimers.set(
      id,
      window.setTimeout(() => {
        if (!this.convertingIds.has(id)) {
          // console.log(`clear ${id}`)
          const bitmaps = this.imageBitmapCache.get(id)
          if (bitmaps) {
            bitmaps.forEach((bitmap) => bitmap.close())
          }
          this.imageBitmapCache.delete(id)
          this.clearCacheTimers.delete(id)
        }
      }, 10000)
    )
  }
}

const convertUgoira = new ConvertUgoira()
export { convertUgoira }
