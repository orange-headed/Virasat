import { HeritageItem, dnaDefaults } from './heritage-data'

export type ActionType = 
  | 'VIEW' 
  | 'OPEN_DETAIL' 
  | 'READ_STORY' 
  | 'VIEW_ARCHITECTURE' 
  | 'VIEW_CRAFT' 
  | 'VIEW_FOOD' 
  | 'VIEW_TRADITION' 
  | 'VIEW_MUSIC' 
  | 'SAVE' 
  | 'UNSAVE' 
  | 'ADD_TO_JOURNEY' 
  | 'REMOVE_FROM_JOURNEY' 
  | 'SEARCH'

const actionWeights: Record<ActionType, number> = {
  VIEW: 0.5,
  OPEN_DETAIL: 1.0,
  READ_STORY: 3.0,
  VIEW_ARCHITECTURE: 3.0,
  VIEW_CRAFT: 3.0,
  VIEW_FOOD: 3.0,
  VIEW_TRADITION: 3.0,
  VIEW_MUSIC: 3.0,
  SAVE: 5.0,
  UNSAVE: -2.0,
  ADD_TO_JOURNEY: 7.0,
  REMOVE_FROM_JOURNEY: -3.0,
  SEARCH: 2.0
}

const LEARNING_RATE = 0.15

export function calculateNewDNA(
  currentDNA: Record<string, number>,
  itemDNA: Record<string, number>,
  action: ActionType
): Record<string, number> {
  const weight = actionWeights[action] || 1.0
  const effectiveLearningRate = LEARNING_RATE * (Math.abs(weight) / 5) // Normalize roughly around SAVE
  const multiplier = weight >= 0 ? 1 : -1 // Handle negative actions by moving away

  const newDNA = { ...currentDNA }

  for (const key of Object.keys(dnaDefaults)) {
    if (itemDNA[key] !== undefined) {
      const difference = itemDNA[key] - currentDNA[key]
      const change = difference * effectiveLearningRate * multiplier
      let nextValue = currentDNA[key] + change
      
      // Clamp between 0 and 100
      nextValue = Math.max(0, Math.min(100, nextValue))
      newDNA[key] = Math.round(nextValue)
    }
  }

  return newDNA
}

export type RecommendationResult = {
  item: HeritageItem
  score: number
  matchedCategories: string[]
  reasons: string[]
}

export function getRecommendedHeritage(
  heritageItems: HeritageItem[],
  dna: Record<string, number>,
  limit = 3
): RecommendationResult[] {
  const scoredItems = heritageItems.map(item => {
    let totalScore = 0
    let maxPossibleScore = 0
    const matchedCategories: { category: string, score: number }[] = []

    for (const key of Object.keys(dnaDefaults)) {
      const userVal = dna[key] || 0
      const itemVal = item.dnaProfile?.[key] || 0
      
      // We weight the match by user preference
      const matchComponent = (userVal / 100) * (itemVal / 100) * 100
      totalScore += matchComponent
      maxPossibleScore += (userVal / 100) * 100

      if (userVal > 60 && itemVal > 70) {
        matchedCategories.push({ category: key, score: matchComponent })
      }
    }

    const normalizedScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 50
    matchedCategories.sort((a, b) => b.score - a.score)
    const topMatches = matchedCategories.slice(0, 2).map(c => c.category)

    const reasons = topMatches.length > 0 
      ? [`Matches your interest in ${topMatches.join(' and ').toLowerCase()}`]
      : ['A great place to start your exploration']

    return {
      item,
      score: normalizedScore,
      matchedCategories: topMatches,
      reasons
    }
  })

  // Sort by score descending
  scoredItems.sort((a, b) => b.score - a.score)
  
  return scoredItems.slice(0, limit)
}
