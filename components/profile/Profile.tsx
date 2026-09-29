'use client'

import React from 'react'
import { useAppContext } from '@/lib/store'
import { heritageItems } from '@/lib/heritage-data'
import { ImageCard } from '@/components/heritage/ImageCard'
import { ChevronRight, Bookmark, Navigation, History, Sparkles, Sun, Moon, Palette } from 'lucide-react'

export function Profile() {
  const { savedIds, journeyIds, recentIds, setDetailId, setActiveScreen, dna, theme, setTheme } = useAppContext()

  const recentItems = recentIds.map(id => heritageItems.find(i => i.id === id)).filter(Boolean) as typeof heritageItems

  // Get top 2 dna traits
  const topTraits = Object.entries(dna).sort((a, b) => b[1] - a[1]).slice(0, 2).map(t => t[0])

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-primary mb-6">Your Profile</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-surface p-5 rounded-3xl text-primary border border-border shadow-sm">
          <Bookmark size={24} className="text-accent mb-2" />
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Saved</p>
          <p className="text-3xl font-serif mt-1">{savedIds.length}</p>
        </div>
        <div className="bg-surface p-5 rounded-3xl text-primary border border-border shadow-sm">
          <Navigation size={24} className="text-accent mb-2" />
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Journey Stops</p>
          <p className="text-3xl font-serif mt-1">{journeyIds.length}</p>
        </div>
        <div className="bg-surface p-5 rounded-3xl text-primary border border-border shadow-sm">
          <History size={24} className="text-accent mb-2" />
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Explored</p>
          <p className="text-3xl font-serif mt-1">{recentIds.length}</p>
        </div>
      </div>

      <div className="bg-surface-elevated border border-border p-6 rounded-3xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-accent" />
            <h2 className="font-serif text-2xl text-primary">Heritage DNA</h2>
          </div>
          <p className="text-sm text-muted">Your strongest interests are {topTraits.join(' and ')}.</p>
        </div>
        <button onClick={() => setActiveScreen('Heritage DNA')} className="mt-4 sm:mt-0 px-5 py-2.5 bg-surface text-accent font-semibold rounded-full hover:bg-border transition flex items-center justify-center gap-2 border border-border">
          View Details <ChevronRight size={16} />
        </button>
      </div>

      <div className="bg-surface-elevated border border-border p-6 rounded-3xl mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-accent" />
          <h2 className="font-serif text-2xl text-primary">App Theme</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition active:scale-95 border ${
              theme === 'light' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-muted border-border hover:text-primary hover:border-muted'
            }`}
          >
            <Sun size={16} /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition active:scale-95 border ${
              theme === 'dark' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-muted border-border hover:text-primary hover:border-muted'
            }`}
          >
            <Moon size={16} /> Dark
          </button>
          <button
            onClick={() => setTheme('virasat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition active:scale-95 border ${
              theme === 'virasat' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-muted border-border hover:text-primary hover:border-muted'
            }`}
          >
            <Sparkles size={16} /> Virasat Original
          </button>
        </div>
      </div>

      {recentItems.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-primary mb-4">Recently Explored</h2>
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
