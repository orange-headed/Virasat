export type HeritageCategory = 'Architecture' | 'Ancient Stories' | 'Crafts' | 'Food Heritage' | 'Folk Arts' | 'Festivals' | 'Traditional Music' | 'Living Traditions'

export type HeritageItem = {
  id: string
  name: string
  location: string
  state: string
  category: HeritageCategory
  description: string
  significance: string
  image: string
  tags: string[]
  match: number
  coordinates: [number, number]
}

export type CulturalPerson = {
  id: string
  name: string
  role: string
  location: string
  years: string
  image: string
  offering: string
}

export const categories: { label: HeritageCategory; icon: string; color: string }[] = [
  { label: 'Architecture', icon: '⌂', color: 'bg-[#E8E1D4]' },
  { label: 'Ancient Stories', icon: '◌', color: 'bg-[#E6DED7]' },
  { label: 'Crafts', icon: '✦', color: 'bg-[#E8DDD4]' },
  { label: 'Food Heritage', icon: '♨', color: 'bg-[#EDE3D0]' },
  { label: 'Folk Arts', icon: '◒', color: 'bg-[#E0E5DF]' },
  { label: 'Festivals', icon: '✺', color: 'bg-[#E6E0E8]' },
  { label: 'Traditional Music', icon: '♫', color: 'bg-[#DBE4E2]' },
  { label: 'Living Traditions', icon: '∞', color: 'bg-[#E5E4D7]' },
]

export const heritageItems: HeritageItem[] = [
  { id: 'chettinad', name: 'Chettinad Heritage', location: 'Karaikudi, Tamil Nadu', state: 'Tamil Nadu', category: 'Architecture', description: 'A living world of courtyards, craft and cuisine shaped by the Nattukottai Chettiar community.', significance: 'Chettinad homes are cultural archives — their materials, spatial rituals and foodways carry stories across generations.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Food Heritage', 'Living Traditions'], match: 92, coordinates: [10.07, 78.78] },
  { id: 'hampi', name: 'Hampi: Stones That Speak', location: 'Vijayanagara, Karnataka', state: 'Karnataka', category: 'Ancient Stories', description: 'Monumental landscapes where temple streets, boulders and river rituals hold the memory of an empire.', significance: 'Hampi reveals how architecture, trade, devotion and ecology were woven into one cultural landscape.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Ancient Stories'], match: 88, coordinates: [15.335, 76.46] },
  { id: 'pattachitra', name: 'Pattachitra Storytelling', location: 'Raghurajpur, Odisha', state: 'Odisha', category: 'Crafts', description: 'A village where painted cloth becomes a stage for epics, devotion and everyday life.', significance: 'The chitrakara tradition is a form of visual storytelling passed through family workshops.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Ancient Stories'], match: 84, coordinates: [19.89, 85.83] },
  { id: 'majuli', name: 'Majuli & the Mask Makers', location: 'Majuli, Assam', state: 'Assam', category: 'Folk Arts', description: 'Satras, bamboo and expressive masks keep the stories of Bhaona theatre alive on the river island.', significance: 'This living performance culture connects craft, music, community and spiritual practice.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Folk Arts', 'Traditional Music'], match: 81, coordinates: [27.0, 94.22] },
]

