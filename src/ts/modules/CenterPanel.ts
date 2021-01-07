import { lang } from './Lang'
import { EVT } from './EVT'
import { DOM } from './DOM'
import { states } from './States'
import { theme } from './Theme'

// 中间面板
class CenterPanel {
  constructor() {
    this.addCenterPanel()

    theme.register(this.centerPanel)

    this.bindEvents()
  }

  private centerPanel!: HTMLDivElement
  private updateLink!: HTMLAnchorElement
  private updateActiveClass = 'updateActiveClass'

  // 添加中间面板
  private addCenterPanel() {
    const centerPanelHTML = `
      <div class="centerWrap beautify_scrollbar">
      <div class="centerWrap_head">
      <div class="centerWrap_title blue">
      Powerful Pixiv Downloader
      <div class="btns">
      <a class="has_tip centerWrap_top_btn update" data-tip="${lang.transl(
        '_newver',
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader/releases/latest" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-Update"></use>
        </svg>
      </a>
      <a class="has_tip centerWrap_top_btn github_icon" data-tip="${lang.transl(
        '_github',
      )}" href="https://github.com/xuejianxianzun/PixivBatchDownloader" target="_blank">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-github"></use>
      </svg>
      </a>
      <a class="has_tip centerWrap_top_btn wiki_url" data-tip="${lang.transl(
        '_wiki',
      )}" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-help"></use>
        </svg>
      </a>
        <div class="has_tip centerWrap_top_btn centerWrap_close" data-tip="${lang.transl(
          '_快捷键切换显示隐藏',
        )}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        </div>
      </div>
      </div>
      </div>

      <div class="centerWrap_con">
      <slot data-name="form"></slot>
      </div>

      <div class="gray1 bottom_help_bar"> 
      <button class="textButton gray1 showDownTip" type="button">${lang.transl(
        '_常见问题',
      )}</button>
      <a class="gray1" href="https://xuejianxianzun.github.io/PBDWiki" target="_blank"> ${lang.transl(
        '_wiki',
      )}</a>
      <a class="gray1" href="https://github.com/xuejianxianzun/PixivFanboxDownloader" target="_blank"> ${lang.transl(
        '_fanboxDownloader',
      )}</a>
      <a id="zanzhu" class="gray1 patronText" href="https://afdian.net/@xuejianxianzun" target="_blank">在“爱发电”支持我</a>
      <a id="patreon" class="gray1 patronText" href="https://www.patreon.com/xuejianxianzun" target="_blank">Become a patron</a>
      <a class="gray1" href="https://discord.gg/eW9JtTK" target="_blank">Discord</a>
      <br>
      <p class="downTip tip"> ${lang.transl('_下载说明')}</p>
      </div>

      </div>
      `
    document.body.insertAdjacentHTML('beforeend', centerPanelHTML)

    this.centerPanel = document.querySelector('.centerWrap') as HTMLDivElement

    this.updateLink = this.centerPanel.querySelector(
      '.update',
    )! as HTMLAnchorElement

    const donateId = lang.flag === 'zh-cn' ? 'zanzhu' : 'patreon'
    document.getElementById(donateId)!.style.display = 'inline-block'
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
      false,
    )

    // 关闭按钮
    document
      .querySelector('.centerWrap_close')!
      .addEventListener('click', () => {
        EVT.fire(EVT.list.closeCenterPanel)
      })

    // 开始抓取作品时，隐藏
    window.addEventListener(EVT.list.crawlStart, () => {
      EVT.fire(EVT.list.closeCenterPanel)
    })

    // 抓取完作品详细数据时，显示
    for (const ev of [EVT.list.crawlFinish, EVT.list.resume]) {
      window.addEventListener(ev, () => {
        if (!states.quickDownload) {
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
        DOM.toggleEl(
          this.centerPanel.querySelector('.downTip')! as HTMLDivElement,
        ),
      )

    this.centerPanel.addEventListener('click', (e) => {
      const ev = e || window.event
      ev.stopPropagation()
    })

    document.addEventListener('click', () => {
      if (getComputedStyle(this.centerPanel)['display'] !== 'none') {
        EVT.fire(EVT.list.closeCenterPanel)
      }
    })
  }

  // 显示中间区域
  public show() {
    this.centerPanel.style.display = 'block'
    EVT.fire(EVT.list.centerPanelOpened)
  }

  // 隐藏中间区域
  public close() {
    this.centerPanel.style.display = 'none'
    EVT.fire(EVT.list.centerPanelClosed)
  }

  public toggle() {
    const nowDisplay = this.centerPanel.style.display
    nowDisplay === 'block' ? this.close() : this.show()
    if (nowDisplay === 'block') {
      EVT.fire(EVT.list.closeCenterPanel)
    } else {
      EVT.fire(EVT.list.openCenterPanel)
    }
  }
}

new CenterPanel()
