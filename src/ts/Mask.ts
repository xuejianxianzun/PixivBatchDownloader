// 遮罩层
class Mask {
  private id = 'xzMaskWrap'

  private _show = false

  public set show(val: boolean) {
    this._show = val
    this._show ? this.showMask() : this.hiddenMask()
  }

  public get show() {
    return this._show
  }

  private create() {
    const mask = document.createElement('div')
    mask.id = this.id
    return document.body.appendChild(mask)
  }

  private getMskEl() {
    let mask = document.body.querySelector('#' + this.id)
    if (mask) {
      return mask as HTMLDivElement
    } else {
      return this.create()
    }
  }

  private showMask() {
    this.getMskEl().style.display = 'flex'
  }

  private hiddenMask() {
    this.getMskEl().style.display = 'none'
  }
}

const mask = new Mask()
export { mask }
