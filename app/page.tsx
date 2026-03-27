'use client'

import { useState } from 'react'
import UploadZone from '@/components/UploadZone'
import ImageList from '@/components/ImageList'
import ResolutionSelector from '@/components/ResolutionSelector'
import { UploadedImage, Resolution, RESOLUTIONS } from '@/lib/types'
import { resizeImage } from '@/lib/resizeImage'
import { buildOutputFilename, buildZipFilename, downloadAsZip } from '@/lib/buildZip'

export default function Home() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [resolution, setResolution] = useState<Resolution>(RESOLUTIONS[0])
  const [processing, setProcessing] = useState(false)

  function handleFilesAccepted(files: File[]) {
    const newImages: UploadedImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  function handleRemove(id: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img) URL.revokeObjectURL(img.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  async function handleProcess() {
    if (images.length === 0 || processing) return
    setProcessing(true)

    const seen = new Map<string, number>()
    const results: { blob: Blob; filename: string }[] = []
    const errors: string[] = []

    for (const img of images) {
      try {
        const blob = await resizeImage(img.file, resolution.width, resolution.height)
        const filename = buildOutputFilename(img.file.name, resolution.width, resolution.height, seen)
        results.push({ blob, filename })
      } catch {
        errors.push(img.file.name)
      }
    }

    if (errors.length > 0) {
      setImages((prev) =>
        prev.map((img) =>
          errors.includes(img.file.name) ? { ...img, error: '处理失败' } : img
        )
      )
    }

    if (results.length > 0) {
      await downloadAsZip(results, buildZipFilename(resolution.width, resolution.height))
    }

    setProcessing(false)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">App Store 截图尺寸调整</h1>
        <p className="text-sm text-gray-500 mt-1">
          上传截图，选择目标分辨率，一键调整并打包下载
        </p>
      </div>

      <UploadZone onFilesAccepted={handleFilesAccepted} currentCount={images.length} />

      <ImageList images={images} onRemove={handleRemove} />

      <ResolutionSelector selected={resolution} onChange={setResolution} />

      <button
        onClick={handleProcess}
        disabled={images.length === 0 || processing}
        className="w-full py-3 rounded-xl text-white font-medium transition-colors
          bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            处理中…
          </span>
        ) : `调整尺寸并下载 ZIP (${images.length} 张)`}
      </button>
    </main>
  )
}
