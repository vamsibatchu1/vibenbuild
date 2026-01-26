import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { Experiment } from '@/app/allexperiments/getExperiments'

export async function POST(request: NextRequest) {
  try {
    const { experiments } = await request.json() as { experiments: Experiment[] }

    // Validate the data structure
    if (!Array.isArray(experiments)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Validate each experiment has required fields
    for (const experiment of experiments) {
      if (!experiment.id || !experiment.title || typeof experiment.tokens !== 'number') {
        return NextResponse.json({ error: 'Invalid experiment data' }, { status: 400 })
      }
    }

    // Write to experiments.json
    const filePath = path.join(process.cwd(), 'app', 'allexperiments', 'experiments.json')
    await writeFile(filePath, JSON.stringify(experiments, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving experiments:', error)
    return NextResponse.json({ error: 'Failed to save experiments' }, { status: 500 })
  }
}
