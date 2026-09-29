'use client'

import React, { useState } from 'react'
import { Sparkles, Brain, Clock, ChevronRight } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { dnaDefaults } from '@/lib/heritage-data'

export function DNA() {
  const { dna, recentIds } = useAppContext()
  const [showSliders, setShowSliders] = useState(false)

  // In a real app we'd construct reasons from actual history. 
  // Here we'll derive some generic explanations based on recent activity.
  const hasRecent = recentIds.length > 0
  const topTrait = Object.entries(dna).sort((a, b) => b[1] - a[1])[0][0]

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-surface text-accent shadow-sm border border-border">
          <Sparkles size={28} />
        </div>
        <h1 className="font-serif text-4xl text-primary">Your Heritage DNA</h1>
        <p className="mt-3 text-muted">
          Virasat learns from the places, stories, traditions and people you choose to explore.
        </p>
      </div>

      <div className="mb-8 rounded-3xl bg-surface-elevated p-6 shadow-sm border border-border">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2 text-primary">
            <Brain size={20} className="text-accent" />
            <h2 className="font-serif text-2xl">Your Current Profile</h2>
          </div>
          <button 
            onClick={() => setShowSliders(!showSliders)}
            className="text-xs font-semibold text-accent uppercase tracking-wider hover:underline"
          >
            {showSliders ? 'Hide Sliders' : 'View Sliders'}
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(dnaDefaults).map(([key, defaultValue]) => {
            const val = dna[key] ?? defaultValue
            const isZero = val === 0
            
            return (
              <div key={key}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-primary">{key}</span>
                  <span className={isZero ? "text-muted italic" : "text-muted"}>
                    {isZero ? "Still learning" : `${val}%`}
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${val}%` }}
                  />
                </div>
                {showSliders && (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    readOnly
                    className="mt-2 w-full accent-primary opacity-50 cursor-not-allowed"
                    title="DNA is learned from behavior, not manually set."
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-surface p-6 text-primary border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-accent" />
          <h2 className="font-serif text-2xl">Why is my DNA changing?</h2>
        </div>
        
        {hasRecent ? (
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <ChevronRight size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Your <strong className="font-semibold">{topTrait}</strong> preference increased because you recently explored heritage closely tied to it.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <ChevronRight size={16} className="text-accent shrink-0 mt-0.5" />
              <span>Saving items and adding them to your Journey sends strong signals to Virasat.</span>
            </li>
          </ul>
        ) : (
          <p className="text-sm">
            Your DNA is currently waiting to learn from your interactions. Start exploring, reading stories, and saving heritage to see Virasat adapt to your interests!
          </p>
        )}
      </div>
    </div>
  )
}
