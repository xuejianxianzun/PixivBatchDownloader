import { EVT } from '../EVT'
import { Tools } from '../Tools'
import { theme } from '../Theme'
import { settings } from '../setting/Settings'
import { Config } from '../Config'

// 在搜索页面按收藏数快速筛选
class FastScreen {
  constructor() {
    this.create()

    window.addEventListener(EVT.list.settingChange, (ev: CustomEventInit) => {
      const data = ev.detail.data as any
      if (data.name === 'showFastSearchArea') {
        this.setDisplay()
      }
    })

    window.addEventListener(EVT.list.pageSwitchedTypeChange, () => {
      this.destroy()
    })
  }

  private readonly fastScreenArea = document.createElement('div')

  private readonly tagList = [
    '100users入り',
    '500users入り',
    '1000users入り',
    '5000users入り',
    '10000users入り',
    '20000users入り',
    '30000users入り',
    '50000users入り',
    '100000users入り',
  ]

  private insertPoint: 'afterend' | 'afterbegin' = 'afterend'
  // 判断插入点的元素有没有加载出来
  private findTarget() {
    if (Config.mobile) {
      return document.querySelector('.search-header') as HTMLDivElement
    } else {
      this.insertPoint = 'afterbegin'
      return document.body
    }
  }

  // 添加快速筛选功能
  private create() {
    const target = this.findTarget()
    if (!target) {
      setTimeout(() => {
        this.create()
      }, 300)
      return
    }

    this.fastScreenArea.className = 'fastScreenArea'

    this.tagList.forEach((tag) => {
      const btn = document.createElement('button')
      btn.innerText = tag
      btn.onclick = () => {
        this.openFastScreenLink(tag)
      }
      this.fastScreenArea.appendChild(btn)
    })

    theme.register(this.fastScreenArea)

    target.insertAdjacentElement(this.insertPoint, this.fastScreenArea)

    this.setDisplay()
  }

  // 设置是否显示快速筛选区域
  private setDisplay() {
    this.fastScreenArea.style.display = settings.showFastSearchArea
      ? 'block'
      : 'none'
  }

  // 打开快速筛选链接
  private openFastScreenLink(fastTag: string) {
    // 拼接 tag。因为搜索页面可以无刷新切换搜索的 tag，所以需要动态获取当前 tag
    const nowTag = Tools.getTagFromURL()
    const firstTag = nowTag.split(' ')[0]
    const fullTag = firstTag + ' ' + fastTag

    // 用组合后的 tag 替换掉当前网址里的 tag
    let newURL = location.href.replace(
      encodeURIComponent(nowTag),
      encodeURIComponent(fullTag)
    )

    // 如果 url 路径的 tags/ 后面没有子路径，代表是在“顶部”分类。
    // “顶部”分类里始终是严格的搜索模式，即使添加 s_mode=s_tag 也无效，这经常会导致搜索结果为 0。所以如果分类是“顶部”，就自动修改为“插画·漫画”分类以获取更多搜索结果。
    // “顶部”分类的 url 示例
    // https://www.pixiv.net/tags/%E9%9B%AA%E8%8A%B1%E3%83%A9%E3%83%9F%E3%82%A3%2010000users%E5%85%A5%E3%82%8A?s_mode=s_tag
    const str = new URL(newURL).pathname.split('tags/')[1]
    if (str.includes('/') === false) {
      // 在 tag 后面添加“插画·漫画”分类的路径
      newURL = newURL.replace(str, str + '/artworks')
    }

    // 设置宽松的搜索模式 s_mode=s_tag
    const u = new URL(newURL)
    u.searchParams.set('s_mode', 's_tag')

    location.href = u.toString()
  }

  private destroy() {
    this.fastScreenArea.remove()
  }
}

export { FastScreen }
