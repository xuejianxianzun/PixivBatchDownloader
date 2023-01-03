import { API } from '../API'
import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { settings, setSetting } from './Settings'
import { theme } from '../Theme'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'

// 针对某些用户,不下载他们的多图作品的最后几张图片
class DoNotDownloadLastFewImages {
  constructor() {
    this.createWrap()
    theme.register(this.wrap)
    lang.register(this.wrap)
    this.bindEvents()
  }

  private readonly slotName = 'DoNotDownloadLastFewImagesSlot'
  private wrap!: HTMLDivElement // 最外层元素

  private expandBtn!: HTMLButtonElement // 展开/折叠 按钮
  private totalSpan!: HTMLSpanElement // 显示规则数量
  private showAddBtn!: HTMLButtonElement // 添加 按钮，点击显示添加区域

  private addWrap!: HTMLDivElement // 用于添加新项目的区域
  private addInputUid!: HTMLInputElement // 用于添加新项目的 uid 的输入框
  private addValueInput!: HTMLInputElement // 用于添加新项目的 name 的输入框
  private addBtn!: HTMLButtonElement // 添加 按钮
  private cancelBtn!: HTMLButtonElement // 取消 按钮

  private listWrap!: HTMLDivElement // 列表区域容器

  private _addWrapShow = false

  set addWrapShow(val: boolean) {
    this._addWrapShow = val

    if (val) {
      this.addWrap.style.display = 'block'
      this.addInputUid.focus()
    } else {
      this.addWrap.style.display = 'none'
      this.addInputUid.value = ''
      this.addValueInput.value = ''
    }
  }

  get addWrapShow() {
    return this._addWrapShow
  }

  private wrapHTML = `
  <span class="DoNotDownloadLastFewImagesWarp">

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

        <div class="inputItem value">
          <span class="label nameLabel" data-xztext="_不下载最后几张图片"></span>
          <input type="text" class="has_tip setinput_style1 blue addValueInput" data-xztip="_提示0表示不生效" />
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
    this.addValueInput = this.wrap.querySelector(
      '.addValueInput'
    )! as HTMLInputElement
    this.addBtn = this.wrap.querySelector('.add')! as HTMLButtonElement
    this.cancelBtn = this.wrap.querySelector('.cancel')! as HTMLButtonElement
    this.listWrap = this.wrap.querySelector('.listWrap')! as HTMLDivElement

    // 展开/折叠按钮
    this.expandBtn.addEventListener('click', () => {
      setSetting(
        'DoNotDownloadLastFewImagesShow',
        !settings.DoNotDownloadLastFewImagesShow
      )
    })

    // 切换显示添加规则的区域
    this.showAddBtn.addEventListener('click', () => {
      this.addWrapShow = !this.addWrapShow
    })

    // 添加规则的按钮
    this.addBtn.addEventListener('click', () => {
      this.addRule(this.addInputUid.value, this.addValueInput.value)
    })

    // 取消添加的按钮
    this.cancelBtn.addEventListener('click', () => {
      this.addWrapShow = false
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'DoNotDownloadLastFewImagesShow') {
        this.showListWrap()
      }
      if (data.name === 'DoNotDownloadLastFewImagesList') {
        this.createAllList()
      }
    })
  }

  private showListWrap() {
    const show = settings.DoNotDownloadLastFewImagesShow
    this.listWrap.style.display = show ? 'flex' : 'none'
    lang.updateText(this.expandBtn, show ? '_收起' : '_展开')
  }

  // 根据规则动态创建 html
  private createAllList() {
    this.totalSpan.textContent =
      settings.DoNotDownloadLastFewImagesList.length.toString()
    this.listWrap.innerHTML = ''
    const df = document.createDocumentFragment()
    for (const {
      uid,
      user,
      value,
    } of settings.DoNotDownloadLastFewImagesList) {
      df.append(this.createOneList(uid, user, value))
    }
    this.listWrap.append(df)
  }

  // 创建规则对应的元素，并绑定事件
  private createOneList(uid: number, user: string, value: number) {
    const html = `
      <div class="inputItem user">
        <span>${user}</span>
      </div>

      <div class="inputItem uid">
        <input type="text" class="setinput_style1 blue" data-uidInput="${uid}" value="${uid}" />
      </div>

      <div class="inputItem value">
        <input type="text" class="has_tip setinput_style1 blue" data-valueInput="${uid}" value="${value}" data-xztip="_提示0表示不生效" />
      </div>

      <div class="btns">
        <button type="button" class="textButton" data-updateRule="${uid}" data-xztitle="_更新">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gengxin"></use>
          </svg>
        </button>

