import { EVT } from './EVT'
import { Utils } from './utils/Utils'
import { IndexedDB } from './utils/IndexedDB'
import { settings } from './setting/Settings'
import browser from 'webextension-polyfill'
import { states } from './store/States'

interface BGData {
  readonly key: 'bg'
  file: File
}

interface BGItem {
  wrap: HTMLElement
  bg: HTMLElement
  opacity?: number
}

interface BGChange {
  origin: string
  token: number
}

class BG {
  constructor() {
    this.IDB = new IndexedDB()
    this.init()
  }

  private list: BGItem[] = []

  private readonly bgModeflagClassName = 'xzBG'
  private readonly bgLayerClassName = 'xzBGLayer'
  private bgUrl = ''
  /** 用于预加载当前背景图片的元素 */
  private preloadImage?: HTMLImageElement

  private IDB: IndexedDB
  private readonly DBName = 'PBDBG'
  private readonly DBVer = 1
  private readonly storeName = 'bg'
  private readonly keyName = 'bg'
  /** 通知其他标签页重新读取背景图片的存储键 */
  private readonly backgroundChangeStoreName = 'bgChange'
  /** 设置初始化期间收到的背景图片变更 */
  private pendingBackgroundChange = false

  private async init() {
    this.bindEvents()
    await this.initDB()
    await this.restore()
    if (states.settingInitialized) {
      this.pendingBackgroundChange = false
    }
  }

  private async initDB() {
    await this.IDB.open(this.DBName, this.DBVer, this.onUpdate)
  }

  // 在数据库升级事件里创建表
  private onUpdate = (db: IDBDatabase) => {
    if (!db.objectStoreNames.contains(this.storeName)) {
      db.createObjectStore(this.storeName, {
        keyPath: 'key',
      })
    }
  }

  private createBGLayer(wrap: HTMLElement) {
    const div = document.createElement('div')
    div.classList.add(this.bgLayerClassName)
    const el = wrap.insertAdjacentElement('afterbegin', div)
    return el as HTMLElement
  }

  private bindEvents() {
    window.addEventListener(EVT.list.selectBG, () => {
      this.selectBG()
    })

    window.addEventListener(EVT.list.clearBG, () => {
      this.clearBG()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'bgDisplay') {
        this.setBGAll()
      }

      if (data.name === 'bgOpacity') {
        this.setBGAll()
      }

      if (data.name === 'bgPositionY') {
        this.setBGAll()
      }
    })

    window.addEventListener(EVT.list.settingInitialized, () => {
      if (
        this.pendingBackgroundChange &&
        settings.settingsAcrossDifferentTabs === 'synchronizeChanges' &&
        this.IDB.db
      ) {
        this.restore()
      }
      this.pendingBackgroundChange = false
    })

    browser.storage.onChanged.addListener((changes, areaName) => {
      const change = changes[this.backgroundChangeStoreName]
      const data = change?.newValue as BGChange | undefined
      if (areaName !== 'local' || !data || data.origin !== location.origin) {
        return
      }

      if (!states.settingInitialized || !this.IDB.db) {
        this.pendingBackgroundChange = true
        return
      }

      if (settings.settingsAcrossDifferentTabs === 'synchronizeChanges') {
        this.restore()
      }
    })
  }

  private async restore() {
    const data: BGData | null = (await this.IDB.get(
      this.storeName,
      this.keyName
    )) as any
    if (!data || !data.file) {
      this.setBGUrl('')
      this.setBGAll()
      return
    }
    this.setBGUrl(URL.createObjectURL(data.file))
    this.setBGAll()
  }

  private async selectBG() {
    const file = (await Utils.selectFile('.jpg,.jpeg,.png,.bmp,.webp'))[0]
    this.setBGUrl(URL.createObjectURL(file))
    for (const o of this.list) {
      this.setBG(o)
    }

    const data: BGData = {
      key: this.keyName,
      file: file,
    }

    const test = await this.IDB.get(this.storeName, this.keyName)
    await this.IDB[test ? 'put' : 'add'](this.storeName, data)
    await this.notifyBackgroundChange()
  }

  private async clearBG() {
    await this.IDB.clear(this.storeName)
    this.setBGUrl('')
    this.setBGAll()
    await this.notifyBackgroundChange()
  }

  /** 替换背景图片 URL，并释放不再使用的资源 */
  private setBGUrl(url: string) {
    if (this.bgUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.bgUrl)
    }
    this.bgUrl = url

    this.preloadImage?.remove()
    this.preloadImage = undefined
    if (this.bgUrl) {
      this.preload()
    }
  }

  // 预加载背景图片
  private preload() {
    // 由于浏览器的工作原理，背景图片在未被显示之前是不会加载的，在显示时才会进行加载。这会导致背景层显示之后出现短暂的空白（因为在加载图片）。为了避免空白，需要预加载图片
    const img = new Image()
    img.style.display = 'none'
    this.preloadImage = img
    img.addEventListener('load', () => {
      if (this.preloadImage === img) {
        img.remove()
        this.preloadImage = undefined
      }
    })
    img.addEventListener('error', () => {
      if (this.preloadImage === img) {
        img.remove()
        this.preloadImage = undefined
      }
    })
    img.src = this.bgUrl
    document.body.append(img)
  }

  private async setBG(o: BGItem) {
    this.setPositionY(o)
    this.setOpacity(o)
    this.setBGURL(o)
    this.setDisplay(o)
  }

  private async setBGAll() {
    for (const o of this.list) {
      this.setPositionY(o)
      this.setOpacity(o)
      this.setBGURL(o)
      this.setDisplay(o)
    }
  }

  private setBGURL(o: BGItem) {
    o.bg.style.backgroundImage = this.bgUrl ? `url(${this.bgUrl})` : 'none'
  }

  /** 通知其他标签页重新读取 IndexedDB 中的背景图片 */
  private notifyBackgroundChange() {
    return browser.storage.local.set({
      [this.backgroundChangeStoreName]: {
        origin: location.origin,
        token: Date.now() + Math.random(),
      } as BGChange,
    })
  }

  private setDisplay(o: BGItem) {
    o.bg.style.display = settings.bgDisplay ? 'block' : 'none'
    if (!this.bgUrl) {
      o.wrap.classList.remove(this.bgModeflagClassName)
    } else {
      o.wrap.classList[settings.bgDisplay ? 'add' : 'remove'](
        this.bgModeflagClassName
      )
    }
  }

  private setOpacity(o: BGItem) {
    o.bg.style.opacity = (o.opacity || settings.bgOpacity / 100).toString()
  }

  private setPositionY(o: BGItem) {
    o.bg.style.backgroundPositionY = settings.bgPositionY
  }

  // 其他模块可以调用这个方法，为一个元素添加背景层
  // 如果传入一个真值的不透明度，会始终使用传入的不透明度，忽略用户设置的不透明度
  public useBG(wrap: HTMLElement, opacity?: number) {
    if (this.bgUrl) {
      this.readySet(wrap, opacity)
    } else {
      let timer = window.setInterval(() => {
        if (this.bgUrl) {
          window.clearInterval(timer)
          this.readySet(wrap)
        }
      }, 300)
    }
  }

  private readySet(wrap: HTMLElement, opacity?: number) {
    const o = {
      wrap,
      bg: this.createBGLayer(wrap),
      opacity,
    }
    this.list.push(o)

    this.setBG(o)
  }
}

const bg = new BG()
export { bg }
