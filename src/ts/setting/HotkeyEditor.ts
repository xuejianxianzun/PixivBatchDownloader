import { Tools } from '../Tools'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { theme } from '../Theme'
import { toast } from '../Toast'
import { msgBox } from '../MsgBox'
import { LangTextKey } from '../langText'
import {
  settings,
  setSetting,
  defaultHotkeys,
  HotkeyCombo,
  HotkeyCommand,
} from '../setting/Settings'
import { setHotkeyRecording } from '../HotkeyListener'
import { Config } from '../Config'

// 在设置面板里查看和修改一级快捷键
class HotkeyEditor {
  constructor() {
    this.wrap = Tools.useSlot('hotkeysEditor', this.wrapHTML)! as HTMLDivElement
    theme.register(this.wrap)
    lang.register(this.wrap)
    this.createAllList()
    this.bindEvents()
  }

  private wrap!: HTMLDivElement

  /**是否正在录制某个快捷键，避免同时录制多个导致错行 */
  private recording = false

  // 命令与显示说明的对应关系（顺序即列表顺序）
  private readonly commandInfo: {
    command: HotkeyCommand
    nameKey: LangTextKey
  }[] = [
    { command: 'commandToggleLogArea', nameKey: '_查看关闭日志区域' },
    {
      command: 'commandToggleSettingsPanel',
      nameKey: '_查看关闭设置面板',
    },
    {
      command: 'commandStartDefaultCrawl',
      nameKey: '_点击默认的抓取按钮',
    },
    { command: 'commandToggleSelectWork', nameKey: '_手动选择作品' },
    { command: 'commandToggleExcludeWork', nameKey: '_手动排除作品' },
    { command: 'commandQuickDownload', nameKey: '_快捷键快速下载' },
    { command: 'commandQuickBookmark', nameKey: '_快速收藏当前作品' },
    { command: 'commandCopyWorkInfo', nameKey: '_复制作品信息' },
    { command: 'commandTogglePreviewWork', nameKey: '_快捷键预览作品' },
  ]

  private wrapHTML = `
  <div class="hotkeyEditorWrap flexBasis100">
    <div class="hotkeyTable">
      <div class="tableHeader">
        <div class="cell" data-xztext="_命令"></div>
        <div class="cell" data-xztext="_快捷键"></div>
        <div class="cell" data-xztext="_操作"></div>
      </div>
      <div class="listWrap"></div>
    </div>
    <div class="btns">
      <button type="button" class="textButton reset borderButton" data-xztext="_重置所有快捷键"></button>
    </div>
  </div>
  `

  private listWrap!: HTMLDivElement

  /**根据设置里的快捷键，重建整个列表 */
  private createAllList() {
    this.listWrap = this.wrap.querySelector('.listWrap') as HTMLDivElement
    this.listWrap.innerHTML = ''
    for (const info of this.commandInfo) {
      this.createList(info.command, info.nameKey)
    }
    lang.register(this.listWrap)
  }

  /**为某个命令创建一行 */
  private createList(command: HotkeyCommand, nameKey: string) {
    const combo = settings.hotkeys[command]
    const valueText =
      combo && combo.key ? this.formatCombo(combo) : lang.transl('_未设置')

    const html = `
    <div class="settingItem" data-command="${command}">
      <div class="cell cellCommand">
        <span class="label" data-xztext="${nameKey}"></span>
      </div>
      <div class="cell cellHotkey">
        <span class="value">${valueText}</span>
        <button type="button" class="textButton escCancel" data-xztext="_Esc取消">Esc 取消</button>
      </div>
      <div class="cell cellAction">
        <button type="button" class="textButton edit" data-xztitle="_修改快捷键">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#category-names-line"></use>
          </svg>
          <span class="buttonLabel" data-xztext="_修改"></span>
        </button>
        <button type="button" class="textButton delete" data-xztitle="_删除快捷键">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#close_cancel"></use>
          </svg>
          <span class="buttonLabel" data-xztext="_清除"></span>
        </button>
      </div>
    </div>`

    this.listWrap.insertAdjacentHTML('beforeend', html)

    const item = this.listWrap.querySelector(
      `.settingItem[data-command='${command}']`
    ) as HTMLDivElement
    const editBtn = item.querySelector('.edit') as HTMLButtonElement
    const deleteBtn = item.querySelector('.delete') as HTMLButtonElement

    editBtn.addEventListener('click', () => {
      this.startRecord(item, command)
    })
    deleteBtn.addEventListener('click', () => {
      this.deleteHotkey(command)
    })
  }

