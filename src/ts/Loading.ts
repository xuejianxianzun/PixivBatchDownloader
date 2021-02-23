import { theme } from './Theme'

// loading 图标
class Loading {
  private id = 'xzLoadingWrap'

  private readonly html = `
  <div id="xzLoadingWrap">
    <div class="iconWrap">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-loading"></use>
    </svg>
    </div>
  </div>`

  private _show = false

  public set show(val: boolean) {
    this._show = val
    this._show ? this.showEl() : this.hiddenEl()
  }

  public get show() {
    return this._show
  }

  private create() {
    document.body.insertAdjacentHTML('beforeend', this.html)
    const el = document.body.querySelector('#' + this.id) as HTMLDivElement
    theme.register(el)
    return el
  }

  private getEl() {
    let el = document.body.querySelector('#' + this.id)
    if (el) {
      return el as HTMLDivElement
    } else {
      return this.create()
    }
  }

  private showEl() {
    this.getEl().style.display = 'flex'
  }

  private hiddenEl() {
    this.getEl().style.display = 'none'
  }
}

const loading = new Loading()
export { loading }