export const people: CulturalPerson[] = [
  { id: 'meena', name: 'Meena Chettiar', role: 'Heritage storyteller', location: 'Karaikudi, Tamil Nadu', years: '20 years preserving oral histories', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', offering: 'Courtyard stories & traditional kitchen' },
  { id: 'ramesh', name: 'Ramesh Chitrakar', role: 'Pattachitra artisan', location: 'Raghurajpur, Odisha', years: 'Third-generation practitioner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', offering: 'Painted stories workshop' },
  { id: 'anjali', name: 'Anjali Saikia', role: 'Folk arts researcher', location: 'Majuli, Assam', years: '12 years with Sattriya communities', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', offering: 'Mask-making & Bhaona theatre' },
]

export const dnaDefaults = { Architecture: 78, Stories: 72, Crafts: 48, Food: 66, Music: 42, Traditions: 61 }

export function recommendHeritage(dna: Record<string, number>, items = heritageItems) {
  return [...items].sort((a, b) => (b.match + (dna[a.category] ?? 50) / 5) - (a.match + (dna[b.category] ?? 50) / 5))
}

export const journey = [
  { day: 'Day 1', title: 'Read the courtyard', time: 'Morning', detail: 'Ancient architecture · Chettinad', note: 'Notice how the thinnai, courtyard and kitchen turn a home into a social map.' },
  { day: 'Day 1', title: 'Hands that remember', time: 'Afternoon', detail: 'Craft tradition · Athangudi', note: 'Meet tile-makers keeping geometric patterns alive through hand-poured pigments.' },
  { day: 'Day 1', title: 'A table of memory', time: 'Evening', detail: 'Food heritage · Karaikudi', note: 'Taste recipes where trade routes, seasonal ingredients and ritual meet.' },
]

export const assistantPrompts = ['Tell me the story behind this place', 'How was this built?', 'Find heritage similar to this', 'Explain this tradition']

export const getHeritageById = (id: string) => heritageItems.find((item) => item.id === id) ?? heritageItems[0]
export const getDistance = (a: [number, number], b: [number, number]) => Math.round(Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) * 111)

export type SavedItem = { id: string; type: 'heritage' | 'person' | 'story'; title: string; subtitle: string }
export type JourneyStop = (typeof journey)[number]
export type Recommendation = HeritageItem
export type ArchitectureInfo = { technique: string; material: string; source?: string }
export type HeritageStory = { title: string; text: string; source?: string }
export type Tradition = { name: string; description: string; source?: string }
export type Experience = { id: string; title: string; hostId: string; duration: string }
export type UserHeritageDNA = typeof dnaDefaults
export type CulturalPersonModel = CulturalPerson
export type HeritageItemModel = HeritageItem
export type HeritageCategoryModel = HeritageCategory
export type SavedItemModel = SavedItem
export type Journey = JourneyStop[]
export type RecommendationModel = Recommendation
export type Coordinates = [number, number]
export type SourceReference = { label: string; url: string }
export type CulturalImpact = { label: string; value: string }
export type MapMarker = HeritageItem
export type Profile = { name: string; city: string }
export type CompanionMessage = { role: 'user' | 'assistant'; content: string }
export type SearchResult = HeritageItem
export type Filter = HeritageCategory | 'All'
export type DNAKey = keyof typeof dnaDefaults
export type DataStatus = 'demo' | 'verified' | 'needs-review'
export type HeritageSection = 'significance' | 'architecture' | 'history' | 'stories' | 'traditions' | 'people' | 'experiences'
export type ServiceBoundary = { baseUrl: string; getHeritage: (id: string) => Promise<HeritageItem> }
export const backendServiceBoundary: ServiceBoundary = { baseUrl: '/api', getHeritage: async (id) => getHeritageById(id) }
export const sources: SourceReference[] = [{ label: 'Demo content — sources will be attached in the curated dataset', url: '#' }]
export const dataStatus: DataStatus = 'demo'
export const culturalImpact: CulturalImpact[] = [{ label: 'Community-led', value: 'Local knowledge first' }, { label: 'Respectful', value: 'Learn before you visit' }]
export const profile: Profile = { name: 'Aarav', city: 'Bengaluru' }
export const filters: Filter[] = ['All', ...categories.map((category) => category.label)]
export const mapMarkers: MapMarker[] = heritageItems
export const defaultCoordinates: Coordinates = [20.59, 78.96]
export const exampleArchitecture: ArchitectureInfo = { technique: 'Lime plaster, teak columns and climate-conscious courtyard planning', material: 'Locally fired tile, lime, wood and stone', source: 'Demo summary — curator references to be added' }
export const exampleStory: HeritageStory = { title: 'A home shaped like a journey', text: 'The long sequence of thresholds in a Chettinad house was not only architectural. It choreographed welcome, work, ritual and rest.', source: 'Demo narrative — verify against curated sources' }
export const exampleTradition: Tradition = { name: 'The shared courtyard', description: 'A place for food, festivals, conversations and the everyday work of keeping memory alive.', source: 'Demo narrative — verify against curated sources' }
export const experience: Experience = { id: 'courtyard', title: 'A morning inside a living Chettinad home', hostId: 'meena', duration: '2 hours' }
export const recommendationReason = 'Architecture + Stories + Food'
export const companionIntro = 'I can help you explore the cultural context here. I’ll distinguish demo narratives from verified references as Samskara grows.'
export const appName = 'Samskara'
export const appTagline = 'India, understood through its living heritage.'
export const navItems = ['Discover', 'Map', 'Journey', 'Saved', 'Heritage DNA'] as const
export type NavItem = (typeof navItems)[number]
export const emptySavedCopy = 'Save places, stories, people and traditions as you explore.'
export const locationLabel = 'Near Bengaluru'
export const locationCoordinates: Coordinates = [12.97, 77.59]
export const primaryAccent = '#A85735'
export const darkAccent = '#233E3A'
export const warmSurface = '#F4EFE7'
export const ink = '#172522'
export const mutedInk = '#68736E'
export const mapBounds = { north: 32, south: 8, east: 96, west: 68 }
export const journeyTitle = 'A day in Chettinad'
export const journeySubtitle = 'A cultural exploration, not a checklist.'
export const savedTypes = ['Places', 'Stories', 'People'] as const
export type SavedType = (typeof savedTypes)[number]
export const verifiedNotice = 'Cultural notes are demo content for this prototype. References will be attached before public release.'
export const footerText = 'Built to make heritage legible, living and local.'
export const appVersion = 'Prototype 01'
export const placeholderImage = '/placeholder.jpg'
export const mapLegend = ['Architecture', 'Crafts', 'Food Heritage', 'Folk Arts']
export const nearbyTitle = 'Nearby heritage'
export const nearbyDescription = 'Begin close to home. There is always more culture than a landmark.'
export const lessKnownTitle = 'Less-known, deeply rooted'
export const storyTitle = 'Stories that stay with you'
export const peopleTitle = 'Meet the people behind the heritage'
export const dnaTitle = 'Your Heritage DNA'
export const savedTitle = 'Your saved heritage'
export const mapTitle = 'Find culture, not just coordinates'
export const companionTitle = 'Ask the cultural companion'
export const profileTitle = 'Your Samskara profile'
export const detailBackLabel = 'Back to discovery'
export const categoriesTitle = 'Explore by cultural lens'
export const recommendationTitle = 'Picked for your Heritage DNA'
export const recommendationDescription = 'A living world of architecture, cuisine and memory.'
export const defaultSearch = ''
export const initialTab = 'Discover'
export const maxSavedItems = 50
export const maxSearchResults = 12
export const isPrototype = true
export const futureApiPath = '/api/heritage'
export const futureDatabase = 'PostgreSQL via Prisma'
export const futureBackend = 'Express service boundary'
export const futureAuth = 'Not enabled in prototype'
export const futurePayments = 'Not enabled in prototype'
export const futureMapProvider = 'Provider-agnostic coordinate model'
export const futureAI = 'Structured companion over curated records'
export const futureGeolocation = 'navigator.geolocation'
export const futurePersistence = 'LocalStorage for demo only'
export const noBookingLanguage = 'Explore respectfully'
export const demoOnly = true
export const version = 1
export const data = { categories, heritageItems, people, journey }
export default data
