import { cache } from 'react'
import wipIdeasData from './wip-ideas.json'

/**
 * Gets all work in progress ideas from wip-ideas.json
 * Uses React cache to ensure this only runs once per request.
 */
export async function getWipIdeas(): Promise<string[]> {
  return wipIdeasData as string[]
}
