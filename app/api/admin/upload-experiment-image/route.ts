import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readdir, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const experimentId = formData.get('experimentId') as string

    if (!file || !experimentId) {
      return NextResponse.json({ error: 'Missing file or experimentId' }, { status: 400 })
    }

    // Extract experiment number from ID (e.g., 'exp-01' -> '01')
    const expNumber = experimentId.replace('exp-', '')
    
    // Ensure experiments2 directory exists
    const experimentsDir = path.join(process.cwd(), 'public', 'images', 'experiments2')
    if (!existsSync(experimentsDir)) {
      await mkdir(experimentsDir, { recursive: true })
    }

    // Get existing files for this experiment
    const files = existsSync(experimentsDir)
      ? await readdir(experimentsDir)
      : []
    
    // Find the next available image number (01, 02, 03, etc.)
    const experimentFiles = files.filter(f => f.startsWith(`${expNumber}-`) && f.endsWith('.webp'))
    let imageNumber = 1
    
    if (experimentFiles.length > 0) {
      // Find the highest number
      const numbers = experimentFiles.map(f => {
        const match = f.match(/-(\d+)\.webp$/)
        return match ? parseInt(match[1]) : 0
      })
      imageNumber = Math.max(...numbers) + 1
    }

    // Read the file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file with the determined image number
    const imgNumber = String(imageNumber).padStart(2, '0')
    const filePath = path.join(experimentsDir, `${expNumber}-${imgNumber}.webp`)
    await writeFile(filePath, buffer)

    const imagePath = `/images/experiments2/${expNumber}-${imgNumber}.webp`

    return NextResponse.json({ 
      path: imagePath,
      imageIndex: imageNumber - 1 // Return 0-based index for the images array
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
