'use client'

import React from 'react'
import { ChevronRight, MapPin, Heart, Bookmark, Plus, Navigation } from 'lucide-react'
import { type HeritageItem } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { imageStyle } from '@/lib/utils'

export function Detail({ item }: { item: HeritageItem }) {
  const { setDetailId, savedIds, toggleSave, journeyIds, addToJourney, setActiveScreen } = useAppContext()
  const saved = savedIds.includes(item.id)
  const inJourney = journeyIds.includes(item.id)
  const onBack = () => setDetailId(null)
  const onSave = () => toggleSave(item)

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-4 md:px-8 md:pb-12">
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#68736e] transition hover:text-[#233e3a]">
        <ChevronRight className="rotate-180" size={16} /> Back
      </button>
      
      <div className="relative overflow-hidden rounded-3xl bg-[#233e3a] text-white">
        <div className="aspect-[1.3] bg-cover bg-center md:aspect-[2.2]" style={imageStyle(item.image)} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 md:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#e4b08d]">
            <span>{item.category}</span>
            <span>·</span>
            <span>{item.state}</span>
          </div>
          <h1 className="mt-1 font-serif text-4xl leading-tight md:text-5xl">{item.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
            <MapPin size={14} />
            {item.location}
          </p>
        </div>
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={onSave}
            className="grid size-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur transition hover:bg-black/40"
            aria-label="Save heritage"
          >
            {saved ? <Heart fill="currentColor" size={18} /> : <Bookmark size={18} />}
          </button>
          {!inJourney ? (
            <button
              onClick={() => addToJourney(item.id)}
              className="grid size-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur transition hover:bg-[#A85735]"
              aria-label="Add to journey"
            >
              <Plus size={20} />
            </button>
          ) : (
            <button
              onClick={() => { setDetailId(null); setActiveScreen('Journey'); }}
              className="grid size-10 place-items-center rounded-full bg-[#A85735] text-white shadow-md transition hover:bg-[#8f472a]"
              aria-label="View in journey"
            >
              <Navigation size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-[1.3fr_.7fr]">
        <main className="space-y-6">
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#A85735]">Why it matters</p>
            <p className="mt-2 font-serif text-2xl leading-snug text-[#233e3a]">{item.significance}</p>
          </section>
          {[
            ['History', item.description],
            ['Stories & Legends', 'This section will carry a clearly attributed story, with sources attached before publication.'],
            ['Local Culture', 'Start with the people who live alongside the heritage. Listen first, then explore.']
          ].map(([title, text]) => (
            <section key={title} className="border-t border-[#ddd5c8] pt-4">
              <h2 className="font-serif text-xl text-[#233e3a]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#68736e]">{text}</p>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}
