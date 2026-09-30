'use client'

import React, { useState } from 'react'
import { ChevronRight, MapPin, Heart, Bookmark, Plus, Navigation, ExternalLink, Sparkles, BookOpen, Hammer, Utensils, Music, Users, Link as LinkIcon, Compass } from 'lucide-react'
import { type HeritageItem, heritageItems } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { imageStyle } from '@/lib/utils'
import { InteractionAction } from '@/lib/personalization'
import { ImageCard } from '@/components/heritage/ImageCard'
import { triggerBuddyEvent } from '@/lib/buddy/events'

export function Detail({ item }: { item: HeritageItem }) {
  const { setDetailId, savedIds, toggleSave, journeyIds, addToJourney, setActiveScreen, trackInteraction, dna } = useAppContext()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  
  const saved = savedIds.includes(item.id)
  const inJourney = journeyIds.includes(item.id)
  
  const onBack = () => setDetailId(null)
  const onSave = () => toggleSave(item)

  const handleExpand = (title: string, action: InteractionAction) => {
    if (expandedSection === title) {
      setExpandedSection(null)
      import('@/lib/buddy/events').then(m => m.triggerBuddyEvent({ type: 'BUDDY_IDLE' }))
    } else {
      setExpandedSection(title)
      trackInteraction(item.id, action)
      import('@/lib/buddy/events').then(m => m.triggerBuddyEvent({ type: 'BUDDY_EXPLAIN' }))
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

  React.useEffect(() => {
    import('@/lib/buddy/events').then(m => m.triggerBuddyEvent({ type: 'BUDDY_THINKING' }))
    
    const t = setTimeout(() => {
      if (matchedTraits.length > 0) {
        import('@/lib/buddy/events').then(m => m.triggerBuddyEvent({ type: 'BUDDY_DNA_MATCH', payload: { matchPercentage: matchedTraits[0].itemScore } }))
      } else {
        import('@/lib/buddy/events').then(m => m.triggerBuddyEvent({ type: 'BUDDY_IDLE' }))
      }
    }, 1200)
    
    return () => clearTimeout(t)
  }, [item.id])

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-4 md:px-8 md:pb-16">
      <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-primary">
        <ChevronRight className="rotate-180" size={16} /> Back
      </button>
      
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <div className="aspect-[1.3] bg-cover bg-center md:aspect-[2.2]" style={imageStyle(item.image)} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#e4b08d]">
            <span>{item.category}</span>
            {item.tags.map(t => <span key={t}>· {t}</span>)}
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight md:text-5xl">{item.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-primary-foreground/90">
            <MapPin size={16} />
            {item.location}, {item.state}
          </p>
        </div>
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={onSave}
            className="grid size-10 place-items-center rounded-full bg-black/20 text-primary-foreground backdrop-blur transition hover:bg-black/40"
            aria-label="Save heritage"
          >
            {saved ? <Heart fill="currentColor" size={18} /> : <Bookmark size={18} />}
          </button>
          {!inJourney ? (
            <button
              onClick={() => addToJourney(item.id)}
              className="grid size-10 place-items-center rounded-full bg-black/20 text-primary-foreground backdrop-blur transition hover:bg-accent"
              aria-label="Add to journey"
            >
              <Plus size={20} />
            </button>
          ) : (
            <button
              onClick={() => { setDetailId(null); setActiveScreen('Journey'); }}
              className="grid size-10 place-items-center rounded-full bg-accent text-primary-foreground shadow-md transition hover:hover:bg-accent/80"
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
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-accent">Why it matters</p>
            <p className="mt-2 font-serif text-2xl leading-snug text-primary">{item.significance}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{item.overview || item.description}</p>
          </section>
          
          {/* DYNAMIC SECTIONS */}
          <div className="space-y-4 pt-6 border-t border-border">
            {item.stories && item.stories.length > 0 && (
              <div className="rounded-2xl border border-border bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('stories', 'READ_STORY')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-accent" />
                    <h3 className="font-serif text-xl text-primary">The Story</h3>
                  </div>
                  <ChevronRight size={20} className={`text-accent transition-transform ${expandedSection === 'stories' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'stories' && (
                  <div className="p-5 pt-5 border-t border-border mt-2 animate-in fade-in space-y-8">
                    {item.stories.map((story, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{story.type}</span>
                        <h4 className="font-serif text-xl text-primary">{story.title}</h4>
                        <p className="text-sm leading-relaxed text-muted">{story.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(item.architecture || item.construction) && (
              <div className="rounded-2xl border border-border bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('architecture', 'VIEW_ARCHITECTURE')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Hammer size={20} className="text-accent" />
                    <h3 className="font-serif text-xl text-primary">How It Was Built</h3>
                  </div>
                  <ChevronRight size={20} className={`text-accent transition-transform ${expandedSection === 'architecture' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'architecture' && (
                  <div className="p-5 pt-5 border-t border-border mt-2 animate-in fade-in space-y-8">
                    {item.architecture && (
                      <div className="space-y-3">
                        <h4 className="font-serif text-xl text-primary">Architecture & Style</h4>
                        {item.architecture.style && <p className="text-sm font-medium text-accent">{item.architecture.style}</p>}
                        <p className="text-sm leading-relaxed text-muted">{item.architecture.description}</p>
                        {item.architecture.features && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.architecture.features.map(f => <span key={f} className="rounded-md bg-surface-elevated px-3 py-1.5 text-xs font-medium text-primary">{f}</span>)}
                          </div>
                        )}
                      </div>
                    )}
                    {item.construction && (
                      <div className="pt-8 border-t border-border/50 space-y-3">
                        <h4 className="font-serif text-xl text-primary">Construction & Materials</h4>
                        <p className="text-sm leading-relaxed text-muted">{item.construction.summary}</p>
                        {item.construction.materials && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.construction.materials.map(m => <span key={m} className="rounded-md bg-surface-elevated px-3 py-1.5 text-xs font-medium text-primary">{m}</span>)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {(item.traditions || item.crafts || item.foodHeritage || item.music) && (
              <div className="rounded-2xl border border-border bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('living', 'VIEW_TRADITION')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Compass size={20} className="text-accent" />
                    <h3 className="font-serif text-xl text-primary">Living Heritage</h3>
                  </div>
                  <ChevronRight size={20} className={`text-accent transition-transform ${expandedSection === 'living' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'living' && (
                  <div className="p-5 pt-5 border-t border-border mt-2 animate-in fade-in space-y-8">
                    {item.traditions && item.traditions.map((t, i) => (
                      <div key={`t-${i}`} className="space-y-2">
                        <h4 className="font-serif text-xl text-primary">{t.name}</h4>
                        <p className="text-sm leading-relaxed text-muted">{t.description}</p>
                      </div>
                    ))}
                    {item.crafts && item.crafts.map((c, i) => (
                      <div key={`c-${i}`} className="pt-8 border-t border-border/50 space-y-2">
                        <h4 className="font-serif text-xl text-primary flex items-center gap-2"><Hammer size={16} className="text-accent"/> {c.name}</h4>
                        <p className="text-sm leading-relaxed text-muted">{c.description}</p>
                      </div>
                    ))}
                    {item.foodHeritage && item.foodHeritage.map((f, i) => (
                      <div key={`f-${i}`} className="pt-8 border-t border-border/50 space-y-2">
                        <h4 className="font-serif text-xl text-primary flex items-center gap-2"><Utensils size={16} className="text-accent"/> {f.name}</h4>
                        <p className="text-sm leading-relaxed text-muted">{f.description}</p>
                      </div>
                    ))}
                    {item.music && item.music.map((m, i) => (
                      <div key={`m-${i}`} className="pt-8 border-t border-border/50 space-y-2">
                        <h4 className="font-serif text-xl text-primary flex items-center gap-2"><Music size={16} className="text-accent"/> {m.name}</h4>
                        <p className="text-sm leading-relaxed text-muted">{m.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {item.localPeople && item.localPeople.length > 0 && (
              <div className="rounded-2xl border border-border bg-[#faf9f6] overflow-hidden">
                <button 
                  onClick={() => handleExpand('people', 'VIEW_TRADITION')}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-accent" />
                    <h3 className="font-serif text-xl text-primary">People & Custodians</h3>
                  </div>
                  <ChevronRight size={20} className={`text-accent transition-transform ${expandedSection === 'people' ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === 'people' && (
                  <div className="p-5 pt-5 border-t border-border mt-2 animate-in fade-in space-y-8">
                    {item.localPeople.map((person, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{person.type}</span>
                        <h4 className="font-serif text-xl text-primary">{person.name} <span className="text-sm font-sans font-normal text-muted">({person.role})</span></h4>
                        <p className="text-sm leading-relaxed text-muted">{person.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {item.culturalExperiences && item.culturalExperiences.length > 0 && (
              <div className="rounded-2xl border border-border bg-[#faf9f6] p-6">
                <h3 className="font-serif text-xl text-primary mb-5">Cultural Experiences</h3>
                <div className="space-y-6">
                  {item.culturalExperiences.map((exp, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1.5 size-2 rounded-full bg-accent shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-primary">{exp.title}</h4>
                        <p className="text-sm leading-relaxed text-muted">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* SOURCES */}
          {item.sources && item.sources.length > 0 && (
            <section className="pt-6 border-t border-border">
              <h3 className="font-serif text-lg text-primary flex items-center gap-2 mb-3">
                <LinkIcon size={16} className="text-accent" /> References & Sources
              </h3>
              <ul className="space-y-2">
                {item.sources.map((src, idx) => (
                  <li key={idx} className="text-xs text-muted">
                    <span className="font-medium text-primary">{src.title}</span> — {src.organization}
                    {src.url && <a href={src.url} target="_blank" rel="noreferrer" className="ml-1 text-accent hover:underline">Link</a>}
                  </li>
                ))}
              </ul>
            </section>
          )}

        </main>
        
        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          {/* YOUR CONNECTION */}
          <div className="rounded-3xl bg-surface-elevated p-6 text-primary">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-accent" />
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
                      <div className="h-1.5 w-full bg-surface-elevated/50 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${trait.itemScore}%` }} />
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
            <div className="rounded-3xl border border-border bg-surface-elevated p-6">
              <h2 className="font-serif text-xl text-primary mb-4">Continue your cultural trail</h2>
              <div className="space-y-4">
                {related.map(rel => (
                  <button 
                    key={rel.id} 
                    onClick={() => setDetailId(rel.id)}
                    className="flex w-full items-start gap-3 text-left group"
                  >
                    <div className="size-16 rounded-xl bg-cover bg-center shrink-0 border border-border transition group-hover:border-accent" style={imageStyle(rel.image)} />
                    <div className="flex-1 py-1">
                      <h4 className="font-serif text-primary group-hover:text-accent transition">{rel.name}</h4>
                      <p className="text-[10px] text-muted uppercase tracking-wider mt-1">{rel.category}</p>
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
