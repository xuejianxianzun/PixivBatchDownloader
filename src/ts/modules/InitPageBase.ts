// 初始化所有页面抓取流程的基类
import { lang } from './Lang'
import { Colors } from './Colors'
import { DOM } from './DOM'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { EVT } from './EVT'
import { options } from './setting/Options'
import { settings } from './setting/Settings'
import { settingAPI } from './setting/SettingAPI'
import { states } from './States'
import { saveArtworkData } from './artwork/SaveArtworkData'
import { saveNovelData } from './novel/SaveNovelData'
import { mute } from './Mute'
import { IDData } from './Store.d'

abstract class InitPageBase {
  protected crawlNumber = 0 // 要抓取的个数/页数

  protected maxCount = 1000 // 当前页面类型最多有多少个页面/作品

  protected startpageNo = 1 // 列表页开始抓取时的页码，只在 api 需要页码时使用。目前有搜索页、排行榜页、新作品页、系列页面使用。

  protected listPageFinished = 0 // 记录一共抓取了多少个列表页。使用范围同上。

  protected readonly ajaxThreadsDefault = 10 // 抓取时的并发连接数默认值，也是最大值

  protected ajaxThreads = this.ajaxThreadsDefault // 抓取时的并发连接数

  protected ajaxThreadsFinished = 0 // 统计有几个并发线程完成所有请求。统计的是并发线程（ ajaxThreads ）而非请求数

