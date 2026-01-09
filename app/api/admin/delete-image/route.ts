import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const { imagePath } = await request.json()

    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 })
    }

    // Validate that the path is within the thumbnails directory for security
    if (!imagePath.startsWith('/images/thumbnails/')) {
      return NextResponse.json({ error: 'Invalid image path' }, { status: 400 })
    }

    // Extract filename from path
    const filename = path.basename(imagePath)
    const filePath = path.join(process.cwd(), 'public', 'images', 'thumbnails', filename)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete the file
    await unlink(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
