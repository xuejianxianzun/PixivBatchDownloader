import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './store/States'
import { theme } from './Theme'
import { Config } from './config/Config'
import { msgBox } from './MsgBox'
import { BG } from './setting/BG'
import './OpenCenterPanel'
import { settings } from './setting/Settings'

// 选项卡的名称和索引
enum Tabbar {
  Crawl,
  Download,
  Other,
}

// 中间面板
class CenterPanel {
  constructor() {
    this.addCenterPanel()

    this.activeTab(Tabbar.Crawl)

    theme.register(this.centerPanel)

    new BG(this.centerPanel)

    this.bindEvents()
  }

  private centerPanel!: HTMLDivElement
  private updateLink!: HTMLAnchorElement
  private updateActiveClass = 'updateActiveClass'

  private allTabTitle!: NodeListOf<HTMLDivElement> // 选项卡的标题区域
  private readonly activeClass = 'active'

  // 添加中间面板
  private addCenterPanel() {
    const centerPanelHTML = `
      <div class="centerWrap ${'lang_' + lang.type}">

      <div class="centerWrap_head">
      <div class="centerWrap_title blue">
      ${Config.appName}
      <div class="btns">
      <a class="has_tip centerWrap_top_btn update" data-tip="${lang.transl(
        '_newver'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengxin"></use>
        </svg>
      </a>
      <a class="has_tip centerWrap_top_btn github_icon" data-tip="${lang.transl(
        '_github'
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-github"></use>
      </svg>
      </a>
      <a class="has_tip centerWrap_top_btn wiki_url" data-tip="${lang.transl(
        '_wiki'
      )}" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-help"></use>
        </svg>
      </a>
        <div class="has_tip centerWrap_top_btn centerWrap_close" data-tip="${lang.transl(
          '_隐藏下载面板'
        )}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        </div>
      </div>
      </div>
      </div>

      <div class="centerWrap_tabs tabsTitle">
        <div class="title">${lang.transl('_抓取')}</div>
        <div class="title">${lang.transl('_下载')}</div>
        <div class="title">${lang.transl('_其他')}</div>
      </div>

      <div class="centerWrap_con beautify_scrollbar">

      <slot data-name="form"></slot>

      <div class="help_bar gray1"> 
      <button class="textButton gray1 showDownTip" type="button">${lang.transl(
        '_常见问题'
      )}</button>
      <a class="gray1" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank"> ${lang.transl(
        '_wiki'
      )}</a>
      <a class="gray1" href="https://github.com/xuejianxianzun/PixivFanboxDownloader" target="_blank"> ${lang.transl(
        '_fanboxDownloader'
      )}</a>
      <a id="zanzhu" class="gray1 patronText" href="https://afdian.net/@xuejianxianzun" target="_blank">在“爱发电”支持我</a>
      <a id="patreon" class="gray1 patronText" href="https://www.patreon.com/xuejianxianzun" target="_blank">Become a patron</a>
      <a class="gray1" href="https://discord.gg/eW9JtTK" target="_blank">Discord</a>
      <br>
      </div>

      </div>

      </div>
      `
    document.body.insertAdjacentHTML('beforeend', centerPanelHTML)

    this.centerPanel = document.querySelector('.centerWrap') as HTMLDivElement

    this.updateLink = this.centerPanel.querySelector(
      '.update'
    )! as HTMLAnchorElement

    const donateId = lang.type === 'zh-cn' ? 'zanzhu' : 'patreon'
    document.getElementById(donateId)!.style.display = 'inline-block'

    this.allTabTitle = this.centerPanel.querySelectorAll('.tabsTitle .title')
  }

  private bindEvents() {
    // 监听点击扩展图标的消息，开关中间面板
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.msg === 'click_icon') {
        this.toggle()
      }
    })

    // 使用快捷键 Alt + x 切换中间面板显示隐藏
    window.addEventListener(
      'keydown',
      (ev) => {
        if (ev.altKey && ev.code === 'KeyX') {
          this.toggle()
        }
      },
      false
    )

    // 关闭按钮
    document
      .querySelector('.centerWrap_close')!
      .addEventListener('click', () => {
        EVT.fire('closeCenterPanel')
      })

    // 开始抓取作品时，隐藏
    window.addEventListener(EVT.list.crawlStart, () => {
      EVT.fire('closeCenterPanel')
    })

    // 抓取完作品详细数据时，显示
    for (const ev of [EVT.list.crawlFinish, EVT.list.resume]) {
      window.addEventListener(ev, () => {
        if (!states.quickCrawl && !states.downloadFromViewer) {
          this.show()
        }
      })
    }

    window.addEventListener(EVT.list.openCenterPanel, () => {
      this.show()
    })

    window.addEventListener(EVT.list.closeCenterPanel, () => {
      this.close()
    })

    // 显示更新按钮
    window.addEventListener(EVT.list.hasNewVer, () => {
      this.updateLink.classList.add(this.updateActiveClass)
      this.updateLink.style.display = 'inline-block'
    })

    // 显示常见问题
    this.centerPanel
      .querySelector('.showDownTip')!
      .addEventListener('click', () =>
        msgBox.show(lang.transl('_下载说明'), {
          title: lang.transl('_常见问题'),
        })
      )

    this.centerPanel.addEventListener('click', (e) => {
      const ev = e || window.event
      ev.stopPropagation()
    })

    document.addEventListener('click', () => {
      if (getComputedStyle(this.centerPanel)['display'] !== 'none') {
        EVT.fire('closeCenterPanel')
      }
    })

    // 在选项卡的标题上触发事件时，激活对应的选项卡
    const eventList = ['click', 'mouseenter']
    for (let index = 0; index < this.allTabTitle.length; index++) {
      eventList.forEach((eventName) => {
        this.allTabTitle[index].addEventListener(eventName, () => {
          // 触发 mouseenter 时，如果用户设置了通过点击切换选项卡，则直接返回
          // 触发 click 时无需检测，始终可以切换
          if (eventName === 'mouseenter' && settings.switchTabBar === 'click') {
            return
          }
          this.activeTab(index)
        })
      })
    }

    // 当可以开始下载时，切换到“下载”选项卡
    for (const ev of [
      EVT.list.crawlFinish,
      EVT.list.resultChange,
      EVT.list.resume,
    ]) {
      window.addEventListener(ev, () => {
        this.activeTab(Tabbar.Download)
      })
    }

    window.addEventListener(EVT.list.crawlEmpty, () => {
      this.activeTab(Tabbar.Crawl)
    })
  }

  // 设置激活的选项卡
  private activeTab(no = 0) {
    for (const title of this.allTabTitle) {
      title.classList.remove(this.activeClass)
    }
    this.allTabTitle[no].classList.add(this.activeClass)

    const allTabCon = this.centerPanel.querySelectorAll(
      '.tabsContnet'
    ) as NodeListOf<HTMLElement>
    for (let index = 0; index < allTabCon.length; index++) {
      allTabCon[index].style.display = index === no ? 'block' : 'none'
    }
  }

  // 显示中间区域
  public show() {
    this.centerPanel.style.display = 'block'
    EVT.fire('centerPanelOpened')
  }

  // 隐藏中间区域
  public close() {
    this.centerPanel.style.display = 'none'
    EVT.fire('centerPanelClosed')
  }

  public toggle() {
    const nowDisplay = this.centerPanel.style.display
    nowDisplay === 'block' ? this.close() : this.show()
    if (nowDisplay === 'block') {
      EVT.fire('closeCenterPanel')
    } else {
      EVT.fire('openCenterPanel')
    }
  }
}

new CenterPanel()
