'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { dnaDefaults, HeritageItem, type NavItem, locationCoordinates, heritageItems } from '@/lib/heritage-data'
import { RecommendationResult, getRecommendedHeritage } from '@/lib/recommendation'
import { InteractionAction, InteractionEvent, deriveDNAFromBehavior, getInitialDNA } from '@/lib/personalization'
import { triggerBuddyEvent } from '@/lib/buddy/events'

type AppState = {
  activeScreen: NavItem
  setActiveScreen: (screen: NavItem) => void
  detailId: string | null
  setDetailId: (id: string | null) => void
  savedIds: string[]
  toggleSave: (item: HeritageItem) => void
  journeyIds: string[]
  addToJourney: (id: string) => void
  removeFromJourney: (id: string) => void
  moveJourneyItem: (index: number, direction: 'up' | 'down') => void
  dna: Record<string, number>
  setDnaValue: (key: string, value: number) => void
  recentIds: string[]
  trackInteraction: (id: string, action: InteractionAction) => void
  companionOpen: boolean
  setCompanionOpen: (open: boolean) => void
  companionPrompt: string | null
  setCompanionPrompt: (prompt: string | null) => void
  userLocation: [number, number]
  setUserLocation: (loc: [number, number]) => void
  theme: 'light' | 'dark' | 'virasat'
  setTheme: (theme: 'light' | 'dark' | 'virasat') => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<NavItem>('Discover')
  const [detailId, setDetailId] = useState<string | null>(null)
  
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [journeyIds, setJourneyIds] = useState<string[]>([])
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [dna, setDnaState] = useState<Record<string, number>>(dnaDefaults)
  
  const [companionOpen, setCompanionOpen] = useState(false)
  const [companionPrompt, setCompanionPrompt] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number]>(locationCoordinates)
  const [theme, setThemeState] = useState<'light' | 'dark' | 'virasat'>('virasat')

  useEffect(() => {
    try {
      // CLEAR OLD DATA!
      localStorage.removeItem('virasat-heritage-dna')
      localStorage.removeItem('virasat-behavior-history')
      localStorage.removeItem('virasat-recent')
      localStorage.removeItem('virasat-dna-deltas')

      const s = localStorage.getItem('virasat-saved')
      if (s) setSavedIds(JSON.parse(s))
      const j = localStorage.getItem('virasat-journey')
      if (j) setJourneyIds(JSON.parse(j))
      
      const d = localStorage.getItem('virasat-dna-v2')
      if (d) {
        setDnaState(JSON.parse(d))
      } else {
        setDnaState(getInitialDNA())
      }
      
      const r = localStorage.getItem('virasat-recent-v2')
      if (r) setRecentIds(JSON.parse(r))
      
      const t = localStorage.getItem('virasat-theme')
      if (t === 'light' || t === 'dark' || t === 'virasat') {
        setThemeState(t)
        document.documentElement.setAttribute('data-theme', t)
      } else {
        document.documentElement.setAttribute('data-theme', 'virasat')
      }
    } catch {}
    
    if (typeof window !== 'undefined') {
      ;(window as any).resetVirasatPersonalization = () => {
        localStorage.removeItem('virasat-dna-v2')
        localStorage.removeItem('virasat-behavior-v2')
        localStorage.removeItem('virasat-recent-v2')
        // We explicitly keep savedIds and journeyIds intact as they are valid app state,
        // but we flush all learned personalization.
        setDnaState(getInitialDNA())
        setRecentIds([])
        console.log('✅ Virasat personalization reset (v2). DNA is now 0. Refreshing...')
        
        triggerBuddyEvent({ type: 'BUDDY_REBOOT' })
        
        setTimeout(() => window.location.reload(), 2500)
      }
    }
  }, [])

  const setTheme = (newTheme: 'light' | 'dark' | 'virasat') => {
    setThemeState(newTheme)
    localStorage.setItem('virasat-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const recalculateDNA = () => {
    setDnaState(prevDna => {
      let activeSavedIds = savedIds
      let activeJourneyIds = journeyIds
      let history: InteractionEvent[] = []
      try {
        activeSavedIds = JSON.parse(localStorage.getItem('virasat-saved') || '[]')
        activeJourneyIds = JSON.parse(localStorage.getItem('virasat-journey') || '[]')
        history = JSON.parse(localStorage.getItem('virasat-behavior-v2') || '[]')
      } catch {}

      const nextDNA = deriveDNAFromBehavior(history, activeSavedIds, activeJourneyIds, heritageItems)
      localStorage.setItem('virasat-dna-v2', JSON.stringify(nextDNA))
      
      console.log(`[DNA DEBUG] Recalculated. Before: ${JSON.stringify(prevDna)}, After: ${JSON.stringify(nextDNA)}`)
      return nextDNA
    })
  }

  const trackInteraction = (id: string, action: InteractionAction) => {
    // 1. Update Recent
    if (action === 'VIEW' || action === 'OPEN_DETAIL') {
      const nextRecent = [id, ...recentIds.filter(i => i !== id)].slice(0, 10)
      setRecentIds(nextRecent)
      localStorage.setItem('virasat-recent-v2', JSON.stringify(nextRecent))
    }

    // 2. Update DNA via Behavior History (Source of Truth)
    const item = heritageItems.find(i => i.id === id)
    if (item && item.dnaProfile) {
      // Log behavior history
      let history: InteractionEvent[] = []
      try {
        history = JSON.parse(localStorage.getItem('virasat-behavior-v2') || '[]')
        history.unshift({ id, action, timestamp: Date.now() })
        history = history.slice(0, 50)
        localStorage.setItem('virasat-behavior-v2', JSON.stringify(history))
      } catch {}

      recalculateDNA()
      
      // Trigger buddy event for tracking interactions
      if (action === 'OPEN_DETAIL') {
        triggerBuddyEvent({ type: 'BUDDY_THINKING' })
      } else if (action === 'SEARCH') {
        triggerBuddyEvent({ type: 'BUDDY_THINKING' })
      }
    }
  }

  const toggleSave = (item: HeritageItem) => {
    setSavedIds(prev => {
      const isSaved = prev.includes(item.id)
      const next = isSaved
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
      localStorage.setItem('virasat-saved', JSON.stringify(next))
      setTimeout(() => recalculateDNA(), 0)
      
      if (!isSaved) {
        triggerBuddyEvent({ type: 'BUDDY_FAVORITED' })
      }
      return next
    })
  }

  const addToJourney = (id: string) => {
    setJourneyIds(prev => {
      if (!prev.includes(id)) {
        triggerBuddyEvent({ type: 'BUDDY_JOURNEY_ADD' })
        const next = [...prev, id]
        localStorage.setItem('virasat-journey', JSON.stringify(next))
        setTimeout(() => recalculateDNA(), 0)
        return next
      }
      return prev
    })
  }

  const removeFromJourney = (id: string) => {
    setJourneyIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id)
        localStorage.setItem('virasat-journey', JSON.stringify(next))
        setTimeout(() => recalculateDNA(), 0)
        return next
      }
      return prev
    })
  }
  
  const moveJourneyItem = (index: number, direction: 'up' | 'down') => {
    const next = [...journeyIds]
    if (direction === 'up' && index > 0) {
      [next[index - 1], next[index]] = [next[index], next[index - 1]]
      setJourneyIds(next)
      localStorage.setItem('virasat-journey', JSON.stringify(next))
    } else if (direction === 'down' && index < next.length - 1) {
      [next[index + 1], next[index]] = [next[index], next[index + 1]]
      setJourneyIds(next)
      localStorage.setItem('virasat-journey', JSON.stringify(next))
    }
  }

  const setDnaValue = (key: string, value: number) => {
    const next = { ...dna, [key]: value }
    setDnaState(next)
    localStorage.setItem('virasat-dna-v2', JSON.stringify(next))
  }

  const handleSetActiveScreen = (screen: NavItem) => {
    setDetailId(null);
    if (activeScreen !== screen) {
      triggerBuddyEvent({ type: 'BUDDY_GREETING' })
    }
    setActiveScreen(screen);
  }
  
  const handleSetDetailId = (id: string | null) => {
    setDetailId(id)
    if (id) {
      trackInteraction(id, 'OPEN_DETAIL')
    }
  }

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen: handleSetActiveScreen,
        detailId,
        setDetailId: handleSetDetailId,
        savedIds,
        toggleSave,
        journeyIds,
        addToJourney,
        removeFromJourney,
        moveJourneyItem,
        dna,
        setDnaValue,
        recentIds,
        trackInteraction,
        companionOpen,
        setCompanionOpen,
        companionPrompt,
        setCompanionPrompt,
        userLocation,
        setUserLocation,
        theme,
        setTheme
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
