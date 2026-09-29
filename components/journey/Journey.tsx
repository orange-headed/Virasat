'use client'

import React from 'react'
import { ArrowUp, ArrowDown, X, Navigation } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { heritageItems } from '@/lib/heritage-data'

export function Journey() {
  const { journeyIds, moveJourneyItem, removeFromJourney, setActiveScreen, setDetailId } = useAppContext()

  const items = journeyIds.map(id => heritageItems.find(item => item.id === id)!).filter(Boolean)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-5 pb-10 pt-5 md:px-10 md:pb-16 flex flex-col h-[calc(100vh-80px)] items-center justify-center text-center">
        <div className="mb-6 grid size-16 place-items-center rounded-full bg-[#e9dfd3] text-[#A85735]">
          <Navigation size={24} />
        </div>
        <h2 className="font-serif text-3xl text-[#233e3a]">Your cultural journey is empty.</h2>
        <p className="mt-3 text-sm text-[#68736e]">Discover a heritage place, story or experience and add it here.</p>
        <button onClick={() => setActiveScreen('Discover')} className="mt-8 rounded-full bg-[#A85735] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8f472a]">
          Explore Heritage
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-5 md:px-10 md:pb-16">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">My Cultural Journey</p>
        <h1 className="mt-2 font-serif text-5xl leading-none text-[#233e3a]">Your Path.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#68736e]">
          A cultural exploration, not a checklist. Follow the thread from architecture to food.
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-[#e0d8cc] bg-white p-4 items-start sm:items-center shadow-sm">
            <div className="flex sm:w-12 shrink-0 flex-row sm:flex-col items-center justify-center gap-2">
              <div className="grid size-9 place-items-center rounded-full bg-[#e9dfd3] font-serif text-xl text-[#A85735]">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 border-l-0 sm:border-l border-[#e3dbcf] pl-0 sm:pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#A85735]">{item.category}</p>
              <h2 className="mt-1 font-serif text-2xl text-[#233e3a] cursor-pointer hover:text-[#A85735] transition" onClick={() => setDetailId(item.id)}>{item.name}</h2>
              <p className="mt-1 text-xs text-[#68736e]">{item.location}</p>
            </div>
            <div className="flex items-center gap-1 self-end sm:self-center bg-[#f4efe7] rounded-lg p-1 border border-[#dfd8cc]">
              <button onClick={() => moveJourneyItem(index, 'up')} disabled={index === 0} className="p-2 text-[#68736e] hover:text-[#233e3a] disabled:opacity-30" aria-label="Move up">
                <ArrowUp size={16} />
              </button>
              <button onClick={() => moveJourneyItem(index, 'down')} disabled={index === items.length - 1} className="p-2 text-[#68736e] hover:text-[#233e3a] disabled:opacity-30" aria-label="Move down">
                <ArrowDown size={16} />
              </button>
              <div className="w-px h-6 bg-[#dfd8cc] mx-1" />
              <button onClick={() => removeFromJourney(item.id)} className="p-2 text-[#A85735] hover:text-red-700" aria-label="Remove">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
