import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('video') as File
    const experimentId = formData.get('experimentId') as string

    if (!file || !experimentId) {
      return NextResponse.json({ error: 'Missing file or experimentId' }, { status: 400 })
    }

    // Extract experiment number from ID (e.g., 'exp-01' -> '01')
    const expNumber = experimentId.replace('exp-', '')
    
    // Ensure videos directory exists
    const videosDir = path.join(process.cwd(), 'public', 'videos', 'experiments2')
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true })
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop() || 'mp4'
    
    // Read the file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file with experiment number as filename
    const fileName = `${expNumber}.${fileExtension}`
    const filePath = path.join(videosDir, fileName)
    await writeFile(filePath, buffer)

    const videoPath = `/videos/experiments2/${fileName}`

    return NextResponse.json({ 
      path: videoPath,
      fileName: fileName
    })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 })
  }
}
