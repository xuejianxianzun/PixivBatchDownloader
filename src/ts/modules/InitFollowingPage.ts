// 初始化关注列表页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { options } from './Options'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { DOM } from './DOM'

class InitFollowingPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1',
    })
  }

  private baseOffset = 0 // 开始抓取时，记录初始的偏移量
  private readonly onceNumber = 24 // 每页 24 个画师

  private getUserListNo = 0 // 获取用户列表时，记录请求的次数
  private readonly limit = 100 // 每次请求多少个画师的数据

  private totalNeed = Number.MAX_SAFE_INTEGER
  private myId = ''
  private rest: 'show' | 'hide' = 'show'

  private userList: string[] = []

  private index = 0 // getIdList 时，对 userList 的索引

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_从本页开始下载x页'),
      lang.transl('_下载所有页面')
    )
  }

  protected nextStep() {
    this.readyGet()
    log.log(lang.transl('_正在抓取'))
    this.getUserList()
  }

  protected readyGet() {
    this.rest = location.href.includes('rest=hide') ? 'hide' : 'show'

    // 获取抓取开始时的页码
    const nowPage = API.getURLSearchField(location.href, 'p')
    // 计算开始抓取时的偏移量
    if (nowPage !== '') {
      this.baseOffset = (parseInt(nowPage) - 1) * this.onceNumber
    } else {
      this.baseOffset = 0
    }

    // 要抓取多少个用户
    this.totalNeed = Number.MAX_SAFE_INTEGER
    if (this.crawlNumber !== -1) {
      this.totalNeed = this.onceNumber * this.crawlNumber
    }

    // 获取用户自己的 id
    const test = /users\/(\d*)\//.exec(location.href)
    if (test && test.length > 1) {
      this.myId = test[1]
    } else {
      const msg = `Get the user's own id failed`
      log.error(msg, 2)
      throw new Error(msg)
    }
  }

  // 获取关注用户列表，保存用户 id
  private async getUserList() {
    const offset = this.baseOffset + this.getUserListNo * this.limit

    let res
    try {
      res = await API.getFollowingList(this.myId, this.rest, offset)
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
      this.userList.push(userData.userId)
      if (this.userList.length >= this.totalNeed) {
        // 抓取到了指定数量的用户
        return this.getUserListComplete()
      }
    }

    log.log(
      lang.transl('_当前有x个用户', this.userList.length.toString()),
      1,
      false
    )

    this.getUserListNo++
    this.getUserList()
  }

  private getUserListComplete() {
    log.log(
      lang.transl('_当前有x个用户', this.userList.length.toString()),
      1,
      false
    )
    if (this.userList.length === 0) {
      return this.getIdListFinished()
    }
    this.getIdList()
  }

  // 获取用户的 id 列表
  protected async getIdList() {
    let idList = []
    try {
      idList = await API.getUserWorksByType(this.userList[this.index])
    } catch {
      this.getIdList()
      return
    }

    store.idList = store.idList.concat(idList)

    this.index++

    if (this.index >= this.userList.length) {
      return this.getIdListFinished()
    }

    log.log(
      lang.transl('_当前作品个数', store.idList.length.toString()),
      1,
      false
    )
    this.getIdList()
  }

  protected resetGetIdListStatus() {
    this.listPageFinished = 0
    this.userList = []
    this.getUserListNo = 0
    this.index = 0
  }

  protected sortResult() {
    // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
    store.result.sort(API.sortByProperty('id'))
  }
}
export { InitFollowingPage }
