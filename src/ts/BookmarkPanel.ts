import { ArtworkData, NovelData } from './crawl/CrawlResult'
import { Config } from './Config'
import { EVT } from './EVT'
import { lang } from './Language'
import { msgBox } from './MsgBox'
import { settings, setSetting } from './setting/Settings'
import { states } from './store/States'
import { cacheWorkData } from './store/CacheWorkData'
import { theme } from './Theme'
import { toast } from './Toast'
import { Tools } from './Tools'
import {
  parseTagInput,
  recordCommonTags,
  sortCommonTags,
} from './utils/BookmarkPanelTags'

/**操作面板里“标签策略”这个单选组的值 */
type TagMode = 'origin' | 'transl' | 'none' | 'custom'

/**收藏时要使用的参数 */
export interface BookmarkPanelOption {
  /**要提交给 bookmark.add 的收藏标签列表 */
  tags: string[]
  /**是否是匿名（非公开）收藏 */
  restrict: boolean
}

/**“常用的标签”显示数量的下限 */
const commonTagsLimitMin = 0
/**“常用的标签”显示数量的上限 */
const commonTagsLimitMax = 100

/**“常用的标签”最多显示多少个。
 *
 * 用户可以在设置里修改它（0 - 100），这里再做一次裁剪，
 * 防止设置里存着超出范围的值（例如旧设置、或者被手动改过的值）
 */
const getCommonTagsMax = () => {
  return Math.min(
    commonTagsLimitMax,
    Math.max(commonTagsLimitMin, settings.bookmarkPanelCommonTagsMax)
  )
}

/**“使用的收藏标签”最多的数量。这是 pixiv 对一个作品的收藏标签数量限制
 *
 * ⚠️ 修改这里时要同时修改 langText 里 `_标签数量` 和 `_收藏标签数量达到上限` 的文本
 */
const bookmarkTagsMax = 10

// 在手动收藏 1 个作品时，显示一个操作面板，让用户设置收藏参数（是否公开、使用哪些标签）
class BookmarkPanel {
  constructor() {
    window.addEventListener(EVT.list.pageSwitch, () => {
      // 切换页面时关闭面板，避免它留在页面上
      this.close()
    })

    // 设置面板里“收藏面板”设置项上的「清空常用的标签」按钮
    window.addEventListener(EVT.list.clearBookmarkPanelCommonTags, () => {
      this.clearCommonTags()
    })
  }

  /**清空设置里的“常用的标签”列表 */
  private clearCommonTags() {
    if (!window.confirm(lang.transl('_确认清空常用的标签'))) {
      return
    }

    setSetting('bookmarkPanelCommonTags', [])
    toast.success(lang.transl('_已清空常用的标签'))
  }

  /**面板是否处于打开状态。
   *
   * ⚠️ 它的含义是「面板存在」，不是「面板可见」：查看大图时面板只是被临时隐藏（`.is-hidden`），
   * 此时仍然是打开状态。所以在「面板隐藏时也要正常工作」的地方（例如 ShowOriginSizeImage）不能用它。
   *
   * 其他模块处理快捷键时需要检查它：面板显示时不应该再响应这些快捷键，
   * 否则可能导致：按 B 收藏作品会导致再次弹出面板，按 Esc 会连带关闭图片查看器。*/
  public get isOpen() {
    return !!this.wrap
  }

  private wrap: HTMLDivElement | undefined
  private mask: HTMLDivElement | undefined
  private resolveFn: ((option?: BookmarkPanelOption) => void) | undefined

  /**要提交给 bookmark.add 的标签列表 */
  private bookmarkTags: string[] = []
  /**作品的原标签列表 */
  private originTags: string[] = []
  /**作品翻译后的标签列表（与保存抓取结果时使用的规则相同） */
  private translatedTags: string[] = []
  private tagMode: TagMode = 'origin'
  private restrict = false
  /**是否因为查看大图而暂时隐藏了面板。此时面板仍然处于打开状态，Esc 只关闭大图 */
  private hiddenForImage = false

