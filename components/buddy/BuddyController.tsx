'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { buddyEvents, BuddyState } from '@/lib/buddy/events'
import { Buddy3D } from './Buddy3D'
import { BuddyProp } from './BuddyProp'

export function BuddyController() {
  const [state, setState] = useState<BuddyState>('IDLE')
  const [payload, setPayload] = useState<any>(null)
  
  useEffect(() => {
    const unsub = buddyEvents.subscribe((event) => {
      setPayload(event.payload || null)
      
      switch (event.type) {
        case 'BUDDY_BOOT':
          setState('BOOTING')
          setTimeout(() => setState('IDLE'), 2000)
          break
        case 'BUDDY_GREETING':
          setState('GREETING')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_REBOOT':
          setState('REBOOTING')
          setTimeout(() => setState('IDLE'), 2500)
          break
        case 'BUDDY_EXPLAIN':
          setState('EXPLAINING')
          // Explaining is persistent until IDLE is explicitly sent or it times out safely
          setTimeout(() => setState(s => s === 'EXPLAINING' ? 'IDLE' : s), 8000)
          break
        case 'BUDDY_WEATHER_ALERT':
          setState('WEATHER_ALERT')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_WEATHER_HELP':
          setState('WEATHER_HELP')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_ROUTE_CHANGED':
          setState('ROUTE_CHANGED')
          setTimeout(() => setState('IDLE'), 2500)
          break
        case 'BUDDY_UTILITY':
          setState('UTILITY')
          setTimeout(() => setState('IDLE'), 2000)
          break
        case 'BUDDY_POPULARITY':
          setState('POPULARITY')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_SPECIAL_EVENT':
          setState('SPECIAL_EVENT')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_THINKING':
          setState('THINKING')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_IDLE':
          setState('IDLE')
          break
        case 'BUDDY_CLICK':
          setState('CLICKED')
          setTimeout(() => setState('IDLE'), 1500)
          break
        case 'BUDDY_PRESS':
          setState('PRESSED')
          break
        case 'BUDDY_DRAG':
          setState('DRAGGING')
          break
        case 'BUDDY_FAVORITED':
          setState('FAVORITED')
          setTimeout(() => setState('IDLE'), 2000)
          break
        case 'BUDDY_JOURNEY_ADD':
          setState('JOURNEY_ADD')
          setTimeout(() => setState('IDLE'), 2500)
          break
        case 'BUDDY_MAP_LOADING':
          setState('LOADING_MAP')
          break
        case 'BUDDY_REVIEWS_LOADING':
          setState('LOADING_REVIEWS')
          break
        case 'BUDDY_REVIEW_RESULT':
          setState('REVIEW_EXCITED')
          setTimeout(() => setState('IDLE'), 3000)
          break
        case 'BUDDY_DNA_MATCH':
          setState('DNA_MATCH')
          setTimeout(() => setState('IDLE'), 3000)
          break
        default:
          break
      }
    })
    
    // Trigger boot sequence on mount exactly once per session
    buddyEvents.trigger({ type: 'BUDDY_BOOT' })
    
    return unsub
  }, [])

  // Pointer event tracking for Buddy
  const [isPointerDown, setIsPointerDown] = useState(false)
  const pointerStart = useRef<{ x: number, y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPointerDown(true)
    pointerStart.current = { x: e.clientX, y: e.clientY }
    buddyEvents.trigger({ type: 'BUDDY_PRESS' })
    // Capture pointer so events keep firing even outside the element
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown || !pointerStart.current) return

    const dx = e.clientX - pointerStart.current.x
    const dy = e.clientY - pointerStart.current.y
    
    let direction = ''
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 5) direction = dx > 0 ? 'right' : 'left'
    } else {
      if (Math.abs(dy) > 5) direction = dy > 0 ? 'down' : 'up'
    }
    
    if (direction) {
      buddyEvents.trigger({ type: 'BUDDY_DRAG', payload: { direction } })
    } else {
      buddyEvents.trigger({ type: 'BUDDY_PRESS' }) // Still pressing but not dragging enough
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return
    setIsPointerDown(false)
    
    if (pointerStart.current) {
      const dx = Math.abs(e.clientX - pointerStart.current.x)
      const dy = Math.abs(e.clientY - pointerStart.current.y)
      if (dx < 5 && dy < 5) {
        buddyEvents.trigger({ type: 'BUDDY_CLICK' })
      } else {
        buddyEvents.trigger({ type: 'BUDDY_IDLE' })
      }
    }
    pointerStart.current = null
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <Buddy3D state={state} payload={payload} />
          <BuddyProp state={state} />
        </Suspense>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={5} blur={2} />
      </Canvas>
    </div>
  )
}
