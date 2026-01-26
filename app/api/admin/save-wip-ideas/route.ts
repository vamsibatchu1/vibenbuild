import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { ideas } = await request.json() as { ideas: string[] }

    if (!Array.isArray(ideas)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    for (const idea of ideas) {
      if (typeof idea !== 'string') {
        return NextResponse.json({ error: 'All ideas must be strings' }, { status: 400 })
      }
    }

    const filePath = path.join(process.cwd(), 'app', 'allexperiments', 'wip-ideas.json')
    await writeFile(filePath, JSON.stringify(ideas, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving WIP ideas:', error)
    return NextResponse.json({ error: 'Failed to save WIP ideas' }, { status: 500 })
  }
}
