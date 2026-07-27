import browser from 'webextension-polyfill'
import { bg } from '../BG'
import { BoldKeywords } from '../BoldKeywords'
import { Config } from '../Config'
import { EVT } from '../EVT'
import { lang } from '../Language'
import { msgBox } from '../MsgBox'
import { showOneTimeMsg } from '../ShowOneTimeMsg'
import { states } from '../store/States'
import { store } from '../store/Store'
import { theme } from '../Theme'

/** 设置面板的外壳 */
// - 负责 shell HTML 渲染
// - 顶部/侧边导航外壳结构
// - 语言 class 切换
// - Alt+X、点击图标开关面板
// - shell 级别的打开/关闭事件
// - sponsor 按钮、点击空白关闭等全局事件
class SettingsPanelShell {
  private static shell?: HTMLDivElement
  private static allLangFlag: string[] = []
  /** 监听设置内容变化，以更新面板高度 */
  private static heightObserver?: MutationObserver
  /** 监听设置内容尺寸变化，以同步面板高度动画 */
  private static heightResizeObserver?: ResizeObserver

  public static init() {
    if (this.shell) {
      return this.shell
    }

    const LogoURL = browser.runtime.getURL('icons/logo128.png')
    const centerPanelHTML = `
      <div class="centerWrap ${'lang_' + lang.type}">
        <div class="centerWrap_head">
          <div class="settingsPanel_headerMain">
            <div class="settingsPanel_brand">
              <img class="settingsPanel_logo" src="${LogoURL}" alt="${Config.appName}">
              <span class="settingsPanel_brandName">${Config.appName}</span>
            </div>

            <button class="centerWrap_top_btn centerWrap_close centerWrap_close_mobile" type="button" data-xztitle="_关闭">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#close"></use>
              </svg>
            </button>
          </div>

          <div class="settingsPanel_headerActions">
            <div class="settingsPanel_headerSearch">
              <label class="settingsPanel_searchBar">
                <svg class="icon settingsPanel_searchIcon" aria-hidden="true">
                  <use xlink:href="#search-in-searchbar"></use>
                </svg>
                <input id="settingsPanelSearchInput" type="text" data-xzplaceholder="_搜索设置">
                <button class="settingsPanel_clearSearch" id="settingsPanelClearSearch" type="button" data-xztitle="_清除">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#close"></use>
                  </svg>
                </button>
              </label>

              <button class="centerWrap_top_btn settingsPanel_expandAll" id="settingsPanelToggleExpand" type="button" data-xztitle="_展开/折叠所有区域">
                <svg class="icon settingsPanel_expandIcon" aria-hidden="true">
                  <use xlink:href="#arrow-up"></use>
                </svg>
              </button>
            </div>

            <div class="settingsPanel_headerMinor">
              <button class="centerWrap_top_btn settingsPanel_sponsorBtn" id="settingsPanelSponsor" type="button" data-xztitle="_赞助我">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#heart-line"></use>
                </svg>
              </button>
            </div>

            <div class="settingsPanel_headerClose">
              <button class="centerWrap_top_btn centerWrap_close centerWrap_close_pc" type="button" data-xztitle="_关闭">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#close"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="centerWrap_con">
          <aside class="settingsPanel_sidebar beautify_scrollbar">
            <nav class="settingsPanel_nav">
              ${this.createNavItem('home', '_首页_Home', 'home-line', 'home-fill')}
              ${this.createNavItem('crawl', '_抓取', 'filter-line', 'filter-filling')}
              ${this.createNavItem('naming', '_命名', 'rename-line', 'rename-fill')}
              ${this.createNavItem('download', '_下载', 'download-line', 'download-fill')}
              ${this.createNavItem('enhance', '_增强', 'magic-line', 'magic-fill')}
              ${this.createNavItem('general', '_通用', 'setting-line', 'setting-fill')}
              ${this.createNavItem('help', '_帮助', 'book-line', 'book-fill')}
              ${this.createNavItem('search', '_搜索', 'search-line', 'search-fill', true)}
            </nav>

            <div class="settingsPanel_downloadSummary" id="settingsPanelDownloadSummary">
              <div class="settingsPanel_downloadSummaryStatus">
                <svg class="icon settingsPanel_downloadSummaryStateIcon" aria-hidden="true">
                  <use xlink:href="#start"></use>
                </svg>
                <span class="settingsPanel_downloadSummaryProgress">0 / 0</span>
              </div>

              <div class="settingsPanel_downloadSummaryActions">
                <button class="settingsPanel_downloadSummaryBtn" id="settingsPanelSummaryStart" type="button" data-xztitle="_开始下载">
                  <svg class="icon" aria-hidden="true"><use xlink:href="#start"></use></svg>
                </button>
                <button class="settingsPanel_downloadSummaryBtn" id="settingsPanelSummaryPause" type="button" data-xztitle="_暂停下载">
                  <svg class="icon" aria-hidden="true"><use xlink:href="#pause"></use></svg>
                </button>
                <button class="settingsPanel_downloadSummaryBtn" id="settingsPanelSummaryStop" type="button" data-xztitle="_停止下载">
                  <svg class="icon" aria-hidden="true"><use xlink:href="#stop"></use></svg>
                </button>
              </div>
            </div>
          </aside>

          <div class="settingsPanel_main beautify_scrollbar">
            <slot data-name="form"></slot>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('afterbegin', centerPanelHTML)
    this.shell = document.querySelector('.centerWrap') as HTMLDivElement
    if (!this.shell) {
      throw new Error('SettingsPanel shell not found')
    }

    this.observeContentHeight()
    if (Config.mobile) {
      document.body.classList.add('mobile')
      this.shell.classList.add('mobile')
    }

    theme.register(this.shell)
    lang.register(this.shell)
    bg.useBG(this.shell)
    new BoldKeywords(this.shell)

    this.allLangFlag = lang.langTypes.map((type) => 'lang_' + type)
    this.setLangFlag()
    this.bindEvents()
    return this.shell
  }

  public static get() {
    return this.init()
  }

  private static createNavItem(
    page: string,
    textKey: string,
    lineIcon: string,
    fillIcon: string,
    hidden = false
  ) {
    return `
    <button class="settingsPanel_navItem hasRippleAnimation" data-page="${page}" type="button" ${
      hidden ? 'hidden' : ''
    }>
      <span class="settingsPanel_navIconWrap" aria-hidden="true">
        <svg class="icon settingsPanel_navIcon settingsPanel_navIconLine">
          <use xlink:href="#${lineIcon}"></use>
        </svg>
        <svg class="icon settingsPanel_navIcon settingsPanel_navIconFill">
          <use xlink:href="#${fillIcon}"></use>
        </svg>
      </span>
      <span class="settingsPanel_navText" data-xztext="${textKey}"></span>
      <span class="ripple"></span>
    </button>
    `
  }

  private static setLangFlag() {
    const shell = this.get()
    this.allLangFlag.forEach((flag) => {
      shell.classList.remove(flag)
    })
    shell.classList.add('lang_' + lang.type)
  }

  private static bindEvents() {
    const shell = this.get()

    browser.runtime.onMessage.addListener((msg: any) => {
      if (msg.msg === 'click_icon') {
        this.toggle()
      }
    })

    window.addEventListener(EVT.list.settingInitialized, () => {
      showOneTimeMsg.show(
        'tipHowToUse',
        lang.transl('_HowToUse') + lang.transl('_账户可能被封禁的警告')
      )
    })

    window.addEventListener(
      'keydown',
      (ev) => {
        if (ev.altKey && ev.code === 'KeyX') {
          this.toggle()
        }
      },
      false
    )

    shell.querySelectorAll('.centerWrap_close').forEach((button) =>
      button.addEventListener('click', () => {
        EVT.fire('closeCenterPanel')
        if (!Config.mobile) {
          showOneTimeMsg.show(
            'tipAltXToShowControlPanel',
            lang.transl('_快捷键ALTX显示隐藏控制面板')
          )
        }
      })
    )

    shell
      .querySelector('#settingsPanelSponsor')
      ?.addEventListener('click', () =>
        msgBox.show(lang.transl('_赞助方式提示'), {
          title: lang.transl('_赞助我'),
        })
      )

    window.addEventListener(EVT.list.crawlStart, () => {
      EVT.fire('closeCenterPanel')
    })

    for (const ev of [EVT.list.crawlComplete, EVT.list.resume]) {
      window.addEventListener(ev, () => {
        if (!states.quickCrawl && store.result.length > 0) {
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

    window.addEventListener(EVT.list.langChange, () => {
      this.setLangFlag()
    })

    shell.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    document.addEventListener('click', () => {
      if (getComputedStyle(shell).display !== 'none') {
        EVT.fire('closeCenterPanel')
      }
    })
  }

  private static show() {
    const shell = this.get()
    shell.style.display = 'flex'
    this.updateHeight()
    EVT.fire('centerPanelOpened')
  }

  private static close() {
    this.get().style.display = 'none'
    EVT.fire('centerPanelClosed')
  }

  private static toggle() {
    const shell = this.get()
    const nowDisplay = shell.style.display
    nowDisplay === 'flex' ? this.close() : this.show()
    if (nowDisplay === 'flex') {
      EVT.fire('closeCenterPanel')
    } else {
      EVT.fire('openCenterPanel')
    }
  }

  /** 监听会影响内容高度的 DOM 变化 */
  private static observeContentHeight() {
    const content = this.get().querySelector(
      '.centerWrap_con'
    ) as HTMLDivElement
    if (!content) {
      throw new Error('Settings panel content not found')
    }

    const observeContentSize = () => {
      const form = content.querySelector('.settingsPanel_form')
      if (form) {
        this.heightResizeObserver?.observe(form)
      }
    }

    this.heightResizeObserver = new ResizeObserver(() => this.updateHeight())
    observeContentSize()

    this.heightObserver = new MutationObserver(() => {
      observeContentSize()
      this.updateHeight()
    })
    this.heightObserver.observe(content, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    content.addEventListener('transitionend', (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.matches('.settingsPanel_sectionContentShell') &&
        event.propertyName === 'grid-template-rows'
      ) {
        this.updateHeight()
      }
    })
    window.addEventListener('resize', () => this.updateHeight())
  }

  /** 将面板高度调整为内容高度，并限制在可用视口内 */
  private static updateHeight() {
    const shell = this.get()
    if (shell.style.display !== 'flex') {
      return
    }

    shell.style.height = 'auto'
    // 最小高度为 60vh，最大高度为 84vh。如果内容高度处于这个范围内，则使用内容高度
    const minHeight = window.innerHeight * 0.6
    const maxHeight = window.innerHeight * 0.84
    shell.style.height = `${Math.min(Math.max(shell.scrollHeight + 2, minHeight), maxHeight)}px`
  }
}

export { SettingsPanelShell }
