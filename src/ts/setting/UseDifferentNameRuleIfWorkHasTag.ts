import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { settings, setSetting } from './Settings'
import { theme } from '../Theme'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'
import { Utils } from '../utils/Utils'

// 如果作品含有某个标签，则对这个作品使用另一种命名规则
class UseDifferentNameRuleIfWorkHasTag {
  constructor() {
    this.createWrap()
    theme.register(this.wrap)
    lang.register(this.wrap)
    this.bindEvents()
  }

  private readonly slotName = 'UseDifferentNameRuleIfWorkHasTagSlot'
  private wrap!: HTMLDivElement // 最外层元素

  private expandBtn!: HTMLButtonElement // 展开/折叠 按钮
  private totalSpan!: HTMLSpanElement // 显示规则数量
  private showAddBtn!: HTMLButtonElement // 添加 按钮，点击显示添加区域

  private addWrap!: HTMLDivElement // 用于添加新项目的区域
  private addTagsInput!: HTMLInputElement // 用于添加新项目的 Tags 的输入框
  private addRuleInput!: HTMLInputElement // 用于添加新项目的命名规则的输入框
  private addBtn!: HTMLButtonElement // 添加 按钮
  private cancelBtn!: HTMLButtonElement // 取消 按钮

  private listWrap!: HTMLDivElement // 列表区域容器

  private _addWrapShow = false

  set addWrapShow(val: boolean) {
    this._addWrapShow = val

    if (val) {
      this.addWrap.style.display = 'block'
      this.addTagsInput.focus()
    } else {
      this.addWrap.style.display = 'none'
      this.addTagsInput.value = ''
      this.addRuleInput.value = ''
    }
  }

  get addWrapShow() {
    return this._addWrapShow
  }

  private wrapHTML = `
  <div class="UseDifferentNameRuleIfWorkHasTagWarp">

    <span class="controlBar">
    <span class="total">0</span>
      <button type="button" class="textButton expand" data-xztext="_收起"></button>
      <button type="button" class="textButton showAdd" data-xztext="_添加"></button>
    </span>

    <div class="addWrap">
      <div class="settingItem addInputWrap" >
        <div class="inputItem tags">
          <span class="label uidLabel">Tags</span>
          <input type="text" class="setinput_style1 blue addTagsInput" data-xzplaceholder="_tag用逗号分割" />
        </div>

        <div class="inputItem rule">
          <span class="label nameLabel" data-xztext="_命名规则2"></span>
          <input type="text" class="setinput_style1 blue addRuleInput" />
        </div>

        <div class="btns">
          <button type="button" class="textButton add" data-xztitle="_添加">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-wanchengqueding"></use>
            </svg>
          </button>

          
          <button type="button" class="textButton cancel" data-xztitle="_取消">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-guanbiquxiao"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="listWrap">
    </div>
  </div>
  `

