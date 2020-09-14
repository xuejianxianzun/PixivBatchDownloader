import { API } from '../API'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { log } from '../Log'
import { form } from './Form'

// 设置相关的 API
class SettingAPI {
  constructor() {
    this.bindEvents()

    this.firstFewImages = this.getFirstFewImages()
  }

  private firstFewImages = 0  // 多图作品设置的值，只下载前几张图片

  private bindEvents() {
    // 当 firstFewImages 设置改变时，保存它的值
    window.addEventListener(EVT.events.settingChange, (event: CustomEventInit) => {
      const data = event.detail.data
      if (data.name === 'firstFewImages') {
        this.firstFewImages = this.getFirstFewImages()
      }
    })
  }

  // 获取作品张数设置
  public getFirstFewImages() {
    const check = API.checkNumberGreater0(form.firstFewImages.value)

    if (check.result) {
      return check.value
    }

    // 如果用户输入的数字不合法（不大于0）
    EVT.fire(EVT.events.crawlError)

    const msg =
      lang.transl('_下载前几张图片') + ' ' + lang.transl('_必须大于0')
    log.error(msg)
    window.alert(msg)
    throw new Error(msg)
  }

  // 计算要从这个作品里下载几张图片
  public getDLCount(pageCount: number) {
    if (form.firstFewImagesSwitch.checked && this.firstFewImages <= pageCount) {
      return this.firstFewImages
    }
    return pageCount
  }
}

const settingAPI = new SettingAPI()

export { settingAPI }
