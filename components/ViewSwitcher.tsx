'use client'

import { ViewType } from '@/types/view'
import { motion } from 'framer-motion'

interface ViewSwitcherProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const views: { id: ViewType; label: string }[] = [
  { id: 'cards', label: 'Cards' },
  { id: 'list', label: 'List' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'graph', label: 'Graph' },
]

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex gap-2 mb-6 justify-center">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`px-4 py-2 border-2 border-white font-ibm-plex-mono text-sm transition-colors ${
            currentView === view.id
              ? 'bg-white text-black'
              : 'bg-black text-white hover:bg-white hover:text-black'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}

