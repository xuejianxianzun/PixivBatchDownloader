// 初始化所有页面抓取流程的基类
import { lang } from './Lang'
import { Colors } from './Colors'
import { DOM } from './DOM'
import { options } from './setting/Options'
import { saveArtworkData } from './artwork/SaveArtworkData'
import { saveNovelData } from './novel/SaveNovelData'
import { API } from './API'
import { store } from './Store'
import { log } from './Log'
import { EVT } from './EVT'
import { form } from './setting/Form'
import { settings } from './setting/Settings'
import { settingAPI } from './setting/SettingAPI'
import { IDData } from './Store.d'
import { states } from './States'

abstract class InitPageBase {
  protected init() {
    options.showAllOption()
    this.setFormOption()
    this.appendCenterBtns()
    this.appendElseEl()
    this.initElse()

    // 个数/页数设置可能在 init 里由代码直接进行设置，不会触发 change 事件，无法被监听到。所以手动触发 settingChange 事件，使其他组件能够接收到通知
    EVT.fire(EVT.events.settingChange, { name: 'setWantPage', value: form.setWantPage.value })

    window.addEventListener(EVT.events.pageSwitchedTypeChange, () => {
      this.destroy()
    })
  }

  // 各个子类私有的初始化内容
  // 可以在这里绑定事件 
  protected initElse() { }

  // 销毁初始化页面时添加的元素和事件，恢复设置项等
  protected destroy(): void {
    DOM.clearSlot('crawlBtns')
    DOM.clearSlot('otherBtns')
  }

  // 添加中间按钮
  protected appendCenterBtns() {
    DOM.addBtn('crawlBtns', Colors.blue, lang.transl('_开始抓取'), [
      ['title', lang.transl('_开始抓取') + lang.transl('_默认下载多页')],
    ]).addEventListener('click', () => {
      this.readyCrawl()
    })
  }

  // 添加其他元素（如果有）
  protected appendElseEl(): void { }

  // 设置表单里的选项。主要是设置页数，隐藏不需要的选项。
  protected setFormOption(): void {
    // 设置“个数/页数”选项
    options.setWantPage({
      text: lang.transl('_页数'),
      tip: lang.transl('_从本页开始下载提示'),
      rangTip: lang.transl('_数字提示1'),
      value: '1',
    })
  }

  protected crawlNumber: number = 0 // 要抓取的个数/页数

  protected firstFewImages: number = 0 // 每个作品下载几张图片。0为不限制，全部下载。改为1则只下载第一张。这是因为有时候多p作品会导致要下载的图片过多，此时可以设置只下载前几张，减少下载量

  protected maxCount = 1000 // 当前页面类型最多有多少个页面/作品

  protected startpageNo: number = 1 // 列表页开始抓取时的页码，只在 api 需要页码时使用。目前有搜索页、排行榜页、关注的新作品页使用。

  protected listPageFinished: number = 0 // 记录一共抓取了多少个列表页。使用范围同上。

  protected readonly ajaxThreadsDefault: number = 10 // 抓取时的并发连接数默认值，也是最大值

  protected ajaxThreads: number = this.ajaxThreadsDefault // 抓取时的并发连接数

  protected ajaxThreadsFinished: number = 0 // 统计有几个并发线程完成所有请求。统计的是并发线程（ ajaxThreads ）而非请求数

