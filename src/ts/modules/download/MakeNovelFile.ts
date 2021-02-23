import { NovelMeta } from '../store/StoreType'
import { settings } from '../setting/Settings'
import { makeEPUB } from './MakeEPUB'

class MakeNovelFile {
  static async make(data: NovelMeta, type = settings.novelSaveAs) {
    if (type === 'txt') {
      return this.makeTXT(data, settings.saveNovelMeta)
    }
    return makeEPUB.make(data, settings.saveNovelMeta)
  }

  static makeTXT(data: NovelMeta, saveMeta = true) {
    let content = data.content
    // 附带小说元数据
    if (saveMeta) {
      content = data.meta + content
    }

    // 替换换行标签，移除 html 标签
    content = content.replace(/<br \/>/g, '\n').replace(/<\/?.+?>/g, '')

    return new Blob([content], {
      type: 'text/plain',
    })
  }
}

export { MakeNovelFile }
