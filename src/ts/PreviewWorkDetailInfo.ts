import { EVT } from './EVT'
import { theme } from './Theme'
import { settings } from './setting/Settings'
import { ArtworkData } from './crawl/CrawlResult'
import { Tools } from './Tools'
import { CopyToClipboard } from './CopyToClipboard'
import { Utils } from './utils/Utils'

// 预览作品的详细信息
// 这个模块由 PreviewWork 提供作品数据，这样可以避免一些重复代码
class PreviewWorkDetailInfo {
  constructor() {
    this.bindEvents()
  }

  // 因为预览作品模块里没有保存鼠标位置，所以本模块需要自己保存鼠标位置
  private mouseX = 0
  private mouseY = 0

  public show = false

  // 保存当前预览的作品 ID，避免在一个预览图上多次显示这个详情面板
  // 当预览图的窗口消失时，会重置这个 ID
  private showWorkID = ''

  private bindEvents() {
    window.addEventListener(
      EVT.list.showPreviewWorkDetailPanel,
      (ev: CustomEventInit) => {
        if (settings.PreviewWorkDetailInfo) {
          const data = ev.detail.data as ArtworkData
          this.create(data)
        }
      }
    )

    window.addEventListener('mousemove', (ev) => {
      this.mouseX = ev.clientX
      this.mouseY = ev.clientY
    })

    window.addEventListener(EVT.list.previewEnd, () => {
      this.showWorkID = ''
    })
  }

  private create(workData: ArtworkData) {
    // 有可能会重复创建，所以需要处理一下
    if (this.show) {
      return
    }

    if (workData.body.id === this.showWorkID) {
      return
    } else {
      this.showWorkID = workData.body.id
    }

    // 这里先把 show 状态设置为 true。实际显示出来还需要经过后面的处理
    this.show = true

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

    // 生成 R-18(G) 和 AI 标记
    let r18HTML = ''
    if (workData.body.xRestrict === 1) {
      r18HTML = '<span class="r18">R-18</span>'
    } else if (workData.body.xRestrict === 2) {
      r18HTML = '<span class="r18">R-18G</span>'
    }

    let aiHTML = ''
    if (
      workData.body.aiType === 2 ||
      workData.body.tags.tags.some((tag) => tag.tag === 'AI生成')
    ) {
      aiHTML = '<span class="ai">AI</span>'
    }

    wrap.innerHTML = `
        <div class="content">
        <p class="flags">${r18HTML} ${aiHTML}</p>
        <p class="title">${workData.body.title}</p>
        <p class="desc">${workData.body.description}</p>
        <p class="tags">${tagsHTML.join('')}</p>
        <p class="size">${workData.body.width} x ${workData.body.height}</p>
        <p class="bmk">${bmkHTML.join('')}</p>
        <p class="date">${new Date(
          workData.body.uploadDate
        ).toLocaleString()}</p>
        <p class="buttons"><button class="textButton" id="copyTXT">Copy TXT</button> <button class="textButton" id="copyJSON">Copy JSON</button></p>
        </div>
      `

    // 按钮功能
    const copyTXT = wrap.querySelector('#copyTXT') as HTMLButtonElement
    copyTXT.addEventListener('click', () => {
      this.copyTXT(workData)
    })
    const copyJSON = wrap.querySelector('#copyJSON') as HTMLButtonElement
    copyJSON.addEventListener('click', () => {
      this.copyJSON(workData)
    })

    // 取消超链接的跳转确认，也就是把跳转链接替换为真正的链接
    const allLink = wrap.querySelectorAll('a')
    for (const a of allLink) {
      if (a.href.includes('jump.php')) {
        a.href = a.innerText
      }
    }

    // 设置样式
    wrap.classList.add('xz_PreviewWorkDetailPanel')
    wrap.style.width = settings.PreviewDetailInfoWidth + 'px'

    wrap.addEventListener('click', () => {
      this.remove(wrap)
    })

    wrap.addEventListener('mouseleave', () => {
      this.remove(wrap)
    })

    wrap.addEventListener(
      'mousewheel',
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

  private remove(el: HTMLDivElement) {
    el && el.parentNode && el.parentNode.removeChild(el)
    this.show = false

    EVT.fire('PreviewWorkDetailPanelClosed', {
      x: this.mouseX,
      y: this.mouseY,
    })
  }

  private copyTXT(workData: ArtworkData) {
    // 组织输出的内容
    const tags = Tools.extractTags(workData).map((tag) => `#${tag}`)
    const checkAITag = workData.body.tags.tags.some(
      (tag) => tag.tag === 'AI生成'
    )

    const array: string[] = []
    const body = workData.body
    array.push(`ID\n${body.id}`)
    array.push(`URL\nhttps://www.pixiv.net/artworks/${body.id}`)
    array.push(`Original\n${body.urls?.original}`)
    array.push(`xRestrict\n${Tools.getXRestrictText(body.xRestrict)}`)
    array.push(`AI\n${Tools.getAITypeText(checkAITag ? 2 : body.aiType)}`)
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
    CopyToClipboard.setClipboard(text)
  }

  private copyJSON(workData: ArtworkData) {
    const text = JSON.stringify(workData, null, 2)
    CopyToClipboard.setClipboard(text)
  }
}

const previewWorkDetailInfo = new PreviewWorkDetailInfo()
export { previewWorkDetailInfo }
