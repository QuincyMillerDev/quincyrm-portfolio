export interface HobbyStats {
  label: string
  value: string
  icon?: string
  url?: string
}

export interface HobbyLink {
  url: string
  label: string
}

export interface Hobby {
  id: string
  name: string
  icon: string
  description: string
  stats?: HobbyStats[]
  colorHue: number
  accentColorHex: string
  link?: HobbyLink
  chatSuggestion?: string
} 