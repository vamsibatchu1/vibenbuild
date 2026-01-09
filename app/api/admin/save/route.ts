import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Project } from '@/types/project'

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json() as { projects: Project[] }

    // Validate the data structure
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Validate each project has required fields
    for (const project of projects) {
      if (!project.id || !project.title || typeof project.week !== 'number' || typeof project.year !== 'number') {
        return NextResponse.json({ error: 'Invalid project data' }, { status: 400 })
      }
    }

    // Write to projects.json
    const filePath = path.join(process.cwd(), 'data', 'projects.json')
    await writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving projects:', error)
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 })
  }
}
