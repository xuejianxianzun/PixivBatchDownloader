import { NovelData } from '../CrawlResult.d'
import { makeEPUB } from './MakeEPUB'

class MakeNovelFile {
  static async makeEPUB(novelData: NovelData, text: string) {
    return makeEPUB.make(novelData, text)
  }

  static makeTXT(content: string) {
    // 替换换行标签，移除 html 标签
    content = content.replace(/<br \/>/g, '\n').replace(/<\/?.+?>/g, '')

    return new Blob([content], {
      type: 'text/plain',
    })
  }
}

export { MakeNovelFile }
