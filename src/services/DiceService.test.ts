import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  roll2d6,
  rollD12,
  getShotResult,
  getScatterLabel,
  getPowerLabel,
  WOOD_POWER_TABLE,
  IRON_POWER_TABLE,
  SCATTER_TABLE,
} from './DiceService'
import type { Club } from '../types/club'

const woodClub: Club = {
  id: 'dr',
  name: 'Driver',
  type: 'Wood',
  dist: [12, 15],
  scatter: 2,
  ability: null,
}

const ironClub: Club = {
  id: '5i',
  name: '5-Iron',
  type: 'Iron',
  dist: [7, 7],
  scatter: 1,
  ability: null,
}

const noScatterClub: Club = {
  id: '7i',
  name: '7-Iron',
  type: 'Iron',
  dist: [5, 5],
  scatter: 0,
  ability: null,
}

const wedgeClub: Club = {
  id: 'pw',
  name: 'Pitching Wedge',
  type: 'Wedge',
  dist: [2, 3],
  scatter: 0,
  ability: null,
}

describe('roll2d6', () => {
  it('returns a value between 2 and 12', () => {
    for (let i = 0; i < 100; i++) {
      const result = roll2d6()
      expect(result).toBeGreaterThanOrEqual(2)
      expect(result).toBeLessThanOrEqual(12)
    }
  })

  it('returns an integer', () => {
    const result = roll2d6()
    expect(Number.isInteger(result)).toBe(true)
  })

  it('can produce a roll of 2 (snake eyes)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(roll2d6()).toBe(2)
    vi.restoreAllMocks()
  })

  it('can produce a roll of 12 (boxcars)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    expect(roll2d6()).toBe(12)
    vi.restoreAllMocks()
  })
})

describe('rollD12', () => {
  it('returns a value between 1 and 12', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollD12()
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(12)
    }
  })

  it('returns an integer', () => {
    const result = rollD12()
    expect(Number.isInteger(result)).toBe(true)
  })

  it('can produce a roll of 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(rollD12()).toBe(1)
    vi.restoreAllMocks()
  })

  it('can produce a roll of 12', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999)
    expect(rollD12()).toBe(12)
    vi.restoreAllMocks()
  })
})

describe('WOOD_POWER_TABLE', () => {
  it('has entries for all 2d6 results (2–12)', () => {
    for (let roll = 2; roll <= 12; roll++) {
      expect(WOOD_POWER_TABLE[roll]).toBeDefined()
    }
  })

  it('maps roll 7 (Standard) to 0', () => {
    expect(WOOD_POWER_TABLE[7]).toBe(0)
  })

  it('maps roll 2 to -6 hexes', () => {
    expect(WOOD_POWER_TABLE[2]).toBe(-6)
  })

  it('maps roll 12 to +6 hexes', () => {
    expect(WOOD_POWER_TABLE[12]).toBe(6)
  })

  it('is strictly increasing from roll 2 to roll 12', () => {
    for (let roll = 3; roll <= 12; roll++) {
      expect(WOOD_POWER_TABLE[roll]).toBeGreaterThanOrEqual(WOOD_POWER_TABLE[roll - 1])
    }
  })
})

describe('IRON_POWER_TABLE', () => {
  it('has entries for all 2d6 results (2–12)', () => {
    for (let roll = 2; roll <= 12; roll++) {
      expect(IRON_POWER_TABLE[roll]).toBeDefined()
    }
  })

  it('maps roll 7 (Standard) to 0', () => {
    expect(IRON_POWER_TABLE[7]).toBe(0)
  })

  it('has a narrower range than the Wood table', () => {
    const woodRange = WOOD_POWER_TABLE[12] - WOOD_POWER_TABLE[2]
    const ironRange = IRON_POWER_TABLE[12] - IRON_POWER_TABLE[2]
    expect(ironRange).toBeLessThan(woodRange)
  })
})

