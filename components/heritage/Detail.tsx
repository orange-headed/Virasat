'use client'

import React, { useState } from 'react'
import { ChevronRight, MapPin, Heart, Bookmark, Plus, Navigation, ExternalLink, Sparkles, BookOpen, Hammer, Utensils, Music, Users, Link as LinkIcon, Compass } from 'lucide-react'
import { type HeritageItem, heritageItems } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { imageStyle } from '@/lib/utils'
import { ActionType } from '@/lib/recommendation'
import { ImageCard } from '@/components/heritage/ImageCard'

export function Detail({ item }: { item: HeritageItem }) {
  const { setDetailId, savedIds, toggleSave, journeyIds, addToJourney, setActiveScreen, trackInteraction, dna } = useAppContext()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const saved = savedIds.includes(item.id)
  const inJourney = journeyIds.includes(item.id)
  
  const onBack = () => setDetailId(null)
  const onSave = () => toggleSave(item)

  const handleExpand = (title: string, action: ActionType) => {
    if (expandedSection === title) {
      setExpandedSection(null)
    } else {
      setExpandedSection(title)
      trackInteraction(item.id, action)
    }
  }

  // Calculate matching traits for "Your Connection"
  const matchedTraits = Object.entries(dna)
    .map(([key, value]) => ({ key, userScore: value, itemScore: item.dnaProfile[key] ?? 50 }))
    .filter(t => t.userScore > 50 && t.itemScore > 60)
    .sort((a, b) => b.itemScore - a.itemScore)
    .slice(0, 2)

  const related = item.relatedHeritageIds
    ? item.relatedHeritageIds.map(id => heritageItems.find(i => i.id === id)).filter(Boolean) as HeritageItem[]
    : []

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-4 md:px-8 md:pb-16">
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-[#68736e] transition hover:text-[#233e3a]">
        <ChevronRight className="rotate-180" size={16} /> Back
      </button>
      
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-[#233e3a] text-white">
        <div className="aspect-[1.3] bg-cover bg-center md:aspect-[2.2]" style={imageStyle(item.image)} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#e4b08d]">
            <span>{item.category}</span>
            {item.tags.map(t => <span key={t}>· {t}</span>)}
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">{item.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
            <MapPin size={16} />
            {item.location}, {item.state}
          </p>
        </div>
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={onSave}
            className="grid size-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur transition hover:bg-black/40"
            aria-label="Save heritage"
          >
            {saved ? <Heart fill="currentColor" size={18} /> : <Bookmark size={18} />}
          </button>
          {!inJourney ? (
            <button
              onClick={() => addToJourney(item.id)}
              className="grid size-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur transition hover:bg-[#A85735]"
              aria-label="Add to journey"
            >
              <Plus size={20} />
            </button>
          ) : (
            <button
              onClick={() => { setDetailId(null); setActiveScreen('Journey'); }}
              className="grid size-10 place-items-center rounded-full bg-[#A85735] text-white shadow-md transition hover:bg-[#8f472a]"
              aria-label="View in journey"
            >
              <Navigation size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_.6fr]">
        <main className="space-y-8">
          {/* OVERVIEW & SIGNIFICANCE */}
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#A85735]">Why it matters</p>
            <p className="mt-2 font-serif text-2xl leading-snug text-[#233e3a]">{item.significance}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#68736e]">{item.overview || item.description}</p>
          </section>
          
          {/* DYNAMIC SECTIONS */}
          <div className="space-y-4 pt-6 border-t border-[#dfd8cc]">
            {item.stories && item.stories.length > 0 && (
              <div className="rounded-2xl border border-[#e2dbd0] bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('stories', 'READ_STORY')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#f4efe7]"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-[#A85735]" />
                    <h3 className="font-serif text-xl text-[#233e3a]">The Story</h3>
                  </div>
                  <ChevronRight size={20} className={`text-[#A85735] transition-transform ${expandedSection === 'stories' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'stories' && (
                  <div className="p-5 pt-5 border-t border-[#dfd8cc] mt-2 animate-in fade-in space-y-8">
                    {item.stories.map((story, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A85735]">{story.type}</span>
                        <h4 className="font-serif text-xl text-[#233e3a]">{story.title}</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{story.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(item.architecture || item.construction) && (
              <div className="rounded-2xl border border-[#e2dbd0] bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('architecture', 'VIEW_ARCHITECTURE')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#f4efe7]"
                >
                  <div className="flex items-center gap-3">
                    <Hammer size={20} className="text-[#A85735]" />
                    <h3 className="font-serif text-xl text-[#233e3a]">How It Was Built</h3>
                  </div>
                  <ChevronRight size={20} className={`text-[#A85735] transition-transform ${expandedSection === 'architecture' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'architecture' && (
                  <div className="p-5 pt-5 border-t border-[#dfd8cc] mt-2 animate-in fade-in space-y-8">
                    {item.architecture && (
                      <div className="space-y-3">
                        <h4 className="font-serif text-xl text-[#233e3a]">Architecture & Style</h4>
                        {item.architecture.style && <p className="text-sm font-medium text-[#A85735]">{item.architecture.style}</p>}
                        <p className="text-sm leading-relaxed text-[#68736e]">{item.architecture.description}</p>
                        {item.architecture.features && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.architecture.features.map(f => <span key={f} className="rounded-md bg-[#e9dfd3] px-3 py-1.5 text-xs font-medium text-[#233e3a]">{f}</span>)}
                          </div>
                        )}
                      </div>
                    )}
                    {item.construction && (
                      <div className="pt-8 border-t border-[#e2dbd0]/50 space-y-3">
                        <h4 className="font-serif text-xl text-[#233e3a]">Construction & Materials</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{item.construction.summary}</p>
                        {item.construction.materials && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.construction.materials.map(m => <span key={m} className="rounded-md bg-[#e9dfd3] px-3 py-1.5 text-xs font-medium text-[#233e3a]">{m}</span>)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {(item.traditions || item.crafts || item.foodHeritage || item.music) && (
              <div className="rounded-2xl border border-[#e2dbd0] bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('living', 'VIEW_TRADITION')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#f4efe7]"
                >
                  <div className="flex items-center gap-3">
                    <Compass size={20} className="text-[#A85735]" />
                    <h3 className="font-serif text-xl text-[#233e3a]">Living Heritage</h3>
                  </div>
                  <ChevronRight size={20} className={`text-[#A85735] transition-transform ${expandedSection === 'living' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'living' && (
                  <div className="p-5 pt-5 border-t border-[#dfd8cc] mt-2 animate-in fade-in space-y-8">
                    {item.traditions && item.traditions.map((t, i) => (
                      <div key={`t-${i}`} className="space-y-2">
                        <h4 className="font-serif text-xl text-[#233e3a]">{t.name}</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{t.description}</p>
                      </div>
                    ))}
                    {item.crafts && item.crafts.map((c, i) => (
                      <div key={`c-${i}`} className="pt-8 border-t border-[#e2dbd0]/50 space-y-2">
                        <h4 className="font-serif text-xl text-[#233e3a] flex items-center gap-2"><Hammer size={16} className="text-[#A85735]"/> {c.name}</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{c.description}</p>
                      </div>
                    ))}
                    {item.foodHeritage && item.foodHeritage.map((f, i) => (
                      <div key={`f-${i}`} className="pt-8 border-t border-[#e2dbd0]/50 space-y-2">
                        <h4 className="font-serif text-xl text-[#233e3a] flex items-center gap-2"><Utensils size={16} className="text-[#A85735]"/> {f.name}</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{f.description}</p>
                      </div>
                    ))}
                    {item.music && item.music.map((m, i) => (
                      <div key={`m-${i}`} className="pt-8 border-t border-[#e2dbd0]/50 space-y-2">
                        <h4 className="font-serif text-xl text-[#233e3a] flex items-center gap-2"><Music size={16} className="text-[#A85735]"/> {m.name}</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{m.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {item.localPeople && item.localPeople.length > 0 && (
              <div className="rounded-2xl border border-[#e2dbd0] bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('people', 'VIEW_TRADITION')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-[#f4efe7]"
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-[#A85735]" />
                    <h3 className="font-serif text-xl text-[#233e3a]">People & Custodians</h3>
                  </div>
                  <ChevronRight size={20} className={`text-[#A85735] transition-transform ${expandedSection === 'people' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'people' && (
                  <div className="p-5 pt-5 border-t border-[#dfd8cc] mt-2 animate-in fade-in space-y-8">
                    {item.localPeople.map((person, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A85735]">{person.type}</span>
                        <h4 className="font-serif text-xl text-[#233e3a]">{person.name} <span className="text-sm font-sans font-normal text-[#68736e]">({person.role})</span></h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{person.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {item.culturalExperiences && item.culturalExperiences.length > 0 && (
              <div className="rounded-2xl border border-[#e2dbd0] bg-[#faf9f6] p-6">
                <h3 className="font-serif text-xl text-[#233e3a] mb-5">Cultural Experiences</h3>
                <div className="space-y-6">
                  {item.culturalExperiences.map((exp, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1.5 size-2 rounded-full bg-[#A85735] shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-[#233e3a]">{exp.title}</h4>
                        <p className="text-sm leading-relaxed text-[#68736e]">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* SOURCES */}
          {item.sources && item.sources.length > 0 && (
            <section className="pt-6 border-t border-[#dfd8cc]">
              <h3 className="font-serif text-lg text-[#233e3a] flex items-center gap-2 mb-3">
                <LinkIcon size={16} className="text-[#A85735]" /> References & Sources
              </h3>
              <ul className="space-y-2">
                {item.sources.map((src, idx) => (
                  <li key={idx} className="text-xs text-[#68736e]">
                    <span className="font-medium text-[#233e3a]">{src.title}</span> — {src.organization}
                    {src.url && <a href={src.url} target="_blank" rel="noreferrer" className="ml-1 text-[#A85735] hover:underline">Link</a>}
                  </li>
                ))}
              </ul>
            </section>
          )}

        </main>
        
        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          {/* YOUR CONNECTION */}
          <div className="rounded-3xl bg-[#e9dfd3] p-6 text-[#233e3a]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-[#A85735]" />
              <h2 className="font-serif text-xl">Why Virasat showed you this</h2>
            </div>
            {matchedTraits.length > 0 ? (
              <>
                <p className="text-sm mb-4">Your recent exploration shows a strong interest in <strong className="font-semibold">{matchedTraits.map(t => t.key).join(' and ')}</strong>.</p>
                <div className="space-y-3">
                  {matchedTraits.map(trait => (
                    <div key={trait.key}>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span>{trait.key}</span>
                        <span>{trait.itemScore}% match</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                        <div className="h-full bg-[#A85735]" style={{ width: `${trait.itemScore}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm">This is a widely recognized heritage site that serves as a great starting point for exploration.</p>
            )}
          </div>
          
          {/* RELATED */}
          {related.length > 0 && (
            <div className="rounded-3xl border border-[#e2dbd0] bg-white p-6">
              <h2 className="font-serif text-xl text-[#233e3a] mb-4">Continue your cultural trail</h2>
              <div className="space-y-4">
                {related.map(rel => (
                  <button 
                    key={rel.id} 
                    onClick={() => setDetailId(rel.id)}
                    className="flex w-full items-start gap-3 text-left group"
                  >
                    <div className="size-16 rounded-xl bg-cover bg-center shrink-0 border border-[#e2dbd0] transition group-hover:border-[#A85735]" style={imageStyle(rel.image)} />
                    <div className="flex-1 py-1">
                      <h4 className="font-serif text-[#233e3a] group-hover:text-[#A85735] transition">{rel.name}</h4>
                      <p className="text-[10px] text-[#68736e] uppercase tracking-wider mt-1">{rel.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
