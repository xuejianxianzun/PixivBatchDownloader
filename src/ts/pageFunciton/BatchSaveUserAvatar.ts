import { canRequestInBatch } from '../AccountWarning'
import { lang } from '../Language'
import { LangTextKey } from '../langText'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { API } from '../API'
import { msgBox } from '../MsgBox'
import { Tools } from '../Tools'
import { FollowingUserData } from '../crawl/CrawlResult'
import { saveAvatarImage, SaveAvatarOption } from './SaveAvatarImage'
import { saveAvatarIcon } from './SaveAvatarIcon'
import { EVT } from '../EVT'

/** 显示保存进度时使用的日志插槽 key */
const progressKey = 'batchSaveUserAvatarProgress'

// 批量保存用户头像：抓取用户列表，然后把列表里每个用户的头像保存为图片文件，或生成 ico 图标文件
// 抓取用户列表的逻辑与 ExportFollowingList 一致
class BatchSaveUserAvatar {
  private busy = false

  /** 保存类型：image 保存头像图片；icon 把头像保存为 ico 图标文件 */
  // 保存头像时可以使用关注列表里的数据，不需要请求用户资料 API 获取用户名和头像 URL。
  // 不过关注数据里没有用户的封面图片（cover image），要保存封面图片的话还是需要请求用户资料 API，获取封面图片的 URL，
  // 这在批量保存时会花费较多时间，而且封面图片没有头像重要，所以现在我没有添加保存封面图片的功能。
  private type: 'image' | 'icon' = 'image'
  /** 当前任务的名称对应的 langText key，用于日志和提示 */
  private nameKey: LangTextKey = '_批量保存用户头像'

  private baseOffset = 0 // 开始抓取时，记录初始的偏移量
  private readonly onceNumber = 24 // 每页 24 个用户
  private crawlPageNumber = 1 // 需要抓取多少个页面

  // 页面子类型：我的关注 | 我的好 P 友 | 我的粉丝
  private pageType: 'following' | 'mypixiv' | 'followers' = 'following'
  private rest: 'show' | 'hide' = 'show'
  private tag = ''
  private currentUserId = ''

  private requestTimes = 0 // 获取用户列表时，记录请求的次数
  private readonly limit = 100 // 每次请求多少个用户
  private totalNeed = Number.MAX_SAFE_INTEGER

  private retryNumber = 0 // 请求用户列表失败时，已经重试了多少次
  private readonly retryMax = 10 // 最多重试几次，超过之后终止任务
  private readonly retryWait = 2000 // 每次重试之前等待的时间（毫秒）

  private userNumber = 0 // 已经处理了多少个用户
  /** 进度里的总数：一共需要保存多少个用户的头像。在第一次获取到列表数据时确定 */
  private totalToSave = 0
  private savedNumber = 0 // 成功保存了多少个头像
  private failedNumber = 0 // 保存失败的数量

  /** 每次保存文件之间的间隔时间，避免请求过于频繁 */
  private readonly saveInterval = 500

  public start(type: 'image' | 'icon') {
    this.type = type
    this.nameKey =
      type === 'icon' ? '_批量保存用户头像为图标' : '_批量保存用户头像'

    // 注意：nameKey 必填
    if (!canRequestInBatch(this.nameKey)) {
      return
    }

    if (this.busy) {
      toast.error(lang.transl('_有同类任务正在执行请等待之前的任务完成'))
      return
    }

    this.busy = true

    // 显示提示
    const log1 = lang.transl(this.nameKey)
    toast.show(log1)
    log.success('🚀' + log1)
    EVT.fire('closeSettingsPanel')
    log.log(lang.transl('_开始抓取用户列表'))

    // 总是慢速抓取
    log.warning(lang.transl('_慢速抓取'))

    try {
      this.readyGet()
    } catch (error) {
      // 出现异常时要复位 busy，否则之后每次点击都只会提示「有同类任务正在执行」
      this.abort(error)
    }
  }

