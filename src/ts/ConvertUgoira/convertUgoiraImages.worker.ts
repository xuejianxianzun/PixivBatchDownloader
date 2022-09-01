interface EventData {
  format: 'png' | 'webp'
  ImageBitmapList: ImageBitmap[]
  width: number
  height: number
}

onmessage = async (ev) => {
  const canvas = new OffscreenCanvas(ev.data.width, ev.data.height)
  const ctx = canvas.getContext('2d')!

  if (ev.data.format === 'png') {
    const result: ArrayBuffer[] = []
    ev.data.ImageBitmapList.forEach((ImageBitmap: ImageBitmap) => {
      ctx.drawImage(ImageBitmap, 0, 0, ev.data.width, ev.data.height)
      // 从画布获取图像绘制后的 Uint8ClampedArray buffer
      const buffer = ctx.getImageData(0, 0, ev.data.width, ev.data.height).data
        .buffer
      result.push(buffer)
    })
    ;(self as unknown as Worker).postMessage({
      result,
    })
  }

  if (ev.data.format === 'webp') {
    const result: string[] = []
    ev.data.ImageBitmapList.forEach(async (ImageBitmap: ImageBitmap) => {
      ctx.drawImage(ImageBitmap, 0, 0, ev.data.width, ev.data.height)
      const blob = await canvas.convertToBlob({
        type: 'image/webp',
        quality: 0.9,
      })
      const dataURL = new FileReaderSync().readAsDataURL(blob)
      result.push(dataURL)
    })
    ;(self as unknown as Worker).postMessage({
      result,
      width: ev.data.width,
      height: ev.data.height,
    })
  }
}