  // 创建列表外部的容器，静态 html
  private createWrap() {
    this.wrap = Tools.useSlot(this.slotName, this.wrapHTML)! as HTMLDivElement
    this.expandBtn = this.wrap.querySelector('.expand')! as HTMLButtonElement
    this.showAddBtn = this.wrap.querySelector('.showAdd')! as HTMLButtonElement
    this.totalSpan = this.wrap.querySelector('.total')! as HTMLSpanElement
    this.addWrap = this.wrap.querySelector('.addWrap')! as HTMLDivElement
    this.addTagsInput = this.wrap.querySelector(
      '.addTagsInput'
    )! as HTMLInputElement
    this.addRuleInput = this.wrap.querySelector(
      '.addRuleInput'
    )! as HTMLInputElement
    this.addBtn = this.wrap.querySelector('.add')! as HTMLButtonElement
    this.cancelBtn = this.wrap.querySelector('.cancel')! as HTMLButtonElement
    this.listWrap = this.wrap.querySelector('.listWrap')! as HTMLDivElement

    // 展开/折叠按钮
    this.expandBtn.addEventListener('click', () => {
      setSetting(
        'UseDifferentNameRuleIfWorkHasTagShow',
        !settings.UseDifferentNameRuleIfWorkHasTagShow
      )
    })

    // 切换显示添加规则的区域
    this.showAddBtn.addEventListener('click', () => {
      this.addWrapShow = !this.addWrapShow
    })

    // 添加规则的按钮
    this.addBtn.addEventListener('click', () => {
      this.addRule(this.addTagsInput.value, this.addRuleInput.value)
    })

    // 取消添加的按钮
    this.cancelBtn.addEventListener('click', () => {
      this.addWrapShow = false
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'UseDifferentNameRuleIfWorkHasTagShow') {
        this.showListWrap()
      }
      if (data.name === 'UseDifferentNameRuleIfWorkHasTagList') {
        this.createAllList()
      }
    })
  }

  private showListWrap() {
    const show = settings.UseDifferentNameRuleIfWorkHasTagShow
    this.listWrap.style.display = show ? 'flex' : 'none'
    lang.updateText(this.expandBtn, show ? '_收起' : '_展开')
  }

  // 根据规则动态创建 html
  private createAllList() {
    this.totalSpan.textContent =
      settings.UseDifferentNameRuleIfWorkHasTagList.length.toString()
    this.listWrap.innerHTML = ''
    const df = document.createDocumentFragment()
    for (const {
      id,
      tags,
      rule,
    } of settings.UseDifferentNameRuleIfWorkHasTagList) {
      df.append(this.createOneList(id, tags, rule))
    }
    this.listWrap.append(df)
  }

  // 创建规则对应的元素，并绑定事件
  private createOneList(id: number, tags: string[], rule: string) {
    const html = `
      <div class="inputItem id">
        <span>${id}</span>
      </div>

      <div class="inputItem tags">
        <input type="text" class="setinput_style1 blue" data-tagsInput="${id}" value="${tags}" />
      </div>

      <div class="inputItem rule">
        <input type="text" class="has_tip setinput_style1 blue" data-ruleInput="${id}" value="${rule}" />
      </div>

      <div class="btns">
        <button type="button" class="textButton" data-updateRule="${id}" data-xztitle="_更新">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengxin"></use>
          </svg>
        </button>

        <button type="button" class="textButton" data-deleteRule="${id}" data-xztitle="_删除">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shanchu1"></use>
          </svg>
        </button>
    </div>`

    const element = document.createElement('div')
    element.classList.add('settingItem')
    element.dataset.key = id.toString()
    element.innerHTML = html

    const updateRule = element.querySelector(`button[data-updateRule='${id}']`)
    const deleteRule = element.querySelector(`button[data-deleteRule='${id}']`)
    const tagsInput = element.querySelector(
      `input[data-tagsInput='${id}']`
    )! as HTMLInputElement
    const ruleInput = element.querySelector(
      `input[data-ruleInput='${id}']`
    )! as HTMLInputElement

    // 当输入框发生变化时，进行更新
    ;[tagsInput, ruleInput].forEach((el) => {
      el?.addEventListener('change', () => {
        if (el.value) {
          this.updateRule(id, tagsInput.value, ruleInput.value, false)
        }
      })
    })

    // 更新规则
    updateRule?.addEventListener('click', () => {
      this.updateRule(id, tagsInput.value, ruleInput.value)
    })

    // 删除规则
    deleteRule?.addEventListener('click', () => {
      this.deleteRule(id)
    })

    return element
  }

  // 检查用户输入的值
  private checkValue(tagsInput: string, rule: string) {
    if (!tagsInput || !rule) {
      msgBox.error(lang.transl('_必填项不能为空'))
      return false
    }

    return {
      tags: Utils.string2array(tagsInput),
      rule,
    }
  }

  // 添加规则
  private async addRule(tagsInput: string, rule: string) {
    const check = this.checkValue(tagsInput, rule)
    if (!check) {
      return
    }

    const idList = settings.UseDifferentNameRuleIfWorkHasTagList.map(
      (item) => item.id
    )
    const id = idList.length === 0 ? 0 : Math.max(...idList) + 1
    const data = {
      id: id,
      tags: check.tags,
      rule: rule,
    }
    settings.UseDifferentNameRuleIfWorkHasTagList.push(data)

    setSetting(
      'UseDifferentNameRuleIfWorkHasTagList',
      settings.UseDifferentNameRuleIfWorkHasTagList
    )

    console.log(...settings.UseDifferentNameRuleIfWorkHasTagList)
    this.addWrapShow = false

    toast.success(lang.transl('_添加成功'))
  }

  // 更新规则
  // tip 表示是否用显示操作成功的提示。当用户点击了更新按钮时应该显示提示；输入内容变化导致的自动更新可以不显示提示
  private async updateRule(
    id: number,
    tagsInput: string,
    rule: string,
    tip = true
  ) {
    const check = this.checkValue(tagsInput, rule)
    if (!check) {
      return
    }

    let old = settings.UseDifferentNameRuleIfWorkHasTagList.find(
      (item) => item.id === id
    )
    if (old) {
      old.tags = check.tags
      old.rule = rule
    } else {
      return
    }

    setSetting(
      'UseDifferentNameRuleIfWorkHasTagList',
      settings.UseDifferentNameRuleIfWorkHasTagList
    )

    console.log(...settings.UseDifferentNameRuleIfWorkHasTagList)
    this.addWrapShow = false

    if (tip) {
      toast.success(lang.transl('_更新成功'))
    }
  }

  // 删除规则
  private deleteRule(id: number) {
    let index = settings.UseDifferentNameRuleIfWorkHasTagList.findIndex(
      (item) => item.id === id
    )
    if (index > -1) {
      settings.UseDifferentNameRuleIfWorkHasTagList.splice(index, 1)
    } else {
      return
    }

    setSetting(
      'UseDifferentNameRuleIfWorkHasTagList',
      settings.UseDifferentNameRuleIfWorkHasTagList
    )

    console.log(...settings.UseDifferentNameRuleIfWorkHasTagList)
    this.removeListElement(id)
  }

  private removeListElement(id: number) {
    const listElement = this.listWrap.querySelector(
      `.settingItem[data-key='${id}']`
    )
    listElement?.remove()
  }
}

new UseDifferentNameRuleIfWorkHasTag()
