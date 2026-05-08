import { EVT } from './EVT'
import { theme } from './Theme'
import { settings } from './setting/Settings'
import { ArtworkData } from './crawl/CrawlResult'
import { Tools } from './Tools'
import { Utils } from './utils/Utils'
import { lang } from './Language'
import { toast } from './Toast'
import { copyWorkInfo } from './CopyWorkInfo'
import { artworkThumbnail } from './ArtworkThumbnail'
import { displayThumbnailListOnMultiImageWorkPage } from './pageFunciton/DisplayThumbnailListOnMultiImageWorkPage'
import { cacheWorkData } from './store/CacheWorkData'
import { states } from './store/States'

// 预览作品的详细信息
class PreviewWorkDetailInfo {
  constructor() {
    this.bindEvents()
  }

  // 在进入缩略图时，如果 workId 与上一次显示时的 workId 相同，就不会再次显示详情面板
  private workId = ''
  private workEl: HTMLElement | null = null

  private resetWorkIdTimer: number | undefined = undefined
  // 启动延迟清除 workId 的定时器的时机：1. 关闭详情面板之后 2. 鼠标移出了作品缩略图区域（这可能是因为面板显示了）
  // 但是期间一旦触发了特定事件，就取消重置操作：1. 显示详情面板 2. 鼠标进入了作品缩略图（这可能是因为面板被关闭了）
  // 这样短时间内在同一个作品的缩略图上重复触发 onEnter 事件时，不会重复显示详情面板

  // 保存鼠标位置
  private mouseX = 0
  private mouseY = 0

  public show = false
  private delayShowTimer: number | undefined = undefined

  private bindEvents() {
    artworkThumbnail.onEnter((el: HTMLElement, id: string) => {
      window.clearTimeout(this.resetWorkIdTimer)

      if (id === '' || id === this.workId) {
        return
      }

      // 在多图作品的缩略图列表上触发时，不执行
      if (displayThumbnailListOnMultiImageWorkPage.checkLI(el)) {
        return
      }

      this.workId = id
      this.workEl = el
      this.readyShow()
    })

    artworkThumbnail.onLeave(() => {
      window.clearTimeout(this.delayShowTimer)
      this.delayResetWorkId()
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      this.remove()
    })

    window.addEventListener('mousemove', (ev) => {
      this.mouseX = ev.clientX
      this.mouseY = ev.clientY
    })

    window.addEventListener(
      'keydown',
      (ev) => {
        if (ev.key === 'Escape' && this.show) {
          ev.stopPropagation()
          ev.preventDefault()
          this.remove()
        }
      },
      {
        capture: true,
        passive: true,
      }
    )
  }

  private readyShow() {
    window.clearTimeout(this.delayShowTimer)
    this.delayShowTimer = window.setTimeout(async () => {
      this.create()
    }, settings.previewWorkWait)
  }

  // 关闭详情面板之后，延迟一段时间再重置 workId，避免在同一个作品上重复显示详情面板
  private delayResetWorkId() {
    window.clearTimeout(this.resetWorkIdTimer)

    // 如果详情面板是显示的，则不重置 workId。这样在关闭面板之后，如果鼠标落到下方的同一个缩略图上，不会重复触发显示面板的事件
    if (this.show) {
      return
    }

    this.resetWorkIdTimer = window.setTimeout(() => {
      // 处理三层重叠元素的情况：作品缩略图（最底层）- 预览作品或缩略图上的按钮（中间层）- 详情面板（最上层）
      // 有时详情面板会重叠在其他元素上方。当点击面板使其消失时，如果鼠标仍处于缩略图区域内，不应该重置 workId，因为此时不满足重置条件。此时重置的话，当中间的元素消失，或者鼠标从中间元素移动到缩略图上时，，就会再次触发显示详情面板的事件，导致面板再次出现
      const mouseInThumbnailArea = Utils.mouseInElementArea(
        this.workEl || undefined,
        this.mouseX,
        this.mouseY
      )
      if (mouseInThumbnailArea) {
        return
      }

      this.workId = ''
    }, 300)
  }

