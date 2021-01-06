import { DOM } from '../DOM'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { Tools } from '../Tools'
import { settings, setSetting } from '../setting/Settings'

// 针对特定用户屏蔽 tag
class BlockTagsForSpecificUser {
  constructor() {
    this.getRule()

    this.createWrap()
    this.createAllList()

    this.listWrapShow = this.listWrapShow
    this.updateWrapDisplay()

    this.bindEvents()
  }

  private rules: typeof settings.blockTagsForSpecificUserList = []

  private wrap!: HTMLDivElement  // 最外层元素

  private expandBtn!: HTMLButtonElement // 展开/折叠 按钮
  private showAddBtn!: HTMLButtonElement // 添加 按钮，点击显示添加区域

  private addWrap!: HTMLDivElement  // 用于添加新项目的区域
  private addInputUid!: HTMLInputElement  // 用于添加新项目的 uid 的输入框
  private addInputTags!: HTMLInputElement  // 用于添加新项目的 tags 的输入框
  private addBtn!: HTMLButtonElement // 添加 按钮
  private cancelBtn!: HTMLButtonElement // 取消 按钮

  private listWrap!: HTMLDivElement // 列表区域容器

  private _addWrapShow = false

  set addWrapShow(val: boolean) {
    this._addWrapShow = val
    this.addWrap.style.display = val ? 'block' : 'none'

    if (!val) {
      this.addInputUid.value = ''
      this.addInputTags.value = ''
    }
  }

  get addWrapShow() {
    return this._addWrapShow
  }

  set listWrapShow(val: boolean) {
    setSetting('blockTagsForSpecificUserShowList', val)

    this.listWrap.style.display = val ? 'block' : 'none'

    this.expandBtn.textContent = val ? lang.transl('_收起') : lang.transl('_展开')
  }

  get listWrapShow() {
    return settings.blockTagsForSpecificUserShowList
  }

  private wrapHTML = `
  <div class="blockTagsForSpecificUserWrap">

    <div class="controlBar">
      <button type="button" class="textButton gray1 expand">${lang.transl('_收起')}</button>
      <button type="button" class="textButton gray1 showAdd">${lang.transl('_添加')}</button>
    </div>

    <div class="addWrap">
      <div class="settingItem addInputWrap" >
        <div class="inputItem uid">
          <span class="label uidLabel">${lang.transl('_用户id')}</span>
          <input type="text" class="setinput_style1 blue addUidInput" placeholder="${lang.transl('_用户ID必须是数字')}" />
        </div>

        <div class="inputItem tags">
          <span class="label tagsLabel">Tags</span>
          <input type="text" class="setinput_style1 blue addTagsInput" placeholder="${lang.transl('_tag用逗号分割')}" />
        </div>

        <div class="btns">
          <button type="button" class="textButton add">${lang.transl('_添加')}</button>
          <button type="button" class="textButton cancel">${lang.transl('_取消')}</button>
        </div>
      </div>
    </div>

    <div class="listWrap">
    </div>
  </div>
  `

  // 创建列表外部的容器，静态html
  private createWrap() {
    this.wrap = DOM.useSlot('blockTagsForSpecificUser', this.wrapHTML)! as HTMLDivElement
    this.expandBtn = this.wrap.querySelector('.expand')! as HTMLButtonElement
    this.showAddBtn = this.wrap.querySelector('.showAdd')! as HTMLButtonElement
    this.addWrap = this.wrap.querySelector('.addWrap')! as HTMLDivElement
    this.addInputUid = this.wrap.querySelector('.addUidInput')! as HTMLInputElement
    this.addInputTags = this.wrap.querySelector('.addTagsInput')! as HTMLInputElement
    this.addBtn = this.wrap.querySelector('.add')! as HTMLButtonElement
    this.cancelBtn = this.wrap.querySelector('.cancel')! as HTMLButtonElement
    this.listWrap = this.wrap.querySelector('.listWrap')! as HTMLDivElement

    // 展开/折叠
    this.expandBtn.addEventListener('click', () => {
      this.listWrapShow = !this.listWrapShow

      if (this.listWrapShow && this.rules.length === 0) {
        EVT.sendMsg({
          msg: lang.transl('_没有数据可供使用'),
          type: 'error',
        })
      }
    })

    // 切换显示添加区域
    this.showAddBtn.addEventListener('click', () => {
      this.addWrapShow = !this.addWrapShow
      if (this.addWrapShow) {
        this.addInputUid.focus()
      }
    })

    // 添加规则的按钮
    this.addBtn.addEventListener('click', () => {
      this.addRule(this.addInputUid.value, this.addInputTags.value)
    })

    // 取消添加的按钮
    this.cancelBtn.addEventListener('click', () => {
      this.addWrapShow = false
    })
  }

  // 根据规则动态创建 html
  private createAllList() {
    for (const data of this.rules) {
      const { uid, tags } = data
      this.createList(uid, tags)
    }
  }

