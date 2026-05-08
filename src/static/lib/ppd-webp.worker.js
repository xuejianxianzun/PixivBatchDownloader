'use strict'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Write a 24-bit unsigned integer in little-endian order. */
function writeUint24LE(buf, offset, value) {
  buf[offset]     =  value        & 0xff
  buf[offset + 1] = (value >>> 8) & 0xff
  buf[offset + 2] = (value >>> 16) & 0xff
}

/**
 * Build a complete RIFF chunk.
 * Returns Uint8Array = FourCC (4B) + Chunk Size (4B, LE, unpadded) + payload + 0x00 padding if needed.
 */
function buildChunk(fourCC, payload) {
  var payloadSize       = payload.byteLength
  var paddedPayloadSize = payloadSize + (payloadSize & 1)
  var chunk             = new Uint8Array(8 + paddedPayloadSize)
  var view              = new DataView(chunk.buffer)

  chunk[0] = fourCC.charCodeAt(0)
  chunk[1] = fourCC.charCodeAt(1)
  chunk[2] = fourCC.charCodeAt(2)
  chunk[3] = fourCC.charCodeAt(3)
  view.setUint32(4, payloadSize, true) // LE, unpadded size
  chunk.set(payload, 8)
  // Padding byte is already 0 from Uint8Array initialisation
  return chunk
}

// ─── Single-frame WebP parsing ────────────────────────────────────────────────

/**
 * Parse a single-frame WebP ArrayBuffer.
 * Returns an array of Uint8Arrays, each being a complete padded RIFF chunk
 * (VP8 , VP8L, or ALPH) to embed directly as ANMF frame data.
 */
function extractFrameChunks(buffer) {
  var bytes = new Uint8Array(buffer)
  var view  = new DataView(buffer)

  // Verify 'RIFF' magic and 'WEBP' FourCC
  if (bytes[0] !== 0x52 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x46 ||
      bytes[8] !== 0x57 || bytes[9] !== 0x45 || bytes[10] !== 0x42 || bytes[11] !== 0x50) {
    throw new Error('PPDWebP worker: invalid WebP data for frame')
  }

  var chunks  = []
  var offset  = 12
  var fileEnd = buffer.byteLength

  while (offset + 8 <= fileEnd) {
    var fourCC    = String.fromCharCode(bytes[offset], bytes[offset+1], bytes[offset+2], bytes[offset+3])
    var chunkSize = view.getUint32(offset + 4, true)
    var padded    = chunkSize + (chunkSize & 1)

    // Collect only the bitstream/alpha chunks needed for ANMF frame data
    if (fourCC === 'VP8 ' || fourCC === 'VP8L' || fourCC === 'ALPH') {
      chunks.push(bytes.slice(offset, offset + 8 + padded))
    }

    offset += 8 + padded
  }

  if (chunks.length === 0) {
    throw new Error('PPDWebP worker: no VP8/VP8L chunk found in encoded frame')
  }

  return chunks
}

// ─── Animated WebP assembly ───────────────────────────────────────────────────

/**
 * Assemble an animated WebP RIFF binary from pre-encoded frame chunks.
 *
 * Extended file structure:
 *   RIFF header (12 B)
 *   VP8X chunk  (18 B) — flags: Animation only
 *   ANIM chunk  (14 B) — background colour + loop count
 *   ANMF chunk  × N   — one per frame (16 B header + VP8 chunk(s))
 *
 * @param {Array<{chunks: Uint8Array[], width: number, height: number, delay: number}>} frames
 * @param {number} loopCount  0 = loop forever
 * @returns {Uint8Array}
 */
