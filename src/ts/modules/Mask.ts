class Mask {
  private _show = false

  public set show(val: boolean) {
    this._show = val
    this._show ? this.showMask() : this.hiddenMask()
  }

  public get show() {
    return this._show
  }

  private create(){
    
  }

  private showMask() { }

  private hiddenMask() { }
}