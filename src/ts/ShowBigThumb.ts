import {  mouseOverThumbnail} from "./MouseOverThumbnail";

// 鼠标经过作品的缩略图时，显示更大尺寸的缩略图
class ShowBigThumb {
  constructor(){
    this.bindEvents()
  }
  // 加载图像的延迟时间。
  // 鼠标进入缩略图时，本模块会立即请求作品数据，但在请求完成时候不会立即加载缩略图。
  // 这是因为要加载的图片体积比较大，1200px 的 regular 尺寸可能达到 800KB，如果立即加载的话会浪费网络资源
  // 如果鼠标在缩略图上停留达到 delay 的时间，才会加载 regular 尺寸的图片
  private readonly delay = 200
  private wrapId = 'xzBigThumbWrap'

  // 保存最后一个缩略图的作品的 id
  private currentWorkId = ''

  private bindEvents(){
    mouseOverThumbnail.onEnter((el:HTMLElement,id:string)=>{
      console.log(id)
    })
  }

  private createThumbWrap() {}

  private calcPosition() {}

  private getImageURL() {}

  private onEnter() {}

  private onLeave() {}
}

new ShowBigThumb()
