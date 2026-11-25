import clubsData from './clubs.json'

export interface ClubStatEntry {
  id: string
  name: string
  type: 'Wood' | 'Iron' | 'Wedge' | 'Putter'
  category?: 'Wood' | 'Iron' | 'Wedge' | 'Putter'
  range: [number, number]
  dist?: [number, number]
  scatter: number
  ability: string | null
}

const clubStats = (clubsData as ClubStatEntry[]).map((club) => ({
  ...club,
  category: club.category ?? club.type,
  range: (club.range ?? club.dist ?? [0, 0]) as [number, number],
  dist: (club.dist ?? club.range ?? [0, 0]) as [number, number],
}))

const lookup = new Map(clubStats.map((club) => [String(club.id).toLowerCase(), club]))

export function getClubStats(id: string): ClubStatEntry | undefined {
  if (!id) return undefined
  return lookup.get(String(id).toLowerCase())
}

export default clubStats
