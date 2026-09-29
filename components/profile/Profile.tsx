'use client'

import React from 'react'
import { useAppContext } from '@/lib/store'
import { heritageItems } from '@/lib/heritage-data'
import { ImageCard } from '@/components/heritage/ImageCard'
import { ChevronRight, Bookmark, Navigation, History, Sparkles } from 'lucide-react'

export function Profile() {
  const { savedIds, journeyIds, recentIds, setDetailId, setActiveScreen, dna } = useAppContext()

  const recentItems = recentIds.map(id => heritageItems.find(i => i.id === id)).filter(Boolean) as typeof heritageItems

  // Get top 2 dna traits
  const topTraits = Object.entries(dna).sort((a, b) => b[1] - a[1]).slice(0, 2).map(t => t[0])

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[#233e3a] mb-6">Your Profile</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-[#e9dfd3] p-5 rounded-3xl text-[#233e3a]">
          <Bookmark size={24} className="text-[#A85735] mb-2" />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#A85735]">Saved</p>
          <p className="text-3xl font-serif mt-1">{savedIds.length}</p>
        </div>
        <div className="bg-[#e9dfd3] p-5 rounded-3xl text-[#233e3a]">
          <Navigation size={24} className="text-[#A85735] mb-2" />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#A85735]">Journey Stops</p>
          <p className="text-3xl font-serif mt-1">{journeyIds.length}</p>
        </div>
        <div className="bg-[#e9dfd3] p-5 rounded-3xl text-[#233e3a]">
          <History size={24} className="text-[#A85735] mb-2" />
          <p className="text-sm font-semibold uppercase tracking-wider text-[#A85735]">Explored</p>
          <p className="text-3xl font-serif mt-1">{recentIds.length}</p>
        </div>
      </div>

      <div className="bg-white border border-[#e6dfd5] p-6 rounded-3xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-[#A85735]" />
            <h2 className="font-serif text-2xl text-[#233e3a]">Heritage DNA</h2>
          </div>
          <p className="text-sm text-[#68736e]">Your strongest interests are {topTraits.join(' and ')}.</p>
        </div>
        <button onClick={() => setActiveScreen('Heritage DNA')} className="mt-4 sm:mt-0 px-5 py-2.5 bg-[#f4efe7] text-[#A85735] font-semibold rounded-full hover:bg-[#e9dfd3] transition flex items-center justify-center gap-2">
          View Details <ChevronRight size={16} />
        </button>
      </div>

      {recentItems.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-[#233e3a] mb-4">Recently Explored</h2>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 md:mx-0 md:px-0">
            {recentItems.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                onOpen={() => setDetailId(item.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
