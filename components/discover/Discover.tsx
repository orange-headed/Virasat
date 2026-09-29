'use client'

import React, { useState } from 'react'
import { Search, ChevronRight, Sparkles, MessageCircle, Navigation, Plus } from 'lucide-react'
import { ImageCard } from '@/components/heritage/ImageCard'
import { categories, dnaDefaults, heritageItems, people, profile, assistantPrompts } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { imageStyle } from '@/lib/utils'
import { calculateHeritageMatch } from '@/lib/recommendation'

export function Discover() {
  const { setDetailId, setActiveScreen, dna, journeyIds, addToJourney } = useAppContext()
  const [query, setQuery] = useState('')
  
  const recommendations = calculateHeritageMatch(dna, heritageItems)
  const featured = recommendations[0]

  const filtered = heritageItems.filter((item) =>
    `${item.name} ${item.location} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  )

  const inJourney = journeyIds.includes(featured.item.id)

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-4 md:px-8 md:pb-12">
      <section className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Good morning, {profile.name}</p>
        <h1 className="font-serif text-4xl leading-[.95] tracking-tight text-[#233e3a] md:text-5xl">
          Discover India&apos;s <em className="text-[#A85735]">living</em> heritage.
        </h1>
      </section>
      <div className="relative mt-6 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b938e]" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search places, stories or traditions"
          className="h-12 w-full rounded-2xl border border-[#ddd5c8] bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#A85735]"
        />
      </div>
      
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Personalized for you</p>
            <h2 className="mt-1 font-serif text-2xl text-[#233e3a]">Picked for your Heritage DNA</h2>
          </div>
          <button onClick={() => setActiveScreen('Heritage DNA')} className="hidden items-center gap-1 text-xs text-[#A85735] sm:flex font-semibold">
            See DNA <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#233e3a] text-white">
            <div className="aspect-[1.55] bg-cover bg-center md:aspect-auto md:h-full" style={imageStyle(featured.item.image)} />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
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
          
          <div className="rounded-3xl bg-[#e9dfd3] p-5 text-[#233e3a] flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Your profile</p>
                <h3 className="mt-1 font-serif text-2xl">Heritage DNA</h3>
              </div>
              <Sparkles className="text-[#A85735]" size={20} />
            </div>
            <div className="mt-5 space-y-3 flex-1">
              {Object.entries(dnaDefaults).slice(0, 4).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="uppercase tracking-wider">{key}</span>
                    <span className="font-semibold">{dna[key] ?? value}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-white/60">
                    <div className="h-full rounded-full bg-[#A85735] transition-all duration-500" style={{ width: `${dna[key] ?? value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveScreen('Heritage DNA')} className="mt-4 flex items-center justify-center w-full gap-2 rounded-xl bg-white/50 py-2.5 text-xs font-semibold text-[#A85735] transition hover:bg-white">
              Tune your interests <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#233e3a]">Explore by cultural lens</h2>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {categories.map((category) => (
            <button
              key={category.label}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl ${category.color} p-2 text-center text-[#233e3a] transition hover:-translate-y-1`}
            >
              <span className="font-serif text-xl">{category.icon}</span>
              <span className="text-[9px] font-medium leading-tight">{category.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#A85735]">Go deeper</p>
          <h2 className="mt-1 font-serif text-2xl text-[#233e3a]">Lesser-known, deeply rooted</h2>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0">
          {filtered.slice(1).map((item) => (
            <ImageCard
              key={item.id}
              item={item}
              onOpen={() => setDetailId(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
