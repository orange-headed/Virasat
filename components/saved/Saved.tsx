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
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Your collection</p>
        <h1 className="mt-1 font-serif text-4xl leading-none text-[#233e3a]">Saved heritage.</h1>
        <p className="mt-2 text-sm text-[#68736e]">Places and stories you want to return to.</p>
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
        <div className="mt-10 grid min-h-[300px] place-items-center rounded-3xl border border-dashed border-[#d7cfc2] bg-[#f4efe7] p-8 text-center">
          <div>
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#e9dfd3] text-[#A85735]">
              <Bookmark size={20} />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-[#233e3a]">Your collection is quiet.</h2>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-[#68736e]">
              Save places, stories, people and traditions as you explore Virasat.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
