import { settings, setSetting } from './Settings'
import { log } from '../Log'
import { toast } from '../Toast'

interface List {
  name: keyof typeof settings
  code: string
}

// 控制不可见的设置。通过预设的按键，切换其开关状态
class InvisibleSettings {
  constructor() {
    this.bindEvents()
  }

  private readonly list: List[] = [
    {
      name: 'createFolderBySl',
      code: 'switchsl',
    },
    {
      name: 'createFolderBySl',
      code: 'qw111',
    },
  ]

  private readonly codeStart = 'Key'

  private input = ''

  private bindEvents() {
    window.addEventListener('keydown', (ev) => {
      // 不记录控制按键，不记录输入状态中的按键
      if (
        ev.altKey ||
        ev.ctrlKey ||
        ev.metaKey ||
        ev.shiftKey ||
        ev.isComposing
      ) {
        return
      }

      // 只记录 26 个字母的按键
      // 例如 "KeyX"
      if (ev.code.startsWith(this.codeStart) && ev.code.length === 4) {
        const key = ev.code[3].toLowerCase()
        this.input += key
        this.check()
      }
    })
  }

  private check() {
    for (const item of this.list) {
      if (this.input.endsWith(item.code)) {
        const nowValue = settings[item.name]
        if (typeof nowValue !== 'boolean') {
          return
        }

        // 如果查找到了符合的记录，则反转这个设置的值
        const newValue = !settings[item.name]
        setSetting(item.name, newValue)

        // 显示提示信息
        if (settings[item.name]) {
          const msg = item.name + ' on'
          log.success(msg)
          toast.success(msg)
        } else {
          const msg = item.name + ' off'
          log.warning(msg)
          toast.warning(msg)
        }
      }
    }
  }
}

new InvisibleSettings()
