import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { settings, setSetting } from './Settings'
import { theme } from '../Theme'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'

// 设置标签别名
// 这个类是从 setUserName 复制过来修改的，复用了一些样式名
class SetTagAlias {
  constructor() {
    this.createWrap()
    theme.register(this.wrap)
    lang.register(this.wrap)
    this.bindEvents()
  }

  private readonly slotName = 'setTagAliasSlot'
  private wrap!: HTMLDivElement // 最外层元素

  private expandBtn!: HTMLButtonElement // 展开/折叠 按钮
  private totalSpan!: HTMLSpanElement // 显示规则数量
  private showAddBtn!: HTMLButtonElement // 添加 按钮，点击显示添加区域

  private addWrap!: HTMLDivElement // 用于添加新项目的区域
  private addInputAlias!: HTMLInputElement // 用于添加新项目的 alias 的输入框
  private addInputTags!: HTMLInputElement // 用于添加新项目的 tags 的输入框
  private addBtn!: HTMLButtonElement // 添加 按钮
  private cancelBtn!: HTMLButtonElement // 取消 按钮

  private listWrap!: HTMLDivElement // 列表区域容器

  private _addWrapShow = false

  set addWrapShow(val: boolean) {
    this._addWrapShow = val

    if (val) {
      this.addWrap.style.display = 'flex'
      this.addInputAlias.focus()
    } else {
      this.addWrap.style.display = 'none'
      this.addInputAlias.value = ''
      this.addInputTags.value = ''
    }
  }

  get addWrapShow() {
    return this._addWrapShow
  }

