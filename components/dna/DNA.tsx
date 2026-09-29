'use client'

import React from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { dnaDefaults } from '@/lib/heritage-data'

export function DNA() {
  const { dna, setDnaValue } = useAppContext()

  const resetDNA = () => {
    Object.entries(dnaDefaults).forEach(([key, val]) => {
      setDnaValue(key, val)
    })
  }

  const averageMatch = Math.round(Object.values(dna).reduce((a, b) => a + b, 0) / Object.keys(dna).length)

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-5 md:px-8 md:pb-12">
      <div className="mt-4 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#A85735]">Personalization, with context</p>
        <h1 className="mt-1 font-serif text-4xl leading-none text-[#233e3a] md:text-5xl">Your Heritage DNA.</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#68736e]">
          A living picture of what draws you in. Tune it as you discover — it directly shapes your recommendations across Virasat.
        </p>
      </div>
      
      <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-[1fr_.8fr]">
        <div className="rounded-3xl bg-[#233e3a] p-5 text-white shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.16em] text-[#e4b08d] font-bold">Your cultural compass</p>
              <p className="mt-1 font-serif text-2xl md:text-3xl">Curious & rooted</p>
            </div>
            <Sparkles className="text-[#e4b08d]" size={20} />
          </div>
          <div
            className="relative mx-auto my-6 grid aspect-square max-w-[200px] w-full place-items-center rounded-full border border-white/20"
            style={{ background: 'conic-gradient(from 20deg, #e4b08d, #a85735, #6a887b, #e4b08d)' }}
          >
            <div className="grid size-[82%] place-items-center rounded-full bg-[#233e3a] text-center shadow-lg">
              <div>
                <span className="block font-serif text-5xl">{averageMatch}</span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-white/60">Affinity</span>
              </div>
            </div>
          </div>
          <p className="text-center text-xs leading-relaxed text-white/70">
            You lean toward places where architecture, stories and everyday life meet. Recommendations update instantly based on your values.
          </p>
        </div>
        
        <div className="rounded-3xl border border-[#ded6ca] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#233e3a]">Tune your lenses</h2>
              <p className="mt-1 text-xs text-[#68736e]">Move sliders to refine matches.</p>
            </div>
            <button onClick={resetDNA} className="p-2 text-[#A85735] hover:bg-[#f4efe7] rounded-full transition" aria-label="Reset DNA">
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="mt-6 space-y-5">
            {Object.entries(dna).map(([key, value]) => (
              <label key={key} className="block group">
                <div className="mb-1.5 flex justify-between text-xs font-medium text-[#233e3a]">
                  <span>{key}</span>
                  <span className="text-[#A85735]">{value}</span>
                </div>
                <input
                  aria-label={`${key} interest`}
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setDnaValue(key, Number(e.target.value))}
                  className="h-1.5 w-full appearance-none rounded-full bg-[#e3dbcf] accent-[#A85735] outline-none group-hover:bg-[#d8cwb8] transition"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