  // 作品个数/页数的输入不合法
  private getWantPageError() {
    EVT.fire(EVT.events.crawlError)
    const msg = lang.transl('_参数不合法')
    window.alert(msg)
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
      log.warning(crawlPartTip.replace('-num-', temp.toString()))
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
      const r = (result.value > max) ? max : result.value

      if (page) {
        log.warning(lang.transl('_从本页开始下载x页',r.toString()))
      }else{
        log.warning(lang.transl('_从本页开始下载x个',r.toString()))
      }
      return r
    } else {
      throw this.getWantPageError()
    }
  }

  // 设置要获取的作品数或页数。有些页面使用，有些页面不使用。使用时再具体定义
  protected getWantPage() { }

  // 获取多图作品设置。因为这个不属于过滤器 filter，所以在这里直接获取
  protected getMultipleSetting() {
    // 获取作品张数设置
    if (settings.firstFewImagesSwitch) {
      this.firstFewImages = settingAPI.getFirstFewImages()
      log.warning(
        lang.transl('_多图作品下载前n张图片', this.firstFewImages.toString())
      )
    }
  }

  // 准备抓取，进行抓取之前的一些检查工作。必要时可以在子类中改写
  protected async readyCrawl() {
    // 检查是否可以开始抓取
    if (states.busy) {
      window.alert(lang.transl('_当前任务尚未完成2'))
      return
    }

    log.clear()

    log.success(lang.transl('_任务开始0'))

    this.getWantPage()

    this.getMultipleSetting()

    EVT.fire(EVT.events.crawlStart)

    // 进入第一个抓取方法
    this.nextStep()
  }

  // 当可以开始抓取时，进入下一个流程。默认情况下，开始获取作品列表。如有不同，由子类具体定义
  protected nextStep() {
    this.getIdList()
  }

  // 获取作品列表，由各个子类具体定义
  protected abstract getIdList(): void

  // 作品列表获取完毕，开始抓取作品内容页
  protected getIdListFinished() {
    // 列表页获取完毕后，可以在这里重置一些变量
    this.resetGetIdListStatus()

    if (store.idList.length === 0) {
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

    try {
      // 发起请求
      if (idData.type === 'novels') {
        const data = await API.getNovelData(id)
        await saveNovelData.save(data)
      } else {
        const data = await API.getArtworkData(id)
        await saveArtworkData.save(data)
      }
      this.afterGetWorksData()
    } catch (error) {
      //  请求成功，但 response.ok 错误。不重试请求，跳过该作品继续抓取
      if (error.status) {
        this.logErrorStatus(error.status, id)
        this.afterGetWorksData()
      } else {
        // 请求失败，会重试这个请求
        console.log(error)
        setTimeout(() => {
          this.getWorksData(idData)
        }, 2000)
      }

      return
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
      return this.noResult()
    }

    this.sortResult()

    log.log(lang.transl('_共抓取到n个文件', store.result.length.toString()))

    log.log(lang.transl('_抓取完毕'), 2)

    // 统计不同类型的文件数量
    // 统计 blob 文件的体积
    // const type = [0, 0, 0, 0]
    // let blobSize = 0
    // for (const result of store.result) {
    //   type[result.type] = type[result.type] + 1
    //   if(result.novelBlob){
    //     blobSize += result.novelBlob.size
    //   }
    // }
    // console.log(type)
    // console.log(blobSize)

    // 发出抓取完毕的信号
    EVT.fire(EVT.events.crawlFinish)
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
        log.error(lang.transl('_无权访问2', id))
        break
    }
  }

  // 在抓取图片网址时，输出提示
  protected logResultTotal() {
    log.log(
      lang.transl('_共抓取到n个文件', store.result.length.toString()),
      1,
      false
    )
  }

  // 抓取结果为 0 时输出提示
  protected noResult() {
    // 先触发 crawlFinish，后触发 crawlEmpty。这样便于其他组件处理 crawlEmpty 这个例外情况
    // 如果触发顺序反过来，那么最后执行的都是 crawlFinish，可能会覆盖对 crawlEmpty 的处理
    EVT.fire(EVT.events.crawlFinish)
    EVT.fire(EVT.events.crawlEmpty)
    log.error(lang.transl('_抓取结果为零'), 2)
    window.alert(lang.transl('_抓取结果为零'))
  }

  // 抓取完成后，对结果进行排序
  protected sortResult() { }
}

export { InitPageBase }