  /**显示操作面板，等待用户确认收藏参数
   *
   * 只有手动收藏 1 个作品时才应该调用它。批量收藏作品时不会显示，因为那时可能需要添加几十、几百个收藏，不适合让用户逐一操作。
   *
   * @param id 作品 id
   * @param type 作品类型
   * @param workData 调用方已经获取到的作品数据。没有传入时，本模块会从缓存（或请求）里获取
   * @returns 用户点击“添加收藏”时返回收藏参数；用户关闭（取消）面板时返回 undefined
   */
  public async show(
    id: string,
    type: 'illusts' | 'novels',
    workData?: ArtworkData | NovelData
  ): Promise<BookmarkPanelOption | undefined> {
    // 面板已经显示时不再创建新的面板。
    // 例如在面板显示时再次按 B 键，那次收藏会被取消（不会重复收藏、也不会叠出第二个面板）
    if (this.wrap) {
      return
    }

    const data = workData || (await this.getWorkData(id, type))

    this.bookmarkTags = []
    // 两个标签列表用于在“使用作品的原始标签 / 翻译后的标签”时填充 bookmarkTags
    this.originTags = data ? Tools.extractTags(data, 'origin') : []
    // 翻译后的标签使用与保存抓取结果时相同的处理方式（没有翻译的标签会回退为原标签）
    this.translatedTags = data ? Tools.extractTags(data, 'transl', 'save') : []
    this.tagMode = settings.bookmarkPanelTagMode
    // 面板里“添加到”使用上一次选择的选项
    this.restrict = settings.bookmarkPanelRestrict === 'private'
    this.resetBookmarkTags()

    this.create(data)

    return new Promise<BookmarkPanelOption | undefined>((resolve) => {
      this.resolveFn = resolve
    })
  }

  /**获取作品数据。获取失败时返回 undefined（此时面板依然会显示，只是没有作品的简要信息） */
  private async getWorkData(id: string, type: 'illusts' | 'novels') {
    try {
      return await cacheWorkData.getWorkDataAsync(
        id,
        type === 'novels' ? 'novel' : 'artwork'
      )
    } catch (error) {
      return undefined
    }
  }

  // -------------------------

