import { lang } from '../Language'
import { log } from '../Log'
import { pageType } from '../PageType'
import { settings } from '../setting/Settings'
import { toast } from '../Toast'
import { Utils } from '../utils/Utils'
import { API } from '../API'
import { msgBox } from '../MsgBox'
import { Input } from '../Input'
import { FollowingResponse } from '../crawl/CrawlResult'

type UserItem = {
  id: string
  name: string
}

// 筛选不活跃（在最近一段时间内没有发表新作品）的用户
class FilterInactiveUsers {
  private busy = false
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

  /**要求用户在这个时间之后有新作品，否则就是不活跃的用户 */
  private time = 0
  /**已经抓取了多少个用户（未过滤） */
  private numberOfCrawledUsers = 0
  // 储存符合条件的用户
  //**没有作品的用户 */
  private userNoWork: UserItem[] = []
  //**最近不活跃的用户 */
  private userInactive: UserItem[] = []
  /**一共储存了多少个用户 */
  private get total() {
    return this.userNoWork.length + this.userInactive.length
  }

  public async start() {
    if (this.busy) {
      toast.error(lang.transl('_有同类任务正在执行请等待之前的任务完成'))
      return
    }

    const input = new Input({
      instruction: `${lang.transl('_筛选不活跃的用户的输入提示')}`,
      value: '6',
      width: 500,
    })
    const value = await input.submit()
    if (!value) {
      return toast.warning(lang.transl('_本次操作已取消'))
    }
    const number = Number.parseInt(value)
    if (isNaN(number) || number <= 0) {
      return toast.error(lang.transl('_参数不合法本次操作已取消'))
    }
    this.time = new Date().getTime() - number * 30 * 24 * 60 * 60 * 1000
    this.busy = true

    // 显示提示
    const log1 = lang.transl('_筛选不活跃的用户')
    log.log(log1)
    toast.warning(log1)
    const log2 = lang.transl('_开始抓取用户列表')
    log.log(log2)
    // 总是慢速抓取
    log.warning(lang.transl('_慢速抓取'))

    this.readyGet()
  }

  protected getWantPage() {
    this.crawlPageNumber = settings.crawlNumber[pageType.type].value
    if (this.crawlPageNumber === -1) {
      log.warning(lang.transl('_下载所有页面'))
    } else {
      log.warning(lang.transl('_注意这个任务遵从抓取多少页面的设置'))
      log.warning(
        lang.transl('_从本页开始下载x页', this.crawlPageNumber.toString())
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
      log.error(msg, 2)
      throw new Error(msg)
    }

    this.getUserList()
  }

  // 获取用户列表
  private async getUserList() {
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
      this.getUserList()
      return
    }

    const users = res.body.users

    if (users.length === 0) {
      // 用户列表抓取完毕
      return this.getUserListComplete()
    }

    for (const userData of users) {
      this.check(userData)
      this.numberOfCrawledUsers++
      if (this.numberOfCrawledUsers >= this.totalNeed) {
        // 抓取到了指定数量的用户
        return this.getUserListComplete()
      }
    }

    log.log(
      lang.transl('_当前有x个符合条件的用户', this.total.toString()),
      1,
      false,
      'filterInactiveUsersProgress'
    )

    this.requestTimes++
    // 获取下一批用户列表
    window.setTimeout(() => {
      this.getUserList()
    }, settings.slowCrawlDealy)
  }

  private async getUserListComplete() {
    this.busy = false
    log.log(lang.transl('_当前有x个符合条件的用户', this.total.toString()))

    // 在批量关注用户时，抓取结果为 0 并不影响继续执行
    if (this.total === 0) {
      const msg =
        '✓ ' +
        lang.transl('_用户数量为0') +
        ', ' +
        lang.transl('_没有可用的抓取结果')
      log.warning(msg)
      msgBox.warning(msg)
    } else {
      this.exportResult()
      const msg = '✓ ' + lang.transl('_筛选不活跃的用户')
      log.success(msg)
      toast.success(msg)
    }

    this.reset()
  }