function assembleAnimatedWebP(frames, loopCount) {
  var canvasWidth  = frames[0].width
  var canvasHeight = frames[0].height

  // ── VP8X chunk ───────────────────────────────────────────────────────────
  // 10-byte payload layout (per spec, MSB-0 bit numbering within each byte):
  //   Byte 0: |Rsv(2)|I|L|E|X|A|R|  — Animation bit A = bit 1 (LSB-0) = 0x02
  //   Bytes 1-3: Reserved (0)
  //   Bytes 4-6: Canvas Width  - 1  (uint24 LE)
  //   Bytes 7-9: Canvas Height - 1  (uint24 LE)
  var vp8xPayload = new Uint8Array(10)
  vp8xPayload[0] = 0x02 // Animation flag
  writeUint24LE(vp8xPayload, 4, canvasWidth  - 1)
  writeUint24LE(vp8xPayload, 7, canvasHeight - 1)

  // ── ANIM chunk ───────────────────────────────────────────────────────────
  // 6-byte payload: Background color [B, G, R, A] + Loop count (uint16 LE)
  var animPayload = new Uint8Array(6)
  animPayload[3] = 0xff // Background: opaque black (B=0,G=0,R=0,A=255)
  animPayload[4] = loopCount & 0xff
  animPayload[5] = (loopCount >>> 8) & 0xff

  // ── ANMF chunks ──────────────────────────────────────────────────────────
  var anmfChunks = frames.map(function (frame) {
    // 16-byte ANMF frame parameters:
    //   Frame X (3B) | Frame Y (3B) | Width-1 (3B) | Height-1 (3B) | Duration (3B) | Flags (1B)
    // Frame X and Y are stored as pixel/2; both are 0 (full-canvas frame).
    var header = new Uint8Array(16)
    writeUint24LE(header, 6,  frame.width  - 1) // Frame Width  Minus One
    writeUint24LE(header, 9,  frame.height - 1) // Frame Height Minus One
    writeUint24LE(header, 12, frame.delay)       // Frame Duration in ms
    header[15] = 0x00                            // B=0 (alpha-blend), D=0 (no dispose)

    // ANMF payload = 16-byte header + VP8 chunk(s) (already padded)
    var vpTotalSize  = frame.chunks.reduce(function (s, c) { return s + c.byteLength }, 0)
    var anmfPayload  = new Uint8Array(header.byteLength + vpTotalSize)
    anmfPayload.set(header, 0)
    var pos = header.byteLength
    for (var i = 0; i < frame.chunks.length; i++) {
      anmfPayload.set(frame.chunks[i], pos)
      pos += frame.chunks[i].byteLength
    }

    return buildChunk('ANMF', anmfPayload)
  })

  // ── RIFF binary ───────────────────────────────────────────────────────────
  var vp8xChunk       = buildChunk('VP8X', vp8xPayload)
  var animChunk       = buildChunk('ANIM', animPayload)
  var anmfTotalBytes  = anmfChunks.reduce(function (s, c) { return s + c.byteLength }, 0)

  // RIFF File Size = everything after the 8-byte 'RIFF'+'size' prefix
  var riffPayloadSize = 4 + vp8xChunk.byteLength + animChunk.byteLength + anmfTotalBytes

  var output     = new Uint8Array(8 + riffPayloadSize)
  var outputView = new DataView(output.buffer)

  // 'RIFF'
  output[0] = 0x52; output[1] = 0x49; output[2] = 0x46; output[3] = 0x46
  outputView.setUint32(4, riffPayloadSize, true)
  // 'WEBP'
  output[8] = 0x57; output[9] = 0x45; output[10] = 0x42; output[11] = 0x50

  var p = 12
  output.set(vp8xChunk, p); p += vp8xChunk.byteLength
  output.set(animChunk, p); p += animChunk.byteLength
  for (var i = 0; i < anmfChunks.length; i++) {
    output.set(anmfChunks[i], p)
    p += anmfChunks[i].byteLength
  }

  return output
}

// ─── Worker entry point ───────────────────────────────────────────────────────

/**
 * Expected message:
 * {
 *   rgbaList:  ArrayBuffer[],  // raw RGBA pixel data, one buffer per frame
 *   delays:    number[],       // frame delay in milliseconds (one per frame)
 *   width:     number,
 *   height:    number,
 *   quality:   number,         // 0.0–1.0 WebP lossy quality
 *   loopCount: number,         // 0 = infinite loop
 * }
 */
onmessage = async function (ev) {
  var d         = ev.data
  var rgbaList  = d.rgbaList
  var delays    = d.delays
  var width     = d.width
  var height    = d.height
  var quality   = d.quality
  var loopCount = d.loopCount

  var canvas = new OffscreenCanvas(width, height)
  var ctx    = canvas.getContext('2d')
  var frames = []

  for (var i = 0; i < rgbaList.length; i++) {
    // Reconstruct the frame from raw RGBA data and encode as single-frame WebP
    var imageData = new ImageData(new Uint8ClampedArray(rgbaList[i]), width, height)
    ctx.putImageData(imageData, 0, 0)

    var blob   = await canvas.convertToBlob({ type: 'image/webp', quality: quality })
    var buffer = await blob.arrayBuffer()
    var chunks = extractFrameChunks(buffer)

    frames.push({ width: width, height: height, delay: delays[i], chunks: chunks })
  }

  var resultBytes = assembleAnimatedWebP(frames, loopCount)
  var resultBlob  = new Blob([resultBytes.buffer], { type: 'image/webp' })
  self.postMessage({ blob: resultBlob })
}
