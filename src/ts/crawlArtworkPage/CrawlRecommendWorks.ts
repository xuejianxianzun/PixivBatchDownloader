import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Lang'
import { pageType } from '../PageType'
import { states } from '../store/States'
import { IDData } from '../store/StoreType'

// 在作品页面里，点击收藏按钮后会出现推荐作品。这个模块用于抓取推荐作品
class CrawlRecommendWorks {
  constructor() {
    this.timer = window.setInterval(() => {
      this.foundTarget()
    }, 300)

    this.bindEvents()
  }

  private get checkSelector() {
    return Config.mobile ? '.recommend-slidein-booster' : 'figcaption h2'
  }

  private readonly linkSelector = '.gtm-illust-recommend-thumbnail-link'

  private get datasetFlag() {
    return Config.mobile ? 'gtmRecommendIllustId' : 'gtmValue'
  }

  private found = false
  private timer: number | undefined
  private IDList: IDData[] = []

  private foundTarget() {
    if (this.found || pageType.type !== pageType.list.Artwork) {
      return
    }

    const titleBar = document.querySelector(this.checkSelector)
    if (titleBar) {
      this.found = true
      window.clearTimeout(this.timer)

      // 等待一段时间再获取作品超链接，因为立刻获取的话可能还未生成
      // 其实在 PC 端页面是可以立即获取到的，但是在移动端页面需要等待较长时间，500ms 不够用
      window.setTimeout(
        () => {
          this.readyCrawl()
        },
        Config.mobile ? 1000 : 100
      )
    }
  }

  private bindEvents() {
    window.addEventListener(EVT.list.pageSwitch, () => {
      // 页面切换后，页面元素可能还没来得及变化，所以需要等待一段时间后再开始查找
      // 如果立即查找，那么经常会查找到已经存在的推荐列表，于是就会立即停止查找
      window.setTimeout(() => {
        this.found = false
        this.IDList = []

        window.clearTimeout(this.timer)
        this.timer = window.setInterval(() => {
          this.foundTarget()
        }, 300)
      }, 600)
    })
  }

  private readyCrawl() {
    const allLinks = document.querySelectorAll(
      this.linkSelector
    ) as NodeListOf<HTMLAnchorElement>
    for (const a of allLinks) {
      const id = a.dataset[this.datasetFlag]
      if (id) {
        this.IDList.push({
          id,
          type: 'illusts',
        })
      }
    }

    this.addDownloadBtn()
  }

  private addDownloadBtn() {
    if (this.IDList.length === 0) {
      return
    }

    const target = document.querySelector(
      this.checkSelector
    ) as HTMLHeadingElement
    if (!target) {
      return
    }

    const btn = document.createElement('button')
    btn.textContent = lang.transl('_下载推荐作品')
    btn.classList.add('blueTextBtn')
    btn.addEventListener('click', () => {
      // 传递 ID 列表时需要复制一份，因为如果直接传递变量，那么这个数组会在抓取之后被清空
      EVT.fire('crawlIdList', [...this.IDList])
    })

    if (Config.mobile) {
      // 在移动端页面，需要把按钮添加到第一个子元素后面，因为第一个子元素才是“推荐作品”的标题
      target.firstElementChild!.insertAdjacentElement('afterend', btn)
    } else {
      // 修改标题的父元素样式，以便让标题和下载按钮可以并排显示
      target.parentElement!.style.display = 'flex'
      target.parentElement!.style.alignItems = 'center'
      target.insertAdjacentElement('afterend', btn)
    }
  }
}

new CrawlRecommendWorks()
