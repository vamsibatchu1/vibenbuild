'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Project } from '@/types/project'
import { Lock, Save, X, Plus, Trash2, Upload, Eye, Edit } from 'lucide-react'
import { motion } from 'framer-motion'

interface AdminClientProps {
  initialProjects: Project[]
}

export function AdminClient({ initialProjects }: AdminClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

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
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      })

      if (response.ok) {
        setSaveMessage('Projects saved successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Failed to save projects')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (err) {
      setSaveMessage('Error saving projects')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }, [projects])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const handleImageUpload = useCallback(async (projectId: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('projectId', projectId)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const project = projects.find(p => p.id === projectId)
        if (project) {
          updateProject(projectId, {
            thumbnails: [...project.thumbnails, data.path]
          })
        }
      }
    } catch (err) {
      console.error('Failed to upload image:', err)
    }
  }, [projects, updateProject])

  const removeImage = useCallback(async (projectId: string, imagePath: string) => {
    try {
      // Delete from file system
      await fetch('/api/admin/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath }),
      })

      // Remove from project thumbnails
      const project = projects.find(p => p.id === projectId)
      if (project) {
        updateProject(projectId, {
          thumbnails: project.thumbnails.filter(t => t !== imagePath)
        })
      }
    } catch (err) {
      console.error('Failed to delete image:', err)
      // Still remove from UI even if file deletion fails
      const project = projects.find(p => p.id === projectId)
      if (project) {
        updateProject(projectId, {
          thumbnails: project.thumbnails.filter(t => t !== imagePath)
        })
      }
    }
  }, [projects, updateProject])

  const addTag = useCallback((projectId: string, tag: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project && tag.trim() && !project.tags.includes(tag.trim())) {
      updateProject(projectId, {
        tags: [...project.tags, tag.trim()]
      })
    }
  }, [projects, updateProject])

  const removeTag = useCallback((projectId: string, tag: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      updateProject(projectId, {
        tags: project.tags.filter(t => t !== tag)
      })
    }
  }, [projects, updateProject])

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
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-ibm-plex-mono uppercase"
              >
                <Save className="w-3 h-3" />
                {isSaving ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </div>
          <div className="text-xs text-black/70 leading-relaxed max-w-md mb-4 uppercase font-ibm-plex-mono">
            Edit project information below. Click "Edit" on any row to modify details.
          </div>
        </div>

        {/* Column Headers - Hidden on mobile */}
        <div className="mb-2 hidden md:block">
          <div className="flex gap-4 text-xs text-black/80 uppercase tracking-wide items-start border-t-2 border-b-2 border-solid border-black py-2 font-ibm-plex-mono">
            <div className="w-16 flex-shrink-0 text-left">Week</div>
            <div className="w-24 flex-shrink-0 text-left">Project Name</div>
            <div className="w-24 flex-shrink-0 text-left">Tags</div>
            <div className="flex-1 min-w-[300px] text-left">Description</div>
            <div className="w-16 flex-shrink-0 text-right">Actions</div>
          </div>
        </div>

        {/* Projects List */}
        <div className="mb-12 font-ibm-plex-mono">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              isEditing={editingId === project.id}
              onToggleEdit={() => setEditingId(editingId === project.id ? null : project.id)}
              onUpdate={(updates) => updateProject(project.id, updates)}
              onImageUpload={(file) => handleImageUpload(project.id, file)}
              onRemoveImage={(imagePath) => removeImage(project.id, imagePath)}
              onAddTag={(tag) => addTag(project.id, tag)}
              onRemoveTag={(tag) => removeTag(project.id, tag)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProjectRowProps {
  project: Project
  index: number
  isEditing: boolean
  onToggleEdit: () => void
  onUpdate: (updates: Partial<Project>) => void
  onImageUpload: (file: File) => void
  onRemoveImage: (imagePath: string) => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

function ProjectRow({
  project,
  index,
  isEditing,
  onToggleEdit,
  onUpdate,
  onImageUpload,
  onRemoveImage,
  onAddTag,
  onRemoveTag,
}: ProjectRowProps) {
  const [newTag, setNewTag] = useState('')

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
            {/* Week Number */}
            <div className="w-12 md:w-16 flex-shrink-0 text-black/80 text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
              {String(project.week).padStart(2, '0')}
            </div>

            {/* Project Name */}
            <div className="w-20 md:w-24 flex-shrink-0 text-black text-left font-plus-jakarta-sans font-bold text-base tracking-tighter">
              {project.title}
            </div>

            {/* Tags - Hidden on mobile */}
            <div className="hidden md:block w-24 flex-shrink-0 text-black/70 text-left">
              {project.tags.join(', ')}
            </div>

            {/* Description */}
            <div className="flex-1 min-w-0 md:min-w-[300px] text-black/70 leading-relaxed text-left">
              {project.description}
            </div>

            {/* Actions */}
            <div className="w-8 md:w-16 text-right text-black/60">
              <button
                onClick={onToggleEdit}
                className="hover:text-black transition-colors"
                aria-label="Edit project"
              >
                <Edit className="w-4 h-4 inline" />
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
              value={project.id}
              onChange={(e) => onUpdate({ id: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Title</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Description</label>
          <textarea
            value={project.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map((tag) => (
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

        <div>
          <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Link</label>
          <input
            type="url"
            value={project.link}
            onChange={(e) => onUpdate({ link: e.target.value })}
            className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Week</label>
            <input
              type="number"
              value={project.week}
              onChange={(e) => onUpdate({ week: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black mb-1 uppercase tracking-wide font-ibm-plex-mono">Year</label>
            <input
              type="number"
              value={project.year}
              onChange={(e) => onUpdate({ year: parseInt(e.target.value) || 2026 })}
              className="w-full px-3 py-2 border-2 border-black text-xs font-ibm-plex-mono bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-2 uppercase tracking-wide font-ibm-plex-mono">Thumbnails</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {project.thumbnails.map((thumbnail, idx) => (
                <div key={idx} className="relative group w-20 h-20 border-2 border-black">
                  <Image
                    src={thumbnail}
                    alt={`Thumbnail ${idx + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => onRemoveImage(thumbnail)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
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
