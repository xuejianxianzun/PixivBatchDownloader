import { DOM } from './DOM'
import { lang } from './Lang'
import { log } from './Log'
import { themeColor } from './ThemeColor'

// 保存和加载命名规则
class SaveNamingRule {
  constructor(ruleInput: HTMLInputElement) {
    this.ruleInput = ruleInput

    const wrap = DOM.useSlot('saveNamingRule', this.html)
    themeColor.register(wrap)

    this.saveBtn = wrap.querySelector('button.nameSave')! as HTMLButtonElement
    this.loadBtn = wrap.querySelector('button.nameLoad')! as HTMLButtonElement
    this.listWrap = wrap.querySelector('ul.namingRuleList')! as HTMLUListElement

    this.createList()

    this.bindEvent()
  }

  private storeName = 'xzNamingList'
  private list: string[] = [] // 保存明明列表，是一个先进先出的队列
  private readonly limit = 10 // 最大保存数量
  private saveBtn: HTMLButtonElement
  private loadBtn: HTMLButtonElement
  private listWrap: HTMLElement
  private ruleInput: HTMLInputElement
  private _show = false // 是否显示列表

  private set show(boolean: boolean) {
    this._show = boolean
    boolean ? this.showListWrap() : this.hideListWrap()
  }

  private get show() {
    return this._show
  }

  private bindEvent() {
    this.saveBtn.addEventListener('click', () => {
      this.add(this.ruleInput.value)
    })

    this.loadBtn.addEventListener('click', () => {
      this.show = !this.show
    })

    this.listWrap.addEventListener('mouseleave', () => {
      this.show = false
    })
  }

  private load() {
    const data = localStorage.getItem(this.storeName)
    if (data) {
      this.list = JSON.parse(data)
    }
  }

  private save() {
    localStorage.setItem(this.storeName, JSON.stringify(this.list))
  }

  private add(rule: string) {
    if (this.list.length === this.limit) {
      this.list.splice(0, 1)
    }
    this.list.push(rule)
    log.success(lang.transl('_已保存命名规则'))
    this.handleChange()
  }

  private delete(index: number) {
    this.list.splice(index, 1)
    this.handleChange()
  }

  private select(rule: string) {
    this.ruleInput.value = rule
  }

  private handleChange() {
    this.save()
    this.createList()
  }

  private createList() {
    this.load()
    const htmlArr = []
    for (let i = 0; i < this.list.length; i++) {
      const html = `<li>
      <span class="rule">${this.list[i]}</span>
      <button class="delete textButton" type="button" data-index="${i}">×</button>
    </li>`
      htmlArr.push(html)
    }
    if (this.list.length === 0) {
      htmlArr.push(`<li><i>&nbsp;&nbsp;&nbsp;&nbsp;no data</i></li>`)
    }
    this.listWrap.innerHTML = htmlArr.join('')

    const ruleEls = this.listWrap.querySelectorAll('.rule')
    for (const el of ruleEls) {
      el.addEventListener('click', () => {
        this.select(el.textContent!)
        this.show = false
      })
    }

    const deleteEls = this.listWrap.querySelectorAll('.delete') as NodeListOf<
      HTMLButtonElement
    >
    for (const el of deleteEls) {
      el.addEventListener('click', () => {
        const index = parseInt(el.dataset.index!)
        this.delete(index)
      })
    }
  }

  private showListWrap() {
    this.listWrap.style.display = 'block'
  }

  private hideListWrap() {
    this.listWrap.style.display = 'none'
  }

  private readonly html = `
  <div class="saveNamingRuleWrap">
  <button class="nameSave textButton has_tip" type="button" data-tip="${lang.transl(
    '_保存命名规则提示',
    this.limit.toString()
  )}">${lang.transl('_保存')}</button>
  <button class="nameLoad textButton" type="button">${lang.transl(
    '_加载'
  )}</button>
  <ul class="namingRuleList"></ul>
  </div>`
}

export { SaveNamingRule }
