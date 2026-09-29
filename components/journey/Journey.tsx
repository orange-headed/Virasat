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
        <div className="mb-6 grid size-16 place-items-center rounded-full bg-surface-elevated text-accent">
          <Navigation size={24} />
        </div>
        <h2 className="font-serif text-3xl text-primary">Your cultural journey is empty.</h2>
        <p className="mt-3 text-sm text-muted">Discover a heritage place, story or experience and add it here.</p>
        <button onClick={() => setActiveScreen('Discover')} className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:hover:bg-accent/80">
          Explore Heritage
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-5 md:px-10 md:pb-16">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">My Cultural Journey</p>
        <h1 className="mt-2 font-serif text-5xl leading-none text-primary">Your Path.</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          A cultural exploration, not a checklist. Follow the thread from architecture to food.
        </p>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-border bg-surface-elevated p-4 items-start sm:items-center shadow-sm">
            <div className="flex sm:w-12 shrink-0 flex-row sm:flex-col items-center justify-center gap-2">
              <div className="grid size-9 place-items-center rounded-full bg-surface-elevated font-serif text-xl text-accent">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 border-l-0 sm:border-l border-border pl-0 sm:pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-accent">{item.category}</p>
              <h2 className="mt-1 font-serif text-2xl text-primary cursor-pointer hover:text-accent transition" onClick={() => setDetailId(item.id)}>{item.name}</h2>
              <p className="mt-1 text-xs text-muted">{item.location}</p>
            </div>
            <div className="flex items-center gap-1 self-end sm:self-center bg-background rounded-lg p-1 border border-border">
              <button onClick={() => moveJourneyItem(index, 'up')} disabled={index === 0} className="p-2 text-muted hover:text-primary disabled:opacity-30" aria-label="Move up">
                <ArrowUp size={16} />
              </button>
              <button onClick={() => moveJourneyItem(index, 'down')} disabled={index === items.length - 1} className="p-2 text-muted hover:text-primary disabled:opacity-30" aria-label="Move down">
                <ArrowDown size={16} />
              </button>
              <div className="w-px h-6 bg-[#dfd8cc] mx-1" />
              <button onClick={() => removeFromJourney(item.id)} className="p-2 text-accent hover:text-red-700" aria-label="Remove">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
