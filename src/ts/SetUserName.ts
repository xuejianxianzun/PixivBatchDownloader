import { Tools } from './Tools'
import { EVT } from './EVT'
import { lang } from './Language'
import { settings, setSetting } from './setting/Settings'
import { theme } from './Theme'
import { toast } from './Toast'
import { msgBox } from './MsgBox'

// 为某些用户设置固定的用户名，或者别名
class SetUserName {
  constructor() {
    this.createWrap()
    theme.register(this.wrap)
    lang.register(this.wrap)
    this.bindEvents()
  }

  private readonly slotName = 'setUserNameSlot'
  private wrap!: HTMLDivElement // 最外层元素

  private expandBtn!: HTMLButtonElement // 展开/折叠 按钮
  private totalSpan!: HTMLSpanElement // 显示规则数量
  private showAddBtn!: HTMLButtonElement // 添加 按钮，点击显示添加区域

  private addWrap!: HTMLDivElement // 用于添加新项目的区域
  private addInputUid!: HTMLInputElement // 用于添加新项目的 uid 的输入框
  private addInputName!: HTMLInputElement // 用于添加新项目的 name 的输入框
  private addBtn!: HTMLButtonElement // 添加 按钮
  private cancelBtn!: HTMLButtonElement // 取消 按钮

  private listWrap!: HTMLDivElement // 列表区域容器

  private _addWrapShow = false

  set addWrapShow(val: boolean) {
    this._addWrapShow = val

    if (val) {
      this.addWrap.style.display = 'flex'
      this.addInputUid.focus()
    } else {
      this.addWrap.style.display = 'none'
      this.addInputUid.value = ''
      this.addInputName.value = ''
    }
  }

  get addWrapShow() {
    return this._addWrapShow
  }

  private wrapHTML = `
  <span class="setUserNameWrap">

    <span class="controlBar">
    <span class="total">0</span>
      <button type="button" class="textButton expand" data-xztext="_收起"></button>
      <button type="button" class="textButton showAdd" data-xztext="_添加"></button>
    </span>

    <div class="addWrap">
      <div class="settingItem addInputWrap" >
        <div class="inputItem uid">
          <span class="label uidLabel" data-xztext="_用户id"></span>
          <input type="text" class="setinput_style1 blue addUidInput" data-xzplaceholder="_必须是数字" />
        </div>

        <div class="inputItem name">
          <span class="label nameLabel" data-xztext="_命名标记user"></span>
          <input type="text" class="setinput_style1 blue addNameInput" />
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
  </span>
  `

