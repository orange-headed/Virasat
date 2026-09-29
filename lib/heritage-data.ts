export type HeritageCategory = 'Architecture' | 'Ancient Stories' | 'Crafts' | 'Food Heritage' | 'Folk Arts' | 'Festivals' | 'Traditional Music' | 'Living Traditions'

export type Story = { title: string; summary: string; type: string }
export type ArchitectureData = { style?: string; features?: string[]; materials?: string[]; notableElements?: string[]; description: string }
export type ConstructionData = { summary: string; materials: string[]; techniques: string[]; notableMethods?: string[]; description?: string }
export type TraditionData = { name: string; description: string; tradition?: string; region?: string; significance?: string }
export type LocalPersonData = { name: string; role: string; description: string; type: string }
export type ExperienceData = { title: string; description: string; category: string; duration?: string }
export type SourceData = { title: string; organization: string; url?: string }

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
  dnaProfile: Record<string, number>
  match?: number
  coordinates: [number, number]
  overview?: string
  architecture?: ArchitectureData
  construction?: ConstructionData
  history?: string
  stories?: Story[]
  traditions?: TraditionData[]
  crafts?: TraditionData[]
  foodHeritage?: TraditionData[]
  music?: TraditionData[]
  localPeople?: LocalPersonData[]
  culturalExperiences?: ExperienceData[]
  relatedHeritageIds?: string[]
  sources?: SourceData[]
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

const placeholderText = 'Detailed verified information will be added in the final curated dataset.'

const defaultSources: SourceData[] = [
  { title: 'Virasat Curatorial Database', organization: 'Virasat Heritage Project' }
]

