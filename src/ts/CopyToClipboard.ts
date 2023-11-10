import { lang } from './Lang'
import { toast } from './Toast'

interface ClipboardItem {
  readonly types: string[]
  readonly presentationStyle: 'unspecified' | 'inline' | 'attachment'
  getType(): Promise<Blob>
}

interface ClipboardItemData {
  [mimeType: string]: Blob | string | Promise<Blob | string>
}

declare var ClipboardItem: {
  prototype: ClipboardItem
  new (itemData: ClipboardItemData): ClipboardItem
}

interface Clipboard {
  read(): Promise<DataTransfer>
  write(data: ClipboardItem[]): Promise<void>
}

class CopyToClipboard {
  static setClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const type = 'text/plain'
      const blob = new Blob([text], { type })
      const data = [new ClipboardItem({ [type]: blob })]

      ;(window.navigator.clipboard as unknown as Clipboard).write(data).then(
        () => {
          toast.success(lang.transl('_已复制到剪贴板'))
          resolve()
        },
        () => {
          toast.error(lang.transl('_写入剪贴板失败'))
          reject()
        }
      )
    })
  }
}

export { CopyToClipboard }
