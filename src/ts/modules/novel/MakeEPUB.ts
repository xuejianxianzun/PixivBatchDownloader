import { API } from '../API'
import { NovelMeta } from '../Store.d'

declare const EpubMaker: any

class MakeEPUB {
  constructor() {}

  // epub 内部会使用标题 title 建立一个文件夹，把一些文件存放进去，所以这里要替换掉标题的特殊字符，特殊字符会导致这个文件夹名被截断，结果就是这个 epub 文件无法被解析。
  public make(data: NovelMeta, saveMeta = true): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let content = data.content
      // 附带小说元数据
      if (saveMeta) {
        content = data.meta + content
      }

      // 把换行符替换成 br 标签
      content = content.replace(/\n/g, '<br/>')

      new EpubMaker()
        .withTemplate('idpf-wasteland')
        .withAuthor(API.replaceUnsafeStr(data.userName))
        .withModificationDate(new Date(data.createDate))
        .withRights({
          description: data.description,
          license: '',
        })
        .withAttributionUrl(
          `https://www.pixiv.net/novel/show.php?id=${data.id}`,
        )
        .withCover(data.coverUrl, {
          license: '',
          attributionUrl: '',
        })
        .withTitle(API.replaceUnsafeStr(data.title))
        .withSection(
          new EpubMaker.Section('1', null, { content: content }, false, true),
        )
        .makeEpub()
        .then((blob: Blob) => {
          resolve(blob)
        })
    })
  }
}

const makeEPUB = new MakeEPUB()

export { makeEPUB }
