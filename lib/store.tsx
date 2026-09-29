'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { dnaDefaults, HeritageItem, type NavItem, locationCoordinates, heritageItems } from '@/lib/heritage-data'
import { ActionType, calculateNewDNA } from '@/lib/recommendation'

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
  trackInteraction: (id: string, action: ActionType) => void
  companionOpen: boolean
  setCompanionOpen: (open: boolean) => void
  companionPrompt: string | null
  setCompanionPrompt: (prompt: string | null) => void
  userLocation: [number, number]
  setUserLocation: (loc: [number, number]) => void
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

  useEffect(() => {
    try {
      const s = localStorage.getItem('virasat-saved')
      if (s) setSavedIds(JSON.parse(s))
      const d = localStorage.getItem('virasat-heritage-dna')
      if (d) setDnaState(JSON.parse(d))
      const j = localStorage.getItem('virasat-journey')
      if (j) setJourneyIds(JSON.parse(j))
      const r = localStorage.getItem('virasat-recent')
      if (r) setRecentIds(JSON.parse(r))
    } catch {}
  }, [])

  const trackInteraction = (id: string, action: ActionType) => {
    // 1. Update Recent
    if (action === 'VIEW' || action === 'OPEN_DETAIL') {
      const nextRecent = [id, ...recentIds.filter(i => i !== id)].slice(0, 10)
      setRecentIds(nextRecent)
      localStorage.setItem('virasat-recent', JSON.stringify(nextRecent))
    }

    // 2. Update DNA
    const item = heritageItems.find(i => i.id === id)
    if (item && item.dnaProfile) {
      const nextDNA = calculateNewDNA(dna, item.dnaProfile, action)
      setDnaState(nextDNA)
      localStorage.setItem('virasat-heritage-dna', JSON.stringify(nextDNA))
      
      // Also log behavior history for debug/transparency
      try {
        const history = JSON.parse(localStorage.getItem('virasat-behavior-history') || '[]')
        history.unshift({ id, action, timestamp: Date.now() })
        localStorage.setItem('virasat-behavior-history', JSON.stringify(history.slice(0, 50)))
      } catch {}
    }
  }

  const toggleSave = (item: HeritageItem) => {
    const next = savedIds.includes(item.id)
      ? savedIds.filter((id) => id !== item.id)
      : [...savedIds, item.id]
    setSavedIds(next)
    localStorage.setItem('virasat-saved', JSON.stringify(next))
    trackInteraction(item.id, savedIds.includes(item.id) ? 'UNSAVE' : 'SAVE')
  }

  const addToJourney = (id: string) => {
    if (!journeyIds.includes(id)) {
      const next = [...journeyIds, id]
      setJourneyIds(next)
      localStorage.setItem('virasat-journey', JSON.stringify(next))
      trackInteraction(id, 'ADD_TO_JOURNEY')
    }
  }

  const removeFromJourney = (id: string) => {
    const next = journeyIds.filter(i => i !== id)
    setJourneyIds(next)
    localStorage.setItem('virasat-journey', JSON.stringify(next))
    trackInteraction(id, 'REMOVE_FROM_JOURNEY')
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
    localStorage.setItem('virasat-heritage-dna', JSON.stringify(next))
  }

  const handleSetActiveScreen = (screen: NavItem) => {
    setDetailId(null);
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
        setUserLocation
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
