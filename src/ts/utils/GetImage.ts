import { lang } from '../Language'
import { Config } from '../Config'
import { log } from '../Log'
import { msgBox } from '../MsgBox'

/**
 * 使用 fetch 加载图片并返回 blob 对象
 * @param url 图片的 URL
 * @param showErrorMsg 加载失败时是否使用消息框显示错误信息。默认显示。
 * 批量保存图片时应该传入 false，由调用方统一报告失败的数量，
 * 否则每个失败的图片都会弹出一个消息框，这些消息框会堆叠在页面上。
 */
export async function getImg(url: string, showErrorMsg = true) {
  let blob: Blob | null = null
  try {
    const response = await fetch(url)
    blob = await response.blob()
    return blob
  } catch (error) {
    // 在 Firefox 浏览器里，由于图片的域名不同，有可能会因为严格的 CORS 限制导致无法获取图片数据
    // 通常能够成功
    let msg = lang.transl('_获取图片失败')
    if (Config.isFirefox) {
      msg += '<br>' + lang.transl('_Firefox的跨域策略导致了请求失败')
    }
    log.error(msg, 'getImageFailed')
    showErrorMsg && msgBox.error(msg)
    return null
  }
}
