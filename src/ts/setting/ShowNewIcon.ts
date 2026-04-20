import { EVT } from '../EVT'
import { Tools } from '../Tools'

type NewOption = {
  id: number
  time: number
}

/** 在新添加的设置上显示 new 角标 */
class ShowNewIcon {
  public init(allOption: NodeListOf<HTMLElement>) {
    this.allOption = allOption
    this.bindEvents()
  }

  private bindEvents() {
    window.addEventListener(EVT.list.settingInitialized, () => {
      this.showNewIcon()
    })
  }

  private allOption!: NodeListOf<HTMLElement>

  // 90 天内添加的设置项，显示 new 角标
  private readonly newRange = 7776000000
  private readonly newOptions: NewOption[] = [
    {
      // 日志区域的默认可见性
      id: 93,
      // 2026-02-28
      time: 1772287652821,
    },
    {
      // 标题必须含有
      id: 94,
      // 2026-03-22
      time: 1774137600000,
    },
    {
      // 标题不能含有
      id: 95,
      // 2026-03-22
      time: 1774137600000,
    },
    {
      // 原创作品
      id: 96,
      // 2026-03-24
      time: 1774310400000,
    },
    {
      // 移除文件名里的 Emoji
      id: 97,
      // 2026-04-08
      time: 1775579018462,
    },
    {
      // 序号起始值
      id: 98,
      // 2026-04-08
      time: 1775633245633,
    },
    {
      // 不抓取下载过的作品
      id: 99,
      // 2026-04-10
      time: 1775755273036,
    },
    {
      // 在已下载的作品上显示边框
      id: 100,
      // 2026-04-11
      time: 1775914625357,
    },
    {
      // 管理下载记录
      id: 101,
      // 2026-04-14
      time: 1776098259792,
    },
    {
      // 缩略图上按钮的位置
      id: 102,
      // 2026-04-14
      time: 1776098259792,
    },
    {
      // 多图作品不抓取后几张图片
      id: 69,
      // 2026-04-14
      time: 1776147641055,
    },
    {
      // 多图作品不抓取前几张图片
      id: 103,
      // 2026-04-14
      time: 1776147641055,
    },
    {
      // 多图作品只抓取后几张图片
      id: 104,
      // 2026-04-14
      time: 1776147641055,
    },
    {
      // 为多图作品添加一层文件夹
      id: 19,
      // 2026-04-16
      time: 1776337453630,
    },
    {
      // 不建立文件夹
      id: 64,
      // 2026-04-16
      time: 1776337453630,
    },
    {
      // 单个 EPUB 文件的体积限制
      id: 105,
      // 2026-04-20
      time: 1776693866003,
    },
  ]

  /**显示 new 角标 */
  private showNewIcon() {
    const now = Date.now()
    this.newOptions.forEach((option) => {
      if (now - option.time <= this.newRange) {
        const el = Tools.getOption(this.allOption, option.id)
        if (el) {
          el.classList.add('new')
        }
      }
    })
  }
}

const showNewIcon = new ShowNewIcon()
export { showNewIcon }