  // 创建规则对应的元素，并绑定事件
  private createList(uid: number, tags: string[]) {
    const html = `
    <div class="settingItem" data-key="${uid}">
      <div class="inputItem uid">
        <span class="label uidLabel">${lang.transl('_用户id')}</span>
        <input type="text" class="setinput_style1 blue" data-uidInput="${uid}" value="${uid}" />
      </div>

      <div class="inputItem tags">
        <span class="label tagsLabel">Tags</span>
        <input type="text" class="setinput_style1 blue" data-tagsInput="${uid}" value="${tags.toString()}" />
      </div>

      <div class="btns">
        <button type="button" class="textButton" data-updateRule="${uid}">${lang.transl('_更新')}</button>
        <button type="button" class="textButton" data-deleteRule="${uid}">${lang.transl('_删除')}</button>
      </div>
    </div>`

    // 倒序显示，早添加的处于底部，晚添加的处于顶部
    this.listWrap.insertAdjacentHTML('afterbegin', html)

    const updateRule = this.listWrap.querySelector(`button[data-updateRule='${uid}']`)
    const deleteRule = this.listWrap.querySelector(`button[data-deleteRule='${uid}']`)
    const uidInput = this.listWrap.querySelector(`input[data-uidInput='${uid}']`)! as HTMLInputElement
    const tagsInput = this.listWrap.querySelector(`input[data-tagsInput='${uid}']`)! as HTMLInputElement

    // 更新
    updateRule?.addEventListener('click', () => {
      this.updateRule(uid, uidInput.value, tagsInput.value)
    })

    // 删除
    deleteRule?.addEventListener('click', () => {
      this.deleteRule(uid)
    })
  }

  // 检查用户输入的值
  private checkValue(uidInput: string, tagsInput: string) {
    const tags = Tools.string2array(tagsInput)

    if (!uidInput || !tagsInput || tags.length === 0) {
      EVT.sendMsg({
        type: 'error',
        msg: lang.transl('_必填项不能为空')
      })
      return false
    }

    const uid = Number.parseInt(uidInput)
    if (!uid || isNaN(uid)) {
      EVT.sendMsg({
        type: 'error',
        msg: lang.transl('_用户ID必须是数字')
      })
      return false
    }

    return {
      uid,
      tags,
    }
  }

  private findIndex(uid: number) {
    return this.rules.findIndex(rule => rule.uid === uid)
  }

  // 添加规则
  private addRule(uidInput: string, tagsInput: string) {
    const check = this.checkValue(uidInput, tagsInput)
    if (!check) {
      return
    }
    const { uid, tags } = check

    // 查找这个用户是否已经被添加过，如果添加过，则改为更新，而不是添加新规则
    const index = this.findIndex(uid)
    if (index > -1) {
      // 把两次的 tag 合并起来
      const joinTags = this.rules[index].tags.concat(tags)
      return this.updateRule(uid, uid.toString(), joinTags.toString())
    }

    this.rules.push(check)
    setSetting('blockTagsForSpecificUserList', [...this.rules])

    this.createList(uid, tags)

    this.addWrapShow = false

    this.listWrapShow = true

    EVT.sendMsg({
      type: 'success',
      msg: lang.transl('_添加成功')
    })
  }

  // 更新规则
  private updateRule(oldUid: number, uidInput: string, tagsInput: string) {
    const check = this.checkValue(uidInput, tagsInput)
    if (!check) {
      return
    }
    const { uid, tags } = check

    const index = this.findIndex(oldUid)
    this.rules[index] = check
    setSetting('blockTagsForSpecificUserList', [...this.rules])

    const listElement = this.listWrap.querySelector(`.settingItem[data-key='${oldUid}']`)
    listElement?.remove()

    this.createList(uid, tags)

    EVT.sendMsg({
      type: 'success',
      msg: lang.transl('_更新成功')
    })

    this.addWrapShow = false
  }

  // 删除规则
  private deleteRule(uid: number) {
    const index = this.findIndex(uid)
    this.rules.splice(index, 1)
    setSetting('blockTagsForSpecificUserList', [...this.rules])

    const listElement = this.listWrap.querySelector(`.settingItem[data-key='${uid}']`)
    listElement?.remove()
  }


  private getRule() {
    this.rules = [...settings.blockTagsForSpecificUserList]
  }

  private updateWrapDisplay() {
    this.wrap.style.display = settings.blockTagsForSpecificUser ? "block" : 'none'
  }

  private bindEvents() {
    // 选项变化
    window.addEventListener(EVT.list.settingChange, () => {
      this.updateWrapDisplay()
    })

    // 选项重置
    window.addEventListener(EVT.list.resetSettingsEnd, () => {
      this.getRule()

      this.listWrap.innerHTML = ''
      this.createAllList()
      this.listWrapShow = this.listWrapShow
    })
  }

  // 如果找到了符合的记录，则返回 true
  public check(uid: string, tags: string[]) {
    // 查找有无记录
    const index = this.findIndex(Number.parseInt(uid))
    if (index === -1) {
      return false
    }

    // 如果有记录则判断是否有相同的 tag，有任意一个就返回
    const rule = this.rules[index]
    const tagsString = tags.toString().toLowerCase()
    for (const tag of rule.tags) {
      if (tagsString.includes(tag.toLowerCase())) {
        return true
      }
    }

    // 没有相同的 tag
    return false
  }
}

const blockTagsForSpecificUser = new BlockTagsForSpecificUser()

export { blockTagsForSpecificUser }