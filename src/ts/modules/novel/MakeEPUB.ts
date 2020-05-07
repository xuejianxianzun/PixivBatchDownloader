import { NovelData } from '../CrawlResult.d'
declare const EpubMaker: any

class MakeEPUB {
  constructor() {}

  public make(data: NovelData, content = ''): Promise<Blob> {
    return new Promise((resolve, reject) => {
      new EpubMaker()
        .withTemplate('idpf-wasteland')
        .withAuthor(data.body.userName)
        .withModificationDate(new Date(data.body.createDate))
        .withRights({
          description: data.body.description,
          license: '',
        })
        .withAttributionUrl(
          `https://www.pixiv.net/novel/show.php?id=${data.body.id}`
        )
        .withCover(data.body.coverUrl, {
          license: '',
          attributionUrl: '',
        })
        .withTitle(data.body.title)
        .withSection(
          new EpubMaker.Section('1', null, { content: content }, false, true)
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
