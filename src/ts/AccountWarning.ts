import { lang } from './Language'
import { LangTextKey } from './langText'
import { log } from './Log'
import { states } from './store/States'

/** 判断批量发送 API 请求的操作能否继续。返回 false 时，调用方应该立刻停止。
 *
 * 只有账户被 pixiv 警告时才返回 false，此时会输出一条红色警告日志。
 *
 * nameKey 是这次操作的名称（langText 里的 key，例如「批量关注用户」），它决定日志里显示什么。
 * **不管在操作的入口还是遍历里调用，都要传入 nameKey**——日志的 key 参数会让内容相同的日志只占一行
 * （见 Log.ts 开头的说明），所以即使在循环里每次迭代都调用，也不会刷屏。
 *
 * 抓取流程和下载流程不需要调用它，因为它们会响应 stopCrawl / downloadPause 事件而自动停止。
 * 这个函数是给那些不理会这两个事件、但自身会批量发送请求的模块用的（例如批量收藏、批量关注）。
 *
 * 这些操作没有「恢复执行」的功能，需要用户刷新页面之后重新执行。 */
export function canRequestInBatch(nameKey: LangTextKey) {
  if (!states.accountWarning) {
    return true
  }

  log.error(
    lang.transl('_账户被警告时停止操作的提示', lang.transl(nameKey)),
    // 带上 key：同一次操作里的多处检查（例如循环里每次迭代）只会占一行日志
    'accountWarning' + nameKey
  )

  return false
}
