import { lang } from './Lang'
import { EVT } from './EVT'
import { states } from './store/States'
import { theme } from './Theme'
import { Config } from './Config'
import { msgBox } from './MsgBox'
import { bg } from './BG'
import './OpenCenterPanel'
import { settings } from './setting/Settings'
import { BoldKeywords } from './BoldKeywords'
import { showHelp } from './ShowHelp'

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
    theme.register(this.centerPanel)
    lang.register(this.centerPanel)
    this.activeTab(Tabbar.Crawl)

    bg.useBG(this.centerPanel)

    new BoldKeywords(this.centerPanel)

    this.allLangFlag = lang.langTypes.map((type) => 'lang_' + type)
    this.setLangFlag()

    this.bindEvents()
  }

  private centerPanel!: HTMLDivElement
  private updateLink!: HTMLAnchorElement
  private updateActiveClass = 'updateActiveClass'

  private allTabTitle!: NodeListOf<HTMLDivElement> // 选项卡的标题区域
  private readonly TitleActiveClass = 'active'
  private titleAnimationEl!: HTMLElement
  private readonly titleAnimationElClassList = ['tab1', 'tab2', 'tab3']

  // 添加中间面板
  private addCenterPanel() {
    const centerPanelHTML = `
      <div class="centerWrap ${'lang_' + lang.type}">

      <div class="centerWrap_head">
      <div class="centerWrap_title blue">
      ${Config.appName}
      <div class="btns">
      <a class="has_tip centerWrap_top_btn update" data-xztip="_newver" data-xztitle="_newver" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gengxin"></use>
        </svg>
      </a>
      <a class="has_tip centerWrap_top_btn github_icon" data-xztip="_github" data-xztitle="_github" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-github"></use>
      </svg>
      </a>
      <a class="has_tip centerWrap_top_btn wiki_url" data-xztip="_wiki" data-xztitle="_wiki" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-help"></use>
        </svg>
      </a>
        <button class="textButton has_tip centerWrap_top_btn centerWrap_close" data-xztip="_隐藏控制面板" data-xztitle="_隐藏控制面板">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        </button>
      </div>
      </div>
      </div>

      <div class="centerWrap_tabs tabsTitle">
        <div class="title" data-xztext="_抓取" tabindex="0"></div>
        <div class="title" data-xztext="_下载" tabindex="0"></div>
        <div class="title" data-xztext="_更多" tabindex="0"></div>
        <div class="title_active"></div>
      </div>

      <div class="centerWrap_con beautify_scrollbar">

      <slot data-name="form"></slot>

      <div class="help_bar gray1"> 
      <button class="textButton gray1" id="showDownTip" type="button" data-xztext="_常见问题"></button>
      <a class="gray1" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank" data-xztext="_wiki"></a>
      <a class="gray1" href="https://discord.gg/eW9JtTK" target="_blank">Discord</a>
      <a class="gray1" href="https://chrome.google.com/webstore/detail/pixiv-fanbox-downloader/ihnfpdchjnmlehnoeffgcbakfmdjcckn" target="_blank" data-xztext="_fanboxDownloader"></a>
      <button class="textButton gray1" id="showPatronTip" type="button" data-xztext="_赞助我"></button>
      <br>
      </div>

      </div>

      </div>
      `
    document.body.insertAdjacentHTML('beforebegin', centerPanelHTML)

    this.centerPanel = document.querySelector('.centerWrap') as HTMLDivElement

    this.updateLink = this.centerPanel.querySelector(
      '.update'
    )! as HTMLAnchorElement

    this.allTabTitle = this.centerPanel.querySelectorAll('.tabsTitle .title')

    this.titleAnimationEl = this.centerPanel.querySelector(
      '.title_active'
    )! as HTMLElement
  }

  private allLangFlag: string[] = []
  private setLangFlag() {
    this.allLangFlag.forEach((flag) => {
      this.centerPanel.classList.remove(flag)
    })
    this.centerPanel.classList.add('lang_' + lang.type)
  }

  private bindEvents() {
    // 监听点击扩展图标的消息，开关中间面板
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.msg === 'click_icon') {
        this.toggle()
      }
    })

    window.addEventListener(EVT.list.settingInitialized, () => {
      showHelp.show('tipHowToUse', lang.transl('_HowToUse'))
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
        showHelp.show(
          'tipAltXToShowControlPanel',
          lang.transl('_快捷键ALTX显示隐藏控制面板')
        )
      })

    // 开始抓取作品时，隐藏
    window.addEventListener(EVT.list.crawlStart, () => {
      EVT.fire('closeCenterPanel')
    })

    // 抓取完作品详细数据时，显示
    for (const ev of [EVT.list.crawlComplete, EVT.list.resume]) {
      window.addEventListener(ev, () => {
        if (!states.quickCrawl) {
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
      .querySelector('#showDownTip')!
      .addEventListener('click', () =>
        msgBox.show(lang.transl('_常见问题说明'), {
          title: lang.transl('_常见问题'),
        })
      )

    this.centerPanel
      .querySelector('#showPatronTip')!
      .addEventListener('click', () =>
        msgBox.show(lang.transl('_赞助方式提示'), {
          title: lang.transl('_赞助我'),
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
      const title = this.allTabTitle[index]
      eventList.forEach((eventName) => {
        title.addEventListener(eventName, () => {
          // 触发 mouseenter 时，如果用户设置的是通过点击来切换选项卡，则直接返回
          // 触发 click 时无需检测，始终可以切换
          if (eventName === 'mouseenter' && settings.switchTabBar === 'click') {
            return
          }
          this.activeTab(index)
        })
      })

      // 当标题获得焦点，并且用户按下了回车或空格键时，激活对应的选项卡
      title.addEventListener('keydown', (event) => {
        if (
          (event.code === 'Enter' || event.code === 'Space') &&
          event.target === title
        ) {
          event.stopPropagation()
          event.preventDefault()
          this.activeTab(index)
        }
      })
    }

    // 当可以开始下载时，切换到“下载”选项卡
    for (const ev of [EVT.list.crawlComplete, EVT.list.resume]) {
      window.addEventListener(ev, () => {
        if (states.mergeNovel) {
          return
        }
        this.activeTab(Tabbar.Download)
      })
    }

    window.addEventListener(EVT.list.crawlEmpty, () => {
      this.activeTab(Tabbar.Crawl)
    })

    window.addEventListener(EVT.list.langChange, () => {
      this.setLangFlag()
    })
  }

  // 设置激活的选项卡
  private activeTab(no = 0) {
    // 显示选项卡的内容
    const allTabCon = this.centerPanel.querySelectorAll(
      '.tabsContnet'
    ) as NodeListOf<HTMLElement>
    for (let index = 0; index < allTabCon.length; index++) {
      allTabCon[index].style.display = index === no ? 'block' : 'none'
    }

    // 高亮选项卡的标题
    for (const title of this.allTabTitle) {
      title.classList.remove(this.TitleActiveClass)
    }
    this.allTabTitle[no].classList.add(this.TitleActiveClass)

    // 设置动画效果
    const useClass = this.titleAnimationElClassList[no]
    if (this.titleAnimationEl.classList.contains(useClass)) {
      return
    }
    this.titleAnimationElClassList.forEach((str) => {
      this.titleAnimationEl.classList.remove(str)
    })
    this.titleAnimationEl.classList.add(useClass)
  }

  // 显示中间区域
  public show() {
    if (states.mergeNovel) {
      return
    }
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