  /**进入录制态：监听用户的按键，只在用户按下“主键”时结束录制 */
  private startRecord(item: HTMLDivElement, command: HotkeyCommand) {
    // 已经在录制其他快捷键时，忽略本次点击
    if (this.recording) {
      return
    }
    this.recording = true
    // 通知派发端暂停派发已有快捷键，避免录入按键误触发既有动作
    setHotkeyRecording(true)

    const valueEl = item.querySelector('.value') as HTMLElement
    valueEl.textContent = lang.transl('_请按下快捷键')
    valueEl.classList.add('recording')
    item.classList.add('recording')

    // 录制期间累计的修饰键状态（解决“先按修饰键、后按主键”时，按下修饰键就会直接结束录制的问题）
    const collected = {
      ctrl: false,
      alt: false,
      shift: false,
      meta: false,
    }

    const finish = () => {
      window.removeEventListener('keydown', handler, true)
      window.removeEventListener('blur', cancel)
      window.removeEventListener('pointerdown', cancel)
      valueEl.classList.remove('recording')
      item.classList.remove('recording')
      this.recording = false
      // 恢复派发已有快捷键
      setHotkeyRecording(false)
    }

    // 取消录制：还原显示，不保存（Esc、窗口失焦、点击任意区域均可触发）
    const cancel = () => {
      finish()
      this.refreshItem(command)
    }

    const handler = (ev: KeyboardEvent) => {
      // 阻止浏览器/系统对保留组合的默认行为（如 Ctrl+T 切标签），避免录制时页面被带走
      ev.preventDefault()
      ev.stopPropagation()

      // 按下 Esc 取消录制
      if (ev.code === 'Escape') {
        cancel()
        return
      }

      // 只按下修饰键时：记录修饰键状态，继续等待主键（不结束录制）
      const modifierCodes = [
        'ShiftLeft',
        'ShiftRight',
        'ControlLeft',
        'ControlRight',
        'AltLeft',
        'AltRight',
        'MetaLeft',
        'MetaRight',
      ]
      if (modifierCodes.includes(ev.code) || ev.code.startsWith('OS')) {
        collected.ctrl = ev.ctrlKey
        collected.alt = ev.altKey
        collected.shift = ev.shiftKey
        collected.meta = ev.metaKey
        return
      }

      // 主键必须是数字或字母，其余按键（如 Tab、CapsLock、功能键等）不接受
      const isMainKey = ev.code.startsWith('Key') || ev.code.startsWith('Digit')
      if (!isMainKey) {
        finish()
        msgBox.error(lang.transl('_快捷键需要主键'))
        this.refreshItem(command)
        return
      }

      // 主键：组装组合并结束录制
      const combo: HotkeyCombo = {
        key: ev.code,
        ctrl: ev.ctrlKey || collected.ctrl,
        alt: ev.altKey || collected.alt,
        shift: ev.shiftKey || collected.shift,
        meta: ev.metaKey || collected.meta,
      }

      // 校验：与另一个一级快捷键重复
      const conflict = this.findConflict(command, combo)
      if (conflict) {
        finish()
        msgBox.error(lang.transl('_快捷键冲突提示', conflict, conflict))
        this.refreshItem(command)
        return
      }

      // 校验：浏览器/系统保留组合
      if (this.isReserved(combo)) {
        finish()
        msgBox.error(lang.transl('_快捷键被浏览器保留'))
        this.refreshItem(command)
        return
      }

      // 通过校验，保存
      const map = { ...settings.hotkeys }
      map[command] = combo
      finish()
      toast.success(lang.transl('_已修改'))
      setSetting('hotkeys', map)
      this.refreshItem(command)
    }

    // 窗口失焦、或点击任意区域都取消录制，避免录制态卡死，也符合用户“点空白处取消”的习惯
    window.addEventListener('keydown', handler, true)
    window.addEventListener('blur', cancel)
    window.addEventListener('pointerdown', cancel)
  }

