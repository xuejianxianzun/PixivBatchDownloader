import { ArtworkData, NovelData } from '../crawl/CrawlResult'

// 本程序有多个模块需要在抓取流程之外获取作品数据
// 为了避免重复发起请求，所以在这里缓存一些作品数据
// 还有个原因：即使下载器获取过某个作品的数据，但是以后再次请求时，浏览器也有可能不会读取缓存，而是重新发起请求。使用缓存的数据可以避免重复发起请求
class CacheWorkData {
  private cache: (ArtworkData | NovelData)[] = []
  // max 的值是个粗略的数字，并没有预设使用场景
  private readonly max = 6000
  // 一个图像作品的数据大约是 5 KB
  // 小说的数据通常更大，因为包含了小说的正文。通常是几十 KB

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
  public get(id: string, type: 'artwork' | 'novel' = 'artwork') {
    return this.cache.find((val) => {
      const key: 'illustType' | 'content' =
        type === 'novel' ? 'content' : 'illustType'
      return val.body.id === id && key in val.body
    })
  }

  public has(id: string) {
    return this.cache.some((val) => val.body.id === id)
  }
}

const cacheWorkData = new CacheWorkData()
export { cacheWorkData }
