import { ArtworkData } from '../crawl/CrawlResult'

// 本程序有多个模块需要在抓取流程之外获取作品数据
// 为了避免重复发起请求，以及解决浏览器有时候不读取缓存的问题，所以在这里缓存一些作品数据
// 即使下载器获取过某个作品的数据，但是以后再次请求时，浏览器也有可能不会读取缓存，而是重新发起请求。
class CacheWorkData {
  private cache: ArtworkData[] = []
  // 一个图像作品的数据大约是 5 KB
  private readonly max = 100

  public set(data: ArtworkData) {
    if (this.has(data.body.id)) {
      return
    }
    if (this.cache.length >= this.max) {
      this.cache.shift()
    }
    this.cache.push(data)
  }

  public get(id: string) {
    return this.cache.find((val) => val.body.id === id)
  }

  public has(id: string) {
    return this.cache.some((val) => val.body.id === id)
  }
}

const cacheWorkData = new CacheWorkData()
export { cacheWorkData }
