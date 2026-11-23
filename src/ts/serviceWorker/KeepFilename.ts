import browser from 'webextension-polyfill'

/** 文件名冲突时的处理方式 */
type ConflictAction = 'uniquify' | 'overwrite' | 'prompt'

/** onDeterminingFilename 事件里传递的下载项（只列出需要用到的属性） */
interface DeterminingItem {
  id: number
  url: string
  finalUrl?: string
  byExtensionId?: string
}

/** 传递给 suggest 回调的文件名建议 */
interface FilenameSuggestion {
  filename: string
  conflictAction?: ConflictAction
}

type DeterminingListener = (
  item: DeterminingItem,
  suggest: (suggestion?: FilenameSuggestion) => void
) => void

/** Chrome 的 downloads.onDeterminingFilename 事件。Firefox 没有这个事件 */
interface DeterminingEvent {
  addListener(listener: DeterminingListener): void
  removeListener(listener: DeterminingListener): void
  hasListener(listener: DeterminingListener): boolean
}

/** 一个等待浏览器确定文件名的下载请求 */
interface PendingFilename {
  filename: string
  conflictAction: ConflictAction
  /** 添加时的时间戳，用于清理过期的数据 */
  time: number
}

/**
 * 防止下载器设置的文件名被其他扩展程序覆盖。
 *
 * 只要有任意扩展程序（例如 IDM Integration Module）监听了 chrome.downloads.onDeterminingFilename 事件，
 * Chrome 就会丢弃 downloads.download() 里设置的 filename，即使那个扩展程序只是调用了无参数的 suggest()。
 * 所以下载器也需要在这个事件里通过 suggest() 明确提交自己的文件名。
 *
 * 但是只要监听了这个事件，就会导致其他扩展程序在 downloads.download() 里设置的文件名丢失（Chrome 没有提供“不修改”的方式），
 * 所以本模块只在下载器有等待确定文件名的下载时才监听该事件，空闲后就会移除监听器，避免影响其他扩展程序。
 *
 * 局限：如果多个扩展程序都建议了文件名，Chrome 采用最后安装（或更新）的扩展程序的建议。
 * 所以当冲突的扩展程序比下载器更晚安装或更新时，仍然可能无法保留文件名。此时前台会检测到异常的文件名并提示用户。
 *
 * 详细的研究记录见 notes/onDeterminingFilename.md
 */
class KeepFilename {
  constructor() {
    if (!this.event) {
      return
    }

    // 必须在 service worker 启动时同步注册监听器：
    // 如果 service worker 在监听期间被回收，Chrome 仍会保留这个监听器的注册信息，并在之后的下载里唤醒 service worker、等待它给出建议。
    // 如果此时没有监听器，Chrome 会等待 15 秒超时后才开始下载（并且影响所有扩展程序和网页发起的下载）。
    // 所以启动时先注册监听器，以便处理这种情况，然后在空闲时移除它。
    this.event.addListener(this.listener)
    this.scheduleRemove()
  }

  /** 浏览器的 onDeterminingFilename 事件。不支持时为 undefined */
  private readonly event = (
    globalThis as {
      chrome?: { downloads?: { onDeterminingFilename?: unknown } }
    }
  ).chrome?.downloads?.onDeterminingFilename as DeterminingEvent | undefined

  /** 等待确定文件名的下载，以下载 URL 为键。同一个 URL 可能被下载多次（例如内容相同的 dataURL），所以值是队列 */
  private pending: Map<string, PendingFilename[]> = new Map()

  /** 等待确定文件名的下载的总数 */
  private get pendingCount() {
    let count = 0
    for (const list of this.pending.values()) {
      count += list.length
    }
    return count
  }

  /** 移除监听器的定时器 */
  private removeTimer: ReturnType<typeof setTimeout> | undefined

  /** 空闲多久之后移除监听器（毫秒） */
  private readonly idleTime = 3000

  /** 超过这个时间仍未使用的数据会被视为过期并删除（毫秒） */
  private readonly expireTime = 5 * 60 * 1000

  /** 在调用 downloads.download() 之前调用，登记这个下载应该使用的文件名 */
  public add(url: string, filename: string, conflictAction: ConflictAction) {
    if (!this.event || !url || !filename) {
      return
    }

    this.clearExpired()
    const list = this.pending.get(url) || []
    list.push({ filename, conflictAction, time: Date.now() })
    this.pending.set(url, list)

    if (this.removeTimer !== undefined) {
      clearTimeout(this.removeTimer)
      this.removeTimer = undefined
    }
    if (!this.event.hasListener(this.listener)) {
      this.event.addListener(this.listener)
    }
  }

  /** 如果 downloads.download() 失败了（没有建立下载项），则撤销登记的文件名 */
  public cancel(url: string) {
    this.take(url)
    this.scheduleRemove()
  }

  /** 取出并删除某个 URL 对应的最早的一条数据 */
  private take(url?: string) {
    if (!url) {
      return undefined
    }
    const list = this.pending.get(url)
    if (!list) {
      return undefined
    }
    const item = list.shift()
    if (list.length === 0) {
      this.pending.delete(url)
    }
    return item
  }

  /** 删除过期的数据（例如由于未知原因没有触发 onDeterminingFilename 事件的下载） */
  private clearExpired() {
    const now = Date.now()
    for (const [url, list] of this.pending) {
      const valid = list.filter((item) => now - item.time < this.expireTime)
      if (valid.length > 0) {
        this.pending.set(url, valid)
      } else {
        this.pending.delete(url)
      }
    }
  }

  /** 当没有等待确定文件名的下载时，延迟移除监听器 */
  private scheduleRemove() {
    if (!this.event) {
      return
    }
    if (this.removeTimer !== undefined) {
      clearTimeout(this.removeTimer)
    }
    this.removeTimer = setTimeout(() => {
      this.removeTimer = undefined
      this.clearExpired()
      if (this.pendingCount === 0) {
        this.event!.removeListener(this.listener)
      }
    }, this.idleTime)
  }

  /** onDeterminingFilename 的监听器。必须同步调用 suggest，否则浏览器会等待 */
  private listener: DeterminingListener = (item, suggest) => {
    let data: PendingFilename | undefined
    if (item.byExtensionId === browser.runtime.id) {
      data = this.take(item.url) || this.take(item.finalUrl)
      // 如果 URL 匹配不上（理论上不会发生），并且只有一个等待中的下载，那么它就是这个下载
      if (!data && this.pendingCount === 1) {
        const url = this.pending.keys().next().value
        data = this.take(url)
      }
    }

    if (data) {
      suggest({ filename: data.filename, conflictAction: data.conflictAction })
    } else {
      // 不是下载器的下载，不修改文件名
      suggest()
    }

    if (this.pendingCount === 0) {
      this.scheduleRemove()
    }
  }
}

const keepFilename = new KeepFilename()
export { keepFilename }
