// 初始化 pixivision 页面
import { InitPageBase } from '../crawl/InitPageBase'
import { Colors } from '../Colors'
import { Tools } from '../Tools'
import { options } from '../setting/Options'
import { store } from '../store/Store'
import { Utils } from '../utils/Utils'

class InitPixivisionPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  protected addCrawlBtns() {
    const typeA = document.querySelector(
      'a[data-gtm-action=ClickCategory]'
    )! as HTMLAnchorElement
    const type = typeA.dataset.gtmLabel

    if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
      // 在插画、漫画、cosplay类型的页面上创建下载功能
      Tools.addBtn(
        'crawlBtns',
        Colors.bgBlue,
        '_抓取该页面的图片'
      ).addEventListener(
        'click',
        () => {
          this.readyCrawl()
        },
        false
      )
    }
  }

  protected setFormOption() {
    options.hideOption([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 19, 21, 22, 23, 24, 26,
      27, 28, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 46, 47, 48,
      49, 50, 51, 54, 55, 56, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
      70, 71, 72, 74, 75, 76, 77,
    ])
  }

  protected nextStep() {
    this.getPixivision()
  }

  // 保存要下载的图片的信息
  private addResult(id: string, url: string, ext: string) {
    store.addResult({
      id: id,
      idNum: Number.parseInt(id),
      original: url,
      ext: ext,
    })
  }

  private async getPixivision() {
    const a = document.querySelector(
      'a[data-gtm-action=ClickCategory]'
    )! as HTMLAnchorElement
    const type = a.dataset.gtmLabel

    if (type === 'illustration') {
      // 插画页面，需要对图片进行测试获取原图 url
      const imageList = document.querySelectorAll(
        '.am__work__main img'
      ) as NodeListOf<HTMLImageElement>
      const urls = Array.from(imageList).map((el) => {
        return el.src
          .replace('c/768x1200_80/img-master', 'img-original')
          .replace('_master1200', '')
      })

      for (const url of urls) {
        let arr = url.split('/')
        const id = arr[arr.length - 1].split('.')[0].split('_')[0] // 作品id，尝试提取出数字部分
        await this.testExtName(url, id)
      }
      this.crawlFinished()
    } else {
      // 漫画和 cosplay ，直接保存页面上的图片
      let selector = ''
      if (type === 'manga') {
        selector = '.am__work__illust'
      } else if (type === 'cosplay') {
        selector = '.fab__image-block__image img'
      }

      // 把图片url添加进数组
      const imageList = document.querySelectorAll(
        selector
      ) as NodeListOf<HTMLImageElement>
      Array.from(imageList).forEach((el) => {
        const url = el.src
        if (url !== 'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg') {
          // 跳过Cure的logo图片
          // 漫画页面的图片 url 如：
          // https://i.pximg.net/c/768x1200_80/img-master/img/2017/06/19/01/08/28/63457814_p0_master1200.jpg
          // cosplay 页面的 ur 如：
          // https://i.pximg.net/imgaz/upload/20170808/670930758.jpg
          const arr = url.split('/')
          const id = arr[arr.length - 1].split('.')[0].split('_')[0] // 作品id，尝试提取出数字部分
          const extTest = arr[arr.length - 1].match(/\.(.*$)/) // 扩展名，不带点 .
          let ext = 'jpg'
          if (extTest && extTest.length > 1) {
            ext = extTest[1]
          }
          this.addResult(id, url, ext)
        }
      })
      this.crawlFinished()
    }
  }

  // 通过加载图片来判断图片的后缀名。pixivision 页面直接获取的图片后缀都是 jpg 的
  private async testExtName(url: string, id: string) {
    let ext = 'jpg' // 默认为 jpg
    await Utils.loadImg(url).catch(() => {
      // 如果图片加载失败则把后缀改为 png
      url = url.replace('.jpg', '.png')
      ext = 'png'
    })

    this.addResult(id, url, ext)

    this.logResultNumber()
  }
}
export { InitPixivisionPage }
