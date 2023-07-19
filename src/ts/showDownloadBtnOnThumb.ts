import { Config } from './Config'
import { ShowDownloadBtnOnThumbOnDesktop } from './ShowDownloadBtnOnThumbOnDesktop'
import { ShowDownloadBtnOnThumbOnMobile } from './ShowDownloadBtnOnThumbOnMobile'

// 在图片作品的缩略图上显示下载按钮，点击按钮可以直接下载这个作品
class ShowDownloadBtnOnThumb {
  constructor() {
    Config.mobile
      ? new ShowDownloadBtnOnThumbOnMobile()
      : new ShowDownloadBtnOnThumbOnDesktop()
  }
}

new ShowDownloadBtnOnThumb()
