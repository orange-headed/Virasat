'use client'

import React from 'react'
import { Heart, Bookmark, MapPin, Plus, Navigation, ChevronRight } from 'lucide-react'
import { type HeritageItem } from '@/lib/heritage-data'
import { imageStyle } from '@/lib/utils'
import { useAppContext } from '@/lib/store'

export function ImageCard({ 
  item, 
  onOpen, 
  score, 
  reason 
}: { 
  item: HeritageItem; 
  onOpen: () => void;
  score?: number;
  reason?: string;
}) {
  const { savedIds, toggleSave, journeyIds, addToJourney } = useAppContext()
  const saved = savedIds.includes(item.id)
  const inJourney = journeyIds.includes(item.id)

  return (
    <article className="group relative flex w-[300px] flex-col overflow-hidden rounded-2xl bg-surface-elevated border border-border shadow-sm">
      <div className="relative aspect-[1.4] w-full shrink-0 overflow-hidden bg-primary">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={imageStyle(item.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <button
            aria-label={`${saved ? 'Remove' : 'Save'} ${item.name}`}
            onClick={() => toggleSave(item)}
            className="grid size-8 place-items-center rounded-full bg-black/40 text-primary-foreground backdrop-blur transition hover:bg-black/60"
          >
            {saved ? <Heart fill="currentColor" size={15} /> : <Bookmark size={15} />}
          </button>
          {!inJourney ? (
            <button
              aria-label={`Add ${item.name} to journey`}
              onClick={() => addToJourney(item.id)}
              className="grid size-8 place-items-center rounded-full bg-black/40 text-primary-foreground backdrop-blur transition hover:bg-accent"
            >
              <Plus size={16} />
            </button>
          ) : (
            <div className="grid size-8 place-items-center rounded-full bg-accent text-primary-foreground backdrop-blur">
              <Navigation size={14} />
            </div>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 text-primary-foreground">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#e4b08d]">{item.category}</p>
          <h3 className="font-serif text-2xl leading-tight truncate">{item.name}</h3>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} /> <span className="truncate">{item.location}</span>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 2).map(tag => (
            <span key={tag} className="rounded border border-border bg-[#faf9f6] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted">
              {tag}
            </span>
          ))}
        </div>
        
        {score && reason && (
          <div className="mb-4 rounded-lg bg-background p-2 text-xs">
            <div className="font-semibold text-primary">{score}% match</div>
            <div className="mt-0.5 text-accent line-clamp-1">{reason}</div>
          </div>
        )}
        
        <div className="mt-auto pt-2 border-t border-border">
          <button onClick={onOpen} className="flex w-full items-center justify-center gap-2 rounded-xl bg-transparent py-2 text-xs font-semibold text-primary transition hover:bg-background">
            Explore heritage <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
