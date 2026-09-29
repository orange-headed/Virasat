'use client'

import React, { useRef, useEffect } from 'react'
import { Compass, MapPin, Navigation, Bookmark, Sparkles, UserRound } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { CulturalCompanion } from '@/components/companion/CulturalCompanion'
import { Logo } from '@/components/app-shell/Logo'
import { useScrollDirection } from '@/lib/useScrollDirection'

export function TopNav() {
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
    <>
      <CulturalCompanion />
      <header 
        className={`sticky top-0 z-40 border-b border-[#dfd8cc] bg-[#faf8f3]/95 backdrop-blur-md transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-10">
          {/* Left: Branding */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {items.map(({ label, icon: Icon }) => {
              const isActive = activeScreen === label
              return (
                <button
                  key={label}
                  onClick={() => setActiveScreen(label as any)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
                    isActive
                      ? 'bg-[#233e3a] text-white shadow-sm'
                      : 'text-[#68736e] hover:bg-[#e9dfd3] hover:text-[#233e3a]'
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </button>
              )
            })}
          </nav>

          {/* Right: Profile */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveScreen('Profile')}
              className="grid size-10 place-items-center rounded-full bg-[#e9dfd3] text-[#233e3a] transition hover:bg-[#dfd3c5] active:scale-95"
              aria-label="User Profile"
            >
              <UserRound size={18} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
