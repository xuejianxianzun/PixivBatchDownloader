import { EVT } from '../EVT'
import { API } from '../API'
import { log } from '../Log'
import { store } from '../store/Store'
import { NovelSeriesGlossary } from '../crawl/CrawlResult'
import { lang } from '../Language'

/** 本地存储里，每个系列的数据 */
interface NovelReplaceWordSettings {
  words: {
    // 替换项的 id
    id: string
    // 用户设置的替换词
    word: string
  }[]
  loadTime: number
}

/** 本地存储里，所有系列的数据。key 是系列 id */
type NovelReplaceWordSettingsStore = Record<string, NovelReplaceWordSettings>

/** 一个替换项的完整数据 */
interface ReplaceWord {
  // 替换项的 id
  id: string
  // 原始单词
  rawWord: string
  // 用户设置的替换词
  word: string
}

/** 替换小说里可置换的单词 */
// 文档：notes/小说里置换单词的细节.md
class ReplaceNovelWords {
  constructor() {
    // 在每次开始下载时，重新获取本地存储里的置换单词配置，这样如果用户修改了此项配置，就可以获取到新的配置
    window.addEventListener(EVT.list.downloadStart, () => {
      this.reset()
    })
  }

  /** 是否需要重新读取本地存储里的置换单词配置 */
  private needGetUserData = true

  /** 本地存储里的置换单词配置。如果为 null，表示未获取，或者本地存储里没有这项数据 */
  private userData: NovelReplaceWordSettingsStore | null = null

  /** 每个系列已经解析好的替换词列表。key 是系列 id，value 是替换词列表 */
  private replaceWordMap = new Map<string, ReplaceWord[]>()

  /** 保存每个系列正在进行中的解析请求，用来避免一个系列 id 发送多次请求 */
  private requestMap = new Map<string, Promise<ReplaceWord[]>>()

  /** 下载批次变化时递增，用来丢弃旧请求的结果 */
  private generation = 0

  private reset() {
    this.generation++
    this.needGetUserData = true
    this.userData = null
    this.replaceWordMap.clear()
    this.requestMap.clear()
  }

  /** 接收系列 id 和小说正文文本，如果有对应的置换词就替换后返回 */
  public async replace(
    seriesId: string | number | null | undefined,
    content: string
  ) {
    if (seriesId === undefined || seriesId === null || content === '') {
      return content
    }

    const replaceWordList = await this.getReplaceWordList(seriesId)
    if (replaceWordList.length === 0) {
      return content
    }

    let result = content
    for (const item of replaceWordList) {
      // 注意：不要替换 [] 及其内部的文字。这是因为内嵌的图片、分页标记等都是通过 [] 来标记的，如 [uploadedimage:13309543]。如果替换 [] 内的文字，可能导致标记里的部分文字被替换，从而变成错误的标记。这可能导致内嵌的图片的 id 发生变化，进而导致下载图片时失败。
      // 这个正则的作用：第一部分（ | 前面的）匹配  [...] 文本
      // 第二部分（ | 后面的）匹配普通文字
      // 这样就能把 [] 内的文字和普通文字分开，分别处理
      // 之后遍历匹配结果，不替换以 [ 开头的文本，只替换普通文字
      result = result.replace(/(\[[^\[\]]*]|[^\[\]]+)/g, (text) => {
        if (text.startsWith('[')) {
          return text
        }
        const logKey = item.rawWord + ' ' + item.word
        log.log(lang.transl('_已置换单词', item.rawWord, item.word), logKey)
        return text.replaceAll(item.rawWord, item.word)
      })
    }
    return result
  }

  /** 获取当前登录用户保存的置换单词配置 */
  private async getUserData() {
    if (!this.needGetUserData) {
      return this.userData
    }

    this.needGetUserData = false

    const userId = store.loggedUserID
    if (!userId) {
      this.userData = null
      return this.userData
    }

    const storeName = `novel_series_glossary_${userId}`
    const value = localStorage.getItem(storeName)
    if (!value) {
      this.userData = null
      return this.userData
    }

    try {
      this.userData = JSON.parse(value) as NovelReplaceWordSettingsStore
    } catch (error) {
      log.warning(`Failed to parse ${storeName}: ${String(error)}`)
      this.userData = null
    }

    return this.userData
  }

  /** 获取某个系列的替换词列表 */
  private async getReplaceWordList(seriesId: string | number) {
    const key = seriesId.toString()
    if (this.replaceWordMap.has(key)) {
      return this.replaceWordMap.get(key) || []
    }

    const existed = this.requestMap.get(key)
    if (existed) {
      return existed
    }

    const generation = this.generation
    const promise = this.createReplaceWordList(key, generation)
      .then((result) => {
        if (generation === this.generation) {
          this.replaceWordMap.set(key, result)
        }
        this.requestMap.delete(key)
        return result
      })
      .catch((error) => {
        this.requestMap.delete(key)
        throw error
      })

    this.requestMap.set(key, promise)
    return promise
  }

  /** 生成某个系列的替换词列表 */
  private async createReplaceWordList(seriesId: string, generation: number) {
    const userData = await this.getUserData()
    if (generation !== this.generation) {
      return []
    }

    if (!userData) {
      return []
    }

    const setting = userData[seriesId]
    if (!setting || setting.words.length === 0) {
      return []
    }

    let glossaryData: NovelSeriesGlossary
    try {
      glossaryData = await API.getNovelSeriesGlossary(seriesId)
    } catch (error) {
      log.warning(`Failed to get novel glossary for series ${seriesId}`)
      return []
    }

    if (generation !== this.generation) {
      return []
    }

    const result: ReplaceWord[] = []
    for (const settingWord of setting.words) {
      const rawWord = this.findRawWord(
        glossaryData.body.categories,
        settingWord.id
      )
      if (rawWord) {
        result.push({
          id: settingWord.id,
          rawWord,
          word: settingWord.word,
        })
      }
    }

    result.sort((a, b) => b.rawWord.length - a.rawWord.length)
    return result
  }

  /** 通过置换项 id 在系列设定资料里查找原单词 */
  private findRawWord(
    categories: NovelSeriesGlossary['body']['categories'],
    id: string
  ) {
    for (const category of categories) {
      for (const item of category.items) {
        if (item.id === id) {
          return item.name
        }
      }
    }
    return ''
  }
}

const replaceNovelWords = new ReplaceNovelWords()
export { replaceNovelWords }
