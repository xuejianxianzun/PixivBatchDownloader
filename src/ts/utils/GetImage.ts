import { lang } from '../Language'
import { Config } from '../Config'
import { log } from '../Log'
import { msgBox } from '../MsgBox'

/** 使用 fetch 加载图片并返回 blob 对象 */
export async function getImg(url: string) {
  let blob: Blob | null = null
  try {
    const response = await fetch(url)
    blob = await response.blob()
    return blob
  } catch (error) {
    // 在 Firefox 浏览器里，由于图片的域名不同，会产生 CORS 错误，无法获取图片数据
    let msg = lang.transl('_获取图片失败')
    if (Config.isFirefox) {
      msg += '<br>' + lang.transl('_Firefox的跨域策略导致了请求失败')
    }
    log.error(msg)
    msgBox.error(msg)
    return null
  }
}
