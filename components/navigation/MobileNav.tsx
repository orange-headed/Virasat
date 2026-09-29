'use client'

import React from 'react'
import { Compass, MapPin, Navigation, Bookmark, Sparkles } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { useScrollDirection } from '@/lib/useScrollDirection'

export function MobileNav() {
  const { activeScreen, setActiveScreen } = useAppContext()
  const { scrollDirection, isAtTop } = useScrollDirection()
  
  const isHidden = scrollDirection === 'down' && !isAtTop
  
  const items = [
    { label: 'Discover', icon: Compass },
    { label: 'Map', icon: MapPin },
    { label: 'Journey', icon: Navigation },
    { label: 'Saved', icon: Bookmark },
    { label: 'Heritage DNA', icon: Sparkles }
  ] as const

  return (
    <nav 
      className={`fixed bottom-0 inset-x-0 z-50 flex items-center justify-around border-t border-[#dfd8cc] bg-[#faf8f3]/95 px-2 pb-6 pt-2 backdrop-blur-md md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      {items.map(({ label, icon: Icon }) => {
        const isActive = activeScreen === label
        return (
          <button
            key={label}
            onClick={() => setActiveScreen(label as any)}
            className={`flex flex-col items-center gap-1.5 p-2 transition w-16 active:scale-95 ${
              isActive ? 'text-[#233e3a]' : 'text-[#8b938e] hover:text-[#233e3a]'
            }`}
            aria-label={label}
          >
            <div className={`grid place-items-center rounded-xl p-1.5 transition ${isActive ? 'bg-[#e9dfd3] shadow-sm' : 'bg-transparent'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-semibold leading-none tracking-wide ${isActive ? 'text-[#233e3a]' : 'text-[#8b938e]'}`}>
              {label === 'Heritage DNA' ? 'DNA' : label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
