import { settings } from './Settings'

// 设置相关的 API
class SettingAPI {
  constructor() {
  }

  // 计算要从这个作品里下载几张图片
  public getDLCount(pageCount: number) {
    if (settings.firstFewImagesSwitch && settings.firstFewImages <= pageCount) {
      return settings.firstFewImages
    }
    return pageCount
  }
}

const settingAPI = new SettingAPI()

export { settingAPI }
