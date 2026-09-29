'use client'

import React, { useState, useMemo } from 'react'
import { MapPin, X, ChevronRight, Navigation, Home } from 'lucide-react'
import { heritageItems, categories, type HeritageItem, type HeritageCategory } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { useUserLocation } from '@/lib/location/useUserLocation'
import { getDistanceKm, formatDistance } from '@/lib/geo/distance'
import { MapWrapper } from '@/components/map/MapWrapper'
import { Heart, Bookmark, Plus } from 'lucide-react'
import { calculateHeritageMatch } from '@/lib/recommendation'

export function MapView() {
  const { setDetailId, dna, savedIds, toggleSave, journeyIds, addToJourney } = useAppContext()
  const [selected, setSelected] = useState<HeritageItem | null>(null)
  const [activeFilter, setActiveFilter] = useState<HeritageCategory | 'All'>('All')
  
  const [mapCenter, setMapCenter] = useState<{ center: [number, number]; zoom: number } | null>(null)
  
  const { latitude, longitude, loading: locLoading, error: locError, requestLocation } = useUserLocation()
  
  const userCoords: [number, number] | null = (latitude !== null && longitude !== null) ? [latitude, longitude] : null

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return heritageItems
    return heritageItems.filter(item => item.category === activeFilter)
  }, [activeFilter])

  const handleLocateMe = () => {
    if (userCoords) {
      setMapCenter({ center: userCoords, zoom: 10 })
    } else {
      requestLocation()
    }
  }

  React.useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setMapCenter({ center: [latitude, longitude], zoom: 8 })
    }
  }, [latitude, longitude])

  const resetIndiaView = () => {
    setMapCenter({ center: [20.5937, 78.9629], zoom: 5 })
  }

  let selectedDistance = ''
  if (selected && userCoords) {
    const dist = getDistanceKm(userCoords[0], userCoords[1], selected.coordinates[0], selected.coordinates[1])
    selectedDistance = formatDistance(dist) + ' away'
  }

  // Calculate quick score
  let score = 50;
  if (selected) {
     let totalScore = 0;
     let maxScore = 0;
     for (const [key, userVal] of Object.entries(dna)) {
        const itemVal = selected.dnaProfile?.[key] || 0;
        totalScore += (userVal / 100) * (itemVal / 100) * 100;
        maxScore += (userVal / 100) * 100;
     }
     score = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 50;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-5 md:px-8 md:pb-16">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Heritage map</p>
        <h1 className="mt-2 max-w-lg font-serif text-4xl leading-none text-[#233e3a] md:text-5xl">Find culture, not just coordinates.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#68736e]">
          Explore places, practices and people across India.
        </p>
      </div>
      
      {/* Filters */}
      <div className="shrink-0 mb-4 no-scrollbar flex overflow-x-auto gap-2">
        <button
          onClick={() => setActiveFilter('All')}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition border ${
            activeFilter === 'All'
              ? 'bg-[#A85735] text-white border-[#A85735]'
              : 'bg-white text-[#68736e] border-[#dfd8cc] hover:border-[#A85735]'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveFilter(cat.label)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition border ${
              activeFilter === cat.label
                ? 'bg-[#A85735] text-white border-[#A85735]'
                : 'bg-white text-[#68736e] border-[#dfd8cc] hover:border-[#A85735]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {locError && (
        <div className="shrink-0 mb-4 rounded-xl bg-orange-100 p-3 text-sm text-orange-800">
          {locError}
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full h-[400px] md:h-[520px] max-h-[560px] overflow-hidden rounded-3xl border border-[#d8d1c5] bg-[#e6e0d4] z-10 shadow-inner">
        <MapWrapper 
          heritageItems={filteredItems}
          userLocation={userCoords}
          selectedItem={selected}
          onSelectItem={setSelected}
          centerMapTo={mapCenter}
        />

        {/* Custom Map Controls Overlay */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
          <button onClick={handleLocateMe} className="grid size-10 place-items-center rounded-xl bg-white text-[#233e3a] shadow-md hover:bg-gray-50 transition" aria-label="Locate me">
            {locLoading ? <div className="size-4 animate-spin rounded-full border-2 border-[#A85735] border-t-transparent" /> : <Navigation size={18} />}
          </button>
          <button onClick={resetIndiaView} className="grid size-10 place-items-center rounded-xl bg-white text-[#233e3a] shadow-md hover:bg-gray-50 transition" aria-label="Reset view">
            <Home size={18} />
          </button>
        </div>

        {/* Selected Item Preview Overlay */}
        {selected && (
          <div className="absolute inset-x-4 bottom-4 z-20 mx-auto max-w-sm rounded-2xl bg-[#faf8f3] p-5 shadow-xl border border-[#dfd8cc]">
            <button className="absolute right-4 top-4 text-[#68736e] hover:text-[#233e3a]" onClick={() => setSelected(null)} aria-label="Close">
              <X size={17} />
            </button>
            <div className="flex gap-4 mb-3">
              <div className="size-16 rounded-xl bg-cover bg-center shrink-0 border border-[#e2dbd0]" style={{ backgroundImage: `url(${selected.image})` }} />
              <div className="flex-1 pr-6">
                <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#A85735]">{selected.category}</p>
                <h3 className="mt-1 font-serif text-xl text-[#233e3a] leading-tight line-clamp-2">{selected.name}</h3>
              </div>
            </div>
            
            <div className="mb-4 flex items-center justify-between text-xs text-[#68736e]">
              <span className="flex items-center gap-1"><MapPin size={12} /> {selected.location}</span>
              {selectedDistance && <span className="font-medium text-[#A85735]">{selectedDistance}</span>}
            </div>

            <div className="mb-4 rounded-lg bg-[#f4efe7] p-2 text-xs flex justify-between items-center">
              <div>
                <div className="font-semibold text-[#233e3a]">{score}% match</div>
                <div className="mt-0.5 text-[#A85735] line-clamp-1">Personalized for you</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setDetailId(selected.id)} className="flex items-center justify-center gap-2 rounded-xl bg-[#A85735] py-2.5 text-xs font-semibold text-white transition hover:bg-[#8f472a]">
                Explore <ChevronRight size={14} />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSave(selected)}
                  className="flex-1 flex items-center justify-center rounded-xl bg-white border border-[#dfd8cc] text-[#233e3a] transition hover:bg-[#f4efe7]"
                >
                  {savedIds.includes(selected.id) ? <Heart fill="#A85735" stroke="#A85735" size={16} /> : <Bookmark size={16} />}
                </button>
                <button
                  onClick={() => !journeyIds.includes(selected.id) && addToJourney(selected.id)}
                  className={`flex-1 flex items-center justify-center rounded-xl border transition ${journeyIds.includes(selected.id) ? 'bg-[#A85735] border-[#A85735] text-white' : 'bg-white border-[#dfd8cc] text-[#233e3a] hover:bg-[#f4efe7]'}`}
                >
                  {journeyIds.includes(selected.id) ? <Navigation size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