  private check(userData: FollowingResponse['body']['users'][0]) {
    // 如果该用户没有任何作品
    if (userData.illusts.length === 0 && userData.novels.length === 0) {
      this.userNoWork.push({
        id: userData.userId,
        name: userData.userName,
      })
      return
    }

    // 如果有插画或小说中的任何一种作品，则检查其发布时间
    const noNewIllust = this.checkNoNewWork('illust', userData.illusts)
    const noNewNovel = this.checkNoNewWork('novel', userData.novels)
    if (noNewIllust && noNewNovel) {
      this.userInactive.push({
        id: userData.userId,
        name: userData.userName,
      })

      // if (userData.illusts.length > 0 && userData.novels.length > 0) {
      //   console.log('该用户有两种作品并且不活跃', userData.userId)
      // }
    }
  }

  /** 如果在指定时间内没有新作品，则返回 true */
  private checkNoNewWork(
    type: 'illust',
    workData: FollowingResponse['body']['users'][0]['illusts']
  ): boolean
  private checkNoNewWork(
    type: 'novel',
    workData: FollowingResponse['body']['users'][0]['novels']
  ): boolean
  private checkNoNewWork(
    type: 'illust' | 'novel',
    workData:
      | FollowingResponse['body']['users'][0]['illusts']
      | FollowingResponse['body']['users'][0]['novels']
  ) {
    if (workData.length === 0) {
      return true
    }

    // 查找最近发表的作品的 id
    const idList: number[] = workData.map((work) => Number.parseInt(work.id))
    const maxId = Math.max(...idList).toString()
    // 获取它的数据
    const work = workData.find((work) => work.id === maxId)
    const createTime = new Date(work!.createDate).getTime()
    return createTime < this.time
  }

  private exportResult() {
    const noWorkUsersHtml = this.userNoWork.map(
      (user) =>
        `<li><a href="https://www.pixiv.net/users/${user.id}" target="_blank">${user.name}</a></li>`
    )
    const inactiveUsersHtml = this.userInactive.map(
      (user) =>
        `<li><a href="https://www.pixiv.net/users/${user.id}" target="_blank">${user.name}</a></li>`
    )
    const bgColor = '#222'

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${lang.transl('_筛选不活跃的用户')}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html {
        font-size: 14px;
      }
      body {
        background-color: ${bgColor};
        color: #fff;
        font-size: 1.2rem;
      }
      a {
        color: #00a6ef;
        text-decoration: none;
      }
      a:visited {
        color: #b733f8;
      }
      .usersWrap {
        width: 90vw;
        max-height: 95vh;
        margin: 3vh auto 0;
        display: flex;
        justify-content: space-between;
      }
      .list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex-basis: 50%;
        flex-shrink: 0;
        flex-grow: 0;
        overflow-y: auto;
      }
      .list:nth-child(1) {
        border-right: #aaa 1px solid;
      }
      .list .title {
        font-size: 1.4rem;
        flex-grow: 0;
      }
      .list ul {
        display: flex;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
      }
      .list .title,
      .list li {
        display: flex;
        align-items: center;
        justify-content: center;
        list-style: none;
        min-height: 40px;
        padding: 4px 0;
        line-height: 32px;
        text-align: center;
      }
      .list li {
        flex-basis: 33%;
        word-break: break-all;
        flex-grow: 0;
      }
    </style>
  </head>
  <body>
    <div class="usersWrap">
      <div class="list">
        <div class="title">${lang.transl('_没有作品的用户')}（${this.userNoWork.length}）</div>
        <ul>
            ${noWorkUsersHtml.join('')}
        </ul>
      </div>
      <div class="list">
        <div class="title">${lang.transl('_最近不活跃的用户')}（${this.userInactive.length}）</div>
        <ul>
            ${inactiveUsersHtml.join('')}
        </ul>
      </div>
    </div>
  </body>
</html>
`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  private reset() {
    this.requestTimes = 0
    this.numberOfCrawledUsers = 0
    this.userNoWork = []
    this.userInactive = []
  }
}

const filterInactiveUsers = new FilterInactiveUsers()
export { filterInactiveUsers }
