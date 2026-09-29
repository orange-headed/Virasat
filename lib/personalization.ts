import { HeritageItem, dnaDefaults } from './heritage-data'

export type InteractionAction = 
  | 'OPEN_DETAIL' 
  | 'READ_STORY' 
  | 'VIEW_ARCHITECTURE' 
  | 'VIEW_CRAFT' 
  | 'VIEW_FOOD' 
  | 'VIEW_TRADITION' 
  | 'VIEW_MUSIC' 
  | 'SEARCH'
  | 'VIEW'

export type InteractionEvent = {
  id: string
  action: InteractionAction
  timestamp: number
}

// 1. Initial DNA is purely 0.
export const getInitialDNA = (): Record<string, number> => ({ ...dnaDefaults })

// 2. Define clear, deterministic rules for what each action produces.
const ACTION_EFFECTS: Record<InteractionAction, { dimension: string, amount: number }[]> = {
  VIEW: [],
  OPEN_DETAIL: [], 
  READ_STORY: [{ dimension: 'Stories', amount: 5 }],
  VIEW_ARCHITECTURE: [{ dimension: 'Architecture', amount: 5 }],
  VIEW_CRAFT: [{ dimension: 'Crafts', amount: 5 }],
  VIEW_FOOD: [{ dimension: 'Food', amount: 5 }],
  VIEW_TRADITION: [{ dimension: 'Traditions', amount: 5 }],
  VIEW_MUSIC: [{ dimension: 'Music', amount: 5 }],
  SEARCH: [] 
}

// Helper: Get top N dimensions from a heritage item's profile
export function getTopDimensions(profile: Record<string, number>, count: number) {
  return Object.entries(profile)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(e => e[0])
}

// 4. The pure derivation function.
export function deriveDNAFromBehavior(
  history: InteractionEvent[],
  savedIds: string[],
  journeyIds: string[],
  items: HeritageItem[]
): Record<string, number> {
  const dna = getInitialDNA()

  // Safe addition with clamping 0-100
  const addPoints = (dimension: string, amount: number) => {
    if (dna[dimension] !== undefined) {
      dna[dimension] = Math.min(100, Math.max(0, dna[dimension] + amount))
    }
  }

  // A. Process Raw Passive History (chronologically)
  for (let i = history.length - 1; i >= 0; i--) {
    const event = history[i]
    
    // Exact mapping for direct interaction signals
    const effects = ACTION_EFFECTS[event.action]
    if (effects) {
      for (const effect of effects) {
        addPoints(effect.dimension, effect.amount)
      }
    }
    
    // Generic interest signal for opening/searching
    if (event.action === 'OPEN_DETAIL' || event.action === 'SEARCH') {
      const item = items.find(it => it.id === event.id)
      if (item && item.dnaProfile) {
        const top = getTopDimensions(item.dnaProfile, 1)
        if (top.length > 0) addPoints(top[0], 2) // small +2 to its most prominent trait
      }
    }
  }

  // B. Process Active SAVED states
  for (const id of savedIds) {
    const item = items.find(it => it.id === id)
    if (item && item.dnaProfile) {
      // Controlled bump: +15 to the item's top 2 defining characteristics
      const topDimensions = getTopDimensions(item.dnaProfile, 2)
      for (const dim of topDimensions) {
        addPoints(dim, 15)
      }
    }
  }

  // C. Process Active JOURNEY states
  for (const id of journeyIds) {
    const item = items.find(it => it.id === id)
    if (item && item.dnaProfile) {
      // Strong bump: +20 to top 2 characteristics
      const topDimensions = getTopDimensions(item.dnaProfile, 2)
      for (const dim of topDimensions) {
        addPoints(dim, 20)
      }
    }
  }

  return dna
}
