import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { Utils } from '../utils/Utils'
import {
  settings,
  setSetting,
  BlockTagsForSpecificUserItem,
} from '../setting/Settings'
import { API } from '../API'
import { theme } from '../Theme'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'

// 针对特定用户屏蔽 tag
class BlockTagsForSpecificUser {
  constructor() {
    this.createWrap()
    theme.register(this.wrap)
    lang.register(this.wrap)
    this.bindEvents()
  }

  private rules: typeof settings.blockTagsForSpecificUserList = []

  private wrap!: HTMLDivElement // 最外层元素

  private expandBtn!: HTMLButtonElement // 展开/折叠 按钮
  private totalSpan!: HTMLSpanElement // 显示规则数量
  private showAddBtn!: HTMLButtonElement // 添加 按钮，点击显示添加区域

  private addWrap!: HTMLDivElement // 用于添加新项目的区域
  private addInputUid!: HTMLInputElement // 用于添加新项目的 uid 的输入框
  private addInputTags!: HTMLInputElement // 用于添加新项目的 tags 的输入框
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

  private wrapHTML = `
  <div class="blockTagsForSpecificUserWrap">

    <div class="controlBar">
      <span class="total">0</span>
      <button type="button" class="textButton expand" data-xztext="_收起"></button>
      <button type="button" class="textButton showAdd" data-xztext="_添加"></button>
    </div>

    <div class="addWrap">
      <div class="settingItem addInputWrap" >
        <div class="inputItem uid">
          <span class="label uidLabel" data-xztext="_用户id"></span>
          <input type="text" class="setinput_style1 blue addUidInput" data-xzplaceholder="_必须是数字" />
        </div>

        <div class="inputItem tags">
          <span class="label tagsLabel">Tags</span>
          <input type="text" class="setinput_style1 blue addTagsInput" data-xzplaceholder="_tag用逗号分割" />
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

  // 创建列表外部的容器，静态html
  private createWrap() {
    this.wrap = Tools.useSlot(
      'blockTagsForSpecificUser',
      this.wrapHTML
    )! as HTMLDivElement
    this.expandBtn = this.wrap.querySelector('.expand')! as HTMLButtonElement
    this.showAddBtn = this.wrap.querySelector('.showAdd')! as HTMLButtonElement
    this.totalSpan = this.wrap.querySelector('.total')! as HTMLSpanElement
    this.addWrap = this.wrap.querySelector('.addWrap')! as HTMLDivElement
    this.addInputUid = this.wrap.querySelector(
      '.addUidInput'
    )! as HTMLInputElement
    this.addInputTags = this.wrap.querySelector(
      '.addTagsInput'
    )! as HTMLInputElement
    this.addBtn = this.wrap.querySelector('.add')! as HTMLButtonElement
    this.cancelBtn = this.wrap.querySelector('.cancel')! as HTMLButtonElement
    this.listWrap = this.wrap.querySelector('.listWrap')! as HTMLDivElement

    // 展开/折叠
    this.expandBtn.addEventListener('click', () => {
      setSetting(
        'blockTagsForSpecificUserShowList',
        !settings.blockTagsForSpecificUserShowList
      )

      if (
        settings.blockTagsForSpecificUserShowList &&
        this.rules.length === 0
      ) {
        toast.error(lang.transl('_没有数据可供使用'))
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

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'blockTagsForSpecificUserShowList') {
        this.showListWrap()
      }

      if (data.name === 'blockTagsForSpecificUser') {
        this.createAllList()
      }

      if (data.name === 'blockTagsForSpecificUserList') {
        this.createAllList()
      }
    })
  }

  private showListWrap() {
    const show = settings.blockTagsForSpecificUserShowList
    this.listWrap.style.display = show ? 'block' : 'none'
    lang.updateText(this.expandBtn, show ? '_收起' : '_展开')
  }

  // 根据规则动态创建 html
  private createAllList() {
    this.rules = [...settings.blockTagsForSpecificUserList]
    this.wrap.style.display = settings.blockTagsForSpecificUser
      ? 'block'
      : 'none'
    this.totalSpan.textContent = this.rules.length.toString()
    this.listWrap.innerHTML = ''
    for (const data of this.rules) {
      this.createList(data)
    }
  }

  // 创建规则对应的元素，并绑定事件
  private createList(data: BlockTagsForSpecificUserItem) {
    const { uid, user, tags } = data
    const html = `
    <div class="settingItem" data-key="${uid}">
      <div class="inputItem uid">
        <span class="label uidLabel" data-xztext="_用户id"></span>
        <input type="text" class="setinput_style1 blue" data-uidInput="${uid}" value="${uid}" />
      </div>

