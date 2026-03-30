import type { FitMode } from './types'

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  outputMimeType: string,
  fitMode: FitMode
): Promise<Blob> {
  const quality = outputMimeType === 'image/jpeg' ? 0.92 : outputMimeType === 'image/webp' ? 0.9 : undefined

  const objectUrl = URL.createObjectURL(file)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Failed to get canvas 2D context'))
        return
      }

      drawWithFitMode(ctx, img, width, height, fitMode)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl)
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob returned null'))
        },
        outputMimeType,
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }
    img.src = objectUrl
  })
}

function drawWithFitMode(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  fitMode: FitMode
) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  switch (fitMode) {
    case 'stretch':
      ctx.drawImage(img, 0, 0, targetW, targetH)
      break

    case 'cover': {
      const scale = Math.max(targetW / iw, targetH / ih)
      const sw = iw * scale
      const sh = ih * scale
      const sx = (targetW - sw) / 2
      const sy = (targetH - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh)
      break
    }

    case 'contain': {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, targetW, targetH)
      const scale = Math.min(targetW / iw, targetH / ih)
      const sw = iw * scale
      const sh = ih * scale
      const sx = (targetW - sw) / 2
      const sy = (targetH - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh)
      break
    }

    case 'blur-fill': {
      // Draw blurred background: scale original to cover target, apply blur
      const bgScale = Math.max(targetW / iw, targetH / ih)
      const bgW = iw * bgScale
      const bgH = ih * bgScale
      const bgX = (targetW - bgW) / 2
      const bgY = (targetH - bgH) / 2

      ctx.filter = `blur(${Math.max(1, Math.round(Math.min(targetW, targetH) / 30))}px)`
      ctx.drawImage(img, bgX, bgY, bgW, bgH)
      ctx.filter = 'none'

      // Draw sharp centered image
      const scale = Math.min(targetW / iw, targetH / ih)
      const sw = iw * scale
      const sh = ih * scale
      const sx = (targetW - sw) / 2
      const sy = (targetH - sh) / 2
      ctx.drawImage(img, sx, sy, sw, sh)
      break
    }
  }
}