  /**查找与 combo 冲突的其他命令。如果有冲突会返回已使用该快捷键的命令的名字，没有冲突则会返回 null */
  private findConflict(self: HotkeyCommand, combo: HotkeyCombo): string | null {
    for (const info of this.commandInfo) {
      if (info.command === self) {
        continue
      }
      const other = settings.hotkeys[info.command]
      if (other && other.key && this.sameCombo(other, combo)) {
        return lang.transl(info.nameKey)
      }
    }
    return null
  }

  /**比较两个组合是否相同 */
  private sameCombo(a: HotkeyCombo, b: HotkeyCombo): boolean {
    return (
      a.key === b.key &&
      a.ctrl === b.ctrl &&
      a.alt === b.alt &&
      a.shift === b.shift &&
      a.meta === b.meta
    )
  }

  /**判断是否为浏览器/系统保留组合（这些组合不会到达页面 keydown，设了也不触发） */
  private isReserved(combo: HotkeyCombo): boolean {
    const k = combo.key
    // 仅 Ctrl 修饰的组合里，部分被浏览器占用
    if (combo.ctrl && !combo.alt && !combo.shift && !combo.meta) {
      // 关闭/新建/切换标签、打开下载等
      const reserved = [
        'KeyT',
        'KeyW',
        'KeyN',
        'KeyR',
        'KeyQ',
        'KeyP',
        'KeyL',
        'KeyK',
        'KeyTab',
      ]
      if (reserved.includes(k)) {
        return true
      }
      // Ctrl + 数字 切换标签
      if (k.startsWith('Digit')) {
        return true
      }
    }
    return false
  }

  /**清除某个命令的快捷键 */
  private deleteHotkey(command: HotkeyCommand) {
    const map = { ...settings.hotkeys }
    delete map[command]
    setSetting('hotkeys', map)
    this.refreshItem(command)
    toast.success(lang.transl('_已清除'))
  }

  /**根据当前设置，刷新某一行的显示 */
  private refreshItem(command: HotkeyCommand) {
    const item = this.listWrap.querySelector(
      `.settingItem[data-command='${command}']`
    )
    if (!item) {
      return
    }
    const combo = settings.hotkeys[command]
    const valueEl = item.querySelector('.value') as HTMLElement
    valueEl.textContent =
      combo && combo.key ? this.formatCombo(combo) : lang.transl('_未设置')
  }

  /**把组合格式化为可读文本。Mac 使用特殊符号 */
  private formatCombo(combo: HotkeyCombo): string {
    const parts: string[] = []
    if (combo.ctrl) {
      parts.push(Config.isMac ? '⌃' : 'Ctrl')
    }
    if (combo.alt) {
      parts.push(Config.isMac ? '⌥' : 'Alt')
    }
    if (combo.shift) {
      parts.push(Config.isMac ? '⇧' : 'Shift')
    }
    if (combo.meta) {
      parts.push(Config.isMac ? '⌘' : Config.isWin ? '⊞' : 'Meta')
    }
    parts.push(this.codeToName(combo.key))
    return parts.join(Config.isMac ? '' : '+')
  }

  /**把 KeyboardEvent.code 转换为可读的按键名 */
  private codeToName(code: string): string {
    if (code.startsWith('Key')) {
      return code.slice(3)
    }
    if (code.startsWith('Digit')) {
      return code.slice(5)
    }
    return code
  }

  private bindEvents() {
    // 当快捷键设置被外部修改（例如重置）时，重建整个列表
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as { name: string; value: unknown }
      if (data.name === 'hotkeys') {
        this.createAllList()
      }
    })

    // 重置为默认
    const resetBtn = this.wrap.querySelector('.reset') as HTMLButtonElement
    resetBtn.addEventListener('click', () => {
      const confirm = window.confirm(lang.transl('_重置所有快捷键的提示'))
      if (confirm) {
        setSetting('hotkeys', { ...defaultHotkeys })
        toast.success(lang.transl('_已重置'))
      }
    })
  }
}

const hotkeyEditor = new HotkeyEditor()

export { hotkeyEditor }
