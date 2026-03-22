import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('thumb') as File
    const experimentId = formData.get('experimentId') as string

    if (!file || !experimentId) {
      return NextResponse.json({ error: 'Missing file or experimentId' }, { status: 400 })
    }

    // Extract experiment number from ID (e.g., 'exp-01' -> '01')
    const expNumber = experimentId.replace('exp-', '')
    
    // Ensure thumbnails directory exists
    const thumbDir = path.join(process.cwd(), 'public', 'videos', 'thumbnails')
    if (!existsSync(thumbDir)) {
      await mkdir(thumbDir, { recursive: true })
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop() || 'mp4'
    
    // Read the file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file with experiment number + thumb suffix as filename
    const fileName = `${expNumber}_thumb.${fileExtension}`
    const filePath = path.join(thumbDir, fileName)
    await writeFile(filePath, buffer)

    const videoPath = `/videos/thumbnails/${fileName}`

    return NextResponse.json({ 
      path: videoPath,
      fileName: fileName
    })
  } catch (error) {
    console.error('Error uploading thumbnail video:', error)
    return NextResponse.json({ error: 'Failed to upload thumbnail video' }, { status: 500 })
  }
}
