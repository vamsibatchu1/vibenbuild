import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const projectId = formData.get('projectId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    // Extract week number from projectId (e.g., "project-01" -> "01")
    const weekMatch = projectId.match(/project-(\d+)/)
    if (!weekMatch) {
      return NextResponse.json({ error: 'Invalid project ID format' }, { status: 400 })
    }

    const weekNumber = weekMatch[1].padStart(2, '0')
    
    // Ensure thumbnails directory exists
    const thumbnailsDir = path.join(process.cwd(), 'public', 'images', 'thumbnails')
    if (!existsSync(thumbnailsDir)) {
      await mkdir(thumbnailsDir, { recursive: true })
    }

    // Get existing files for this week to determine next number
    const files = existsSync(thumbnailsDir)
      ? await readdir(thumbnailsDir)
      : []
    
    // Find the next available filename
    let filename = `${weekNumber}.webp`
    let counter = 1
    
    // Check if base file exists, if so, use numbered version
    if (files.includes(filename)) {
      // Find the highest number for this week
      const weekFiles = files.filter(f => f.startsWith(`${weekNumber}-`) && f.endsWith('.webp'))
      if (weekFiles.length > 0) {
        const numbers = weekFiles.map(f => {
          const match = f.match(/-(\d+)\.webp$/)
          return match ? parseInt(match[1]) : 0
        })
        counter = Math.max(...numbers) + 1
      }
      filename = `${weekNumber}-${counter}.webp`
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    const filePath = path.join(thumbnailsDir, filename)
    await writeFile(filePath, buffer)

    // Return the public path
    const publicPath = `/images/thumbnails/${filename}`

    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      filename 
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
