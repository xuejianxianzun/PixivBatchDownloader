// 初始化用户页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { centerButtons } from './CenterButtons'
import { options } from './Options'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { DOM } from './DOM'
import { userWorksType } from './CrawlArgument.d'

class InitUserPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected appendCenterBtns() {
    centerButtons
      .add(Colors.blue, lang.transl('_开始抓取'), [
        ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')]
      ])
      .addEventListener('click', () => {
        this.readyCrawl()
      })
  }

  protected setFormOption() {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_checkWantPageRule1Arg8'),
      rangTip: lang.transl('_数字提示1'),
      value: '-1'
    })

    options.hideOption([15, 18])
  }

  protected destroy() {}

  private idList: string[] = [] // 储存从列表页获取到的 id

  private tag = '' // 储存当前页面的 tag，有时没有 tag

  private listType = 0 // 细分的列表类型

  private readonly onceNumber = 48 // 每页个数

  private requsetNumber = 0 // 根据页数，计算要抓取的作品个数

  private offset = 0 // 要去掉的作品数量

  protected getWantPage() {
    this.crawlNumber = this.checkWantPageInput(
      lang.transl('_checkWantPageRule1Arg6'),
      lang.transl('_checkWantPageRule1Arg7')
    )
  }

  protected nextStep() {
    this.readyGetIdList()
  }

  protected readyGetIdList() {
    // 如果前面有页数，就去掉前面页数的作品数量。即：从本页开始下载
    const nowPage = API.getURLField(location.href, 'p') // 判断当前处于第几页，页码从 1 开始。也可能没有页码
    if (nowPage) {
      this.offset = (parseInt(nowPage) - 1) * this.onceNumber
    }
    if (this.offset < 0) {
      this.offset = 0
    }

    // 根据页数设置，计算要下载的个数
    this.requsetNumber = 0
    if (this.crawlNumber === -1) {
      this.requsetNumber = 9999999
    } else {
      this.requsetNumber = this.onceNumber * this.crawlNumber
    }

    // 设置列表页面的类型
    // listType:
    // 0 插画和漫画全都要，但是不带 tag
    // 4 插画和漫画全都要，带 tag
    // 1 只要插画
    // 2 只要漫画

    if (location.href.includes('member.php?id=')) {
      // 用户资料页主页
      this.listType = 0
    } else if (/member_illust\.php\?.*id=/.test(location.href)) {
      // 作品列表页
      if (API.getURLField(location.href, 'type') === 'illust') {
        // 插画分类
        this.listType = 1
      } else if (API.getURLField(location.href, 'type') === 'manga') {
        // 漫画分类
        this.listType = 2
      } else if (API.getURLField(location.href, 'tag')) {
        // url 里没有标识插画还是漫画，但是有 tag，则是在用户首页点击了 tag，需要同时获取插画和漫画
        this.listType = 4
      }
    }

    // 是否带有 tag
    this.tag = decodeURI(API.getURLField(location.href, 'tag'))

    // 根据不同的页面类型，选择不同的 API 来获取 id 列表
    /*
      1. 无 tag 通过 profileAll 获取
      2. 有 tag 通过指定的作品类型获取
     */

    if (!this.tag) {
      this.getIdList()
    } else {
      if (this.listType === 1) {
        this.getIdListByTag('illusts')
      } else if (this.listType === 2) {
        this.getIdListByTag('manga')
      } else if (this.listType === 4) {
        this.getIdListByTag('illustmanga')
      }
    }

    log.log(lang.transl('_正在抓取'))
  }

  // 获取用户的全部作品列表
  protected async getIdList() {
    let type: userWorksType[] = []

    // 插画和漫画列表页
    if (this.listType === 0) {
      type = ['illusts', 'manga']
    } else if (this.listType === 1) {
      // 插画列表页，包含动图
      type = ['illusts']
    } else if (this.listType === 2) {
      // 漫画列表页
      type = ['manga']
    }

    this.idList = await API.getUserWorksByType(DOM.getUserId(), type)

    this.afterGetListPage()
  }

  // 获取用户某一类型的作品列表（附带 tag）
  private async getIdListByTag(type: 'illusts' | 'manga' | 'illustmanga') {
    let data = await API.getUserWorksByTypeWithTag(
      DOM.getUserId(),
      type,
      this.tag,
      this.offset,
      this.requsetNumber
    )

    data.body.works.forEach(data => this.idList.push(data.id))

    this.afterGetListPage()
  }

  // 获取作品 id 列表完毕之后
  private afterGetListPage() {
    // 没有 tag
    if (!this.tag) {
      // 在获取全部作品时，由于 API 里不能设置 requset_number，所以在这里去掉多余的作品。

      // 把 id 从小到大排序
      let tempList: number[] = []
      // 转换成数字
      tempList = this.idList.map(id => {
        return parseInt(id)
      })
      // 升序排列
      tempList.sort(function(x, y) {
        return x - y
      })
      // 保存到结果中
      this.idList = tempList.map(id => {
        return id.toString()
      })

      // 删除后面的 id（删除不需要的近期作品）
      this.idList.splice(this.idList.length - this.offset, this.idList.length)
    }

    // 删除多余的作品
    if (this.idList.length > this.requsetNumber) {
      // 删除前面部分（早期作品）
      this.idList.splice(0, this.idList.length - this.requsetNumber)
    }

    store.idList = store.idList.concat(this.idList)

    this.getIdListFinished()
  }

  protected resetGetIdListStatus() {
    this.offset = 0
    this.idList = []
    this.listType = 0
    this.listPageFinished = 0
  }

  protected sortResult() {
    // 把作品数据按 id 倒序排列，id 大的在前面，这样可以先下载最新作品，后下载早期作品
    store.result.sort(API.sortByProperty('id'))
  }
}
export { InitUserPage }
