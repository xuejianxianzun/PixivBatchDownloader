// 初始化搜索页
import { InitPageBase } from './InitPageBase'
import { CrawlSearchPage } from './CrawlSearchPage'
import { Colors } from './Colors'
import { lang } from './Lang'
import { ui } from './UI'
import { pageInfo } from './PageInfo'
import { DeleteWorks } from './DeleteWorks'
import { EVT } from './EVT'

class InitSearchPage extends InitPageBase {
  constructor(crawler: CrawlSearchPage) {
    super(crawler)
    this.crawler = crawler
  }
  protected crawler: CrawlSearchPage

  protected appendCenterBtns() {
    ui.addCenterButton(Colors.green, lang.transl('_开始筛选'), [
      ['title', lang.transl('_开始筛选Title')]
    ]).addEventListener('click', () => {
      this.crawler.startScreen()
    })

    ui.addCenterButton(Colors.red, lang.transl('_在结果中筛选'), [
      ['title', lang.transl('_在结果中筛选Title')]
    ]).addEventListener('click', () => {
      this.crawler.screenInResult()
    })
  }

  protected appendElseEl() {
    this.fastScreen()

    const deleteWorks = new DeleteWorks('.lmXjIY')

    deleteWorks.addClearMultipleBtn('.fjaNWC', () => {
      EVT.fire(EVT.events.clearMultiple)
    })

    deleteWorks.addClearUgoiraBtn('.bAzGJL', () => {
      EVT.fire(EVT.events.clearUgoira)
    })

    deleteWorks.addManuallyDeleteBtn((el: HTMLElement) => {
      EVT.fire(EVT.events.deleteWork, el)
    })
  }

  // 打开快速筛选链接
  private openFastScreenLink(secondTag: string) {
    // 拼接两个 tag。因为搜索页面可以无刷新切换搜索的 tag，所以从这里动态获取
    const firstTag = pageInfo.getPageTag.split(' ')[0]
    const fullTag = encodeURIComponent(firstTag + ' ' + secondTag)
    // 用新的 tag 替换掉当前网址里的 tag
    let newURL = location.href.replace(
      encodeURIComponent(pageInfo.getPageTag),
      fullTag
    )
    // 添加 s_mode=s_tag 宽松匹配标签
    let u = new URL(newURL)
    u.searchParams.set('s_mode', 's_tag')
    location.href = u.toString()
  }

  // 添加快速筛选功能
  private fastScreen() {
    // 判断插入点的元素有没有加载出来
    let target = document.querySelector('header')

    if (!target) {
      setTimeout(() => {
        this.fastScreen()
      }, 300)
      return
    }

    const favNums = [
      '100users入り',
      '500users入り',
      '1000users入り',
      '3000users入り',
      '5000users入り',
      '10000users入り',
      '20000users入り',
      '30000users入り',
      '50000users入り'
    ] // 200 和 2000 的因为数量太少，不添加。40000 的也少

    const fastScreenArea = document.createElement('div')
    fastScreenArea.className = 'fastScreenArea'
    favNums.forEach(secondTag => {
      let a = document.createElement('a')
      a.innerText = secondTag
      a.href = 'javascript:viod(0)'
      a.onclick = () => {
        this.openFastScreenLink(secondTag)
      }
      fastScreenArea.appendChild(a)
    })
    ;(target as HTMLDivElement).insertAdjacentElement(
      'afterend',
      fastScreenArea
    )
  }

  protected setFormOptin() {
    this.crawler.maxCount = 1000
    this.setWantPageTip1.textContent = lang.transl('_页数')
    this.setWantPageTip1.dataset.tip = lang.transl('_checkWantPageRule1Arg8')
    this.setWantPageTip2.textContent = `1 - ${this.crawler.maxCount}`
    this.setWantPage.value = this.crawler.maxCount.toString()

    this.hideNotNeedOption([14])
  }

  protected destroySelf() {
    // 删除快速筛选元素
    const fastScreen = document.querySelector('.fastScreenArea')
    if (fastScreen) {
      fastScreen.remove()
    }
  }
}

export { InitSearchPage }
