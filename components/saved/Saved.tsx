'use client'

import React from 'react'
import { Bookmark } from 'lucide-react'
import { ImageCard } from '@/components/heritage/ImageCard'
import { heritageItems } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'

export function Saved() {
  const { savedIds, setDetailId } = useAppContext()
  const items = heritageItems.filter((item) => savedIds.includes(item.id))

  return (
    <div className="mx-auto max-w-5xl px-5 pb-10 pt-5 md:px-8 md:pb-12">
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">Your collection</p>
        <h1 className="mt-1 font-serif text-4xl leading-none text-primary">Saved heritage.</h1>
        <p className="mt-2 text-sm text-muted">Places and stories you want to return to.</p>
      </div>
      {items.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <ImageCard
              key={item.id}
              item={item}
              onOpen={() => setDetailId(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid min-h-[300px] place-items-center rounded-3xl border border-dashed border-border bg-background p-8 text-center">
          <div>
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface-elevated text-accent">
              <Bookmark size={20} />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-primary">Your collection is quiet.</h2>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted">
              Save places, stories, people and traditions as you explore Virasat.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