  private wrapHTML = `
  <span class="setUserNameWrap setTagAliasWrap">

    <span class="controlBar">
    <span class="total">0</span>
      <button type="button" class="textButton expand" data-xztext="_收起"></button>
      <button type="button" class="textButton showAdd" data-xztext="_添加"></button>
    </span>

    <div class="addWrap">
      <div class="settingItem addInputWrap" >
        <div class="inputItem uid">
          <span class="label uidLabel" data-xztext="_别名"></span>
          <input type="text" class="setinput_style1 blue addUidInput" />
        </div>

        <div class="inputItem name">
          <span class="label nameLabel" data-xztext="_标签列表"></span>
          <input type="text" class="setinput_style1 blue addNameInput" placeholder="tag1,tag2,tag3" />
        </div>

        <div class="btns">
          <button type="button" class="textButton add" data-xztitle="_添加">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yes_submit"></use>
            </svg>
          </button>

          <button type="button" class="textButton cancel" data-xztitle="_取消">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close_cancel"></use>
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
    this.addInputAlias = this.wrap.querySelector(
      '.addUidInput'
    )! as HTMLInputElement
    this.addInputTags = this.wrap.querySelector(
      '.addNameInput'
    )! as HTMLInputElement
    this.addBtn = this.wrap.querySelector('.add')! as HTMLButtonElement
    this.cancelBtn = this.wrap.querySelector('.cancel')! as HTMLButtonElement
    this.listWrap = this.wrap.querySelector('.listWrap')! as HTMLDivElement

    // 展开/折叠按钮
    this.expandBtn.addEventListener('click', () => {
      setSetting('setTagAliasShow', !settings.setTagAliasShow)
    })

    // 切换显示添加规则的区域
    this.showAddBtn.addEventListener('click', () => {
      this.addWrapShow = !this.addWrapShow
    })

    // 添加规则的按钮
    this.addBtn.addEventListener('click', () => {
      this.addRule(this.addInputAlias.value, this.addInputTags.value)
    })

    // 取消添加的按钮
    this.cancelBtn.addEventListener('click', () => {
      this.addWrapShow = false
    })
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'setTagAliasShow') {
        this.showListWrap()
      }
      if (data.name === 'setTagAliasList') {
        this.createAllList()
        this.updateCache()
      }
    })
  }

  private showListWrap() {
    const show = settings.setTagAliasShow
    this.listWrap.style.display = show ? 'flex' : 'none'
    lang.updateText(this.expandBtn, show ? '_收起' : '_展开')
  }

  // 根据规则动态创建 html
  private createAllList() {
    this.totalSpan.textContent = Object.keys(
      settings.setTagAliasList
    ).length.toString()
    this.listWrap.innerHTML = ''
    const df = document.createDocumentFragment()
    for (const [alias, tags] of Object.entries(settings.setTagAliasList)) {
      df.append(this.createOneList(alias, tags))
    }
    this.listWrap.append(df)
  }

  // 创建规则对应的元素，并绑定事件
  private createOneList(alias: string, tags: string) {
    const html = `
        <input type="text" class="setinput_style1 blue alias" data-uidInput="${alias}" value="${alias}" />
        <input type="text" class="setinput_style1 blue tags" data-nameInput="${alias}" value="${tags}" />
        <button type="button" class="textButton delete" data-deleteRule="${alias}" data-xztitle="_删除">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-delete"></use>
          </svg>
        </button>`

    const element = document.createElement('div')
    element.classList.add('settingItem')
    element.dataset.key = alias
    element.innerHTML = html

    const deleteRule = element.querySelector(
      `button[data-deleteRule='${alias}']`
    )
    const uidInput = element.querySelector(
      `input[data-uidInput='${alias}']`
    )! as HTMLInputElement
    const nameInput = element.querySelector(
      `input[data-nameInput='${alias}']`
    )! as HTMLInputElement

    // 当输入框发生变化时，进行更新
    ;[uidInput, nameInput].forEach((el) => {
      el?.addEventListener('change', () => {
        if (el.value) {
          this.updateRule(alias, uidInput.value, nameInput.value)
        }
      })
    })

    // 删除规则
    deleteRule?.addEventListener('click', () => {
      this.deleteRule(alias)
    })

    return element
  }

  // 检查用户输入的值
  private checkValue(aliasInput: string, tagsInput: string) {
    if (!aliasInput || !tagsInput) {
      const msg =
        lang.transl('_标签别名') + ':<br>' + lang.transl('_必填项不能为空')
      msgBox.error(msg)
      return false
    }

    return {
      aliasInput,
      tagsInput,
    }
  }

  // 添加规则
  private addRule(alias: string, tags: string) {
    const check = this.checkValue(alias, tags)
    if (!check) {
      return
    }

    settings.setTagAliasList[alias] = tags
    setSetting('setTagAliasList', settings.setTagAliasList)

    this.addWrapShow = false

    toast.success(lang.transl('_添加成功'))
  }

  // 更新规则
  // tip 表示是否用显示操作成功的提示。当用户点击了更新按钮时应该显示提示；输入内容变化导致的自动更新可以不显示提示
  private updateRule(
    oldAlias: string,
    alias: string,
    tags: string,
    tip = true
  ) {
    const check = this.checkValue(alias, tags)
    if (!check) {
      return
    }

    delete settings.setTagAliasList[oldAlias]
    alias = alias.trim()
    settings.setTagAliasList[alias] = tags
    setSetting('setTagAliasList', settings.setTagAliasList)

    this.addWrapShow = false

    if (tip) {
      toast.success(lang.transl('_更新成功'))
    }
  }

  // 删除规则
  private deleteRule(alias: string) {
    const confirm = window.confirm(lang.transl('_确定要删除这一条配置吗'))
    if (!confirm) {
      return
    }

    delete settings.setTagAliasList[alias]
    setSetting('setTagAliasList', settings.setTagAliasList)
    this.removeListElement(alias)
  }

  private removeListElement(alias: string) {
    const listElement = this.listWrap.querySelector(
      `.settingItem[data-key='${alias}']`
    )
    listElement?.remove()
  }

  private cache: Record<string, string[]> = {}

  /** 每当 setTagAliasList 变化时，把每个 tags 转换成数组，生成缓存数据，以避免在匹配时重复创建数组 */
  private updateCache() {
    const cache: Record<string, string[]> = {}
    for (const [alias, tags] of Object.entries(settings.setTagAliasList)) {
      cache[alias] = tags.split(',').map((t) => t.trim().toLowerCase())
    }
    this.cache = cache
  }

  /** 传入一个标签，查找用户是否为它设置了别名 */
  public findAlias(tag: string): string | null {
    for (const [alias, tags] of Object.entries(this.cache)) {
      // 把传入的标签转换成小写，并移除收藏数量标记
      // 标签后面可能有数字+users入り的收藏数量标记，例如：原神10000users入り
      const cleanTag = tag
        .toLowerCase()
        .replace(/\d+users入り$/, '')
        .trim()
      if (tags.includes(cleanTag)) {
        return alias
      }
    }
    return null
  }

  /** 如果一个标签有对应的别名，就把它替换成别名 */
  public handleTagsNamingRule(tags: string[]): string[] {
    if (!settings.useTagAliasForTagsNamingRule) {
      return tags
    }

    const set: Set<string> = new Set()
    for (const tag of tags) {
      const alias = this.findAlias(tag)
      if (alias) {
        set.add(alias)
        // 特殊处理：如果标签里有收藏数量标记（例如：原神10000users入り），会同时添加别名和原标签
        // 因为别名里没有收藏数量，只添加别名的话会丢失收藏数量的信息
        if (tag.includes('users入り')) {
          set.add(tag)
        }
      } else {
        set.add(tag)
      }
    }
    return Array.from(set)
  }
}

const setTagAlias = new SetTagAlias()
export { setTagAlias }
