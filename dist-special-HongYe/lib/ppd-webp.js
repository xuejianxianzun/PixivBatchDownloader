;(function () {
  'use strict'

  var _workerUrl = ''

  /**
   * PPDWebP — Animated WebP encoder.
   *
   * Usage:
   *   PPDWebP.init(workerUrl)
   *   const blob = await PPDWebP.encode(bitmaps, delays, { quality: 0.94, loopCount: 0 })
   *
   * The library offloads frame encoding (RGBA → WebP) and RIFF assembly to a
   * Web Worker so the main thread stays responsive during conversion.
   *
   * ImageBitmaps are NOT transferred to the worker; their RGBA pixel data is
   * extracted on the main thread and the ArrayBuffers are transferred instead.
   * This allows the caller to keep the original ImageBitmaps for other uses.
   */
  var PPDWebP = {
    /**
     * Set the URL of the ppd-webp.worker.js script.
     * Must be called once before encode().
     * @param {string} workerUrl
     */
    init: function (workerUrl) {
      _workerUrl = workerUrl
    },

    /**
     * Encode a sequence of ImageBitmap frames into an animated WebP Blob.
     *
     * @param {ImageBitmap[]} bitmaps    One ImageBitmap per frame.
     * @param {number[]}      delays     Frame delay in milliseconds (one per frame).
     * @param {object}       [options]
     * @param {number}       [options.quality=0.94]   Lossy quality 0.0–1.0.
     * @param {number}       [options.loopCount=0]    Loop count; 0 = infinite.
     * @returns {Promise<Blob>}  Animated WebP blob (MIME: image/webp).
     */
    encode: function (bitmaps, delays, options) {
      options   = options || {}
      var quality   = options.quality   !== undefined ? options.quality   : 0.94
      var loopCount = options.loopCount !== undefined ? options.loopCount : 0

      if (!_workerUrl) {
        return Promise.reject(new Error('PPDWebP: call init(workerUrl) before encode()'))
      }
      if (!bitmaps || bitmaps.length === 0) {
        return Promise.reject(new Error('PPDWebP: bitmaps array must not be empty'))
      }

      var width  = bitmaps[0].width
      var height = bitmaps[0].height

      // Extract raw RGBA pixel data from each bitmap on the main thread.
      // getImageData() returns a fresh copy, so the resulting ArrayBuffers can
      // be transferred (zero-copy) to the worker without affecting the bitmaps.
      var canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      var ctx = canvas.getContext('2d', { willReadFrequently: true })

      var rgbaList = []
      for (var i = 0; i < bitmaps.length; i++) {
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(bitmaps[i], 0, 0)
        rgbaList.push(ctx.getImageData(0, 0, width, height).data.buffer)
      }

      return new Promise(function (resolve, reject) {
        var worker = new Worker(_workerUrl)

        worker.onmessage = function (ev) {
          worker.terminate()
          resolve(ev.data.blob)
        }

        worker.onerror = function (err) {
          worker.terminate()
          reject(err)
        }

        // Transfer the RGBA ArrayBuffers for zero-copy delivery to the worker.
        worker.postMessage(
          {
            rgbaList:  rgbaList,
            delays:    delays,
            width:     width,
            height:    height,
            quality:   quality,
            loopCount: loopCount,
          },
          rgbaList // transfer list
        )
      })
    },
  }

  window.PPDWebP = PPDWebP
})()
