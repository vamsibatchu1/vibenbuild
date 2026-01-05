export type ViewType = 'cards' | 'list' | 'gallery' | 'timeline'

export interface ViewConfig {
  id: ViewType
  label: string
  icon?: string
}

