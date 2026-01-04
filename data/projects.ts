import { Project } from '@/types/project'
import projectsData from './projects.json'
import { readdir } from 'fs/promises'
import path from 'path'
import { cache } from 'react'

/**
 * Cached function to read all thumbnail files from the directory.
 * Uses React cache to ensure this only runs once per request.
 */
const getThumbnailFiles = cache(async (): Promise<string[]> => {
  try {
    const thumbnailsDir = path.join(process.cwd(), 'public', 'images', 'thumbnails')
    const files = await readdir(thumbnailsDir)
    return files.filter(file => file.endsWith('.webp'))
  } catch (error) {
    // Directory doesn't exist or can't be read
    return []
  }
})

/**
 * Automatically scans the thumbnails folder and finds all images for a given week.
 * Looks for files matching: {week}.webp, {week}-1.webp, {week}-2.webp, etc.
 * Uses cached file list for better performance.
 */
async function getThumbnailsForWeek(week: number, allFiles: string[]): Promise<string[]> {
  const weekStr = String(week).padStart(2, '0')
  
  // Filter files that match the week number pattern
  const weekFiles = allFiles.filter(file => {
    // Match {week}.webp or {week}-{number}.webp
    const pattern = new RegExp(`^${weekStr}(-\\d+)?\\.webp$`)
    return pattern.test(file)
  })
  
  // Sort files: {week}.webp first, then {week}-1.webp, {week}-2.webp, etc.
  weekFiles.sort((a, b) => {
    // If one is the base file (no dash), it comes first
    if (a === `${weekStr}.webp`) return -1
    if (b === `${weekStr}.webp`) return 1
    
    // Otherwise, sort by the number after the dash
    const aMatch = a.match(/-(\d+)\.webp$/)
    const bMatch = b.match(/-(\d+)\.webp$/)
    
    if (aMatch && bMatch) {
      return parseInt(aMatch[1]) - parseInt(bMatch[1])
    }
    
    return a.localeCompare(b)
  })
  
  // Convert to full paths
  return weekFiles.map(file => `/images/thumbnails/${file}`)
}

/**
 * Gets all projects with automatically detected thumbnails.
 * Thumbnails are automatically scanned from /public/images/thumbnails/ folder.
 * Just drop images like 01.webp, 02.webp, etc. and they'll be picked up automatically!
 * 
 * Uses React cache to ensure file system is only read once per request.
 */
export async function getProjects(): Promise<Project[]> {
  const projects = projectsData as Project[]
  
  // Get all thumbnail files once (cached)
  const allThumbnailFiles = await getThumbnailFiles()
  
  // Automatically populate thumbnails for each project
  const projectsWithThumbnails = await Promise.all(
    projects.map(async (project) => {
      // If thumbnails are already specified in JSON, use those
      // Otherwise, auto-detect from file system
      const thumbnails = project.thumbnails.length > 0 
        ? project.thumbnails 
        : await getThumbnailsForWeek(project.week, allThumbnailFiles)
      
      return {
        ...project,
        thumbnails
      }
    })
  )
  
  return projectsWithThumbnails
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects()
  return projects.find((project) => project.id === id)
}

