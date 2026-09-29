import { HeritageItem, dnaDefaults } from './heritage-data'

export type RecommendationResult = {
  item: HeritageItem
  score: number
  reasons: string[]
  matchedCategories: string[]
}

export function calculateHeritageMatch(dna: Record<string, number>, items: HeritageItem[]): RecommendationResult[] {
  return items.map(item => {
    const baseScore = item.match || 50;
    const relevantCategories = [item.category, ...(item.tags || [])];
    const uniqueCategories = Array.from(new Set(relevantCategories));
    
    let dnaBoost = 0;
    let reasons: string[] = [];
    let matchedCategories: string[] = [];

    uniqueCategories.forEach(cat => {
      const userInterest = dna[cat] ?? dnaDefaults[cat as keyof typeof dnaDefaults] ?? 50;
      if (userInterest > 70) {
        dnaBoost += (userInterest - 50) * 0.5;
        matchedCategories.push(cat);
      } else if (userInterest > 50) {
        dnaBoost += (userInterest - 50) * 0.2;
        matchedCategories.push(cat);
      }
    });

    if (matchedCategories.length > 1) {
      reasons = [`Because you enjoy ${matchedCategories.join(' + ')}`];
    } else if (matchedCategories.length === 1) {
      reasons = [`A great fit for your interest in ${matchedCategories[0]}`];
    } else {
      reasons = ['Popular heritage destination'];
    }

    const score = Math.min(100, Math.round(baseScore * 0.6 + dnaBoost));

    return {
      item,
      score,
      reasons,
      matchedCategories
    }
  }).sort((a, b) => b.score - a.score);
}
