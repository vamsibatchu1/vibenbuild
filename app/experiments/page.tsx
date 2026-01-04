'use client'

import { useState } from 'react'
import { getProjects } from '@/data/projects'
import { ViewType } from '@/types/view'
import { ViewSwitcher } from '@/components/ViewSwitcher'
import { CardsView } from '@/components/views/CardsView'
import { ListView } from '@/components/views/ListView'
import { GalleryView } from '@/components/views/GalleryView'
import { GraphView } from '@/components/views/GraphView'
import { motion, AnimatePresence } from 'framer-motion'

export default function ExperimentsPage() {
  const projects = getProjects()
  const [currentView, setCurrentView] = useState<ViewType>('cards')

  const renderView = () => {
    switch (currentView) {
      case 'cards':
        return <CardsView projects={projects} />
      case 'list':
        return <ListView projects={projects} />
      case 'gallery':
        return <GalleryView projects={projects} />
      case 'graph':
        return <GraphView projects={projects} />
      default:
        return <CardsView projects={projects} />
    }
  }

  return (
    <main className="min-h-screen bg-black py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        
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
