import { resizeImage } from '@/lib/resizeImage'
import type { FitMode } from '@/lib/types'

const modes: FitMode[] = ['cover', 'stretch', 'contain', 'blur-fill']

describe('resizeImage', () => {
  for (const mode of modes) {
    describe(`fitMode: ${mode}`, () => {
      it('returns a Blob with specified png format', async () => {
        const mockFile = new File([''], 'test.png', { type: 'image/png' })
        const blob = await resizeImage(mockFile, 1242, 2688, 'image/png', mode)
        expect(blob).toBeInstanceOf(Blob)
        expect(blob.type).toBe('image/png')
      })

      it('returns jpeg mime type when output is jpeg', async () => {
        const mockFile = new File([''], 'test.png', { type: 'image/png' })
        const blob = await resizeImage(mockFile, 1242, 2688, 'image/jpeg', mode)
        expect(blob.type).toBe('image/jpeg')
      })
    })
  }
})
