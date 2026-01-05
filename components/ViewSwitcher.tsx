'use client'

import { ViewType } from '@/types/view'
import { motion } from 'framer-motion'

interface ViewSwitcherProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const views: { id: ViewType; label: string }[] = [
  { id: 'list', label: 'List' },
  { id: 'cards', label: 'Cards' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'graph', label: 'Graph' },
  { id: 'tags', label: 'Tags' },
]

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="w-full max-w-[800px] mb-6">
      <div className="flex gap-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`px-4 py-2 border-2 border-black font-ibm-plex-mono text-sm transition-colors ${
              currentView === view.id
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  )
}

