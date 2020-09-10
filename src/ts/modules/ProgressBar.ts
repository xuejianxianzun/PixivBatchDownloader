// 下载进度条
import { store } from './Store'
import { DOM } from './DOM'
import { lang } from './Lang'

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
    this.wrap = DOM.useSlot('progressBar', this.wrapHTML) as HTMLDivElement
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

  private readonly wrapHTML = `
  <div class="progressBarWrap">
  <div class="total">
  <span class="text">${lang.transl('_下载进度')}</span>
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

  private wrap: HTMLDivElement
  private downloadedEl: HTMLSpanElement
  private progressColorEl: HTMLDivElement
  private listWrap: HTMLUListElement
  private totalNumberEl: HTMLSpanElement
  private allProgressBar: ProgressBarEl[] = []

  // 重设所有进度
  public reset(progressBarNum: number, downloaded: number = 0) {
    if (progressBarNum === 0) {  // 如果进度条数量为 0（抓取结果为空），则隐藏进度条区域
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

  // 设置子进度条的进度
  public setProgress(index: number, data: ProgressData) {
    const bar = this.allProgressBar[index]
    bar.name.textContent = data.name

    bar.loaded.textContent = `${Math.floor(data.loaded / 1024)}/${Math.floor(
      data.total / 1024
    )} KiB`

    const progress = data.loaded / data.total || 0 // 若结果为 NaN 则设为 0
    bar.progress.style.width = progress * 100 + '%'
  }

  // 让某个子进度条显示警告色
  public showErrorColor(index: number, show: boolean) {
    const bar = this.allProgressBar[index]
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
