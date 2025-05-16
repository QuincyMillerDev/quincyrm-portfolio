export type TimelineItemType = 'work' | 'education' | 'project' | 'achievement'

export interface TimelineItemData {
  year: string
  title: string
  company?: string
  location?: string
  description: string
  skills?: string[]
  type: TimelineItemType
}

export interface TypeConfig {
  icon: string
  color: string
  border: string
  accentHue: number
  accentColorHex: string
}

export interface SkillColorConfig {
  bg: string
  text: string
  border: string
}

export type TypeConfigMap = Record<string, TypeConfig>
export type SkillColorMap = Record<string, SkillColorConfig> 