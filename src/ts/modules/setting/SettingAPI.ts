import { API } from '../API'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { log } from '../Log'
import { settings } from './Settings'

// 设置相关的 API
class SettingAPI {
  constructor() {
    this.bindEvents()

    this.firstFewImages = this.getFirstFewImages()
  }

  private firstFewImages = 0 // 缓存多图作品只下载前几张图片的值

  private bindEvents() {
    // 当 firstFewImages 设置改变时，保存它的值
    window.addEventListener(
      EVT.list.settingChange,
      () => {
        this.firstFewImages = this.getFirstFewImages()
      },
    )
  }

  // 获取作品张数设置
  public getFirstFewImages() {
    if (settings.firstFewImages) {
      return settings.firstFewImages
    }

    // 如果用户输入的数字不合法（不大于0）
    EVT.fire(EVT.list.wrongSetting)

    const msg = lang.transl('_下载前几张图片') + ' ' + lang.transl('_必须大于0')
    log.error(msg)
    EVT.sendMsg({
      msg: msg,
      type: 'error',
    })
    throw new Error(msg)
  }

  // 计算要从这个作品里下载几张图片
  public getDLCount(pageCount: number) {
    if (settings.firstFewImagesSwitch && this.firstFewImages <= pageCount) {
      return this.firstFewImages
    }
    return pageCount
  }
}

const settingAPI = new SettingAPI()

export { settingAPI }
