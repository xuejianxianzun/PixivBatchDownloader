// 下载进度条
import { store } from '../store/Store'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { EVT } from '../EVT'
import { Utils } from '../utils/Utils'

interface ProgressBarEl {
  name: HTMLSpanElement
  loaded: HTMLSpanElement
  progress: HTMLDivElement
}

interface ProgressData {
  name: string
  loaded: number
  total: number
}

// 进度条
class ProgressBar {
  constructor() {
    this.createElements()
    lang.register(this.wrap)
    this.bindEvents()
  }

  private readonly wrapHTML = `
  <div class="progressBarWrap">
  <div class="total">
  <span class="text" data-xztext="_下载进度"></span>
  <div class="right1">
  <div class="progressBar progressBar1">
  <div class="progress progress1"></div>
  </div>
  <div class="totalNumberWrap">
  <span class="downloaded">0</span>
  /
  <span class="imgNum totalNumber">0</span>
  </div>
  </div>
  </div>

  <ul class="progressBarList"></ul>
  </div>
  `

  private readonly barHTML = `<li class="downloadBar">
  <div class="progressBar progressBar2">
  <div class="progress progress2"></div>
  </div>
  <div class="progressTip progressTip2">
  <span class="fileName"></span>
  <span class="loadedWrap">
  <span class="loaded"></span>
  </span>
  </div>
  </li>`

  private wrap!: HTMLDivElement
  private downloadedEl!: HTMLSpanElement
  private progressColorEl!: HTMLDivElement
  private listWrap!: HTMLUListElement
  private totalNumberEl!: HTMLSpanElement
  private allProgressBar: ProgressBarEl[] = []

  private readonly KB = 1024
  private readonly MB = 1024 * 1024

  private createElements() {
    this.wrap = Tools.useSlot('progressBar', this.wrapHTML) as HTMLDivElement
    this.downloadedEl = this.wrap.querySelector(
      '.downloaded'
    ) as HTMLSpanElement
    this.progressColorEl = this.wrap.querySelector(
      '.progress1'
    ) as HTMLDivElement
    this.listWrap = this.wrap.querySelector(
      '.progressBarList'
    ) as HTMLUListElement
    this.totalNumberEl = this.wrap.querySelector(
      '.totalNumber'
    ) as HTMLSpanElement
  }

  private bindEvents() {
    window.addEventListener(EVT.list.crawlStart, () => {
      this.hide()
    })
  }

  // 重设所有进度
  public reset(progressBarNum: number, downloaded: number = 0) {
    if (progressBarNum === 0) {
      // 如果进度条数量为 0（抓取结果为空），则隐藏进度条区域
      return this.hide()
    }

    // 重置总进度条
    this.setTotalProgress(downloaded)
    this.totalNumberEl.textContent = store.result.length.toString()
    // 重置子进度条
    this.listWrap.innerHTML = this.barHTML.repeat(progressBarNum)

    this.show()

    // 保存子进度条上需要使用到的元素
    const allProgressBar = this.listWrap.querySelectorAll('.downloadBar')
    this.allProgressBar = []
    for (const bar of allProgressBar) {
      const data: ProgressBarEl = {
        name: bar.querySelector('.fileName')! as HTMLSpanElement,
        loaded: bar.querySelector('.loaded')! as HTMLSpanElement,
        progress: bar.querySelector('.progress')! as HTMLDivElement,
      }

      this.allProgressBar.push(data)
    }
  }

  // 设置总进度条的进度
  public setTotalProgress(downloaded: number) {
    this.downloadedEl.textContent = downloaded.toString()

    const progress = (downloaded / store.result.length) * 100
    this.progressColorEl.style.width = progress + '%'
  }

  /**立即更新子进度条的进度 */
  public setProgress(index: number, data: ProgressData) {
    const bar = this.allProgressBar[index]
    if (!bar) {
      console.error(index, this.allProgressBar)
      return
    }
    bar.name.textContent = data.name
    bar.name.setAttribute('title', data.name)

    let text = ''
    if (data.total >= this.MB) {
      // 如果判断条件加上： || data.total === 0
      // 则文件未下载时显示的默认单位会是 MiB
      // 使用 MiB 作为单位
      text = `${(data.loaded / this.MB).toFixed(1)}/${(
        data.total / this.MB
      ).toFixed(1)} MiB`
    } else {
      // 使用 KiB 作为单位
      text = `${Math.floor(data.loaded / this.KB)}/${Math.floor(
        data.total / this.KB
      )} KiB`
    }

    bar.loaded.textContent = text

    const progress = data.loaded / data.total || 0 // 若结果为 NaN 则设为 0
    bar.progress.style.width = progress * 100 + '%'
  }

  /**更新子进度条时，使用节流 */
  public setProgressThrottle = Utils.throttle(this.setProgress.bind(this), 200)

  // 让某个子进度条显示警告色
  public errorColor(index: number, show: boolean) {
    const bar = this.allProgressBar[index]
    if (!bar) {
      console.error(index, this.allProgressBar)
      return
    }
    bar.name.classList[show ? 'add' : 'remove']('downloadError')
  }

  private show() {
    this.wrap.style.display = 'block'
  }

  private hide() {
    this.wrap.style.display = 'none'
  }
}

const progressBar = new ProgressBar()
export { progressBar }
