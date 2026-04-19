import { artworkThumbnail } from './ArtworkThumbnail'
import { downloadRecord, DownloadRecordType } from './download/DownloadRecord'
import { DonwloadSuccessData } from './download/DownloadType'
import { EVT } from './EVT'
import { novelThumbnail } from './NovelThumbnail'
import { setTimeoutWorker } from './SetTimeoutWorker'
import { SettingChangeData, settings } from './setting/Settings'
import { Utils } from './utils/Utils'

interface WorkExtra {
  id: string
  type: 'illusts' | 'novels'
  /** 是否已添加 className */
  // 如果为 false，只能说明未添加 className，但不代表没有检查过下载记录。
  classNameAdded: boolean
}

/** 在已下载的作品上显示边框 */
// 实际上添加的不是 border 而是 outline，因为如果父元素有 overflow: hidden 的话 border 很可能显示不完整，而 outline 不受影响
class ShowBorderOnDownloadedWorks {
  constructor() {
    this.bindEvent()
  }

  // WeakMap 保存的是弱引用，当元素被移除时会自动从 WeakMap 中删除，不需要手动删除
  private works: WeakMap<HTMLElement, WorkExtra> = new WeakMap()
  // 使用这个数组来辅助遍历，因为 WeakMap 没有遍历方法
  private workElements: { id: string; el: HTMLElement }[] = []
  // 注意：一个 id 可能存在多个作品元素，所以使用 id 查询时可能有多个对应的元素

  // 当设置初始化完成后，ready 就绪
  private ready = false

  private async waitReady() {
    while (!this.ready) {
      await setTimeoutWorker.sleep(30)
    }
  }

  private bindEvent() {
    // 即使没有启用这个功能，也会保存作品缩略图元素备用
    artworkThumbnail.onFound((el: HTMLElement, id: string) => {
      this.addWork(el, id, 'illusts')
    })

    novelThumbnail.onFound((el: HTMLElement, id: string) => {
      this.addWork(el, id, 'novels')
    })

    window.addEventListener(EVT.list.settingInitialized, () => {
      this.ready = true
    })

    window.addEventListener(
      EVT.list.settingChange,
      async (ev: CustomEventInit) => {
        const data = ev.detail.data as SettingChangeData
        // 启用或关闭此功能
        if (data.name === 'showBorderOnDownloadedWorks') {
          if (data.value) {
            this.updateCSS()
            this.delayCheck()
          } else {
            // 禁用此功能时，只会移除样式，不会移除元素上添加的 className
            this.removeCSS()
          }
        }

        // 更新样式
        if (data.name === 'borderColor' || data.name === 'borderWidth') {
          this.updateCSS()
        }
      }
    )

    // 当有文件下载完成时，为它的元素添加边框
    window.addEventListener(EVT.list.downloadSuccess, (ev: CustomEventInit) => {
      const successData = ev.detail.data as DonwloadSuccessData
      // 此时接收到的 id 可能是带序号的，例如 143050161_p1，需要去掉序号部分
      const id = Number.parseInt(successData.id).toString()
      // 注意：如果走正常流程（检查它的下载记录）的话，需要等待一段时间（例如 100 ms）再执行，
      // 因为立即检查的话，下载记录还没有保存成功，就会找不到它的下载记录
      // 这里特殊处理，所以无须等待
      this.checkWorks(id)
    })
  }

  private async addWork(
    el: HTMLElement,
    id: string,
    type: 'illusts' | 'novels'
  ) {
    if (!id) {
      return
    }
    if (this.works.has(el)) {
      return
    }
    this.works.set(el, { id, type, classNameAdded: false })
    this.workElements.push({ id, el })
    this.delayCheck()
  }

  private delayCheck = Utils.debounce(() => {
    this.checkWorks()
  }, 50)

