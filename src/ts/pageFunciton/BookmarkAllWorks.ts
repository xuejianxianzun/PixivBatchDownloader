import { API } from '../API'
import { lang } from '../Lang'
import { BookmarkResult } from '../crawl/CrawlResult'
import { EVT } from '../EVT'
import { toast } from '../Toast'
import { bookmark } from '../Bookmark'
import { Tools } from '../Tools'
import { log } from '../Log'
import { msgBox } from '../MsgBox'
import { setTimeoutWorker } from '../SetTimeoutWorker'
import { Config } from '../Config'
import { settings } from '../setting/Settings'

// 一键收藏所有作品
// 可以传入页面上的作品元素列表，也可以直接传入 id 列表
// 一次任务里要么全部传递插画，要么全部传递小说，不要混合
type WorkType = 'illusts' | 'novels'

export interface IDList {
  type: WorkType
  id: string
}

type BookmarkData = BookmarkResult & {
  type: WorkType
}

class BookmarkAllWorks {
  constructor(tipWrap?: HTMLElement) {
    if (tipWrap) {
      this.tipWrap = tipWrap
    }
  }

  private idList: IDList[] = []

  private bookmarKData: BookmarkData[] = []

  public tipWrap: HTMLElement = document.createElement('button')

  // 传递 workList，这是作品列表元素的合集。代码会尝试分析每个作品元素中的超链接，提取出作品 id
  // 如果传递的作品是本页面上的作品，可以省略 type。代码会根据页面 url 判断是图片还是小说。
  // 如果传递的作品不是本页面上的，为防止误判，需要显式传递 type
  public sendWorkList(
    list: NodeListOf<HTMLElement> | HTMLElement[],
    type?: WorkType
  ) {
    this.reset()

    type =
      type ??
      (window.location.pathname.includes('/novel') ? 'novels' : 'illusts')

    const regExp = type === 'illusts' ? /\/artworks\/(\d*)/ : /\?id=(\d*)/
    for (const el of list) {
      const a = el.querySelector('a')
      if (a) {
        // "https://www.pixiv.net/artworks/82618568"
        // "https://www.pixiv.net/novel/show.php?id=12350618"
        const test = regExp.exec(a.href)
        if (test && test.length > 1) {
          this.idList.push({
            type,
            id: test[1],
          })
        }
      }
    }

    this.startBookmark()
  }

  // 直接传递 id 列表
  public sendIdList(list: IDList[]) {
    this.reset()

    this.idList = list

    this.startBookmark()
  }

  private reset() {
    this.idList = []
    this.bookmarKData = []
  }

  // 启动收藏流程
  private async startBookmark() {
    if (this.idList.length === 0) {
      toast.error(lang.transl('_没有数据可供使用'))
      return
    }

    this.tipWrap.textContent = `Checking`
    this.tipWrap.setAttribute('disabled', 'disabled')

    await this.getTagData()
    await this.addBookmarkAll()
    this.complete()
  }

  // 获取每个作品的 tag 数据
  private async getTagData() {
    return new Promise<void>(async (resolve, reject) => {
      for (const id of this.idList) {
        this.tipWrap.textContent = `Get data ${this.bookmarKData.length} / ${this.idList.length}`

        try {
          // 如果作品数量大于一定数量，则启用慢速抓取，以免在获取作品数据时发生 429 错误
          await new Promise(async (res) => {
            setTimeoutWorker.set(
              async () => {
                let data
                if (id.type === 'novels') {
                  data = await API.getNovelData(id.id)
                } else {
                  data = await API.getArtworkData(id.id)
                }

                this.bookmarKData.push({
                  type: id.type,
                  id: data.body.id,
                  tags: Tools.extractTags(data),
                  restrict: false,
                })
                res(id)
              },
              this.idList.length >= 120 ? settings.slowCrawlDealy : 0
            )
          })
        } catch (error) {
          // 捕获错误，主要是为了处理 429 错误。但是现在只会提示，没有重试。因为需要过 3 分钟之后才能重试成功，等待时间太长了
          const e = error as {
            status: number
            statusText: string
          }
          let msg = ''
          if (e.status) {
            msg = `${lang.transl('_发生错误原因')}${lang.transl('_错误代码')}${
              e.status
            }. ${lang.transl('_请稍后重试')}`
          } else {
            msg = `${lang.transl('_发生错误原因')}${lang.transl(
              '_未知错误'
            )}${lang.transl('_请稍后重试')}`
          }

          // 显示提示，并中止执行
          log.error(msg)
          msgBox.error(msg)
          this.tipWrap.textContent = `× Error`
          this.tipWrap.removeAttribute('disabled')
          EVT.fire('bookmarkModeEnd')
          return reject()
        }
      }

      resolve()
    })
  }

  // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
  private async addBookmarkAll() {
    return new Promise<void>(async (resolve) => {
      let index = 0
      for (const data of this.bookmarKData) {
        this.tipWrap.textContent = `Add bookmark ${index} / ${this.bookmarKData.length}`

        const status = await bookmark.add(
          data.id,
          data.type,
          data.tags,
          undefined,
          undefined,
          true
        )
        if (status === 403) {
          msgBox.error(
            `Add bookmark: ${data.id}, Error: 403 Forbidden, ${lang.transl(
              '_你的账号已经被Pixiv限制'
            )}`
          )
          break
        }

        index++
      }

      resolve()
    })
  }

  private complete() {
    this.tipWrap.textContent = `✓ Complete`
    this.tipWrap.removeAttribute('disabled')
    toast.success(lang.transl('_收藏作品完毕'))
    EVT.fire('bookmarkModeEnd')
  }
}

export { BookmarkAllWorks }
