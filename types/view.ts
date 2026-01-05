export type ViewType = 'cards' | 'list' | 'gallery' | 'timeline' | 'tags'

export interface ViewConfig {
  id: ViewType
  label: string
  icon?: string
}