export const heritageItems: HeritageItem[] = [
  { 
    id: 'chettinad', name: 'Chettinad Heritage', location: 'Karaikudi, Tamil Nadu', state: 'Tamil Nadu', category: 'Architecture', 
    description: 'A living world of courtyards, craft and cuisine shaped by the Nattukottai Chettiar community.', 
    significance: 'Chettinad homes are cultural archives — their materials, spatial rituals and foodways carry stories across generations.', 
    image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Food Heritage', 'Living Traditions'], dnaProfile: { Architecture: 95, Stories: 70, Crafts: 80, Food: 90, Music: 20, Traditions: 85 }, coordinates: [10.07, 78.78],
    overview: 'The Chettinad region comprises 70-odd villages famous for their fortress-like palatial homes built by the mercantile Chettiar community.',
    architecture: {
      style: 'Chettinad Vernacular',
      features: ['Thinnai (veranda)', 'Muttram (central courtyard)', 'Athangudi tiles', 'Burma teak pillars'],
      description: 'The homes are designed for cross-ventilation, communal gatherings, and vast storage for trade goods.'
    },
    construction: {
      summary: 'Built using climate-conscious indigenous methods combined with imported luxury materials.',
      materials: ['Lime plaster (karai)', 'Burma teak', 'Italian marble', 'Athangudi tiles'],
      techniques: ['Egg-white lime plastering', 'Hand-poured cement tiles']
    },
    history: 'Constructed predominantly between the 1850s and 1930s, fueled by the maritime trade wealth of the Chettiars across Southeast Asia.',
    stories: [{ title: 'A home shaped like a journey', summary: 'The long sequence of thresholds in a Chettinad house was not only architectural. It choreographed welcome, work, ritual and rest.', type: 'culturalMemory' }],
    foodHeritage: [{ name: 'Chettinad Cuisine', description: 'Renowned for complex spice profiles, star anise, stone flower (kalpasi), and sun-dried meats.', significance: 'Reflects their mercantile travels, integrating Southeast Asian spices into Tamil culinary traditions.' }],
    localPeople: [{ name: 'Local craft practitioners', role: 'Athangudi Tile Makers', description: 'Artisans continuing the hand-poured geometric tile tradition.', type: 'artisan' }],
    culturalExperiences: [{ title: 'Observe Athangudi tile making', description: 'Watch the rhythmic process of pouring liquid colors onto glass to create vibrant tiles.', category: 'Crafts' }],
    relatedHeritageIds: ['chola-bronze', 'thanjavur'],
    sources: defaultSources
  },
  { 
    id: 'hampi', name: 'Hampi: Stones That Speak', location: 'Vijayanagara, Karnataka', state: 'Karnataka', category: 'Ancient Stories', 
    description: 'Monumental landscapes where temple streets, boulders and river rituals hold the memory of an empire.', 
    significance: 'Hampi reveals how architecture, trade, devotion and ecology were woven into one cultural landscape.', 
    image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Ancient Stories'], dnaProfile: { Architecture: 98, Stories: 95, Crafts: 40, Food: 30, Music: 50, Traditions: 75 }, coordinates: [15.335, 76.46],
    overview: 'The spectacular ruins of the 14th-century Vijayanagara Empire, scattered across a surreal boulder-strewn landscape.',
    architecture: {
      style: 'Vijayanagara Dravidian',
      features: ['Musical pillars', 'Stepped tanks', 'Monolithic sculptures', 'Bazaar streets'],
      description: 'Characterized by ornate pillared halls (mandapas), massive gopurams, and seamless integration with the natural granite geography.'
    },
    construction: {
      summary: 'Massive granite blocks fitted together without mortar.',
      materials: ['Local granite', 'Brick', 'Lime mortar (for superstructures)'],
      techniques: ['Interlocking dry masonry', 'Rock-cut carving']
    },
    stories: [{ title: 'The Musical Pillars of Vittala', summary: 'Legend says the intricate granite pillars of the Vittala Temple were carved to resonate with specific musical notes when struck.', type: 'legend' }],
    relatedHeritageIds: ['khajuraho', 'mahabalipuram'],
    sources: defaultSources
  },
  { id: 'pattachitra', name: 'Pattachitra Storytelling', location: 'Raghurajpur, Odisha', state: 'Odisha', category: 'Crafts', description: 'A village where painted cloth becomes a stage for epics, devotion and everyday life.', significance: 'The chitrakara tradition is a form of visual storytelling passed through family workshops.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Ancient Stories'], dnaProfile: { Architecture: 20, Stories: 90, Crafts: 98, Food: 20, Music: 40, Traditions: 85 }, coordinates: [19.89, 85.83], overview: placeholderText, crafts: [{ name: 'Pattachitra', description: 'Cloth-based scroll painting using natural colors.', tradition: 'Chitrakara', region: 'Odisha' }], sources: defaultSources },
  { id: 'majuli', name: 'Majuli & the Mask Makers', location: 'Majuli, Assam', state: 'Assam', category: 'Folk Arts', description: 'Satras, bamboo and expressive masks keep the stories of Bhaona theatre alive on the river island.', significance: 'This living performance culture connects craft, music, community and spiritual practice.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Folk Arts', 'Traditional Music'], dnaProfile: { Architecture: 40, Stories: 85, Crafts: 90, Food: 40, Music: 85, Traditions: 95 }, coordinates: [27.0, 94.22], overview: placeholderText, traditions: [{ name: 'Satra Culture', description: placeholderText }], sources: defaultSources },
  { id: 'konark', name: 'Konark Sun Temple', location: 'Puri, Odisha', state: 'Odisha', category: 'Architecture', description: 'A massive chariot of stone dedicated to the Sun God, featuring intricate carvings that tell the story of medieval life.', significance: 'Represents the pinnacle of Kalinga architecture and incredible astrological precision.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Ancient Stories'], dnaProfile: { Architecture: 100, Stories: 90, Crafts: 85, Food: 10, Music: 30, Traditions: 70 }, coordinates: [19.88, 86.09], overview: placeholderText, architecture: { description: placeholderText }, sources: defaultSources },
  { id: 'khajuraho', name: 'Khajuraho Group of Monuments', location: 'Chhatarpur, Madhya Pradesh', state: 'Madhya Pradesh', category: 'Architecture', description: 'Renowned for their nagara-style architectural symbolism and their erotic sculptures.', significance: 'A spectacular demonstration of ancient Indian architectural and sculptural mastery.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Crafts'], dnaProfile: { Architecture: 95, Stories: 75, Crafts: 95, Food: 10, Music: 40, Traditions: 60 }, coordinates: [24.83, 79.92], overview: placeholderText, architecture: { description: placeholderText }, sources: defaultSources },
  { id: 'mahabalipuram', name: 'Group of Monuments at Mahabalipuram', location: 'Chengalpattu, Tamil Nadu', state: 'Tamil Nadu', category: 'Architecture', description: 'A sanctuary known for its rathas (temples in the form of chariots), mandapas (cave sanctuaries), and giant open-air reliefs.', significance: 'Highlights Pallava art and early Dravidian architecture by the sea.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Ancient Stories'], dnaProfile: { Architecture: 95, Stories: 85, Crafts: 80, Food: 20, Music: 20, Traditions: 65 }, coordinates: [12.62, 80.19], overview: placeholderText, architecture: { description: placeholderText }, sources: defaultSources },
  { id: 'thanjavur', name: 'Brihadisvara Temple', location: 'Thanjavur, Tamil Nadu', state: 'Tamil Nadu', category: 'Architecture', description: 'A magnificent Chola era temple dedicated to Shiva, showcasing grand proportions and intricate frescoes.', significance: 'A UNESCO World Heritage site and an engineering marvel of the 11th century.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Architecture', 'Living Traditions'], dnaProfile: { Architecture: 100, Stories: 80, Crafts: 70, Food: 30, Music: 60, Traditions: 85 }, coordinates: [10.78, 79.13], overview: placeholderText, architecture: { description: placeholderText }, sources: defaultSources },
  { id: 'kanchipuram-silk', name: 'Kanchipuram Silk Weaving', location: 'Kanchipuram, Tamil Nadu', state: 'Tamil Nadu', category: 'Crafts', description: 'A tradition of handwoven silk saris distinguished by their wide contrast borders and gold zari work.', significance: 'Interwoven with temple traditions and South Indian bridal heritage.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Living Traditions'], dnaProfile: { Architecture: 20, Stories: 60, Crafts: 100, Food: 10, Music: 15, Traditions: 90 }, coordinates: [12.83, 79.70], overview: placeholderText, crafts: [{ name: 'Kanjeevaram', description: placeholderText }], sources: defaultSources },
  { id: 'madhubani', name: 'Madhubani Painting', location: 'Mithila region, Bihar', state: 'Bihar', category: 'Folk Arts', description: 'Intricate, geometric patterns originally painted on freshly plastered mud walls and floors.', significance: 'Empowering women communities while preserving mythological stories visually.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Folk Arts', 'Ancient Stories'], dnaProfile: { Architecture: 15, Stories: 95, Crafts: 90, Food: 15, Music: 20, Traditions: 85 }, coordinates: [26.35, 86.08], overview: placeholderText, sources: defaultSources },
  { id: 'channapatna', name: 'Channapatna Toys', location: 'Channapatna, Karnataka', state: 'Karnataka', category: 'Crafts', description: 'Wooden toys and dolls manufactured in the town of Channapatna using traditional ivory-wood and lac dyes.', significance: 'A sustainable craft supported by generations of local artisans.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Living Traditions'], dnaProfile: { Architecture: 10, Stories: 50, Crafts: 95, Food: 10, Music: 10, Traditions: 75 }, coordinates: [12.65, 77.20], overview: placeholderText, sources: defaultSources },
  { id: 'blue-pottery', name: 'Blue Pottery of Jaipur', location: 'Jaipur, Rajasthan', state: 'Rajasthan', category: 'Crafts', description: 'Distinctive pottery made from quartz frit rather than clay, adorned with blue and white floral motifs.', significance: 'A Turko-Persian craft that has found a permanent home in Rajasthani culture.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Living Traditions'], dnaProfile: { Architecture: 30, Stories: 40, Crafts: 95, Food: 10, Music: 10, Traditions: 70 }, coordinates: [26.91, 75.78], overview: placeholderText, sources: defaultSources },
  { id: 'kathputli', name: 'Kathputli Puppet Theatre', location: 'Rajasthan', state: 'Rajasthan', category: 'Folk Arts', description: 'String puppet theatre native to Rajasthan, featuring colorful wooden dolls and lively storytelling.', significance: 'A rich oral tradition conveying local history, morality tales, and social themes.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Folk Arts', 'Ancient Stories', 'Traditional Music'], dnaProfile: { Architecture: 10, Stories: 95, Crafts: 85, Food: 10, Music: 80, Traditions: 90 }, coordinates: [26.9, 75.8], overview: placeholderText, sources: defaultSources },
  { id: 'banarasi', name: 'Banarasi Brocade', location: 'Varanasi, Uttar Pradesh', state: 'Uttar Pradesh', category: 'Crafts', description: 'Exquisite silk weaving involving intricate gold and silver zari, creating heavy, luxurious textiles.', significance: 'A staple of Indian weddings, representing centuries of artisanal expertise and cultural exchange.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Living Traditions'], dnaProfile: { Architecture: 20, Stories: 60, Crafts: 100, Food: 20, Music: 30, Traditions: 90 }, coordinates: [25.31, 83.00], overview: placeholderText, sources: defaultSources },
  { id: 'theyyam', name: 'Theyyam Ritual Art', location: 'Malabar region, Kerala', state: 'Kerala', category: 'Folk Arts', description: 'A vibrant ritualistic dance where the performer embodies the deity, featuring spectacular face painting and elaborate headgear.', significance: 'A profound living tradition blending dance, music, and deep spiritual belief.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Folk Arts', 'Traditional Music', 'Living Traditions'], dnaProfile: { Architecture: 15, Stories: 85, Crafts: 60, Food: 20, Music: 90, Traditions: 100 }, coordinates: [11.87, 75.37], overview: placeholderText, sources: defaultSources },
  { id: 'yakshagana', name: 'Yakshagana', location: 'Coastal Karnataka', state: 'Karnataka', category: 'Folk Arts', description: 'A traditional theatre form combining dance, music, dialogue, and heavy makeup to enact stories from Hindu epics.', significance: 'A dynamic community art form connecting classical epics with rural audiences.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Folk Arts', 'Ancient Stories', 'Traditional Music'], dnaProfile: { Architecture: 10, Stories: 95, Crafts: 50, Food: 10, Music: 95, Traditions: 90 }, coordinates: [13.34, 74.74], overview: placeholderText, sources: defaultSources },
  { id: 'chola-bronze', name: 'Chola Bronze Casting', location: 'Swamimalai, Tamil Nadu', state: 'Tamil Nadu', category: 'Crafts', description: 'The ancient lost-wax technique used to create stunning, highly expressive bronze deities.', significance: 'Considered some of the finest metal art in the world, combining metallurgy with spiritual canon.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Ancient Stories'], dnaProfile: { Architecture: 30, Stories: 80, Crafts: 100, Food: 10, Music: 15, Traditions: 80 }, coordinates: [10.95, 79.33], overview: placeholderText, sources: defaultSources },
  { id: 'manganiyar', name: 'Manganiyar Folk Music', location: 'Thar Desert, Rajasthan', state: 'Rajasthan', category: 'Traditional Music', description: 'Hereditary musicians whose haunting melodies and powerful vocals narrate tales of love, war, and devotion.', significance: 'A vital thread in the cultural fabric of Rajasthan bridging diverse communities through song.', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85', tags: ['Traditional Music', 'Living Traditions', 'Ancient Stories'], dnaProfile: { Architecture: 10, Stories: 90, Crafts: 20, Food: 30, Music: 100, Traditions: 95 }, coordinates: [26.9, 70.9], overview: placeholderText, sources: defaultSources },
  { id: 'kutch-embroidery', name: 'Kutch Embroidery', location: 'Kutch, Gujarat', state: 'Gujarat', category: 'Crafts', description: 'Vibrant, densely stitched textile art often featuring mirrors and intricate geometric motifs, unique to various nomadic groups.', significance: 'A visual language of identity, community, and resilient artistry in an arid landscape.', image: 'https://images.unsplash.com/photo-1582561833407-b95380302a3c?auto=format&fit=crop&w=900&q=85', tags: ['Crafts', 'Living Traditions'], dnaProfile: { Architecture: 15, Stories: 60, Crafts: 100, Food: 25, Music: 20, Traditions: 90 }, coordinates: [23.73, 69.85], overview: placeholderText, sources: defaultSources },
  { id: 'awadhi-cuisine', name: 'Awadhi Food Heritage', location: 'Lucknow, Uttar Pradesh', state: 'Uttar Pradesh', category: 'Food Heritage', description: 'A royal culinary tradition known for its slow-cooking techniques (dum pukht) and aromatic spices.', significance: 'Embodies the syncretic culture of the Nawabs, blending Persian and Indian flavors.', image: 'https://images.unsplash.com/photo-1600100397608-f010f8b8c3f9?auto=format&fit=crop&w=1200&q=85', tags: ['Food Heritage', 'Living Traditions'], dnaProfile: { Architecture: 40, Stories: 70, Crafts: 30, Food: 100, Music: 40, Traditions: 85 }, coordinates: [26.84, 80.94], overview: placeholderText, sources: defaultSources }
]

