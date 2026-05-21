import { API } from '../API'
import { Config } from '../Config'
import { ArtworkData, NovelData } from '../crawl/CrawlResult'

// 本程序有多个模块需要在抓取流程之外获取作品数据
// 为了避免重复发起请求，所以在这里缓存一些作品数据
// 还有个原因：即使下载器获取过某个作品的数据，但是以后再次请求时，浏览器也有可能不会读取缓存，而是重新发起请求。使用缓存的数据可以避免重复发起请求
class CacheWorkData {
  private readonly max = Config.mobile ? 1000 : 6000
  // max 的值是个粗略的数字，并没有预设使用场景
  // 一个图像作品的数据大约是 5 KB
  // 小说的数据通常更大，因为包含了小说的正文
  // 在一次抓取中，缓存满了 6000 个小说，cache 对象的内存占用为 204 MiB，平均每篇小说的原始 JSON 数据的内存占用为 35 KiB
  private cache: (ArtworkData | NovelData)[] = []
  /** 保存正在使用 API 获取数据的作品 ID，避免重复发送请求 */
  private pendingIds = new Set<string>()

  public set(data: ArtworkData | NovelData) {
    if (this.has(data.body.id)) {
      return
    }
    if (this.cache.length >= this.max) {
      this.cache.shift()
    }
    this.cache.push(data)
  }

  /* 默认只查找 ArtworkData 类型的数据
   *
   * 如果要获取 NovelData，就必须设置 type 为 'novel'
   */
  public get(id: string): ArtworkData | undefined
  public get(id: string, type: 'artwork'): ArtworkData | undefined
  public get(id: string, type: 'novel'): NovelData | undefined
  public get(
    id: string,
    type: 'artwork' | 'novel'
  ): ArtworkData | NovelData | undefined
  public get(id: string, type: 'novelSeries'): undefined
  public get(
    id: string,
    type: 'artwork' | 'novel' | 'novelSeries' = 'artwork'
  ) {
    if (type === 'novelSeries') {
      return undefined
    }

    return this.cache.find((val) => {
      const key: 'illustType' | 'content' =
        type === 'novel' ? 'content' : 'illustType'
      return val.body.id === id && key in val.body
    })
  }

  /** 如果缓存里有这份数据就返回，否则获取数据再返回。
   *
   * 注意：
   *
   * 1. 如果多个模块同时请求同一份数据，使用这个方法只会发起一次请求，可以避免重复请求
   *
   * 2. get 方法可以用来判断数据是否存在，这个方法不行，它没有判断的作用，因为它总是会获取数据
   *
   * 3. 这个方法没有在请求之间添加间隔时间，所以在有连续多个请求的场景里使用时，可能会导致请求太过频繁。此时调用方应该自己添加间隔时间，控制调用频率。
   */
  public getWorkDataAsync(
    id: string,
    type: 'artwork',
    unlisted?: boolean
  ): Promise<ArtworkData>
  public getWorkDataAsync(
    id: string,
    type: 'novel',
    unlisted?: boolean
  ): Promise<NovelData>
  public getWorkDataAsync(
    id: string,
    type: 'artwork' | 'novel',
    unlisted?: boolean
  ): Promise<ArtworkData | NovelData>
  public async getWorkDataAsync(
    id: string,
    type: 'artwork' | 'novel',
    unlisted = false
  ) {
    if (!id) {
      throw new Error('id is falsy')
    }

    const cache = this.get(id, type)
    if (cache) {
      return cache
    }

    if (this.pendingIds.has(id)) {
      // 如果正在获取这份数据，就等一段时间后再尝试获取
      await new Promise((resolve) => setTimeout(resolve, 50))
      return this.getWorkDataAsync(id, type as any, unlisted)
    }

    this.pendingIds.add(id)

    const func =
      type === 'artwork' ? 'getArtworkData' : ('getNovelData' as const)
    try {
      const data = await API[func](id, unlisted)
      this.set(data)
      return data
    } finally {
      this.pendingIds.delete(id)
    }
  }

  public has(id: string) {
    return this.cache.some((val) => val.body.id === id)
  }
}

const cacheWorkData = new CacheWorkData()
export { cacheWorkData }
