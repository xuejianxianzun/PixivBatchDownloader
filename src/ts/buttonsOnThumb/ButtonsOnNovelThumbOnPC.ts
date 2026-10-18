import { EVT } from '../EVT'
import { novelThumbnail } from '../NovelThumbnail'
import { Tools } from '../Tools'
import { toast } from '../Toast'
import { lang } from '../Language'
import { likeWork } from '../LikeWork'
import { BtnConfig } from './ButtonsOnThumbConfig'
import { ButtonsOnThumbOnPC } from './ButtonsOnThumbOnPC'

// 在小说作品的缩略图上显示一些按钮
class ButtonsOnNovelThumbOnPC extends ButtonsOnThumbOnPC {
  protected getThumbnail() {
    return novelThumbnail
  }

  protected getBtnList() {
    // btnsConfig 里有些按钮不适合在小说缩略图上显示，
    // 例如查看图片、复制信息，因为这些按钮是为图像作品设计的。
    // 在这里过滤出要在小说缩略图上显示的按钮
    return this.btnsConfig.filter(
      (config) =>
        config.name === 'downloadBtnOnThumb' ||
        config.name === 'likeBtnOnThumb' ||
        config.name === 'bookmarkBtnOnThumb'
    )
  }

  protected shouldShowBtn(config: BtnConfig, el: HTMLElement) {
    // 系列小说不是单个作品，不能点赞或收藏
    if (el.dataset.worktype === 'novelSeries') {
      return (
        config.name !== 'likeBtnOnThumb' && config.name !== 'bookmarkBtnOnThumb'
      )
    }

    return true
  }

  protected clickBtn(config: BtnConfig) {
    if (config.name === 'downloadBtnOnThumb') {
      // 点击下载按钮时，重新获取当前作品的 id 和类型，并触发抓取事件
      const idData = Tools.getNovelOrSeriesIDData(this.workEL)
      // 如果找不到小说 id，也找不到系列 id，则不下载
      if (!idData) {
        toast.error(lang.transl('_没有找到可下载的作品'))
        return
      }
      EVT.fire('crawlIdList', [idData])
    } else if (config.name === 'likeBtnOnThumb') {
      // 系列小说不是单个作品，不能点赞
      if (this.workEL?.dataset.worktype === 'novels') {
        likeWork.like(this.currentId, 'novels')
      }
    } else if (config.name === 'bookmarkBtnOnThumb') {
      this.bookmarkWork()
    }
  }
}

new ButtonsOnNovelThumbOnPC()
