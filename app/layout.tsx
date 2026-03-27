import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'App Store 截图尺寸调整',
  description: '批量将截图调整为苹果应用商店所需的分辨率',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-100 antialiased">{children}</body>
    </html>
  )
}