describe('SCATTER_TABLE', () => {
  it('has entries for all d12 results (1–12)', () => {
    for (let roll = 1; roll <= 12; roll++) {
      expect(SCATTER_TABLE[roll]).toBeDefined()
    }
  })

  it('maps roll 11 to +2 hexes (Slice) per RULES.md', () => {
    expect(SCATTER_TABLE[11]).toBe(2)
  })

  it('maps roll 6 and 7 to 0 (Straight)', () => {
    expect(SCATTER_TABLE[6]).toBe(0)
    expect(SCATTER_TABLE[7]).toBe(0)
  })

  it('maps roll 1 to -3 hexes (Heavy Hook)', () => {
    expect(SCATTER_TABLE[1]).toBe(-3)
  })

  it('maps roll 12 to +3 hexes (Shank)', () => {
    expect(SCATTER_TABLE[12]).toBe(3)
  })
})

describe('getScatterLabel', () => {
  it('labels -3 as Heavy Hook', () => {
    expect(getScatterLabel(-3)).toBe('Heavy Hook')
  })

  it('labels -2 as Hook', () => {
    expect(getScatterLabel(-2)).toBe('Hook')
  })

  it('labels -1 as Draw', () => {
    expect(getScatterLabel(-1)).toBe('Draw')
  })

  it('labels 0 as Straight', () => {
    expect(getScatterLabel(0)).toBe('Straight')
  })

  it('labels +1 as Fade', () => {
    expect(getScatterLabel(1)).toBe('Fade')
  })

  it('labels +2 as Slice', () => {
    expect(getScatterLabel(2)).toBe('Slice')
  })

  it('labels +3 as Shank', () => {
    expect(getScatterLabel(3)).toBe('Shank')
  })
})

describe('getPowerLabel', () => {
  it('labels 0 as Standard', () => {
    expect(getPowerLabel(0)).toBe('Standard')
  })

  it('labels positive offsets appropriately', () => {
    expect(getPowerLabel(1)).toBe('Long')
    expect(getPowerLabel(2)).toBe('Long')
    expect(getPowerLabel(4)).toBe('Big Drive')
    expect(getPowerLabel(6)).toBe('Bomb')
  })

  it('labels negative offsets appropriately', () => {
    expect(getPowerLabel(-1)).toBe('Short')
    expect(getPowerLabel(-3)).toBe('Flub')
    expect(getPowerLabel(-6)).toBe('Dub')
  })
})

describe('getShotResult', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the correct clubId', () => {
    const result = getShotResult(woodClub, 7, 6)
    expect(result.clubId).toBe('dr')
  })

  it('returns the power roll unchanged', () => {
    const result = getShotResult(woodClub, 9, 6)
    expect(result.powerRoll).toBe(9)
  })

  it('uses the Wood power table for Wood clubs', () => {
    const result = getShotResult(woodClub, 2, 7)
    expect(result.powerOffset).toBe(WOOD_POWER_TABLE[2])
  })

  it('uses the Iron power table for Iron clubs', () => {
    const result = getShotResult(ironClub, 2, 7)
    expect(result.powerOffset).toBe(IRON_POWER_TABLE[2])
  })

  it('uses the Iron power table for Wedge clubs', () => {
    const result = getShotResult(wedgeClub, 12, 7)
    expect(result.powerOffset).toBe(IRON_POWER_TABLE[12])
  })

  it('maps scatter roll 11 to +2 lateral offset for club with scatter', () => {
    const result = getShotResult(woodClub, 7, 11)
    expect(result.scatterRoll).toBe(11)
    expect(result.scatterOffset).toBe(2)
  })

  it('sets scatterRoll to null for clubs with scatter === 0', () => {
    const result = getShotResult(noScatterClub, 7, 11)
    expect(result.scatterRoll).toBeNull()
    expect(result.scatterOffset).toBe(0)
  })

  it('roll 7 produces powerOffset of 0 for Wood clubs (Standard)', () => {
    const result = getShotResult(woodClub, 7, 7)
    expect(result.powerOffset).toBe(0)
  })

  it('roll 7 produces powerOffset of 0 for Iron clubs (Standard)', () => {
    const result = getShotResult(ironClub, 7, 7)
    expect(result.powerOffset).toBe(0)
  })

  it('roll 6/7 scatter produces scatterOffset of 0 (Straight)', () => {
    const result = getShotResult(woodClub, 7, 6)
    expect(result.scatterOffset).toBe(0)
    const result2 = getShotResult(woodClub, 7, 7)
    expect(result2.scatterOffset).toBe(0)
  })
})