      <div class="inputItem tags">
        <span class="label tagsLabel">Tags</span>
        <input type="text" class="setinput_style1 blue" data-tagsInput="${uid}" value="${tags.toString()}" />
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
      </div>
    </div>`

    // 倒序显示，早添加的处于底部，晚添加的处于顶部
    this.listWrap.insertAdjacentHTML('afterbegin', html)

    const uidLabel = this.listWrap.querySelector('.uidLabel')! as HTMLElement
    if (user) {
      lang.updateText(uidLabel, '')
      uidLabel.textContent = user
    } else {
      this.updateUserName(data)
    }

    const updateRule = this.listWrap.querySelector(
      `button[data-updateRule='${uid}']`
    )
    const deleteRule = this.listWrap.querySelector(
      `button[data-deleteRule='${uid}']`
    )
    const uidInput = this.listWrap.querySelector(
      `input[data-uidInput='${uid}']`
    )! as HTMLInputElement
    const tagsInput = this.listWrap.querySelector(
      `input[data-tagsInput='${uid}']`
    )! as HTMLInputElement

    // 当输入框发生变化时，进行更新
    ;[uidInput, tagsInput].forEach((el) => {
      el?.addEventListener('change', () => {
        if (el.value) {
          this.updateRule(uid, uidInput.value, tagsInput.value, false)
        }
      })
    })

    // 更新按钮
    updateRule?.addEventListener('click', () => {
      this.updateRule(uid, uidInput.value, tagsInput.value)
    })

    // 删除按钮
    deleteRule?.addEventListener('click', () => {
      this.deleteRule(uid)
    })
  }

  // 如果某个规则没有用户名，就获取用户名储存起来
  private async updateUserName(data: BlockTagsForSpecificUserItem) {
    const profile = await API.getUserProfile(data.uid.toString()).catch(
      (err) => {
        console.log(err)
      }
    )
    if (profile && profile.body.name) {
      const name = profile.body.name
      const index = this.findIndex(data.uid)
      if (index > -1) {
        this.rules[index].user = name
        setSetting('blockTagsForSpecificUserList', [...this.rules])

        // 显示到页面上
        const listElement = this.listWrap.querySelector(
          `.settingItem[data-key='${data.uid}']`
        )
        if (listElement) {
          const label = listElement.querySelector('.uidLabel')
          label && (label.textContent = name)
        }
      }
    }
  }

  // 检查用户输入的值
  private checkValue(uidInput: string, tagsInput: string) {
    const tags = Utils.string2array(tagsInput)

    if (!uidInput || !tagsInput || tags.length === 0) {
      msgBox.error(lang.transl('_必填项不能为空'))
      return false
    }

    const uid = Number.parseInt(uidInput)
    if (!uid || isNaN(uid)) {
      msgBox.error(lang.transl('_用户ID必须是数字'))
      return false
    }

    return {
      uid,
      tags,
    }
  }

  private findIndex(uid: number) {
    return this.rules.findIndex((rule) => rule.uid === uid)
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

    this.addWrapShow = false
    this.rules.push(check)
    setSetting('blockTagsForSpecificUserList', [...this.rules])
    setSetting('blockTagsForSpecificUserShowList', true)

    toast.success(lang.transl('_添加成功'))
  }

  // 更新规则
  // tip 表示是否用消息框进行提示。当用户点击了更新按钮时应该显示提示；输入内容变化导致的自动更新可以不显示提示
  private updateRule(
    oldUid: number,
    uidInput: string,
    tagsInput: string,
    tip = true
  ) {
    const check = this.checkValue(uidInput, tagsInput)
    if (!check) {
      return
    }

    const listElement = this.listWrap.querySelector(
      `.settingItem[data-key='${oldUid}']`
    )
    listElement?.remove()

    const index = this.findIndex(oldUid)
    this.rules[index] = check
    setSetting('blockTagsForSpecificUserList', [...this.rules])

    if (tip) {
      toast.success(lang.transl('_更新成功'))
    }

    this.addWrapShow = false
  }

  // 删除规则
  private deleteRule(uid: number) {
    const index = this.findIndex(uid)
    this.rules.splice(index, 1)
    setSetting('blockTagsForSpecificUserList', [...this.rules])

    const listElement = this.listWrap.querySelector(
      `.settingItem[data-key='${uid}']`
    )
    listElement?.remove()
  }

  // 如果找到了符合的记录，则返回 true
  public check(uid: string | number, tags: string[]) {
    if (typeof uid === 'string') {
      uid = Number.parseInt(uid)
    }

    // 查找有无记录
    const index = this.findIndex(uid)
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
