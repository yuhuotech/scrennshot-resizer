'use client'

import { Resolution, RESOLUTIONS, RESOLUTION_GROUPS } from '@/lib/types'

interface Props {
  selected: Resolution
  onChange: (resolution: Resolution) => void
}

export default function ResolutionSelector({ selected, onChange }: Props) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-700 mb-2">目标分辨率</p>
      <select
        value={`${selected.width}x${selected.height}`}
        onChange={(e) => {
          const res = RESOLUTIONS.find((r) => `${r.width}x${r.height}` === e.target.value)
          if (res) onChange(res)
        }}
        className="w-full p-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
      >
        {RESOLUTION_GROUPS.map((group) => (
          <optgroup key={group} label={group}>
            {RESOLUTIONS.filter((r) => r.group === group).map((res) => (
              <option key={`${res.width}x${res.height}`} value={`${res.width}x${res.height}`}>
                {res.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
