// UPNG.js is prepended to this script by ToAPNG.ts before creating the Worker

onmessage = function (ev) {
  var data = ev.data
  try {
    var pngFile = UPNG.encode(
      data.arrayBuffList,
      data.width,
      data.height,
      0,
      data.delayList
    )
    self.postMessage({ id: data.id, result: pngFile }, [pngFile])
  } catch (error) {
    self.postMessage({ id: data.id, error: error.message || String(error) })
  }
}
