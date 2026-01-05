'use client'

import { useState } from 'react'
import { Project } from '@/types/project'
import { ViewType } from '@/types/view'
import { ViewSwitcher } from '@/components/ViewSwitcher'
import { CardsView } from '@/components/views/CardsView'
import { ListView } from '@/components/views/ListView'
import { GalleryView } from '@/components/views/GalleryView'
import { GraphView } from '@/components/views/GraphView'
import { TagsView } from '@/components/views/TagsView'
import { motion, AnimatePresence } from 'framer-motion'

interface ExperimentsClientProps {
  initialProjects: Project[]
}

export function ExperimentsClient({ initialProjects }: ExperimentsClientProps) {
  const [currentView, setCurrentView] = useState<ViewType>('list')

  const renderView = () => {
    switch (currentView) {
      case 'cards':
        return <CardsView projects={initialProjects} />
      case 'list':
        return <ListView projects={initialProjects} />
      case 'gallery':
        return <GalleryView projects={initialProjects} />
      case 'graph':
        return <GraphView projects={initialProjects} />
      case 'tags':
        return <TagsView projects={initialProjects} />
      default:
        return <CardsView projects={initialProjects} />
    }
  }

  return (
    <main className="min-h-screen bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-center">
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