  /** 处理已保存的作品元素
   *
   * @param downloadedID 如果提供了 id，则直接为它的缩略图添加边框，并且不会检查它是否有下载记录；如果没有提供 id，则检查所有作品
   */
  private async checkWorks(downloadedID?: string) {
    await this.waitReady()

    // 因为可能会在循环中删除数组项，所以需要倒序遍历
    for (let i = this.workElements.length - 1; i >= 0; i--) {
      if (downloadedID && this.workElements[i].id !== downloadedID) {
        continue
      }

      const el = this.workElements[i].el
      // 如果元素已经不在页面里了，就删除它
      if (el?.isConnected === false) {
        this.workElements.splice(i, 1)
        this.works.delete(el)
        continue
      }

      // 如果未启用此功能，则不继续检查。放到这里判断是为了在用户未启用此功能时，也依然有机会清理已失效的元素，避免内存泄漏
      if (!settings.showBorderOnDownloadedWorks) {
        continue
      }

      const extra = this.works.get(el)
      if (extra && !extra.classNameAdded) {
        if (downloadedID) {
          // 如果传递了 id，无须检查其下载记录，直接修改它的状态
          this.setBorder(el, downloadedID, extra.type)
        } else {
          this.checkOneEl(el, extra.id, extra.type)
        }
      }
    }
  }

  private async checkOneEl(
    el: HTMLElement,
    id: string,
    type: 'illusts' | 'novels'
  ) {
    if (!settings.showBorderOnDownloadedWorks || !this.ready) {
      return
    }

    let record: DownloadRecordType | null = null
    // 小说直接使用 id 查询
    if (type === 'novels') {
      record = await downloadRecord.getRecord(id)
    } else {
      // 对于图像作品，先添加 _p0 查询，这符合大部分情况
      record = await downloadRecord.getRecord(id + '_p0')
      if (record === null) {
        // 如果查询不到，则使用 id 再查询一次，因为动图是只使用 id 的
        record = await downloadRecord.getRecord(id.toString())
      }
    }
    if (record) {
      this.setBorder(el, id, type)
    }
  }

  private setBorder(el: HTMLElement, id: string, type: 'illusts' | 'novels') {
    el.classList.add(this.className)
    el.parentElement?.classList.add(this.classNameParent)
    this.works.set(el, { id, type, classNameAdded: true })
  }

  // -----------处理样式-----------

  private styleElement: HTMLStyleElement | null = null
  private className = 'downloadedWorksBorder'
  private classNameParent = 'downloadedWorksBorderParent'
  private latestWidth = 0
  private latestColor = ''

  private async updateCSS() {
    await this.waitReady()
    if (!settings.showBorderOnDownloadedWorks) {
      return
    }
    if (
      this.latestColor === settings.borderColor &&
      this.latestWidth === settings.borderWidth
    ) {
      return
    }
    this.latestColor = settings.borderColor
    this.latestWidth = settings.borderWidth

    const cssText = `
    .${this.className} {
      position: relative;           /* 必须 */
      border-radius: 8px;           /* 有些元素本来就有 8px 的圆角，有些没有。这里统一设置为 8px */
      overflow: visible !important; /* 尽量让伪元素可见 */
      z-index: 1;
    }

    .${this.className}::after {
      content: '';
      position: absolute;
      inset: 0px;                  /* 与缩略图元素的区域重叠 */
      /* border 显示在缩略图内，不能显示在外面，否则会因为父级元素的 overflow: hidden 被裁剪，或者因为相邻元素之间没有缝隙，导致交界处的 border 被遮挡 */
      border: ${settings.borderWidth}px solid ${settings.borderColor};
      border-radius: 8px;
      pointer-events: none;         /* 不阻挡点击 */
      z-index: 0;                  /* 层级需要大于 -1, 否则容易被图片遮挡 */
    }

    /* 使设置边框颜色的 input 里的文字也变成对应的颜色，起到预览的作用 */
    #borderColor {
      color: ${settings.borderColor} !important;
    }
  `
    if (!this.styleElement) {
      this.styleElement = Utils.addStyle(cssText)
    }
    if (this.styleElement) {
      this.styleElement.textContent = cssText
    }
  }

  private removeCSS() {
    if (!this.styleElement) {
      return
    }

    // 移除样式并重置保存的属性值，以便在下一次启用时再次添加样式
    this.styleElement.remove()
    this.styleElement = null
    this.latestColor = ''
    this.latestWidth = 0
  }
}

new ShowBorderOnDownloadedWorks()
