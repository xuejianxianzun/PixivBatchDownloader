// whammy.js is prepended to this script before the worker is created.

function bytesToBase64(bytes) {
  var chunkSize = 0x8000
  var binary = ''
  for (var i = 0; i < bytes.length; i += chunkSize) {
    var chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, chunk)
  }
  return btoa(binary)
}

function blobToDataURL(blob) {
  return blob.arrayBuffer().then(function (buffer) {
    return 'data:image/webp;base64,' + bytesToBase64(new Uint8Array(buffer))
  })
}

function compileVideo(encoder) {
  return new Promise(function (resolve) {
    encoder.compile(false, function (blob) {
      resolve(blob)
    })
  })
}

onmessage = async function (ev) {
  var data = ev.data
  var bitmaps = data.bitmaps

  try {
    if (typeof OffscreenCanvas === 'undefined') {
      throw new Error('Whammy worker requires OffscreenCanvas')
    }

    var canvas = new OffscreenCanvas(data.width, data.height)
    var ctx = canvas.getContext('2d')
    var encoder = new Whammy.Video()

    for (var i = 0; i < bitmaps.length; i++) {
      ctx.clearRect(0, 0, data.width, data.height)
      ctx.drawImage(bitmaps[i], 0, 0)

      var blob = await canvas.convertToBlob({
        type: 'image/webp',
        quality: data.quality,
      })
      var dataURL = await blobToDataURL(blob)
      encoder.add(dataURL, data.delays[i])
    }

    var webm = await compileVideo(encoder)
    self.postMessage({ id: data.id, result: webm })
  } catch (error) {
    self.postMessage({
      id: data.id,
      error: error && error.message ? error.message : String(error),
    })
  } finally {
    if (bitmaps && bitmaps.length) {
      bitmaps.forEach(function (bitmap) {
        if (bitmap && bitmap.close) {
          bitmap.close()
        }
      })
    }
  }
}
