// 初始化 pixivision 页面
import { InitPageBase } from './InitPageBase'
import { Colors } from './Colors'
import { lang } from './Lang'
import { DOM } from './DOM'
import { options } from './setting/Options'
import { form } from './setting/Form'
import { store } from './Store'

class InitPixivisionPage extends InitPageBase {
  constructor() {
    super()
    this.init()
  }

  private tested: number = 0 // 检查图片后缀名时的计数

  protected appendCenterBtns() {
    const typeA = document.querySelector(
      'a[data-gtm-action=ClickCategory]'
    )! as HTMLAnchorElement
    const type = typeA.dataset.gtmLabel

    if (type === 'illustration' || type === 'manga' || type === 'cosplay') {
      // 在插画、漫画、cosplay类型的页面上创建下载功能
      DOM.addBtn(
        'crawlBtns',
        Colors.blue,
        lang.transl('_抓取该页面的图片')
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
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      14,
      15,
      16,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      26,
      27,
      28,
    ])

    // pixivision 里，文件名只有 id 标记会生效，所以把文件名规则替换成 id
    // form.userSetName.value = '{p_title}/{id}'
  }

  protected nextStep() {
    this.getPixivision()
  }

  protected getIdList() {}

  protected resetGetIdListStatus() {}

  // 保存要下载的图片的信息
  private addResult(id: string, url: string, ext: string) {
    store.addResult({
      id: id,
      url: url,
      ext: ext,
    })
  }

  private getPixivision() {
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
      this.tested = 0
      urls.forEach((url) => {
        let arr = url.split('/')
        const id = arr[arr.length - 1].split('.')[0].split('_')[0] // 作品id，尝试提取出数字部分
        this.testExtName(url, urls.length, id)
      })
    } else {
      // 漫画和 cosplay ，直接保存页面上的图片
      let selector = ''
      if (type === 'manga') {
        selector = '.am__work__illust'
      } else if (type === 'cosplay') {
        selector = '.fab__image-block__image img'
      }

      // 把图片url添加进数组
      const imageList = document.querySelectorAll(selector) as NodeListOf<
        HTMLImageElement
      >
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

  // 测试图片 url 是否正确的函数。pixivision 页面直接获取的图片 url，后缀都是jpg的，所以要测试实际上是jpg还是png
  private testExtName(url: string, imgNumber: number, id: string) {
    let ext = ''
    const testImg = new Image()
    testImg.src = url

    testImg.onload = () => next(true)

    testImg.onerror = () => next(false)

    let next = (bool: boolean) => {
      if (bool) {
        ext = 'jpg'
      } else {
        url = url.replace('.jpg', '.png')
        ext = 'png'
      }

      this.addResult(id, url, ext)

      this.logResultTotal()

      if (imgNumber !== undefined) {
        this.tested++
        if (this.tested === imgNumber) {
          // 如果所有请求都执行完毕
          this.crawlFinished()
        }
      }
    }
  }
}
export { InitPixivisionPage }
