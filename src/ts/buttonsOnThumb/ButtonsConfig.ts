import { settings } from '../setting/Settings'
import { LangTextKey } from '../langText'

type BtnConfig = {
  name:
    | 'zoomBtnOnThumb'
    | 'downloadBtnOnThumb'
    | 'copyBtnOnThumb'
    | 'hideUserBtnOnThumb'
  order: number
  icon: string
  btn: HTMLButtonElement
  title: LangTextKey
  show: () => boolean
}

type BtnList = BtnConfig[]

class ButtonsConfig {
  protected readonly btnsConfig: BtnList = [
    {
      name: 'zoomBtnOnThumb',
      order: 1,
      icon: 'icon-zoom',
      btn: document.createElement('button'),
      title: '_图片查看器',
      show: () => settings.magnifier,
    },
    {
      name: 'copyBtnOnThumb',
      order: 2,
      icon: 'icon-copy',
      btn: document.createElement('button'),
      title: '_复制图片和摘要',
      show: () => settings.showCopyBtnOnThumb,
    },
    {
      name: 'downloadBtnOnThumb',
      order: 3,
      icon: 'icon-download',
      btn: document.createElement('button'),
      title: '_下载这个作品',
      show: () => settings.showDownloadBtnOnThumb,
    },
    {
      name: 'hideUserBtnOnThumb',
      order: 4,
      icon: 'icon-shanchu1',
      btn: document.createElement('button'),
      title: '_阻止',
      show: () => settings.hideUserButton,
    },
  ]

  protected readonly btnSize = 32
  protected readonly margin = 8
}

export { ButtonsConfig, BtnConfig, BtnList }