  /** 任务因为异常而终止时的收尾：复位 busy，输出错误日志 */
  private abort(error?: unknown) {
    this.busy = false
    log.error(lang.transl('_任务已中止'))
    error !== undefined && console.error(error)
    this.reset()
  }

  protected getWantPage() {
    this.crawlPageNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlPageNumber === -1) {
      log.warning(lang.transl('_抓取所有页面'))
    } else {
      log.warning(lang.transl('_注意这个任务遵从抓取多少页面的设置'))
      log.warning(
        lang.transl('_从本页开始抓取x页', this.crawlPageNumber.toString())
      )
    }
  }

  private getPageType() {
    const pathname = window.location.pathname
    if (pathname.includes('/following')) {
      this.pageType = 'following'
    } else if (pathname.includes('/mypixiv')) {
      this.pageType = 'mypixiv'
    } else if (pathname.includes('/followers')) {
      this.pageType = 'followers'
    }
  }

  protected readyGet() {
    this.getWantPage()
    this.getPageType()
    this.rest = location.href.includes('rest=hide') ? 'hide' : 'show'
    this.tag = Utils.getURLPathField(window.location.pathname, 'following')

    // 获取抓取开始时的页码
    const nowPage = Utils.getURLSearchField(location.href, 'p')
    // 计算开始抓取时的偏移量
    if (nowPage !== '') {
      this.baseOffset = (parseInt(nowPage) - 1) * this.onceNumber
    } else {
      this.baseOffset = 0
    }

    // 要抓取多少个用户
    this.totalNeed = Number.MAX_SAFE_INTEGER
    if (this.crawlPageNumber !== -1) {
      this.totalNeed = this.onceNumber * this.crawlPageNumber
    }

    // 获取当前页面的用户 id
    const test = /users\/(\d*)\//.exec(location.href)
    if (test && test.length > 1) {
      this.currentUserId = test[1]
    } else {
      const msg = `Get the user's own id failed`
      log.error(msg)
      // 输出空字符串，起到占据一个空行的效果，使得日志看起来更清晰
      log.log('')
      throw new Error(msg)
    }

    this.getUserList()
  }

  // 获取用户列表
  private async getUserList() {
    try {
      await this.requestUserList()
    } catch (error) {
      // 出现异常时要复位 busy，否则之后每次点击都只会提示「有同类任务正在执行」
      this.abort(error)
    }
  }

  private async requestUserList() {
    // 账户被警告时终止遍历，不再请求后续的用户列表
    // canRequestInBatch 已经输出了停止的原因，这里不再重复提示
    if (!canRequestInBatch(this.nameKey)) {
      this.busy = false
      this.reset()
      return
    }

    const offset = this.baseOffset + this.requestTimes * this.limit
    let res
    try {
      switch (this.pageType) {
        case 'following':
          res = await API.getFollowingList(
            this.currentUserId,
            this.rest,
            this.tag,
            offset
          )
          break
        case 'mypixiv':
          res = await API.getMyPixivList(this.currentUserId, offset)
          break
        case 'followers':
          res = await API.getFollowersList(this.currentUserId, offset)
          break
      }
    } catch {
      // 请求失败时，等待一段时间再重试，避免短时间内重复请求
      if (this.retryNumber >= this.retryMax) {
        log.error(lang.transl('_获取关注列表失败'))
        this.abort()
        return
      }
      this.retryNumber++
      await Utils.sleep(this.retryWait)
      this.getUserList()
      return
    }

    // 请求成功之后，重置重试次数
    this.retryNumber = 0

    const users = res.body.users

    if (users.length === 0) {
      // 用户列表抓取完毕
      return this.getUserListComplete()
    }

    // 第一次获取到列表数据时，确定进度里显示的总数，即一共需要保存多少个用户的头像
    // body.total 是这个列表里的用户总数
    if (this.requestTimes === 0) {
      // 从中间的页面开始抓取时，前面的用户不会被抓取，所以要从总数里减掉起始偏移量
      const rest = Math.max(res.body.total - this.baseOffset, 0)
      if (this.crawlPageNumber === -1) {
        // 抓取所有页面时，需要保存剩余的全部用户
        this.totalToSave = rest
      } else {
        // 抓取指定数量的页面时，按设置的页数计算，但不大于剩余的用户数量
        this.totalToSave = Math.min(
          this.crawlPageNumber * this.onceNumber,
          rest
        )
      }
    }

    for (const userData of users) {
      this.userNumber++
      await this.saveOne(userData)
      this.logProgress()

      if (this.userNumber >= this.totalNeed) {
        // 抓取到了指定数量的用户
        return this.getUserListComplete()
      }
    }

    this.requestTimes++
    // 获取下一批用户列表
    await Utils.sleep(settings.slowCrawlDealy)
    this.getUserList()
  }

  /** 保存一个用户的头像 */
  private async saveOne(userData: FollowingUserData) {
    const option: SaveAvatarOption = {
      url: userData.profileImageUrl,
      userId: userData.userId,
      userName: userData.userName,
      silent: true,
    }

    let saved: boolean
    try {
      saved =
        this.type === 'icon'
          ? await saveAvatarIcon.saveAvatarIcon(option)
          : await saveAvatarImage.saveAvatarImage(option)
    } catch {
      saved = false
    }

    if (saved) {
      this.savedNumber++
    } else {
      this.failedNumber++
      log.error(
        lang.transl(
          '_保存这个用户的头像失败',
          Tools.createUserLink(userData.userId, userData.userName)
        )
      )
    }

    // 每次保存文件之间添加间隔，避免请求过于频繁
    await Utils.sleep(this.saveInterval)
  }

  private logProgress() {
    // 保存为图标时，提示里也要说明保存的是图标文件
    const savedKey: LangTextKey =
      this.type === 'icon' ? '_已保存x个头像为图标' : '_已保存x个头像'
    log.log(
      `${lang.transl(
        '_需要保存x个头像',
        this.totalToSave.toString()
      )}, ${lang.transl(savedKey, this.savedNumber.toString())}`,
      progressKey
    )
  }

  private async getUserListComplete() {
    // 让进度日志固定下来，之后的日志不再覆盖它
    log.persistentRefresh(progressKey)
    log.log(lang.transl('_当前有x个用户', this.userNumber.toString()))

    // 实际处理的用户数量（包含保存失败的）比总数少时，说明有些用户可能已经注销了
    if (this.userNumber < this.totalToSave) {
      log.warning(
        lang.transl('_提示有些用户可能已经注销'),
        'tipUserMayDeactivated'
      )
    }

    this.busy = false

    if (this.userNumber === 0) {
      const msg =
        '✅' +
        lang.transl('_用户数量为0') +
        ', ' +
        lang.transl('_没有可用的抓取结果')
      log.warning(msg)
      msgBox.warning(msg)
    } else if (this.failedNumber > 0) {
      // 有失败时如实说明失败数量，并提示用户可以再次执行来重试
      const msg =
        '✅' +
        lang.transl(this.nameKey) +
        '<br>' +
        lang.transl(
          '_有x个用户保存失败请再次执行重试',
          this.failedNumber.toString()
        )
      log.error(msg)
      toast.error(lang.transl('_保存头像完毕但是有一些失败了'), {
        position: 'center',
      })
    } else {
      const msg = lang.transl(this.nameKey)
      log.success('✅' + msg)
      toast.success(msg, { position: 'center' })
    }

    this.reset()
  }

  private reset() {
    this.requestTimes = 0
    this.retryNumber = 0
    this.userNumber = 0
    this.totalToSave = 0
    this.savedNumber = 0
    this.failedNumber = 0
  }
}

const batchSaveUserAvatar = new BatchSaveUserAvatar()
export { batchSaveUserAvatar }
