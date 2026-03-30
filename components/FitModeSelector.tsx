'use client'

import { FitMode, FIT_MODES } from '@/lib/types'

interface Props {
  selected: FitMode
  onChange: (mode: FitMode) => void
}

export default function FitModeSelector({ selected, onChange }: Props) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-700 mb-2">适配模式</p>
      <div className="grid grid-cols-4 gap-2">
        {FIT_MODES.map((mode) => (
          <label
            key={mode.value}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-center ${
              selected === mode.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }`}
          >
            <input
              type="radio"
              name="fitMode"
              className="accent-blue-500"
              checked={selected === mode.value}
              onChange={() => onChange(mode.value)}
            />
            <span className="text-sm text-gray-700">{mode.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