  private create(workData?: ArtworkData | NovelData) {
    const wrap = document.createElement('div')
    wrap.classList.add('xzBookmarkPanel', 'beautify_scrollbar')
    if (Config.mobile) {
      wrap.classList.add('mobile')
    }
    wrap.tabIndex = -1

    // 图片查看器总是暗色的，并且会覆盖整个网页，此时面板也总是使用暗色；
    // 否则自行获取网页的颜色主题
    const themeName = states.imageViewerIsShow
      ? 'dark'
      : theme.getThemeFromHtml()
    wrap.classList.add(themeName === 'dark' ? 'theme-dark' : 'theme-white')

    const coverURL = this.getCoverURL(workData)
    const title = workData ? workData.body.title : ''
    // 封面图的提示文字：图像作品会显示原图，小说作品会在新标签页打开封面
    let coverTitle = ''
    if (workData) {
      coverTitle = Tools.isArtworkData(workData)
        ? lang.transl('_查看作品原图')
        : lang.transl('_在新标签页打开封面图片')
    }

    wrap.innerHTML = `
      <button type="button" class="closeBtn" title="${lang.transl('_关闭')}">×</button>

      <div class="workCard">
        ${
          coverURL
            ? `<img class="cover" src="${this.escapeHTML(
                coverURL
              )}" title="${this.escapeHTML(coverTitle)}" />`
            : ''
        }
        <div class="workInfoRight">
          <p class="workTitle">${this.escapeHTML(title)}</p>
          <div class="tagList workTagList"></div>
          <p class="tipText">${lang.transl('_点击标签添加到收藏标签列表')}</p>
        </div>
      </div>

      <div class="section">
        <p class="sectionTitle">${lang.transl('_添加到')}</p>
        <div class="radioRow">
          ${this.createRadioHTML(
            'xzBookmarkPanelRestrict',
            'public',
            lang.transl('_公开收藏'),
            !this.restrict
          )}
          ${this.createRadioHTML(
            'xzBookmarkPanelRestrict',
            'private',
            lang.transl('_匿名收藏'),
            this.restrict
          )}
        </div>
      </div>

      <div class="section noDivider">
        <p class="sectionTitle">${lang.transl('_使用的收藏标签')}</p>
        <div class="tagList bookmarkTagList"></div>
        <p class="tipText bookmarkTagsTip hide"></p>
      </div>

      <div class="section">
        <p class="sectionTitle">${lang.transl('_标签策略')}</p>
        <div class="radioColumn">
          ${this.createRadioHTML(
            'xzBookmarkPanelTagMode',
            'origin',
            lang.transl('_使用作品的原始标签'),
            this.tagMode === 'origin'
          )}
          ${this.createRadioHTML(
            'xzBookmarkPanelTagMode',
            'transl',
            lang.transl('_使用作品翻译后的标签'),
            this.tagMode === 'transl'
          )}
          ${this.createRadioHTML(
            'xzBookmarkPanelTagMode',
            'none',
            lang.transl('_不使用标签'),
            this.tagMode === 'none'
          )}
          ${this.createRadioHTML(
            'xzBookmarkPanelTagMode',
            'custom',
            lang.transl('_自定义标签'),
            this.tagMode === 'custom'
          )}
        </div>

        <div class="customInput">
          <span class="customInputLabel">${lang.transl('_手动添加标签')}</span>
          <input
            type="text"
            class="tagInput"
            placeholder="${lang.transl('_请输入标签')}"
          />
          <button type="button" class="addTagBtn">
            ${lang.transl('_添加')}
          </button>
        </div>
        <p class="tipText">${lang.transl('_输入收藏标签的提示')}</p>
      </div>

      <div class="section commonTagsSection">
        <p class="sectionTitle">${lang.transl('_常用的标签')}</p>
        <div class="tagList commonTagList"></div>
      </div>

      <div class="submitArea">
        <button
          type="button"
          class="submitBtn"
          title="${lang.transl('_B或者CtrlEnter')}"
        >
          <span class="submitText">${lang.transl('_添加收藏')}</span>
          <span class="hotkey">${lang.transl('_B或者CtrlEnter')}</span>
        </button>
      </div>
      `

    // 点击封面图可以查看大图
    const coverEl = wrap.querySelector('.cover') as HTMLImageElement | null
    if (coverEl && workData) {
      coverEl.addEventListener('click', () => {
        this.showCoverImage(workData)
      })
    }

    // 渲染作品的原标签 + 翻译后的标签
    // 最后一个参数为 true：让一个标签和它的翻译显示在一起，方便对照
    const workTags = workData
      ? Tools.extractTags(workData, 'both', 'check', true).map(
          (str) => '#' + str
        )
      : []
    this.renderTags(wrap.querySelector('.workTagList')!, workTags)
    // 点击作品标签时，把它添加到“使用的收藏标签”里
    this.bindTagListClick(wrap.querySelector('.workTagList')!, (tag) => {
      // 渲染时添加了 # 前缀，添加时要去掉
      this.addTags([tag.replace(/^#/, '')])
    })

    // 渲染“常用的标签”
    const commonTags = sortCommonTags(
      settings.bookmarkPanelCommonTags,
      getCommonTagsMax()
    )
    if (commonTags.length === 0) {
      // 没有常用的标签时隐藏这个区域。默认状态下它是空的，显示出来没有意义
      wrap.querySelector('.commonTagsSection')!.classList.add('hide')
    } else {
      this.renderTags(wrap.querySelector('.commonTagList')!, commonTags)
      this.bindTagListClick(wrap.querySelector('.commonTagList')!, (tag) => {
        this.addTags([tag])
      })
    }

    // 渲染“使用的收藏标签”和它的提示文字
    this.renderBookmarkTags(wrap)
    this.bindTagListClick(wrap.querySelector('.bookmarkTagList')!, (tag) => {
      this.removeTag(tag)
    })

    // “添加到”：公开收藏 / 匿名收藏
    this.bindRadio(wrap, 'xzBookmarkPanelRestrict', (value) => {
      this.restrict = value === 'private'
      // 记住这个选择，下次打开面板时使用
      setSetting('bookmarkPanelRestrict', value as 'public' | 'private')
    })

    // “标签策略”：原始标签 / 翻译后的标签 / 不使用标签 / 自定义标签
    this.bindRadio(wrap, 'xzBookmarkPanelTagMode', (value) => {
      this.tagMode = value as TagMode
      setSetting('bookmarkPanelTagMode', this.tagMode)
      this.resetBookmarkTags()
      this.renderBookmarkTags(wrap)
    })

    // 关闭面板
    wrap.querySelector('.closeBtn')!.addEventListener('click', () => {
      this.close()
    })

    // 输入标签后点击“添加”按钮
    const tagInput = wrap.querySelector('.tagInput') as HTMLInputElement
    wrap.querySelector('.addTagBtn')!.addEventListener('click', () => {
      this.addTagsFromInput(tagInput)
    })
    tagInput.addEventListener('keydown', (ev) => {
      // 按 Enter 时添加标签。⚠️ 输入法正在组词时（中文、日文的候选框），
      // Enter 是用来确认候选词的，不能当成添加
      if (ev.key !== 'Enter' || ev.isComposing || (ev as any).keyCode === 229) {
        return
      }
      ev.preventDefault()
      this.addTagsFromInput(tagInput)
    })

    // 提交
    wrap.querySelector('.submitBtn')!.addEventListener('click', () => {
      this.submit()
    })

    // 面板处于焦点时，按 Ctrl + Enter 或 B 提交
    wrap.addEventListener('keydown', (ev) => {
      // 正在看大图时面板是隐藏的，不响应
      if (this.hiddenForImage) {
        return
      }

      if (ev.key === 'Enter' && ev.ctrlKey && !ev.shiftKey && !ev.altKey) {
        ev.preventDefault()
        this.submit()
        return
      }

      if (this.isSubmitByBKey(ev)) {
        // 阻止事件继续传递到页面上的其他监听器：作品页面里 Pixiv 原本的收藏快捷键也是 B，
        // 不阻止的话这次按键会同时触发它
        ev.preventDefault()
        ev.stopPropagation()
        this.submit()
      }
    })

    // 按 Esc 取消。这个监听在 window 上，因为焦点可能不在面板里
    window.addEventListener('keydown', this.onKeyDown)

    // 显示原图时隐藏面板（否则面板会挡住大图），关闭原图后再显示
    window.addEventListener(
      EVT.list.showOriginSizeImage,
      this.onOriginImageShow
    )
    window.addEventListener(
      EVT.list.hideOriginSizeImage,
      this.onOriginImageHide
    )

    // 遮罩层：点击它时取消
    const mask = document.createElement('div')
    mask.classList.add('xzBookmarkPanelMask')
    mask.addEventListener('click', () => {
      // 正在看大图时点击遮罩层：这次点击会冒泡到 body，由 ShowOriginSizeImage 关闭大图，
      // 面板随后会自动恢复，所以这里不要关闭面板
      if (this.hiddenForImage) {
        return
      }
      this.close()
    })

    document.body.append(mask)
    document.body.append(wrap)

    this.wrap = wrap
    this.mask = mask

    // 让面板获得焦点，这样按 Ctrl + Enter 时事件会经过面板
    wrap.focus()
  }

  private onKeyDown = (ev: KeyboardEvent) => {
    // 正在看大图时，Esc 只用来关闭大图（由 ShowOriginSizeImage 处理），不要关闭面板
    if (ev.key === 'Escape' && !this.hiddenForImage) {
      this.close()
    }
  }

  /**按下 B 键时是否应该提交收藏
   *
   * 以下情况不算：
   * - 按下了 Ctrl / Shift / Alt / Meta 等修饰键（例如 Ctrl + B）
   * - 输入法正在组词（此时 B 是用来输入字符的）
   * - 焦点在输入框里（用户在输入标签，B 应该输入到输入框里）
   */
  private isSubmitByBKey(ev: KeyboardEvent) {
    if (ev.code !== 'KeyB') {
      return false
    }
    if (ev.ctrlKey || ev.shiftKey || ev.altKey || ev.metaKey) {
      return false
    }
    // 输入法组词时的 Enter / 字母都不能当作快捷键
    if (ev.isComposing || (ev as any).keyCode === 229) {
      return false
    }

    const target = ev.target as HTMLElement | null
    if (
      target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
    ) {
      return false
    }

    return true
  }

  /**显示原图时触发：把面板和遮罩层隐藏起来，避免挡住大图 */
  private onOriginImageShow = () => {
    if (!this.wrap) {
      return
    }
    this.hiddenForImage = true
    this.setVisible(false)
  }

  /**关闭原图时触发：恢复面板 */
  private onOriginImageHide = () => {
    if (!this.wrap) {
      return
    }

    // 延迟到这次事件处理完之后再恢复。
    // 按 Esc 关闭原图时，同一个 Esc 事件还会继续传给面板的 keydown 监听，
    // 如果这里立刻把 hiddenForImage 设为 false，面板就会被这次 Esc 一起关掉。
    window.setTimeout(() => {
      if (!this.wrap) {
        return
      }
      this.hiddenForImage = false
      this.setVisible(true)
    }, 0)
  }

  /**显示或隐藏面板。遮罩层不隐藏，避免用户在看大图时误点到下面的页面 */
  private setVisible(visible: boolean) {
    this.wrap?.classList.toggle('is-hidden', !visible)
  }

  /**点击封面图时执行：图像作品显示原图，小说作品在新标签页打开封面 */
  private showCoverImage(workData: ArtworkData | NovelData) {
    if (Tools.isArtworkData(workData)) {
      // 移动端没有“查看原图”的功能，改为在新标签页打开
      if (Config.mobile) {
        window.open(workData.body.urls.original, '_blank')
        return
      }
      // 原图显示之后，面板会通过 showOriginSizeImage 事件自动隐藏
      EVT.fire('callShowOriginSizeImage', workData.body.illustId)
      return
    }

    // 下载器里没有查看小说缩略图的模块，所以在新的标签页里打开封面图片
    window.open(workData.body.coverUrl, '_blank')
  }

  private createRadioHTML(
    name: string,
    value: string,
    text: string,
    checked: boolean
  ) {
    return `<label class="radioOption">
      <input type="radio" name="${name}" value="${value}"${
        checked ? ' checked' : ''
      } />
      <span class="radioMark"></span>
      <span class="radioText">${this.escapeHTML(text)}</span>
    </label>`
  }

  private bindRadio(
    wrap: HTMLDivElement,
    name: string,
    callback: (value: string) => void
  ) {
    for (const radio of wrap.querySelectorAll<HTMLInputElement>(
      `input[name="${name}"]`
    )) {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          callback(radio.value)
        }
      })
    }
  }

  /**渲染可点击的标签列表 */
  private renderTags(el: HTMLElement, tags: string[]) {
    el.innerHTML = ''
    for (const tag of tags) {
      const span = document.createElement('span')
      span.classList.add('tag')
      // 使用 textContent，这样标签里的特殊字符不会被当成 HTML
      span.textContent = tag
      el.append(span)
    }
  }

  private renderBookmarkTags(wrap: HTMLDivElement) {
    this.renderTags(
      wrap.querySelector('.bookmarkTagList')!,
      this.bookmarkTags.map((tag) => '#' + tag)
    )

    const count = this.bookmarkTags.length
    // 没有标签时不显示提示文字（此时“标签数量：0”没有意义）
    const tip = wrap.querySelector('.bookmarkTagsTip') as HTMLElement
    tip.classList.toggle('hide', count === 0)
    if (count > 0) {
      // 第一行是操作说明，第二行是标签数量。达到最大数量时，把警告放在数量右侧，
      // 这样不用多占一行高度
      let html =
        lang.transl('_点击标签可以移除它') +
        '<br>' +
        lang.transl('_标签数量', count.toString())

      if (count >= bookmarkTagsMax) {
        html += ` <span class="maxTagsTip">${lang.transl(
          '_标签数量已达到最大值'
        )}</span>`
      }

      tip.innerHTML = html
    }

    // 其他两个标签列表里，已经添加过的标签要显示标记
    this.markAddedTags(wrap)
  }

  /**在作品标签列表和常用的标签列表里，给已经添加到“使用的收藏标签”里的标签加上标记
   *
   * 这里对比的是标签的文字。作品标签列表里显示的是带 # 的标签，所以要先去掉 # 再比较。
   */
  private markAddedTags(wrap: HTMLDivElement) {
    const mark = (list: Element, stripHash: boolean) => {
      for (const el of list.querySelectorAll<HTMLElement>('.tag')) {
        const text = el.textContent || ''
        const tag = stripHash ? text.replace(/^#/, '') : text
        el.classList.toggle('is-added', this.bookmarkTags.includes(tag))
      }
    }

    mark(wrap.querySelector('.workTagList')!, true)
    mark(wrap.querySelector('.commonTagList')!, false)
  }

  /**给标签列表绑定点击事件。传入的回调会收到被点击的标签的文字 */
  private bindTagListClick(el: HTMLElement, callback: (tag: string) => void) {
    el.addEventListener('click', (ev) => {
      const target = ev.target as HTMLElement
      if (!target.classList.contains('tag')) {
        return
      }
      const text = target.textContent
      if (text) {
        callback(text)
      }
    })
  }

  /**获取封面图片的网址 */
  private getCoverURL(workData?: ArtworkData | NovelData) {
    if (!workData) {
      return ''
    }
    // 图像作品使用缩略图；多图作品也只显示第一张的缩略图
    // 小说作品使用它的封面图片
    return Tools.isArtworkData(workData)
      ? workData.body.urls.small
      : workData.body.coverUrl
  }

  private escapeHTML(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  // -------------------------

  /**切换“标签策略”时，重设 bookmarkTags 的值 */
  private resetBookmarkTags() {
    switch (this.tagMode) {
      case 'origin':
        // 使用作品的原标签列表，而不是原标签+翻译后标签的混合列表
        this.bookmarkTags = [...this.originTags]
        break
      case 'transl':
        // 使用翻译后的标签列表（与保存抓取结果时的处理方式相同）
        this.bookmarkTags = [...this.translatedTags]
        break
      case 'custom':
        // 保留当前的标签列表，这样用户可以在现有的标签上修改，而不是从空白开始
        break
      default:
        // 不使用标签：清空列表
        this.bookmarkTags = []
        break
    }

    // 作品自身的标签可能超过上限（pixiv 允许的收藏标签数量），这里截断
    this.bookmarkTags = this.bookmarkTags.slice(0, bookmarkTagsMax)
  }

  /**添加标签到 bookmarkTags。重复的标签不会重复添加
   *
   * 最多只能添加 bookmarkTagsMax 个标签。达到上限时多出的标签不会被添加，并会显示提示。
   *
   * @returns 实际添加的标签数量
   */
  private addTags(tags: string[]) {
    let added = 0
    let reachedMax = false

    for (const tag of tags) {
      if (!tag || this.bookmarkTags.includes(tag)) {
        continue
      }
      if (this.bookmarkTags.length >= bookmarkTagsMax) {
        // 后续的标签都无法添加了
        reachedMax = true
        break
      }
      this.bookmarkTags.push(tag)
      added++
    }

    if (added > 0 && this.wrap) {
      this.renderBookmarkTags(this.wrap)
    }

    if (reachedMax) {
      // 使用 msgBox 而不只是 toast，因为用户需要看清楚如何继续添加标签
      msgBox.warning(lang.transl('_收藏标签数量达到上限'))
    }

    return added
  }

  /**把输入框里的标签添加到 bookmarkTags */
  private addTagsFromInput(input: HTMLInputElement) {
    const tags = parseTagInput(input.value)
    if (tags.length === 0) {
      return
    }

    const added = this.addTags(tags)
    // 只有真的添加了标签才清空输入框。如果一个都没添加进去（例如已经达到数量上限），
    // 就保留用户输入的内容，方便他移除一些标签之后再添加
    if (added > 0) {
      input.value = ''
    }
  }

  private removeTag(tag: string) {
    // 渲染时添加了 # 前缀，移除时要去掉
    const value = tag.replace(/^#/, '')
    const index = this.bookmarkTags.indexOf(value)
    if (index === -1) {
      return
    }
    this.bookmarkTags.splice(index, 1)

    if (this.wrap) {
      this.renderBookmarkTags(this.wrap)
    }
  }

  /**用户点击“添加收藏”时执行 */
  private submit() {
    if (!this.wrap) {
      return
    }

    // 只有通过面板发送收藏请求时，才记录常用的标签
    if (this.bookmarkTags.length > 0) {
      setSetting(
        'bookmarkPanelCommonTags',
        recordCommonTags(settings.bookmarkPanelCommonTags, this.bookmarkTags)
      )
    }

    const option: BookmarkPanelOption = {
      tags: [...this.bookmarkTags],
      restrict: this.restrict,
    }

    this.close(option)
  }

  /**关闭面板
   *
   * @param option 传入时表示用户确认了收藏参数；不传入表示用户取消了操作
   */
  private close(option?: BookmarkPanelOption) {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener(
      EVT.list.showOriginSizeImage,
      this.onOriginImageShow
    )
    window.removeEventListener(
      EVT.list.hideOriginSizeImage,
      this.onOriginImageHide
    )

    this.hiddenForImage = false
    this.wrap?.remove()
    this.mask?.remove()
    this.wrap = undefined
    this.mask = undefined

    const resolve = this.resolveFn
    this.resolveFn = undefined
    resolve && resolve(option)
  }
}

const bookmarkPanel = new BookmarkPanel()
export { bookmarkPanel }
