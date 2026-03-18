export interface SpecialAbility {
  id: string
  name: string
  effect: string
}

export interface PlayerUI {
  primaryColor: string
  accentColor: string
  icon: string
  hexTheme: string
}

export interface PlayerStats {
  power: number
  accuracy: number
  recovery: number
}

export interface Golfer {
  id: string
  name: string
  initials: string
  archetype: string
  bio: string
  ui: PlayerUI
  stats: PlayerStats
  specialAbilities: SpecialAbility[]
}
