'use client'

import React, { useState } from 'react'
import { Search, ChevronRight, Sparkles, Navigation, Plus, X } from 'lucide-react'
import { ImageCard } from '@/components/heritage/ImageCard'
import { categories, dnaDefaults, heritageItems, profile } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { imageStyle } from '@/lib/utils'
import { getRecommendedHeritage } from '@/lib/recommendation'

export function Discover() {
  const { setDetailId, setActiveScreen, dna, journeyIds, addToJourney, trackInteraction, recentIds } = useAppContext()
  const [query, setQuery] = useState('')
  const [activeLens, setActiveLens] = useState<string | null>(null)
  
  const recommendations = getRecommendedHeritage(heritageItems, dna, 5)
  const featured = recommendations[0]
  
  // Filter for search and lens
  const filtered = heritageItems.filter((item) => {
    const fields = [
      item.name, item.location, item.state, item.category, ...item.tags,
      item.description, item.significance, item.overview,
      item.architecture?.style, item.architecture?.description,
      ...(item.stories?.map(s => s.title) || []),
      ...(item.crafts?.map(c => c.name) || []),
      ...(item.traditions?.map(c => c.name) || []),
      ...(item.foodHeritage?.map(c => c.name) || []),
      ...(item.music?.map(c => c.name) || []),
    ].filter(Boolean).join(' ').toLowerCase()
    
    const matchQuery = fields.includes(query.toLowerCase())
    const matchLens = activeLens ? item.category === activeLens || item.tags.includes(activeLens) : true
    return matchQuery && matchLens
  })

  const inJourney = featured ? journeyIds.includes(featured.item.id) : false

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && filtered.length > 0) {
       trackInteraction(filtered[0].id, 'SEARCH')
    }
  }

  const handleLens = (label: string) => {
    if (activeLens === label) {
      setActiveLens(null)
    } else {
      setActiveLens(label)
      const match = heritageItems.find(i => i.category === label || i.tags.includes(label))
      if (match) trackInteraction(match.id, 'SEARCH')
    }
  }

  const recentItems = recentIds.map(id => heritageItems.find(i => i.id === id)).filter(Boolean) as typeof heritageItems

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-4 md:px-8 md:pb-12 overflow-x-hidden">
      <section className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Good morning, {profile.name}</p>
        <h1 className="font-serif text-4xl leading-[.95] tracking-tight text-[#233e3a] md:text-5xl">
          Discover India&apos;s <em className="text-[#A85735]">living</em> heritage.
        </h1>
      </section>
      
      <form onSubmit={handleSearch} className="relative mt-6 max-w-xl z-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b938e]" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search places, stories or traditions"
          className="h-12 w-full rounded-2xl border border-[#ddd5c8] bg-white pl-12 pr-10 text-sm outline-none transition focus:border-[#A85735]"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b938e]">
            <X size={16} />
          </button>
        )}
      </form>
      
      {/* SEARCH / FILTER RESULTS */}
      {(query || activeLens) && (
        <section className="mt-10">
          <div className="mb-4 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#A85735]">Results</p>
              <h2 className="mt-1 font-serif text-2xl text-[#233e3a]">
                {query ? `Searching for "${query}"` : `${activeLens} Heritage`}
              </h2>
            </div>
            <button onClick={() => { setQuery(''); setActiveLens(null) }} className="text-sm font-semibold text-[#A85735]">
              Clear filters
            </button>
          </div>
          
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <div key={item.id} className="w-full h-full flex flex-col justify-stretch">
                  <ImageCard item={item} onOpen={() => setDetailId(item.id)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-3xl border border-[#e6dfd5]">
              <p className="text-[#68736e]">No heritage found matching your criteria.</p>
            </div>
          )}
        </section>
      )}

      {/* DEFAULT DISCOVER VIEW */}
      {!query && !activeLens && (
        <>
          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Picked by your Heritage DNA</p>
                <h2 className="mt-1 font-serif text-2xl text-[#233e3a]">Personalized for you</h2>
              </div>
              <button onClick={() => setActiveScreen('Profile')} className="hidden items-center gap-1 text-xs text-[#A85735] sm:flex font-semibold hover:underline">
                View Profile <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
              {featured && (
                <div className="relative overflow-hidden rounded-3xl bg-[#233e3a] text-white">
                  <div className="aspect-[1.55] bg-cover bg-center md:aspect-auto md:h-full" style={imageStyle(featured.item.image)} />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#e4b08d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#542b1d]">
                        {featured.score}% match
                      </span>
                      <span className="text-xs font-medium text-white/90">{featured.reasons[0]}</span>
                    </div>
                    <h3 className="font-serif text-3xl">{featured.item.name}</h3>
                    <p className="mt-1 max-w-md text-sm text-white/80 line-clamp-2">{featured.item.significance}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button onClick={() => setDetailId(featured.item.id)} className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30">
                        Explore <ChevronRight size={16} />
                      </button>
                      {!inJourney ? (
                        <button onClick={() => addToJourney(featured.item.id)} className="flex items-center gap-1.5 rounded-full bg-[#A85735] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8f472a]">
                          <Plus size={16} /> Add to Journey
                        </button>
                      ) : (
                        <button onClick={() => setActiveScreen('Journey')} className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                          <Navigation size={14} /> In Journey
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-3xl bg-[#e9dfd3] p-5 text-[#233e3a] flex flex-col border border-[#d8d1c5]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Your profile</p>
                    <h3 className="mt-1 font-serif text-2xl">Heritage DNA</h3>
                  </div>
                  <Sparkles className="text-[#A85735]" size={20} />
                </div>
                <div className="mt-5 space-y-3 flex-1">
                  {Object.entries(dnaDefaults).slice(0, 4).map(([key]) => {
                    const val = dna[key] ?? 50
                    return (
                      <div key={key}>
                        <div className="mb-1 flex justify-between text-[11px]">
                          <span className="uppercase tracking-wider">{key}</span>
                          <span className="font-semibold">{val}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/60">
                          <div className="h-full rounded-full bg-[#A85735] transition-all duration-500" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => setActiveScreen('Heritage DNA')} className="mt-4 flex items-center justify-center w-full gap-2 rounded-xl bg-white/50 py-2.5 text-xs font-semibold text-[#A85735] transition hover:bg-white">
                  Learn how this works <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* MORE RECOMMENDATIONS */}
          <section className="mt-10">
            <h2 className="font-serif text-2xl text-[#233e3a] mb-4">Recommended for you</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0">
              {recommendations.slice(1).map((rec) => (
                <div key={rec.item.id} className="shrink-0">
                  <ImageCard
                    item={rec.item}
                    onOpen={() => setDetailId(rec.item.id)}
                    score={rec.score}
                    reason={rec.reasons[0]}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* EXPLORE BY LENS */}
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#233e3a]">Explore by cultural lens</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {categories.map((category) => (
                <button
                  key={category.label}
                  onClick={() => handleLens(category.label)}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl ${activeLens === category.label ? 'bg-[#A85735] text-white' : `${category.color} text-[#233e3a]`} p-2 text-center transition hover:-translate-y-1`}
                >
                  <span className="font-serif text-xl">{category.icon}</span>
                  <span className="text-[9px] font-medium leading-tight">{category.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* RECENTLY EXPLORED */}
          {recentItems.length > 0 && (
            <section className="mt-10">
              <div className="mb-4">
                <h2 className="font-serif text-2xl text-[#233e3a]">Recently Explored</h2>
              </div>
              <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0">
                {recentItems.map((item) => (
                  <div key={item.id} className="shrink-0">
                    <ImageCard item={item} onOpen={() => setDetailId(item.id)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ARCHITECTURE ROW */}
          <section className="mt-10">
            <h2 className="font-serif text-2xl text-[#233e3a] mb-4">Architectural Marvels</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0">
              {heritageItems.filter(i => i.category === 'Architecture' && i.id !== featured?.item.id).slice(0, 4).map((item) => (
                <div key={item.id} className="shrink-0">
                  <ImageCard item={item} onOpen={() => setDetailId(item.id)} />
                </div>
              ))}
            </div>
          </section>

          {/* LIVING TRADITIONS ROW */}
          <section className="mt-10">
            <h2 className="font-serif text-2xl text-[#233e3a] mb-4">Living Traditions & Folk Arts</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0">
              {heritageItems.filter(i => ['Living Traditions', 'Folk Arts', 'Traditional Music'].includes(i.category)).slice(0, 4).map((item) => (
                <div key={item.id} className="shrink-0">
                  <ImageCard item={item} onOpen={() => setDetailId(item.id)} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#e6e0d4] rounded-3xl p-6 md:p-8 border border-[#d8d1c5]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#A85735]">Nearby</p>
                <h2 className="mt-1 font-serif text-3xl text-[#233e3a]">Explore on Map</h2>
                <p className="mt-2 text-sm text-[#68736e] max-w-sm">Discover what's around you, from ancient architecture to living traditions.</p>
              </div>
              <button onClick={() => setActiveScreen('Map')} className="mt-5 md:mt-0 rounded-full bg-[#A85735] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8f472a]">
                Open Map
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
