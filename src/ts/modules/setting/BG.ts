import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'
import { IndexedDB } from '../utils/IndexedDB'
import { settings } from './Settings'

interface BGData {
  readonly key: 'bg'
  file: File
}

class BG {
  constructor(wrap: HTMLElement) {
    this.wrap = wrap
    this.el = this.createEl() as HTMLElement
    this.IDB = new IndexedDB()
    this.init()
  }

  private el: HTMLElement
  private wrap: HTMLElement
  private readonly id = 'xzBG'
  private readonly flagClassName = 'xzBG'
  private haveImage = false

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

  private createEl() {
    const div = document.createElement('div')
    div.id = this.id
    const el = this.wrap.insertAdjacentElement('afterbegin', div)
    return el
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
        this.setDisplay()
      }

      if (data.name === 'bgOpacity') {
        this.setOpacity()
      }

      if (data.name === 'bgPositionY') {
        this.setPositionY()
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
    const url = URL.createObjectURL(data.file)
    this.setBGImage(url)
  }

  private async selectBG() {
    const file = (await Utils.selectFile('.jpg,.jpeg,.png,.bmp'))[0]
    const url = URL.createObjectURL(file)
    this.setBGImage(url)

    const data: BGData = {
      key: this.keyName,
      file: file,
    }

    const test = await this.IDB.get(this.storeName, this.keyName)
    this.IDB[test ? 'put' : 'add'](this.storeName, data)
  }

  private async setBGImage(url: string) {
    this.setPositionY()
    this.setOpacity()

    // 预加载背景图片
    // 由于浏览器的工作原理，背景图片在未被显示之前是不会加载的，在显示时才会进行加载。这会导致背景层显示之后出现短暂的空白（因为在加载图片）。为了避免空白，需要预加载图片
    await Utils.loadImg(url)

    this.el.style.backgroundImage = `url(${url})`
    this.haveImage = true
    this.setDisplay()
  }

  private setDisplay() {
    this.el.style.display = settings.bgDisplay ? 'block' : 'none'

    if (!this.haveImage) {
      this.wrap.classList.remove(this.flagClassName)
    } else {
      this.wrap.classList[settings.bgDisplay ? 'add' : 'remove'](
        this.flagClassName
      )
    }
  }

  private setOpacity() {
    this.el.style.opacity = (settings.bgOpacity / 100).toString()
  }

  private setPositionY() {
    this.el.style.backgroundPositionY = settings.bgPositionY
  }

  private clearBG() {
    this.el.style.backgroundImage = 'none'
    this.IDB.clear(this.storeName)
    this.haveImage = false
    this.setDisplay()
  }
}

export { BG }
