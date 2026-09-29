'use client'

import dynamic from 'next/dynamic'
import { HeritageMapProps } from './HeritageMap'
import React from 'react'

const DynamicMap = dynamic(() => import('./HeritageMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#e6e0d4] flex items-center justify-center animate-pulse">
      <p className="text-[#A85735] text-sm font-semibold uppercase tracking-widest">Loading Map...</p>
    </div>
  )
})

export function MapWrapper(props: HeritageMapProps) {
  return <DynamicMap {...props} />
}
