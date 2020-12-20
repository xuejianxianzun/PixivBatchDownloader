import { DOM } from './DOM'
import { Colors } from './Colors'
import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './States'
import { IDData } from './Store.d'

class QueryWork {
  constructor() {
    this.el = this.createQueryEl()
    this.addBtn()
    this.bindEvents()
  }

  private el: HTMLElement
  private id = 'QueryWorkEl'
  private left = 0
  private top = 0
  private half = 10
  private show = false

  private artworkReg = /artworks\/(\d{2,15})/
  private novelReg = /novel\/show\.php\?id=\/(\d{2,15})/

  private idList: IDData[] = []

  private bindClickEvent!: (ev: MouseEvent) => void | undefined
  private bindMoveEvent!: (ev: MouseEvent) => void | undefined

  private createQueryEl() {
    const el = document.createElement('div')
    el.id = this.id
    document.body.appendChild(el)
    return el
  }

  private updateEl() {
    this.el.style.left = this.left - this.half + 'px'
    this.el.style.top = this.top - this.half + 'px'
    this.el.style.display = this.show ? 'block' : 'none'
  }

  private addBtn() {
    const btn = DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_手动选择作品'), [
      ['title', lang.transl('_手动选择作品的说明')],
    ])
    btn.addEventListener('click', (ev) => {
      if (!this.show) {
        this.startQuery(ev)
        btn.textContent = lang.transl('_抓取选择的作品')
      } else {
        this.downloadQuery(btn)
      }
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.stopQuery()
    })
  }

  private startQuery(ev: MouseEvent) {
    this.idList = []

    this.show = true
    this.left = ev.x
    this.top = ev.y
    this.updateEl()
    this.bindClickEvent = this.clickEvent.bind(this)
    this.bindMoveEvent = this.moveEvent.bind(this)
    window.addEventListener('click', this.bindClickEvent, true)
    window.addEventListener('mousemove', this.bindMoveEvent, true)

    EVT.fire(EVT.list.closeCenterPanel)
  }

  private stopQuery() {
    this.show = false
    this.updateEl()
    this.bindClickEvent && window.removeEventListener('click', this.bindClickEvent, true)
    this.bindMoveEvent && window.removeEventListener('mousemove', this.bindMoveEvent, true)
  }

  private downloadQuery(btn: HTMLButtonElement) {
    if (states.busy) {
      EVT.sendMsg({
        msg: lang.transl('_当前任务尚未完成'),
        type: 'error',
      })
      return
    }

    this.stopQuery()
    EVT.fire(EVT.list.downloadIdList, this.idList)
    
    window.setTimeout(() => {
      btn.textContent = lang.transl('_手动选择作品')
    }, 300)
  }

  private clickEvent(ev: MouseEvent) {
    ev.preventDefault()
    // ev.stopPropagation()
    const workId = this.findWork((ev as any).path)

    if (workId) {
      console.log(workId)
      this.idList.push(workId)
    }
  }

  private moveEvent(ev: MouseEvent) {
    this.left = ev.x
    this.top = ev.y
    this.updateEl()
  }

  private findWork(arr: HTMLElement[]): IDData | undefined {
    for (const el of arr) {
      // 查找所有 a 标签
      if (el.nodeName === 'A') {
        const href = (el as HTMLAnchorElement).href
        // 测试图片作品链接
        const test = this.artworkReg.exec(href)
        if (test && test[1]) {
          return {
            type: 'unknown',
            id: test[1]
          }
        }

        // 测试小说作品链接
        const test2 = this.novelReg.exec(href)
        if (test2 && test2[1]) {
          return {
            type: 'novels',
            id: test2[1]
          }
        }
      }
    }
  }
}

export { QueryWork }