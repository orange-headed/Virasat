import { HeritageItem } from '@/lib/heritage-data'

export function getCompanionResponse({ intent, contextItem, currentScreen }: { intent: string, contextItem?: HeritageItem | null, currentScreen: string }) {
  const intentLower = intent.toLowerCase()

  if (currentScreen === 'Map') {
    if (intentLower.includes('near')) return "Tap 'Locate me' on the map to find heritage places near your location."
    return "Explore the map to see how cultural practices and architecture spread across India."
  }
  
  if (currentScreen === 'Heritage DNA') {
    if (intentLower.includes('why') || intentLower.includes('recommendation')) {
      return "Your Heritage DNA shapes your recommendations. We look at your interests in architecture, stories, and traditions to highlight places you might love."
    }
    return "Tune your sliders to adjust your cultural compass. It helps us personalize your journey."
  }

  if (currentScreen === 'Journey') {
    return "This is your cultural journey. You can add places you discover to build a meaningful exploration, rather than just a checklist."
  }

  if (!contextItem) {
    return "I am Virasat's cultural companion. I can help you understand the context of the places you explore. Tap on a heritage place to ask me specific questions!"
  }
  
  if (intentLower.includes('story') || intentLower.includes('history')) {
    return contextItem.description ? contextItem.description : "Virasat's current prototype does not yet have a verified story for this heritage item."
  }
  
  if (intentLower.includes('built') || intentLower.includes('architecture')) {
    if (contextItem.category === 'Architecture' || contextItem.tags?.includes('Architecture')) {
      return contextItem.significance || "Virasat's current prototype does not yet have a verified construction record for this heritage item."
    }
    return "This heritage is primarily recognized for its cultural and historical significance rather than its physical construction."
  }
  
  if (intentLower.includes('important') || intentLower.includes('significance')) {
    return contextItem.significance || "Virasat's current prototype does not yet have a verified record for its cultural importance."
  }
  
  return `I'm a prototype companion. I can tell you about the story, architecture, or cultural significance of ${contextItem.name} based on curated local data.`
}
