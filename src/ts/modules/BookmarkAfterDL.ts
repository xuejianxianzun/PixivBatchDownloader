import { API } from './API'
import { token } from './Token'
import { store } from './Store'
import { settings } from './setting/Settings'
import { Result } from './Store.d'
import { lang } from './Lang'
import { EVT } from './EVT'
import { DonwloadSuccessData } from './Download.d'

// 当文件下载成功后，收藏这个作品
class BookmarkAfterDL {
  constructor(tipEl?: HTMLElement) {
    if (tipEl) {
      this.tipEl = tipEl
    }

    this.bindEvent()
  }

  // 储存接收到的 id，用于防止对一个作品重复添加收藏
  // 其实重复添加收藏没什么影响，和只添加一次没区别。为了不浪费网络请求，还是尽量不要重复添加。
  private savedIds: number[] = []

  private successCount = 0

  private tipEl: HTMLElement = document.createElement('span')

  // 可选传入一个元素，显示收藏的数量和总数
  private bindEvent() {
    // 当有文件下载完成时，提取 id
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      this.send(Number.parseInt(successData.id))
    })

    // 当开始新的抓取时重置状态和提示
    window.addEventListener(EVT.list.crawlStart, (ev: CustomEventInit) => {
      this.reset()
      this.showProgress()
    })
  }

  private showProgress() {
    if (this.savedIds.length === 0) {
      return (this.tipEl.textContent = '')
    }
    this.tipEl.textContent = `${lang.transl('_已收藏')} ${this.successCount}/${this.savedIds.length
      }`
  }

  private reset() {
    this.savedIds = []
    this.successCount = 0
  }

  // 接收作品 id，开始收藏
  private send(id: number | string) {
    if (!settings.bmkAfterDL) {
      return
    }

    if (typeof id !== 'number') {
      id = Number.parseInt(id)
    }

    // 检查这个 id 是否已经添加了
    if (this.savedIds.includes(id)) {
      return
    }

    this.addBookmark(id)
  }

  // 给所有作品添加收藏（之前收藏过的，新 tag 将覆盖旧 tag）
  private async addBookmark(id: number) {
    return new Promise<void>(async (resolve, reject) => {
      this.savedIds.push(id)
      this.showProgress()

      // 从 store 里查找这个作品的数据
      let data: Result | undefined = undefined
      let dataSource =
        store.resultMeta.length > 0 ? store.resultMeta : store.result
      for (const r of dataSource) {
        if (r.idNum === id) {
          data = r
          break
        }
      }
      if (data === undefined) {
        return reject(new Error(`Not find ${id} in result`))
      }

      await API.addBookmark(
        data.type !== 3 ? 'illusts' : 'novels',
        id.toString(),
        settings.widthTag === '1' ? data.tags : [],
        settings.restrict === '1',
        token.token,
      ).catch((err) => {
        // 如果添加收藏失败，则从 id 列表里删除它，重新开始添加收藏
        console.error(err)
        const len = this.savedIds.length
        for (let index = 0; index < len; index++) {
          if (this.savedIds[index] === id) {
            delete this.savedIds[index]
            break
          }
        }
        return resolve(this.send(id))
      })

      this.successCount++
      this.showProgress()

      resolve()
    })
  }
}

export { BookmarkAfterDL }
