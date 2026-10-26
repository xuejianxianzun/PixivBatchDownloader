import { EVT } from '../EVT'
import { settings } from '../setting/Settings'
import { artworkThumbnail } from '../ArtworkThumbnail'
import { ImageViewer } from '../ImageViewer'
import { IDData } from '../store/StoreType'
import { copyWorkInfo } from '../CopyWorkInfo'
import { likeWork } from '../LikeWork'
import { displayThumbnailListOnMultiImageWorkPage } from '../pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { BtnConfig } from './ButtonsOnThumbConfig'
import { ButtonsOnThumbOnPC } from './ButtonsOnThumbOnPC'

// 在图片作品的缩略图上显示一些按钮
class ButtonsOnArtworkThumbOnPC extends ButtonsOnThumbOnPC {
  protected getThumbnail() {
    return artworkThumbnail
  }

  protected shouldShowBtn(config: BtnConfig, el: HTMLElement) {
    // 在多图作品页面里的缩略图列表上触发时，不显示放大按钮，因为点击图片即可放大
    if (config.name === 'zoomBtnOnThumb') {
      return !displayThumbnailListOnMultiImageWorkPage.checkLI(el)
    }

    return true
  }

  protected clickBtn(config: BtnConfig) {
    let index = 0
    const onThumbList = displayThumbnailListOnMultiImageWorkPage.checkLI(
      this.workEL
    )
    // 在多图作品的缩略图列表上触发时，通过 data-index 属性获取序号
    if (onThumbList) {
      index = Number.parseInt(this.workEL!.dataset!.index!)
    }

    const idData: IDData = {
      type: 'illusts',
      id: this.currentId,
    }

    if (config.name === 'zoomBtnOnThumb') {
      new ImageViewer({
        workId: this.currentId,
        imageSize: settings.magnifierSize,
        autoStart: true,
        showLoading: true,
      })
    } else if (config.name === 'copyBtnOnThumb') {
      copyWorkInfo.receive(idData, index)
    } else if (config.name === 'bookmarkBtnOnThumb') {
      this.bookmarkWork()
    } else if (config.name === 'likeBtnOnThumb') {
      likeWork.like(this.currentId)
    } else if (config.name === 'downloadBtnOnThumb') {
      // 在多图作品的缩略图列表上点击下载按钮时，只下载这一张图片
      if (onThumbList) {
        idData.downloadIndexes = [index]
      }

      EVT.fire('crawlIdList', [idData])
    }
  }
}

new ButtonsOnArtworkThumbOnPC()
