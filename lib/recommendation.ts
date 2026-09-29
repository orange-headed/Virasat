import { HeritageItem, dnaDefaults } from './heritage-data'

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
