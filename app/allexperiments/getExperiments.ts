import { cache } from 'react'
import experimentsData from './experiments.json'

export interface Experiment {
  id: string
  title: string
  tags: string[]
  tokens: number
  link: string
  text: string
  images: number[]
}

/**
 * Gets all experiments from experiments.json
 * Uses React cache to ensure this only runs once per request.
 */
export async function getExperiments(): Promise<Experiment[]> {
  return experimentsData as Experiment[]
}