        <button type="button" class="textButton" data-deleteRule="${uid}" data-xztitle="_删除">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shanchu1"></use>
          </svg>
        </button>
    </div>`

    const element = document.createElement('div')
    element.classList.add('settingItem')
    element.dataset.key = uid.toString()
    element.innerHTML = html

    const updateRule = element.querySelector(`button[data-updateRule='${uid}']`)
    const deleteRule = element.querySelector(`button[data-deleteRule='${uid}']`)
    const uidInput = element.querySelector(
      `input[data-uidInput='${uid}']`
    )! as HTMLInputElement
    const valueInput = element.querySelector(
      `input[data-valueInput='${uid}']`
    )! as HTMLInputElement

    // 当输入框发生变化时，进行更新
    ;[uidInput, valueInput].forEach((el) => {
      el?.addEventListener('change', () => {
        if (el.value) {
          this.updateRule(uid, uidInput.value, valueInput.value, false)
        }
      })
    })

    // 更新规则
    updateRule?.addEventListener('click', () => {
      this.updateRule(uid, uidInput.value, valueInput.value)
    })

    // 删除规则
    deleteRule?.addEventListener('click', () => {
      this.deleteRule(uid)
    })

    return element
  }

  // 检查用户输入的值
  private checkValue(uidInput: string, value: string) {
    if (!uidInput || !value) {
      msgBox.error(lang.transl('_必填项不能为空'))
      return false
    }

    const uid = Number.parseInt(uidInput)
    if (!uid || isNaN(uid)) {
      msgBox.error(lang.transl('_用户ID必须是数字'))
      return false
    }

    // value 允许为 0
    const val = Number.parseInt(value)
    if (isNaN(val) || val < 0) {
      msgBox.error(
        lang.transl('_不下载最后几张图片') + ' ' + lang.transl('_必须是数字')
      )
      return false
    }

    return {
      uid,
      val,
    }
  }

  private async getUserName(uid: number): Promise<string> {
    return new Promise(async (resolve) => {
      const profile = await API.getUserProfile(uid.toString()).catch((err) => {
        console.log(err)
      })
      if (profile && profile.body.name) {
        return resolve(profile.body.name)
      }
      return resolve('')
    })
  }

  // 添加规则
  private async addRule(uid: string, value: string) {
    const check = this.checkValue(uid, value)
    if (!check) {
      return
    }

    let old = settings.DoNotDownloadLastFewImagesList.find(
      (item) => item.uid === check.uid
    )
    if (old) {
      old.value = check.val
    } else {
      const user = await this.getUserName(check.uid)
      const data = {
        uid: check.uid,
        user: user,
        value: check.val,
      }
      settings.DoNotDownloadLastFewImagesList.push(data)
    }

    setSetting(
      'DoNotDownloadLastFewImagesList',
      settings.DoNotDownloadLastFewImagesList
    )

    this.addWrapShow = false

    toast.success(lang.transl('_添加成功'))
  }

  // 更新规则
  // tip 表示是否用显示操作成功的提示。当用户点击了更新按钮时应该显示提示；输入内容变化导致的自动更新可以不显示提示
  private async updateRule(
    oldUid: number,
    uid: string,
    value: string,
    tip = true
  ) {
    const check = this.checkValue(uid, value)
    if (!check) {
      return
    }

    let old = settings.DoNotDownloadLastFewImagesList.find(
      (item) => item.uid === oldUid
    )
    if (old) {
      // 更新时如果 uid 未改变，依然会获取用户名，因为用户名可能更新了
      const user = await this.getUserName(check.uid)
      old.uid = check.uid
      old.user = user
      old.value = check.val
    } else {
      return
    }

    setSetting(
      'DoNotDownloadLastFewImagesList',
      settings.DoNotDownloadLastFewImagesList
    )

    this.addWrapShow = false

    if (tip) {
      toast.success(lang.transl('_更新成功'))
    }
  }

  // 删除规则
  private deleteRule(uid: number) {
    let index = settings.DoNotDownloadLastFewImagesList.findIndex(
      (item) => item.uid === uid
    )
    if (index > -1) {
      settings.DoNotDownloadLastFewImagesList.splice(index, 1)
    } else {
      return
    }

    setSetting(
      'DoNotDownloadLastFewImagesList',
      settings.DoNotDownloadLastFewImagesList
    )

    this.removeListElement(uid)
  }

  private removeListElement(uid: number) {
    const listElement = this.listWrap.querySelector(
      `.settingItem[data-key='${uid}']`
    )
    listElement?.remove()
  }
}

new DoNotDownloadLastFewImages()
