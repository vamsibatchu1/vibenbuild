export type ViewType = 'cards' | 'list' | 'gallery' | 'graph'

export interface ViewConfig {
  id: ViewType
  label: string
  icon?: string
}

