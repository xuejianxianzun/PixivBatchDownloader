import { Tools } from '../Tools'
import { lang } from '../Language'
import { pageType } from '../PageType'
import { workToolBar } from '../WorkToolBar'
import { showHelp } from '../ShowHelp'
import { EVT } from '../EVT'
import { IDData } from '../store/StoreType'
import { copyWorkInfo } from '../CopyWorkInfo'

// 在作品页面里添加复制按钮
class CopyButtonOnWorkPage {
  constructor() {
    workToolBar.register(
      (
        toolbar: HTMLDivElement,
        pixivBMKDiv: HTMLDivElement,
        likeBtn: HTMLButtonElement
      ) => {
        window.setTimeout(() => {
          this.init(likeBtn)
        }, 0)
      }
    )
  }

  private readonly btnId = 'copyBtnOnWorkPage'

  private async init(likeBtn: HTMLButtonElement) {
    // 删除可能存在的旧按钮
    const oldBtn = document.body.querySelector('#' + this.btnId)
    if (oldBtn) {
      oldBtn.remove()
    }

    // 添加复制按钮
    let btn = this.createBtn()
    lang.register(btn)
    likeBtn.parentElement!.insertAdjacentElement('beforebegin', btn)
    // 把按钮添加到点赞按钮的前面。由于 toolbar 里的按钮是倒序显示，所以复制按钮会显示在点赞按钮的右边

    btn.addEventListener('click', () => {
      const isNovel = pageType.type === pageType.list.Novel
      const idData: IDData = {
        id: isNovel ? Tools.getNovelId() : Tools.getIllustId(),
        type: isNovel ? 'novels' : 'illusts',
      }
      copyWorkInfo.receive(idData)

      const msg = `${lang.transl('_显示复制按钮的提示')}
      <br>
      ${lang.transl('_相关设置')}: ${lang.transl('_显示复制按钮')}
      <br>
      ${lang.transl('_你可以在更多选项卡的xx分类里找到它', lang.transl('_增强'))}`
      showHelp.show('tipCopyWorkInfoButton', msg)
    })

    // 使用快捷键 Alt + C 点击复制按钮
    window.addEventListener('keydown', (ev) => {
      if (ev.code === 'KeyC' && ev.altKey) {
        btn && btn.click()
      }
    })

    window.addEventListener(EVT.list.pageSwitch, () => {
      btn = null as any
    })
  }

  //　创建复制按钮
  private createBtn() {
    const btn = document.createElement('button')
    btn.id = this.btnId
    btn.innerHTML = `
    <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-copy"></use>
</svg>`
    btn.dataset.xztitle = '_复制摘要数据'
    return btn
  }
}

new CopyButtonOnWorkPage()