  private async create() {
    if (!settings.PreviewWorkDetailInfo || this.show) {
      return
    }

    this.show = true
    states.previewWorkDetailInfoPanelIsShow = true
    window.clearTimeout(this.resetWorkIdTimer)

    const workData = await cacheWorkData.getWorkDataAsync(
      this.workId,
      'artwork'
    )
    const wrap = document.createElement('div')

    // 设置文字内容
    // 生成 tag 内容
    const tagsHTML: string[] = []
    for (const item of workData.body.tags.tags) {
      const array: string[] = []
      const link = `https://www.pixiv.net/tags/${item.tag}/artworks`
      array.push(
        `<span class="origin"><a href="${link}" target="_blank">#${item.tag}</a></span>`
      )
      if (item.translation?.en) {
        array.push(
          `<span class="transl"><a href="${link}" target="_blank">${item.translation?.en}</a></span>`
        )
      }
      tagsHTML.push(`<span>${array.join('')}</span>`)
    }

    // 生成收藏数、点赞数、浏览量一栏
    const bmkHTML: string[] = []
    const schema = [
      {
        title: 'bookmark',
        icon: `<svg viewBox="0 0 12 12" width="12" height="12"><path fill="currentColor" d="
      M9,0.75 C10.6568542,0.75 12,2.09314575 12,3.75 C12,6.68851315 10.0811423,9.22726429 6.24342696,11.3662534
      L6.24342863,11.3662564 C6.09210392,11.4505987 5.90790324,11.4505988 5.75657851,11.3662565
      C1.9188595,9.22726671 0,6.68851455 0,3.75 C1.1324993e-16,2.09314575 1.34314575,0.75 3,0.75
      C4.12649824,0.75 5.33911281,1.60202454 6,2.66822994 C6.66088719,1.60202454 7.87350176,0.75 9,0.75 Z"></path></svg>`,
        number: workData.body.bookmarkCount,
      },
      {
        title: 'like',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path fill="#858585" d="M2 6a2 2 0 110-4 2 2 0 010 4zm8 0a2 2 0 110-4 2 2 0 010 4zM2.11 8.89a1 1 0 011.415-1.415 3.5 3.5 0 004.95 0 1 1 0 011.414 1.414 5.5 5.5 0 01-7.778 0z"/></svg>`,
        number: workData.body.likeCount,
      },
      {
        title: 'view',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 12" width="12" height="12"><path fill="#858585" d="M0 6c2-3.333 4.333-5 7-5s5 1.667 7 5c-2 3.333-4.333 5-7 5S2 9.333 0 6z"/><path fill="#fff" d="M7 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm0-1a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>`,
        number: workData.body.viewCount,
      },
    ]

    for (const cfg of schema) {
      bmkHTML.push(`
      <span class="item" title="${cfg.title}">
        <span>${cfg.icon}</span>
        <span>${Tools.numberToString(cfg.number)}</span>
      </span class="item">
      `)
    }

    // 生成 R-18(G) 标记
    let r18HTML = ''
    if (workData.body.xRestrict === 1) {
      r18HTML = '<span class="r18">R-18</span>'
    } else if (workData.body.xRestrict === 2) {
      r18HTML = '<span class="r18">R-18G</span>'
    }

    // 判断是不是 AI 生成的作品
    let aiHTML = ''
    const tagsWithTransl: string[] = Tools.extractTags(workData, 'both')
    let aiType = workData.body.aiType
    if (aiType !== 2) {
      if (Tools.checkAIFromTags(tagsWithTransl)) {
        aiType = 2
      }
    }

    if (aiType === 2) {
      aiHTML = '<span class="ai">AI</span>'
    }

    // 添加“原创”标记
    let originHTML = ''
    if (workData.body.isOriginal) {
      const originalMark = Tools.getOriginalMark()
      originHTML = `<span class="origin">${originalMark}</span>`
    }

    wrap.innerHTML = `
        <div class="content">
          <p class="flags">${r18HTML} ${aiHTML} ${originHTML}</p>
          <p class="title">${workData.body.title}</p>
          <p class="desc">${workData.body.description}</p>
          <p class="tags">${tagsHTML.join('')}</p>
          <p class="size">${workData.body.width} x ${workData.body.height}</p>
          <p class="bmk">${bmkHTML.join('')}</p>
          <p class="date">${new Date(
            workData.body.uploadDate
          ).toLocaleString()}</p>
          <p class="buttons">
            <button class="textButton" id="copyTXT">Copy TXT</button>
            <button class="textButton" id="copyJSON">Copy JSON</button>
            <button class="textButton" id="copyURL">Copy URL</button>
            <button class="textButton" id="copyBtn">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-copy"></use>
              </svg>
            </button>
          </p>
        </div>
      `

    // 按钮功能
    wrap.querySelector('#copyTXT')!.addEventListener('click', () => {
      this.copyTXT(workData, aiType)
    })

    wrap.querySelector('#copyJSON')!.addEventListener('click', () => {
      this.copyJSON(workData)
    })

    wrap.querySelector('#copyURL')!.addEventListener('click', () => {
      const url = `https://www.pixiv.net/artworks/${workData.body.id}`
      this.copy(url)
    })

    wrap.querySelector('#copyBtn')!.addEventListener('click', () => {
      copyWorkInfo.receive({
        id: workData.body.id,
        type: 'illusts',
      })
    })

    // 取消超链接的跳转确认，也就是把跳转链接替换为真正的链接
    const allLink = wrap.querySelectorAll('a')
    for (const a of allLink) {
      if (a.href.includes('jump.php')) {
        a.href = a.innerText
      }
    }

    // 设置样式
    wrap.classList.add('xz_PreviewWorkDetailPanel', 'beautify_scrollbar')
    wrap.style.width = settings.PreviewDetailInfoWidth + 'px'

    wrap.addEventListener('click', () => {
      this.remove(wrap)
    })

    wrap.addEventListener('mouseleave', () => {
      this.remove(wrap)
    })

    wrap.addEventListener(
      'wheel',
      (ev) => {
        if (this.show) {
          ev.preventDefault()
          EVT.fire('wheelScrollSwitchPreviewImage', ev)
        }
      },
      {
        passive: false,
      }
    )

    theme.register(wrap)

    document.body.append(wrap)

    // 获取宽高，以鼠标为中心显示
    const rect = wrap.getBoundingClientRect()

    // 设置 left
    let left = this.mouseX - rect.width / 2
    // 最小的 left 为 10，避免其紧贴左侧，看不到左边界。其他四边也同理
    if (left < 10) {
      left = 10
    }

    // 如果面板右侧超出屏幕，则把面板向左移动
    let right = left + rect.width
    if (right > window.innerWidth) {
      left = left + (window.innerWidth - right) - 10
    }

    wrap.style.left = left + 'px'

    // 设置 top
    let top = this.mouseY - rect.height / 2
    if (top < 10) {
      top = 10
    }

    // 如果面板底部超出屏幕，则把面板向上移动
    let bottom = top + rect.height
    if (bottom > window.innerHeight) {
      top = top + (window.innerHeight - bottom) - 10
    }

    wrap.style.top = top + 'px'
    wrap.style.opacity = '1'
  }

