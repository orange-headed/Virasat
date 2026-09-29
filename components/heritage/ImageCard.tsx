'use client'

import React from 'react'
import { Heart, Bookmark, MapPin, Plus, Navigation } from 'lucide-react'
import { type HeritageItem } from '@/lib/heritage-data'
import { imageStyle } from '@/lib/utils'
import { useAppContext } from '@/lib/store'

export function ImageCard({ item, onOpen }: { item: HeritageItem; onOpen: () => void }) {
  const { savedIds, toggleSave, journeyIds, addToJourney } = useAppContext()
  const saved = savedIds.includes(item.id)
  const inJourney = journeyIds.includes(item.id)

  return (
    <article className="group relative min-w-[260px] overflow-hidden rounded-2xl bg-[#233e3a] text-white shadow-sm">
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          aria-label={`${saved ? 'Remove' : 'Save'} ${item.name}`}
          onClick={() => toggleSave(item)}
          className="grid size-9 place-items-center rounded-full bg-black/20 backdrop-blur transition hover:bg-black/40"
        >
          {saved ? <Heart fill="currentColor" size={17} /> : <Bookmark size={17} />}
        </button>
        {!inJourney && (
          <button
            aria-label={`Add ${item.name} to journey`}
            onClick={() => addToJourney(item.id)}
            className="grid size-9 place-items-center rounded-full bg-black/20 backdrop-blur transition hover:bg-[#A85735]"
          >
            <Plus size={18} />
          </button>
        )}
        {inJourney && (
          <div className="grid size-9 place-items-center rounded-full bg-[#A85735] text-white backdrop-blur">
            <Navigation size={15} />
          </div>
        )}
      </div>
      <button onClick={onOpen} className="block w-full text-left">
        <div
          className="aspect-[1.18] bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={imageStyle(item.image)}
        />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[.16em] text-[#eac8aa]">{item.category}</p>
          <h3 className="font-serif text-2xl leading-none">{item.name}</h3>
          <p className="mt-2 flex items-center gap-1 text-xs text-white/75">
            <MapPin size={12} />
            {item.location}
          </p>
        </div>
      </button>
    </article>
  )
}