  // 创建列表外部的容器，静态 html
  private createWrap() {
    this.wrap = Tools.useSlot(this.slotName, this.wrapHTML)! as HTMLDivElement
    this.expandBtn = this.wrap.querySelector('.expand')! as HTMLButtonElement
    this.showAddBtn = this.wrap.querySelector('.showAdd')! as HTMLButtonElement
    this.totalSpan = this.wrap.querySelector('.total')! as HTMLSpanElement
    this.addWrap = this.wrap.querySelector('.addWrap')! as HTMLDivElement
    this.addInputUid = this.wrap.querySelector(
      '.addUidInput'
    )! as HTMLInputElement
    this.addInputName = this.wrap.querySelector(
      '.addNameInput'
    )! as HTMLInputElement
    this.addBtn = this.wrap.querySelector('.add')! as HTMLButtonElement
    this.cancelBtn = this.wrap.querySelector('.cancel')! as HTMLButtonElement
    this.listWrap = this.wrap.querySelector('.listWrap')! as HTMLDivElement

    // 展开/折叠按钮
    this.expandBtn.addEventListener('click', () => {
      setSetting('setUserNameShow', !settings.setUserNameShow)
    })

    // 切换显示添加规则的区域
    this.showAddBtn.addEventListener('click', () => {
      this.addWrapShow = !this.addWrapShow
    })

    // 添加规则的按钮
    this.addBtn.addEventListener('click', () => {
      this.addRule(this.addInputUid.value, this.addInputName.value)
    })

    // 取消添加的按钮
    this.cancelBtn.addEventListener('click', () => {
      this.addWrapShow = false
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'setUserNameShow') {
        this.showListWrap()
      }
      if (data.name === 'setUserNameList') {
        this.createAllList()
      }
    })
  }

  private showListWrap() {
    const show = settings.setUserNameShow
    this.listWrap.style.display = show ? 'flex' : 'none'
    lang.updateText(this.expandBtn, show ? '_收起' : '_展开')
  }

  // 根据规则动态创建 html
  private createAllList() {
    this.totalSpan.textContent = Object.keys(
      settings.setUserNameList
    ).length.toString()
    this.listWrap.innerHTML = ''
    const df = document.createDocumentFragment()
    for (const [uid, name] of Object.entries(settings.setUserNameList)) {
      df.append(this.createOneList(uid, name))
    }
    this.listWrap.append(df)
  }

  // 创建规则对应的元素，并绑定事件
  private createOneList(uid: string, name: string) {
    const html = `
      <div class="inputItem uid">
        <input type="text" class="setinput_style1 blue" data-uidInput="${uid}" value="${uid}" />
      </div>

      <div class="inputItem name">
        <input type="text" class="setinput_style1 blue" data-nameInput="${uid}" value="${name}" />
      </div>

      <div class="btns">
        <button type="button" class="textButton refresh" data-updateRule="${uid}" data-xztitle="_更新">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengxin"></use>
          </svg>
        </button>

        <button type="button" class="textButton delete" data-deleteRule="${uid}" data-xztitle="_删除">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shanchu1"></use>
          </svg>
        </button>
    </div>`

    const element = document.createElement('div')
    element.classList.add('settingItem')
    element.dataset.key = uid
    element.innerHTML = html

    const updateRule = element.querySelector(`button[data-updateRule='${uid}']`)
    const deleteRule = element.querySelector(`button[data-deleteRule='${uid}']`)
    const uidInput = element.querySelector(
      `input[data-uidInput='${uid}']`
    )! as HTMLInputElement
    const nameInput = element.querySelector(
      `input[data-nameInput='${uid}']`
    )! as HTMLInputElement

      // 当输入框发生变化时，进行更新
      ;[uidInput, nameInput].forEach((el) => {
        el?.addEventListener('change', () => {
          if (el.value) {
            this.updateRule(uid, uidInput.value, nameInput.value, false)
          }
        })
      })

    // 更新规则
    updateRule?.addEventListener('click', () => {
      this.updateRule(uid, uidInput.value, nameInput.value)
    })

    // 删除规则
    deleteRule?.addEventListener('click', () => {
      this.deleteRule(uid)
    })

    return element
  }

  // 检查用户输入的值
  private checkValue(uidInput: string, nameInput: string) {
    if (!uidInput || !nameInput) {
      msgBox.error(lang.transl('_必填项不能为空'))
      return false
    }

    const uid = Number.parseInt(uidInput)
    if (!uid || isNaN(uid)) {
      msgBox.error(lang.transl('_用户ID必须是数字'))
      return false
    }

    return {
      uidInput,
      nameInput,
    }
  }

  // 添加规则
  private addRule(uid: string, name: string) {
    const check = this.checkValue(uid, name)
    if (!check) {
      return
    }

    settings.setUserNameList[uid] = name
    setSetting('setUserNameList', settings.setUserNameList)

    this.addWrapShow = false

    toast.success(lang.transl('_添加成功'))
  }

  // 更新规则
  // tip 表示是否用显示操作成功的提示。当用户点击了更新按钮时应该显示提示；输入内容变化导致的自动更新可以不显示提示
  private updateRule(oldUid: string, uid: string, name: string, tip = true) {
    const check = this.checkValue(uid, name)
    if (!check) {
      return
    }

    delete settings.setUserNameList[oldUid]
    settings.setUserNameList[uid] = name
    setSetting('setUserNameList', settings.setUserNameList)

    this.addWrapShow = false

    if (tip) {
      toast.success(lang.transl('_更新成功'))
    }
  }

  // 删除规则
  private deleteRule(uid: string) {
    delete settings.setUserNameList[uid]
    setSetting('setUserNameList', settings.setUserNameList)

    this.removeListElement(uid)
  }

  private removeListElement(uid: string) {
    const listElement = this.listWrap.querySelector(
      `.settingItem[data-key='${uid}']`
    )
    listElement?.remove()
  }
}

new SetUserName()
