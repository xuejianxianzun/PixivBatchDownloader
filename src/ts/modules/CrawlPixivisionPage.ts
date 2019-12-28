// 抓取 pixivision 页面
import { CrawlPageBase } from './CrawlPageBase'
import { store } from './Store'

class CrawlPixivisionPage extends CrawlPageBase {
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
      ext: ext
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
      const urls = Array.from(imageList).map(el => {
        return el.src
          .replace('c/768x1200_80/img-master', 'img-original')
          .replace('_master1200', '')
      })
      this.tested = 0
      urls.forEach(url => {
        let arr = url.split('/')
        const id = arr[arr.length - 1].split('.')[0] // 取出作品 id
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
      Array.from(imageList).forEach(el => {
        const url = el.src
        if (url !== 'https://i.pximg.net/imgaz/upload/20170407/256097898.jpg') {
          // 跳过Cure的logo图片
          const arr = url.split('/')
          const id = arr[arr.length - 1].split('.')[0] // 作品id
          const ext = arr[arr.length - 1] // 扩展名

          this.addResult(id, url, ext)
        }
      })
      this.crawlFinished()
    }
  }

  private tested: number = 0 // 检查图片后缀名时的计数

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

      this.logImagesNo()

      if (imgNumber !== undefined) {
        this.tested++
        if (this.tested === imgNumber) {
          // 如果所有请求都执行完毕
          this.crawlFinished()
        }
      }
    }
  }

  public destroy() {}
}

export { CrawlPixivisionPage }
