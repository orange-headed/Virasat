'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { getCompanionResponse } from '@/lib/companion/engine'
import { heritageItems } from '@/lib/heritage-data'

type BuddyState = 'IDLE' | 'LISTENING' | 'THINKING' | 'EXCITED' | 'CONCERNED' | 'POINTING'

function BuddyAvatar({ state }: { state: BuddyState }) {
  const isExcited = state === 'EXCITED'
  const isThinking = state === 'THINKING'
  const isConcerned = state === 'CONCERNED'
  
  return (
    <div className={`relative flex items-center justify-center transition-transform duration-500 cursor-pointer ${isExcited ? 'animate-bounce' : isThinking ? 'animate-pulse' : ''}`}>
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
        {/* Body */}
        <path d="M32 10C19.85 10 10 19.85 10 32V46C10 51.523 14.477 56 20 56H44C49.523 56 54 51.523 54 46V32C54 19.85 44.15 10 32 10Z" className="fill-buddy-accent"/>
        {/* Face plate */}
        <path d="M18 28C18 23.582 24.268 20 32 20C39.732 20 46 23.582 46 28V42C46 46.418 39.732 50 32 50C24.268 50 18 46.418 18 42V28Z" className="fill-buddy-surface"/>
        
        {/* Eyes */}
        {!isConcerned && (
          <>
            <circle cx="26" cy="34" r="3.5" className={`fill-buddy-primary ${isExcited ? 'animate-pulse' : ''}`} />
            <circle cx="38" cy="34" r="3.5" className={`fill-buddy-primary ${isExcited ? 'animate-pulse' : ''}`} />
          </>
        )}
        {isConcerned && (
          <>
            <path d="M23 33 Q26 30 29 35" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-buddy-primary" />
            <path d="M35 35 Q38 30 41 33" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" className="text-buddy-primary" />
          </>
        )}
        
        {/* Blushes */}
        {isExcited && (
          <>
            <ellipse cx="21" cy="38" rx="2.5" ry="1.5" className="fill-buddy-primary opacity-30" />
            <ellipse cx="43" cy="38" rx="2.5" ry="1.5" className="fill-buddy-primary opacity-30" />
          </>
        )}
        
        {/* Mouth */}
        {!isThinking && !isConcerned && (
           <path d="M30 41 Q32 43 34 41" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className="text-buddy-primary"/>
        )}
        {isThinking && (
           <circle cx="32" cy="41" r="2" className="fill-buddy-primary" />
        )}
        {isConcerned && (
           <path d="M30 42 Q32 40 34 42" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" className="text-buddy-primary"/>
        )}
      </svg>
    </div>
  )
}

export function CulturalCompanion() {
  const { activeScreen, detailId, savedIds, journeyIds } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState<BuddyState>('IDLE')
  const [response, setResponse] = useState<string | null>(null)

  const contextItem = detailId ? heritageItems.find(i => i.id === detailId) : null

  useEffect(() => {
    if (!isOpen) {
      setState('EXCITED')
      const t = setTimeout(() => setState('IDLE'), 2500)
      return () => clearTimeout(t)
    }
  }, [detailId, savedIds.length, journeyIds.length, activeScreen, isOpen])

  const getGreeting = () => {
    if (activeScreen === 'Map') return "Want to explore something nearby?"
    if (activeScreen === 'Heritage DNA') return "Your strongest cultural lens shapes your recommendations."
    if (activeScreen === 'Journey') return `Your journey has ${journeyIds.length} heritage stops.`
    if (activeScreen === 'Saved') return `You've saved ${savedIds.length} heritage places.`
    if (contextItem) return "Curious about this place?"
    return "I found something that matches your heritage DNA."
  }

  const getSuggestions = () => {
    if (contextItem) return ['Tell me its story', 'How was it built?', 'Why does it matter?']
    if (activeScreen === 'Map') return ['Find heritage near me']
    if (activeScreen === 'Journey') return ['Explain my journey']
    return ['Show me ancient architecture', 'Tell me a cultural story']
  }

  const handleAction = (intent: string) => {
    setState('THINKING')
    setResponse(null)
    setTimeout(() => {
      const res = getCompanionResponse({ intent, contextItem, currentScreen: activeScreen })
      setResponse(res)
      if (res.includes('does not yet have a verified record') || res.includes('prototype does not yet')) {
        setState('CONCERNED')
      } else {
        setState('EXCITED')
        setTimeout(() => setState('LISTENING'), 3000)
      }
    }, 800)
  }

  const close = () => {
    setIsOpen(false)
    setResponse(null)
    setState('IDLE')
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setState('LISTENING') }}
          className="fixed bottom-[80px] right-4 z-40 md:bottom-8 md:right-8 transition-transform hover:scale-105"
          aria-label="Virasat Buddy"
        >
          <BuddyAvatar state={state} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-[80px] right-4 left-4 z-50 md:left-auto md:w-[340px] md:bottom-8 md:right-8 flex flex-col items-end">
          <div className="mb-2 self-end" onClick={close} role="button" aria-label="Close buddy">
            <BuddyAvatar state={state} />
          </div>
          <div className="w-full rounded-3xl bg-surface border border-border p-5 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-[22px] text-primary pr-4 leading-snug">
                {response ? response : getGreeting()}
              </h3>
            </div>
            
            {!response && (
              <div className="flex flex-col gap-2 mt-4">
                {getSuggestions().map((s) => (
                  <button
                    key={s}
                    onClick={() => handleAction(s)}
                    className="w-full rounded-2xl bg-surface-elevated border border-border p-3 text-left text-sm text-accent font-semibold transition hover:border-accent hover:bg-surface"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {response && (
              <button 
                onClick={() => { setResponse(null); setState('LISTENING') }}
                className="mt-4 rounded-full px-4 py-2 bg-surface-elevated text-xs font-semibold uppercase tracking-widest text-accent hover:bg-border transition border border-border"
              >
                ← Ask something else
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
