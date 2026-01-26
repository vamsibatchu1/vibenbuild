'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Experiment } from '@/app/allexperiments/getExperiments'
import { Lock, Save, X, Plus, Trash2, Upload, Eye, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

interface AdminClientProps {
  initialExperiments: Experiment[]
  initialWipIdeas: string[]
}

export function AdminClient({ initialExperiments, initialWipIdeas }: AdminClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [experiments, setExperiments] = useState<Experiment[]>(initialExperiments)
  const [wipIdeas, setWipIdeas] = useState<string[]>(initialWipIdeas)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'experiments' | 'wip'>('experiments')

  const handleLogin = useCallback(async () => {
    setError('')
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setError('Invalid password')
      }
    } catch (err) {
      setError('Authentication failed')
    }
  }, [password])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Save experiments and WIP ideas in parallel
      const [experimentsResponse, wipIdeasResponse] = await Promise.all([
        fetch('/api/admin/save-experiments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ experiments }),
        }),
        fetch('/api/admin/save-wip-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ideas: wipIdeas }),
        })
      ])

      if (experimentsResponse.ok && wipIdeasResponse.ok) {
        setSaveMessage('All changes saved successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Failed to save some changes')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (err) {
      setSaveMessage('Error saving changes')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }, [experiments, wipIdeas])

  const updateExperiment = useCallback((id: string, updates: Partial<Experiment>) => {
    setExperiments(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])

  const handleImageUpload = useCallback(async (experimentId: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('experimentId', experimentId)

      const response = await fetch('/api/admin/upload-experiment-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const experiment = experiments.find(e => e.id === experimentId)
        if (experiment && data.imageIndex !== undefined) {
          // Add the image index returned from the API
          updateExperiment(experimentId, {
            images: [...experiment.images, data.imageIndex]
          })
        }
      }
    } catch (err) {
      console.error('Failed to upload image:', err)
    }
  }, [experiments, updateExperiment])

  const removeImage = useCallback(async (experimentId: string, imageIndex: number) => {
    try {
      const experiment = experiments.find(e => e.id === experimentId)
      if (experiment) {
        // Extract experiment number and image number for file deletion
        const expNumber = experimentId.replace('exp-', '')
        const imgNumber = String(imageIndex + 1).padStart(2, '0')
        const imagePath = `/images/experiments2/${expNumber}-${imgNumber}.webp`
        
        // Delete from file system
        await fetch('/api/admin/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePath }),
        })

        // Remove from experiment images array
        updateExperiment(experimentId, {
          images: experiment.images.filter(idx => idx !== imageIndex)
        })
      }
    } catch (err) {
      console.error('Failed to delete image:', err)
      // Still remove from UI even if file deletion fails
      const experiment = experiments.find(e => e.id === experimentId)
      if (experiment) {
        updateExperiment(experimentId, {
          images: experiment.images.filter(idx => idx !== imageIndex)
        })
      }
    }
  }, [experiments, updateExperiment])

  const addTag = useCallback((experimentId: string, tag: string) => {
    const experiment = experiments.find(e => e.id === experimentId)
    if (experiment && tag.trim() && !experiment.tags.includes(tag.trim())) {
      updateExperiment(experimentId, {
        tags: [...experiment.tags, tag.trim()]
      })
    }
  }, [experiments, updateExperiment])

  const removeTag = useCallback((experimentId: string, tag: string) => {
    const experiment = experiments.find(e => e.id === experimentId)
    if (experiment) {
      updateExperiment(experimentId, {
        tags: experiment.tags.filter(t => t !== tag)
      })
    }
  }, [experiments, updateExperiment])

  const handleAddExperiment = useCallback(() => {
    // Find the next available experiment number
    const existingNumbers = experiments.map(e => {
      const match = e.id.match(/exp-(\d+)/)
      return match ? parseInt(match[1]) : 0
    }).sort((a, b) => a - b)
    
    let nextNumber = 1
    for (let num of existingNumbers) {
      if (num === nextNumber) {
        nextNumber++
      } else {
        break
      }
    }
    
    // Generate new experiment ID
    const nextId = `exp-${String(nextNumber).padStart(2, '0')}`
    
    // Create new experiment with default values
    const newExperiment: Experiment = {
      id: nextId,
      title: 'New Experiment',
      text: 'Enter experiment description here...',
      tags: [],
      images: [],
      tokens: 0,
      link: 'https://example.com'
    }
    
    // Add to experiments array
    setExperiments(prev => [...prev, newExperiment])
    
    // Open edit mode for the new experiment
    setEditingId(nextId)
  }, [experiments])

  const handleDeleteExperiment = useCallback((experimentId: string) => {
    if (confirm('Are you sure you want to delete this experiment? This action cannot be undone.')) {
      setExperiments(prev => prev.filter(e => e.id !== experimentId))
      // If the deleted experiment was being edited, close edit mode
      if (editingId === experimentId) {
        setEditingId(null)
      }
    }
  }, [editingId])

  const handleWipIdeaChange = useCallback((index: number, value: string) => {
    setWipIdeas(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }, [])

  const handleAddWipIdea = useCallback(() => {
    setWipIdeas(prev => [...prev, ''])
  }, [])

  const handleRemoveWipIdea = useCallback((index: number) => {
    setWipIdeas(prev => prev.filter((_, i) => i !== index))
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2 font-ibm-plex-mono uppercase tracking-wide">Admin Login</h1>
            <div className="text-xs text-black/70 leading-relaxed uppercase font-ibm-plex-mono">
              Enter password to access the admin panel
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide font-ibm-plex-mono">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-xs font-ibm-plex-mono uppercase">{error}</div>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full bg-black text-white py-3 px-4 hover:bg-black/80 transition-colors text-xs font-ibm-plex-mono uppercase tracking-wide"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold font-ibm-plex-mono uppercase tracking-wide">Admin Panel</h1>
            <div className="flex items-center gap-4">
              {saveMessage && (
                <span className={`text-xs ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {saveMessage}
                </span>
              )}
              {activeTab === 'experiments' && (
                <button
                  onClick={handleAddExperiment}
                  className="flex items-center gap-2 border-2 border-black bg-white text-black px-4 py-2 hover:bg-black/5 transition-colors text-xs font-ibm-plex-mono uppercase"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden md:inline">Add Experiment</span>
                  <span className="md:hidden">Add</span>
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-ibm-plex-mono uppercase"
              >
                <Save className="w-3 h-3" />
                {isSaving ? 'Saving...' : <><span className="hidden md:inline">Save All</span><span className="md:hidden">Save</span></>}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b-2 border-black">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('experiments')}
              className={`px-4 py-2 text-xs font-ibm-plex-mono uppercase transition-colors ${
                activeTab === 'experiments'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              Experiment Data
            </button>
            <button
              onClick={() => setActiveTab('wip')}
              className={`px-4 py-2 text-xs font-ibm-plex-mono uppercase transition-colors ${
                activeTab === 'wip'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              Work in Progress Ideas
            </button>
          </div>
        </div>

        {/* Experiment Data Tab */}
        {activeTab === 'experiments' && (
          <>
            <div className="text-xs text-black/70 leading-relaxed max-w-md mb-4 uppercase font-ibm-plex-mono">
              Edit experiment information below. Click &quot;Edit&quot; on any row to modify details.
            </div>

            {/* Column Headers - Hidden on mobile */}
            <div className="mb-2 hidden md:block">
              <div className="flex gap-4 text-xs text-black/80 uppercase tracking-wide items-start border-t-2 border-b-2 border-solid border-black py-2 font-ibm-plex-mono">
                <div className="w-24 flex-shrink-0 text-left">ID</div>
                <div className="w-24 flex-shrink-0 text-left">Title</div>
                <div className="w-24 flex-shrink-0 text-left">Tags</div>
                <div className="flex-1 min-w-[300px] text-left">Text</div>
                <div className="w-20 md:w-24 flex-shrink-0 text-right">Actions</div>
              </div>
            </div>

            {/* Experiments List */}
            <div className="mb-12 font-ibm-plex-mono">
              {experiments.map((experiment, index) => (
                <ExperimentRow
                  key={experiment.id}
                  experiment={experiment}
                  index={index}
                  isEditing={editingId === experiment.id}
                  onToggleEdit={() => setEditingId(editingId === experiment.id ? null : experiment.id)}
                  onDelete={() => handleDeleteExperiment(experiment.id)}
                  onUpdate={(updates) => updateExperiment(experiment.id, updates)}
                  onImageUpload={(file) => handleImageUpload(experiment.id, file)}
                  onRemoveImage={(imageIndex) => removeImage(experiment.id, imageIndex)}
                  onAddTag={(tag) => addTag(experiment.id, tag)}
                  onRemoveTag={(tag) => removeTag(experiment.id, tag)}
                />
              ))}
            </div>
          </>
        )}

        {/* Work in Progress Ideas Tab */}
        {activeTab === 'wip' && (
          <div className="mb-12">
            <div className="text-xs text-black/70 leading-relaxed max-w-md mb-6 uppercase font-ibm-plex-mono">
              Edit work in progress ideas below. These will appear in the exit column of the experiments page.
            </div>
            <div className="space-y-4">
              {wipIdeas.map((idea, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <textarea
                    value={idea}
                    onChange={(e) => handleWipIdeaChange(idx, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black leading-relaxed"
                    placeholder={`Idea ${idx + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveWipIdea(idx)}
                    className="px-3 py-2 border-2 border-black bg-white text-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-xs font-ibm-plex-mono uppercase"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddWipIdea}
                className="w-full px-4 py-2 border-2 border-black bg-white text-black hover:bg-black/5 transition-colors text-xs font-ibm-plex-mono uppercase flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" />
                Add Idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface ExperimentRowProps {
  experiment: Experiment
  index: number
  isEditing: boolean
  onToggleEdit: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<Experiment>) => void
  onImageUpload: (file: File) => void
  onRemoveImage: (imageIndex: number) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

function ExperimentRow({
  experiment,
  index,
  isEditing,
  onToggleEdit,
  onDelete,
  onUpdate,
  onImageUpload,
  onRemoveImage,
  onAddTag,
  onRemoveTag,
}: ExperimentRowProps) {
  const [newTag, setNewTag] = useState('')

  const getImagePath = (experimentId: string, imageIndex: number): string => {
    const expNumber = experimentId.replace('exp-', '')
    const imgNumber = String(imageIndex + 1).padStart(2, '0')
    return `/images/experiments2/${expNumber}-${imgNumber}.webp`
  }

  if (!isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.01 }}
        className={index > 0 ? 'mt-4' : ''}
      >
        <div
          className={`block transition-colors ${index === 0 ? '-mt-2 pt-2' : '-mt-4 pt-4'} hover:bg-black/5`}
        >
          <div className="flex gap-2 md:gap-4 text-xs text-black items-start border-b-2 border-solid border-black pb-4">
            {/* Experiment ID */}
            <div className="w-20 md:w-24 flex-shrink-0 text-black/80 text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
              {experiment.id}
            </div>

            {/* Experiment Title */}
            <div className="w-20 md:w-24 flex-shrink-0 text-black text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
              {experiment.title}
            </div>

            {/* Tags - Hidden on mobile */}
            <div className="hidden md:block w-24 flex-shrink-0 text-black/70 text-left">
              {experiment.tags.join(', ')}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 md:min-w-[300px] text-black/70 leading-relaxed text-left">
              {experiment.text.substring(0, 100)}...
            </div>

            {/* Actions */}
            <div className="w-20 md:w-24 flex-shrink-0 text-right text-black/60 flex items-center justify-end gap-2">
              <button
                onClick={onToggleEdit}
                className="hover:text-black transition-colors"
                aria-label="Edit experiment"
              >
                <Edit className="w-4 h-4 inline" />
              </button>
              <button
                onClick={onDelete}
                className="hover:text-red-600 transition-colors"
                aria-label="Delete experiment"
              >
                <Trash2 className="w-4 h-4 inline" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`bg-black/5 ${index === 0 ? '-mt-2 pt-2' : '-mt-4 pt-4'} border-b-2 border-solid border-black pb-6`}
    >
      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">ID</label>
            <input
              type="text"
              value={experiment.id}
              onChange={(e) => onUpdate({ id: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Title</label>
            <input
              type="text"
              value={experiment.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Text</label>
          <textarea
            value={experiment.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {experiment.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 border border-black text-xs font-ibm-plex-mono bg-white"
              >
                {tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="text-black hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddTag(newTag)
                  setNewTag('')
                }
              }}
              placeholder="Add tag and press Enter"
              className="flex-1 px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={() => {
                onAddTag(newTag)
                setNewTag('')
              }}
              className="px-4 py-2 bg-black text-white hover:bg-black/80 text-xs font-ibm-plex-mono uppercase transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Link</label>
            <input
              type="url"
              value={experiment.link}
              onChange={(e) => onUpdate({ link: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Tokens</label>
            <input
              type="number"
              value={experiment.tokens}
              onChange={(e) => onUpdate({ tokens: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide font-ibm-plex-mono">Images</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {experiment.images.map((imageIndex, idx) => {
                const imagePath = getImagePath(experiment.id, imageIndex)
                return (
                  <div key={idx} className="relative group w-20 h-20 border-2 border-black">
                    <Image
                      src={imagePath}
                      alt={`Image ${imageIndex + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e5e5e5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="monospace" font-size="10" fill="%23999"%3ENot Found%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <button
                      onClick={() => onRemoveImage(imageIndex)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1 font-ibm-plex-mono">
                      {imageIndex}
                    </div>
                  </div>
                )
              })}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white cursor-pointer hover:bg-black/5 transition-colors text-xs font-ibm-plex-mono uppercase">
              <Upload className="w-3 h-3" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    onImageUpload(file)
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t-2 border-black">
          <button
            onClick={onToggleEdit}
            className="px-4 py-2 border-2 border-black bg-white text-black hover:bg-black/5 text-xs font-ibm-plex-mono uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onToggleEdit}
            className="px-4 py-2 bg-black text-white hover:bg-black/80 text-xs font-ibm-plex-mono uppercase transition-colors"
          >
            Done Editing
          </button>
        </div>
      </div>
    </motion.div>
  )
}