  // 子组件不应该重载 init 方法
  protected init() {
    options.showAllOption()
    this.setFormOption()
    this.addCrawlBtns()
    this.addAnyElement()
    this.initAny()

    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.destroy()
    })

    // 切换页面时，如果任务已经完成，则清空输出区域，避免日志一直堆积。
    window.addEventListener(EVT.list.pageSwitch, () => {
      if (!states.busy) {
        EVT.fire(EVT.list.clearLog)
      }
    })

    // 直接下载已有 id 列表
    window.addEventListener(EVT.list.downloadIdList,(ev:CustomEventInit)=>{
      const idList = ev.detail.data as IDData[]
      if(idList){
        this.downloadIdList(idList)
      }
    })
  }

  // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
  protected setFormOption(): void {
    // 个数/页数选项的提示
    options.setWantPageTip({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: lang.transl('_数字提示1'),
    })
  }

  // 添加抓取区域的按钮
  protected addCrawlBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  // 添加其他任意元素（如果有）
  protected addAnyElement(): void {}

  // 初始化任意内容
  // 如果有一些代码不能归纳到 init 方法的前面几个方法里，那就放在这里
  // 通常用来初始化特有的组件、功能、事件、状态等
  protected initAny() {}

  // 销毁初始化页面时添加的元素和事件，恢复设置项等
  protected destroy(): void {
    DOM.clearSlot('crawlBtns')
    DOM.clearSlot('otherBtns')
  }

  // 作品个数/页数的输入不合法
  private getWantPageError() {
    EVT.fire(EVT.list.wrongSetting)
    const msg = lang.transl('_参数不合法')
    EVT.sendMsg({
      msg: msg,
      type: 'error',
    })
    throw new Error(msg)
  }

  // 检查用户输入的页数/个数设置
  // 可以为 -1，或者大于 0
  protected checkWantPageInput(crawlPartTip: string, crawlAllTip: string) {
    const temp = parseInt(settings.setWantPage)

    // 如果比 1 小，并且不是 -1，则不通过
    if ((temp < 1 && temp !== -1) || isNaN(temp)) {
      // 比 1 小的数里，只允许 -1 , 0 也不行
      throw this.getWantPageError()
    }

    if (temp >= 1) {
      log.warning(crawlPartTip.replace('{}', temp.toString()))
    } else if (temp === -1) {
      log.warning(crawlAllTip)
    }

    return temp
  }

  // 检查用户输入的页数/个数设置
  // 要求必须大于 0
  // 参数 max 为最大值
  // 参数 page 指示单位是“页”（页面）还是“个”（作品个数）
  protected checkWantPageInputGreater0(max: number, page: boolean) {
    const result = API.checkNumberGreater0(settings.setWantPage)

    if (result.result) {
      const r = result.value > max ? max : result.value

      if (page) {
        log.warning(lang.transl('_从本页开始下载x页', r.toString()))
      } else {
        log.warning(lang.transl('_从本页开始下载x个', r.toString()))
      }
      return r
    } else {
      throw this.getWantPageError()
    }
  }

  // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
  protected getWantPage() {}

  // 获取多图作品设置。因为这个不属于过滤器 filter，所以在这里直接获取
  protected getMultipleSetting() {
    // 获取作品张数设置
    if (settings.firstFewImagesSwitch) {
      log.warning(
        lang.transl(
          '_多图作品下载前n张图片',
          settingAPI.getFirstFewImages().toString(),
        ),
      )
    }
  }

  // 准备正常进行抓取，执行一些检查
  protected async readyCrawl() {
    // 检查是否可以开始抓取
    if (states.busy) {
      return EVT.sendMsg({
        msg: lang.transl('_当前任务尚未完成2'),
        type: 'error',
      })
    }

    log.clear()

    log.success(lang.transl('_任务开始0'))

    await mute.getMuteSettings()

    this.getWantPage()

    this.getMultipleSetting()

    EVT.fire(EVT.list.crawlStart)

    // 进入第一个抓取方法
    this.nextStep()
  }

  // 基于传递的 id 列表直接开始抓取
  // 这个方法是为了让其他模块可以传递 id 列表，直接进行下载。
  // 这个类的子类没有必要使用这个方法。当子类想要直接指定 id 列表时，修改自己的 getIdList 方法即可。
  protected async downloadIdList(idList:IDData[]) {
    // 检查是否可以开始抓取
    if (states.busy) {
      return EVT.sendMsg({
        msg: lang.transl('_当前任务尚未完成2'),
        type: 'error',
      })
    }

    log.clear()

    log.success(lang.transl('_任务开始0'))

    await mute.getMuteSettings()

    this.getMultipleSetting()

    EVT.fire(EVT.list.crawlStart)

    store.idList = idList

    this.getIdListFinished()
  }

  // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
  protected nextStep() {
    this.getIdList()
  }

  // 获取 id 列表，由各个子类具体定义
  protected abstract getIdList(): void

  // id 列表获取完毕，开始抓取作品内容页
  protected getIdListFinished() {
    this.resetGetIdListStatus()

    EVT.fire(EVT.list.getIdListFinished)
    if (states.bookmarkMode) {
      return
    }

    if (store.idList.length === 0) {
      console.log('idList 0')
      return this.noResult()
    }

    log.log(lang.transl('_当前作品个数', store.idList.length.toString()))

    // 这个 return 在这里重置任务状态，不继续抓取作品的详情了，用于调试时反复进行抓取
    // return states.allWork = false

    if (store.idList.length <= this.ajaxThreadsDefault) {
      this.ajaxThreads = store.idList.length
    } else {
      this.ajaxThreads = this.ajaxThreadsDefault
    }

    for (let i = 0; i < this.ajaxThreads; i++) {
      this.getWorksData()
    }
  }

  // 获取作品的数据
  protected async getWorksData(idData?: IDData) {
    idData = idData || store.idList.shift()!
    const id = idData.id

    if (!id) {
      const msg = 'Error: work id is invalid!'
      EVT.sendMsg({
        msg: msg,
        type: 'error',
      })
      throw new Error(msg)
    }

    let failed = false // 请求失败的标记

    try {
      if (idData.type === 'novels') {
        const data = await API.getNovelData(id)
        await saveNovelData.save(data)
      } else {
        const data = await API.getArtworkData(id)
        await saveArtworkData.save(data)
      }
    } catch (error) {
      if (error.status) {
        // 请求成功，但状态码不正常，不会重试
        this.logErrorStatus(error.status, id)
      } else {
        // 请求失败，没有获得服务器的返回数据，会重试
        // 这里也会捕获到 save 作品数据时的错误
        failed = true
        console.error(error)
      }
    }

    if (failed) {
      // 再次发送这个请求
      setTimeout(() => {
        this.getWorksData(idData)
      }, 2000)
    } else {
      this.afterGetWorksData()
    }
  }

  // 每当获取完一个作品的信息
  private afterGetWorksData() {
    this.logResultTotal()

    if (store.idList.length > 0) {
      // 如果存在下一个作品，则
      this.getWorksData()
    } else {
      // 没有剩余作品
      this.ajaxThreadsFinished++
      if (this.ajaxThreadsFinished === this.ajaxThreads) {
        // 如果所有并发请求都执行完毕，复位
        this.ajaxThreadsFinished = 0
        this.crawlFinished()
      }
    }
  }

  // 抓取完毕
  protected crawlFinished() {
    if (store.result.length === 0) {
      console.log('result 0')
      return this.noResult()
    }

    store.crawlCompleteTime = new Date()

    this.sortResult()

    log.log(lang.transl('_共抓取到n个文件', store.result.length.toString()))

    log.log(lang.transl('_抓取完毕'), 2)

    // 发出抓取完毕的信号
    EVT.fire(EVT.list.crawlFinish)
  }

  // 重设抓取作品列表时使用的变量或标记
  protected abstract resetGetIdListStatus(): void

  // 网络请求状态异常时输出提示
  private logErrorStatus(status: number, id: string) {
    switch (status) {
      case 0:
        log.error(id + ': ' + lang.transl('_作品页状态码0'))
        break

      case 400:
        log.error(id + ': ' + lang.transl('_作品页状态码400'))
        break

      case 403:
        log.error(id + ': ' + lang.transl('_作品页状态码403'))
        break

      case 404:
        log.error(id + ': ' + lang.transl('_作品页状态码404'))
        break

      default:
        log.error(lang.transl('_无权访问', id))
        break
    }
  }

  // 在抓取图片网址时，输出提示
  protected logResultTotal() {
    log.log(
      lang.transl('_共抓取到n个文件', store.result.length.toString()),
      1,
      false,
    )
  }

  // 抓取结果为 0 时输出提示
  protected noResult() {
    // 先触发 crawlFinish，后触发 crawlEmpty。这样便于其他组件处理 crawlEmpty 这个例外情况
    // 如果触发顺序反过来，那么最后执行的都是 crawlFinish，可能会覆盖对 crawlEmpty 的处理
    EVT.fire(EVT.list.crawlFinish)
    EVT.fire(EVT.list.crawlEmpty)
    const msg = lang.transl('_抓取结果为零')
    log.error(msg, 2)
    EVT.sendMsg({
      msg: msg,
      type: 'error',
    })
  }

  // 抓取完成后，对结果进行排序
  protected sortResult() {}
}

export { InitPageBase }
