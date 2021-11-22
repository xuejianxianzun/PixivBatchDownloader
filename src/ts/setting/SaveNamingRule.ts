import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { lang } from '../Lang'
import { theme } from '../Theme'
import { settings, setSetting } from './Settings'
import { toast } from '../Toast'
import { nameRuleManager } from './NameRuleManager'

// 保存和加载命名规则列表
class SaveNamingRule {
  constructor(ruleInput: HTMLInputElement) {
    this.ruleInput = ruleInput

    Tools.clearSlot('saveNamingRule')
    const wrap = Tools.useSlot('saveNamingRule', this.html) as HTMLElement
    theme.register(wrap)
    lang.register(wrap)

    this.saveBtn = wrap.querySelector('button.nameSave')! as HTMLButtonElement
    this.loadBtn = wrap.querySelector('button.nameLoad')! as HTMLButtonElement
    this.listWrap = wrap.querySelector('ul.namingRuleList')! as HTMLUListElement

    this.createList()

    this.bindEvents()
  }

  private readonly limit = 20 // 最大保存数量
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

  private bindEvents() {
    this.saveBtn.addEventListener('click', () => {
      this.add(this.ruleInput.value)
    })

    this.loadBtn.addEventListener('click', () => {
      this.show = !this.show
    })

    this.listWrap.addEventListener('mouseleave', () => {
      this.show = false
    })

    // 设置发生变化时重新创建列表
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'namingRuleList') {
        this.createList()
      }
    })
  }

  private add(rule: string) {
    if (settings.namingRuleList.length === this.limit) {
      this.delete(0)
    }
    // 如果这个规则已存在，不会重复添加它
    if (!settings.namingRuleList.includes(rule)) {
      const list = Array.from(settings.namingRuleList)
      list.push(rule)
      setSetting('namingRuleList', list)
    }

    toast.success(lang.transl('_已保存命名规则'))
  }

  private delete(index: number) {
    const list = Array.from(settings.namingRuleList)
    list.splice(index, 1)
    setSetting('namingRuleList', list)
  }

  private select(rule: string) {
    this.ruleInput.value = rule
    nameRuleManager.rule = rule
  }

  private createList() {
    const htmlArr = []
    for (let i = 0; i < settings.namingRuleList.length; i++) {
      const html = `<li>
      <span class="rule">${settings.namingRuleList[i]}</span>
      <button class="delete textButton" type="button" data-index="${i}">×</button>
    </li>`
      htmlArr.push(html)
    }
    if (settings.namingRuleList.length === 0) {
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

    const deleteEls = this.listWrap.querySelectorAll(
      '.delete'
    ) as NodeListOf<HTMLButtonElement>
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
  <button class="nameSave textButton has_tip" type="button" data-xztip="_保存命名规则提示" data-xztext="_保存"></button>
  <button class="nameLoad textButton" type="button" data-xztext="_加载"></button>
  <ul class="namingRuleList"></ul>
  </div>`
}

export { SaveNamingRule }
