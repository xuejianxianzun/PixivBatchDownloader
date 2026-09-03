import { settings } from '../setting/Settings'
import { LangTextKey } from '../langText'

type BtnConfig = {
  name: 'zoomBtnOnThumb' | 'downloadBtnOnThumb' | 'copyBtnOnThumb'
  order: number
  icon: string
  btn: HTMLButtonElement
  title: LangTextKey
  show: () => boolean
}

class ButtonsOnThumbConfig {
  protected readonly btnsConfig: BtnConfig[] = [
    {
      name: 'zoomBtnOnThumb',
      order: 1,
      icon: 'zoom',
      btn: document.createElement('button'),
      title: '_图片查看器',
      show: () => settings.magnifier,
    },
    {
      name: 'copyBtnOnThumb',
      order: 2,
      icon: 'copy',
      btn: document.createElement('button'),
      title: '_复制图片和摘要',
      show: () => settings.showCopyBtnOnThumb,
    },
    {
      name: 'downloadBtnOnThumb',
      order: 3,
      icon: 'download',
      btn: document.createElement('button'),
      title: '_下载',
      show: () => settings.showDownloadBtnOnThumb,
    },
  ]

  protected readonly btnSize = 32
  protected readonly margin = 8
}

export { ButtonsOnThumbConfig, BtnConfig }
