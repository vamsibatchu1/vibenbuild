export type ViewType = 'cards' | 'list' | 'gallery' | 'graph' | 'tags'

export interface ViewConfig {
  id: ViewType
  label: string
  icon?: string
}

