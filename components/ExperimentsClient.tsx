'use client'

import { useState } from 'react'
import { Project } from '@/types/project'
import { ViewType } from '@/types/view'
import { ViewSwitcher } from '@/components/ViewSwitcher'
import { CardsView } from '@/components/views/CardsView'
import { ListView } from '@/components/views/ListView'
import { GalleryView } from '@/components/views/GalleryView'
import { TimelineView } from '@/components/views/TimelineView'
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
      case 'timeline':
        return <TimelineView projects={initialProjects} />
      case 'tags':
        return <TagsView projects={initialProjects} />
      default:
        return <CardsView projects={initialProjects} />
    }
  }

  return (
    <main className={`min-h-screen bg-white ${currentView === 'timeline' ? 'pt-8 md:pt-12 pb-0' : 'py-8 md:py-12'}`}>
      <div className={`container mx-auto px-4 md:px-6 lg:px-8 ${currentView === 'timeline' ? 'max-w-7xl h-[calc(100vh-96px)] md:h-[calc(100vh-112px)]' : 'max-w-7xl'}`}>
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
            className={currentView === 'timeline' ? 'h-full' : ''}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
