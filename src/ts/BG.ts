import { EVT } from './EVT'
import { Utils } from './utils/Utils'
import { IndexedDB } from './utils/IndexedDB'
import { settings } from './setting/Settings'

interface BGData {
  readonly key: 'bg'
  file: File
}

interface BGItem {
  wrap: HTMLElement
  bg: HTMLElement
  opacity?: number
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

  private IDB: IndexedDB
  private readonly DBName = 'PBDBG'
  private readonly DBVer = 1
  private readonly storeName = 'bg'
  private readonly keyName = 'bg'

  private async init() {
    this.bindEvents()
    await this.initDB()
    this.restore()
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
  }

  private async restore() {
    const data: BGData | null = (await this.IDB.get(
      this.storeName,
      this.keyName
    )) as any
    if (!data || !data.file) {
      return
    }
    this.bgUrl = URL.createObjectURL(data.file)
    this.preload()
  }

  private async selectBG() {
    const file = (await Utils.selectFile('.jpg,.jpeg,.png,.bmp,.webp'))[0]
    this.bgUrl = URL.createObjectURL(file)
    this.preload()
    for (const o of this.list) {
      this.setBG(o)
    }

    const data: BGData = {
      key: this.keyName,
      file: file,
    }

    const test = await this.IDB.get(this.storeName, this.keyName)
    this.IDB[test ? 'put' : 'add'](this.storeName, data)
  }

  private clearBG() {
    this.IDB.clear(this.storeName)
    this.bgUrl = ''
    for (const o of this.list) {
      o.bg.style.backgroundImage = 'none'
      this.setDisplay(o)
    }
  }

  // 预加载背景图片
  private preload() {
    // 由于浏览器的工作原理，背景图片在未被显示之前是不会加载的，在显示时才会进行加载。这会导致背景层显示之后出现短暂的空白（因为在加载图片）。为了避免空白，需要预加载图片
    const img = new Image()
    img.src = this.bgUrl
    img.style.display = 'none'
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
    o.bg.style.backgroundImage = `url(${this.bgUrl})`
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
  // 如果传入一个真值的不透明度，会始终使用传入的不透明度，忽略用户用户设置的不透明度
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
