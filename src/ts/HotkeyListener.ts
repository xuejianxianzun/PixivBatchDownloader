import { EVT } from './EVT'
import { settings } from './setting/Settings'
import { HotkeyCommand } from './setting/Settings'

// 录制快捷键期间，临时暂停派发已注册的快捷键命令，避免录入的按键误触发既有动作
let recording = false

/**设置是否处于快捷键录制态；录制期间 HotkeyListener 不会派发命令 */
export function setHotkeyRecording(state: boolean) {
  recording = state
}

// 在内容脚本里集中监听 keydown，并把用户自定义的一级快捷键派发为对应的 EVT 命令事件
// 备注：这个脚本不监听和派发二级快捷键；二级快捷键的监听在各个功能模块里自行处理
class HotkeyListener {
  constructor() {
    this.buildMap()
    this.bindEvents()
  }

  /**按键签名到命令的映射。签名格式：ctrl|alt|shift|meta|key */
  private map: Map<string, HotkeyCommand> = new Map()

  /**根据当前设置，重建“按键签名 -> 命令”映射 */
  private buildMap() {
    this.map.clear()
    const hotkeys = settings.hotkeys
    for (const command of Object.keys(hotkeys) as HotkeyCommand[]) {
      const combo = hotkeys[command]
      if (!combo || !combo.key) {
        continue
      }
      this.map.set(this.signature(combo), command)
    }
  }

  /**把组合转换为可比较的签名 */
  private signature(combo: {
    key: string
    ctrl: boolean
    alt: boolean
    shift: boolean
    meta: boolean
  }): string {
    return `${combo.ctrl ? 1 : 0}${combo.alt ? 1 : 0}${combo.shift ? 1 : 0}${
      combo.meta ? 1 : 0
    }|${combo.key}`
  }

  private bindEvents() {
    // 在捕获阶段监听，以便在必要时阻止默认行为
    window.addEventListener(
      'keydown',
      (ev: KeyboardEvent) => {
        // 录制快捷键期间暂停派发，避免录入的按键触发既有动作
        if (recording) {
          return
        }

        // 排除输入控件里的按键，此时用户可能在输入文本
        if (ev.target) {
          const target = ev.target as HTMLElement
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
          ) {
            return
          }
        }

        const sig = this.signature({
          key: ev.code,
          ctrl: ev.ctrlKey,
          alt: ev.altKey,
          shift: ev.shiftKey,
          meta: ev.metaKey,
        })

        const command = this.map.get(sig)
        if (command) {
          ev.preventDefault()
          EVT.fire(command as any)
        }
      },
      true
    )

    // 用户修改快捷键后热更新映射，无需刷新页面
    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as { name: string; value: unknown }
      if (data.name === 'hotkeys') {
        this.buildMap()
      }
    })
  }
}

const hotkeyListener = new HotkeyListener()

export { hotkeyListener }