export const people: CulturalPerson[] = [
  { id: 'meena', name: 'Meena Chettiar', role: 'Heritage storyteller', location: 'Karaikudi, Tamil Nadu', years: '20 years preserving oral histories', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', offering: 'Courtyard stories & traditional kitchen' },
  { id: 'ramesh', name: 'Ramesh Chitrakar', role: 'Pattachitra artisan', location: 'Raghurajpur, Odisha', years: 'Third-generation practitioner', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', offering: 'Painted stories workshop' },
  { id: 'anjali', name: 'Anjali Saikia', role: 'Folk arts researcher', location: 'Majuli, Assam', years: '12 years with Sattriya communities', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', offering: 'Mask-making & Bhaona theatre' },
]

export const dnaDefaults = { Architecture: 50, Stories: 50, Crafts: 50, Food: 50, Music: 50, Traditions: 50 }

export function recommendHeritage(dna: Record<string, number>, items = heritageItems) {
  return [...items].sort((a, b) => ((b.match ?? 0) + (dna[a.category] ?? 50) / 5) - ((a.match ?? 0) + (dna[b.category] ?? 50) / 5))
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
export const companionIntro = 'I can help you explore the cultural context here. I’ll distinguish demo narratives from verified references as Virasat grows.'
export const appName = 'Virasat'
export const appTagline = 'India, understood through its living heritage.'
export const navItems = ['Discover', 'Map', 'Journey', 'Saved', 'Heritage DNA', 'Profile'] as const
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
export const profileTitle = 'Your Virasat profile'
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
