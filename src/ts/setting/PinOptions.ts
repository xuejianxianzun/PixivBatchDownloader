import { EVT } from '../EVT'
import { lang } from '../Language'
import { states } from '../store/States'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { settings, setSetting } from './Settings'

/** 管理置顶的选项 */
class PinOptions {
  public init(allOption: NodeListOf<HTMLElement>) {
    // 不在 pixivision 上启用
    if (!Utils.isPixiv()) {
      return
    }

    this.allOption = allOption
    this.bindEvents()
  }

  private allOption!: NodeListOf<HTMLElement>
  private pinnedClassName = 'pinned'

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.bindLongPress()
      this.syncPinnedClass()
    })

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      if (!states.settingInitialized) {
        return
      }
      const data = ev.detail.data as any
      if (data.name === 'pinnedOptionsV2') {
        this.syncPinnedClass()
      }
    })
  }

  private bindLongPress() {
    for (const option of this.allOption) {
      const no = option.dataset.no
      if (!no || option.dataset.pinBound === 'true') {
        continue
      }

      option.dataset.pinBound = 'true'
      Utils.longPress(option, (ev: MouseEvent | TouchEvent) => {
        // 在输入框等元素上长按时，用户通常只是想选择文本或调出上下文菜单，不应该切换置顶
        if (this.isTextInput(ev.target)) {
          return
        }

        this.togglePinOption(Number.parseInt(no))
      })
    }
  }

  /** 判断长按是否发生在输入框等元素里
   *
   * 这些元素上的长按通常是想选择文本（或调出上下文菜单），不应该被当成「长按设置项」处理
   */
  private isTextInput(target: EventTarget | null) {
    if (!(target instanceof Element)) {
      return false
    }

    return !!target.closest(
      'input, textarea, select, [contenteditable="true"], [contenteditable=""]'
    )
  }

  private togglePinOption(noNum: number) {
    if (settings.pinnedOptionsV2.includes(noNum)) {
      settings.pinnedOptionsV2 = settings.pinnedOptionsV2.filter(
        (no) => no !== noNum
      )
      toast.warning(lang.transl('_取消置顶'))
    } else {
      settings.pinnedOptionsV2.push(noNum)
      toast.success(lang.transl('_已置顶'))
    }

    setSetting('pinnedOptionsV2', settings.pinnedOptionsV2)
  }

  private syncPinnedClass() {
    for (const option of this.allOption) {
      const no = option.dataset.no
      if (!no) {
        continue
      }

      option.classList[
        settings.pinnedOptionsV2.includes(Number.parseInt(no))
          ? 'add'
          : 'remove'
      ](this.pinnedClassName)
    }
  }
}

const pinOption = new PinOptions()
export { pinOption }
