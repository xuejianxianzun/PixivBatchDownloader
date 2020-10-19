import { lang } from './Lang'
import { langTextKeys } from './langText'

// 显示最近更新内容
class ShowWhatIsNew {
  constructor() {
    this.show()
  }

  private newTag: langTextKeys = '_xzNew660'

  private show() {
    const storeName = 'xzNewVerTag'
    const value = localStorage.getItem(storeName)
    if (window.location.host.includes('pixiv.net') && value !== this.newTag) {
      const whatIsNewHtml = `
      <div class="xz_new">
        <p class="title">Powerful Pixiv Downloader ${lang.transl(
          '_最近更新',
        )}</p>
        <p class="content">${lang.transl(this.newTag)}</p>
        <button class="btn">${lang.transl('_确定')}</button>
      </div>`
      document.body.insertAdjacentHTML('afterbegin', whatIsNewHtml)
      const whatIsNewEl = document.querySelector('.xz_new')!
      whatIsNewEl.querySelector('.btn')!.addEventListener('click', () => {
        localStorage.setItem(storeName, this.newTag)
        whatIsNewEl.parentNode!.removeChild(whatIsNewEl)
      })
    }
  }
}

new ShowWhatIsNew()