  private remove(el?: HTMLDivElement) {
    el =
      el ||
      (document.querySelector('.xz_PreviewWorkDetailPanel') as HTMLDivElement)
    el && el.parentNode && el.parentNode.removeChild(el)
    this.show = false
    states.previewWorkDetailInfoPanelIsShow = false

    this.delayResetWorkId()

    EVT.fire('PreviewWorkDetailPanelClosed', {
      x: this.mouseX,
      y: this.mouseY,
    })
  }

  private copyTXT(workData: ArtworkData, aiType: 0 | 1 | 2) {
    // 组织输出的内容
    const array: string[] = []
    const body = workData.body
    const tags = Tools.extractTags(workData).map((tag) => `#${tag}`)
    array.push(`ID\n${body.id}`)
    array.push(`URL\nhttps://www.pixiv.net/artworks/${body.id}`)
    array.push(`Original\n${body.urls?.original}`)
    array.push(`xRestrict\n${Tools.getXRestrictText(body.xRestrict)}`)
    array.push(`AI\n${Tools.getAITypeTextEnglish(aiType)}`)
    array.push(`User\n${body.userName}`)
    array.push(`UserID\n${body.userId}`)
    array.push(`Title\n${body.title}`)
    if (body.description) {
      array.push(
        `Description\n${Utils.htmlToText(
          Tools.replaceATag(Utils.htmlDecode(body.description))
        )}`
      )
    }
    array.push(`Tags\n${tags.join('\n')}`)
    array.push(`Size\n${body.width} x ${body.height}`)
    array.push(`Bookmark\n${body.bookmarkCount}`)
    array.push(`Date\n${new Date(body.uploadDate).toLocaleString()}`)

    const text = array.join('\n\n')
    this.copy(text)
  }

  private copyJSON(workData: ArtworkData) {
    const text = JSON.stringify(workData, null, 2)
    this.copy(text)
  }

  private async copy(text: string) {
    const copied = await Utils.writeClipboardText(text)
    if (copied) {
      toast.success(lang.transl('_已复制到剪贴板'))
    } else {
      toast.error(lang.transl('_写入剪贴板失败'))
    }
  }
}

new PreviewWorkDetailInfo()
