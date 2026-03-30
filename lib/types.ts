export interface UploadedImage {
  id: string           // crypto.randomUUID()
  file: File
  previewUrl: string   // URL.createObjectURL(file)
  error?: string       // per-image error after processing
}

export interface Resolution {
  label: string
  width: number
  height: number
  group?: string
}

export interface OutputFormat {
  label: string
  mimeType: string
  ext: string
}

export const OUTPUT_FORMATS: OutputFormat[] = [
  { label: 'PNG', mimeType: 'image/png', ext: 'png' },
  { label: 'JPG', mimeType: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP', mimeType: 'image/webp', ext: 'webp' },
]

export const RESOLUTIONS: Resolution[] = [
  { label: 'iPhone 竖屏 (1242×2688)', width: 1242, height: 2688, group: 'App Store' },
  { label: 'iPhone 横屏 (2688×1242)', width: 2688, height: 1242, group: 'App Store' },
  { label: 'iPhone 竖屏 Pro (1284×2778)', width: 1284, height: 2778, group: 'App Store' },
  { label: 'iPhone 横屏 Pro (2778×1284)', width: 2778, height: 1284, group: 'App Store' },
  { label: '小米竖屏 (1080×1920)', width: 1080, height: 1920, group: '小米应用商店' },
]

export const RESOLUTION_GROUPS = [...new Set(RESOLUTIONS.map((r) => r.group!))]

export type FitMode = 'cover' | 'stretch' | 'contain' | 'blur-fill'

export interface FitModeOption {
  value: FitMode
  label: string
  description: string
}

export const FIT_MODES: FitModeOption[] = [
  { value: 'cover', label: '智能裁切', description: '等比缩放并居中裁切，无变形但可能裁掉边缘' },
  { value: 'stretch', label: '拉伸填充', description: '强制拉伸到目标尺寸，可能变形' },
  { value: 'contain', label: '留白填充', description: '等比缩放保留完整画面，空白区域填白色' },
  { value: 'blur-fill', label: '模糊填充', description: '等比缩放保留完整画面，空白区域用模糊背景填充' },
]
