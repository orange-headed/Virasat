'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useAppContext } from '@/lib/store'
import { getCompanionResponse } from '@/lib/companion/engine'
import { heritageItems } from '@/lib/heritage-data'

type Message = { id: string; role: 'user' | 'assistant'; text: string }

export function CulturalCompanion() {
  const { companionOpen, setCompanionOpen, activeScreen, detailId } = useAppContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const contextItem = detailId ? heritageItems.find(i => i.id === detailId) : null

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, companionOpen])

  // Contextual suggestions based on screen
  const getSuggestions = () => {
    if (activeScreen === 'Map') return ['Find heritage near me', 'What can I explore nearby?']
    if (activeScreen === 'Heritage DNA') return ['Why am I seeing these recommendations?', 'Change my heritage preferences']
    if (activeScreen === 'Journey') return ['Explain my journey', 'Suggest another cultural stop']
    if (contextItem) return ['Tell me the story behind this place', 'How was this built?', 'Why is this culturally important?']
    return ['What is Virasat?', 'Show me ancient architecture', 'Tell me a cultural story']
  }

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    
    // Simulate delay
    setTimeout(() => {
      const response = getCompanionResponse({ intent: text, contextItem, currentScreen: activeScreen })
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: response }
      setMessages(prev => [...prev, assistantMsg])
    }, 600)
  }

  return (
    <>
      <button
        onClick={() => setCompanionOpen(true)}
        className={`fixed bottom-6 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#A85735] text-white shadow-xl transition hover:scale-105 ${companionOpen ? 'hidden' : 'block'}`}
        aria-label="Ask the cultural companion"
      >
        <MessageCircle size={22} />
      </button>

      {companionOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col rounded-t-3xl border-t border-[#d9d0c3] bg-[#faf8f3] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:bottom-6 md:left-auto md:right-6 md:h-[520px] md:w-[380px] md:rounded-3xl md:border">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#e6dfd5] px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#A85735]" size={20} />
              <div>
                <h2 className="font-serif text-xl text-[#233e3a]">Virasat Companion</h2>
                <p className="text-[10px] uppercase tracking-wider text-[#A85735]">Prototype AI</p>
              </div>
            </div>
            <button
              onClick={() => setCompanionOpen(false)}
              className="rounded-full p-2 text-[#68736e] transition hover:bg-[#e9dfd3]"
              aria-label="Close companion"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-[#68736e] mt-4">
                <p>I can help you explore the cultural context here. I connect your questions to structured heritage records.</p>
                {contextItem && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#e9dfd3] px-3 py-1 text-xs font-medium text-[#A85735]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A85735]" />
                    Context: {contextItem.name}
                  </div>
                )}
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#A85735] text-white rounded-br-sm' 
                    : 'bg-[#e9dfd3] text-[#233e3a] rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="shrink-0 px-4 pb-3 no-scrollbar flex overflow-x-auto gap-2">
            {getSuggestions().map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap rounded-full border border-[#d9d0c3] bg-white px-3 py-1.5 text-xs text-[#A85735] transition hover:border-[#A85735] hover:bg-gray-50 shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-[#e6dfd5] p-4 bg-white md:rounded-b-3xl">
            <div className="flex items-center gap-2 rounded-full bg-[#f4efe7] px-4 py-2 border border-[#d9d0c3] focus-within:border-[#A85735] transition">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask about culture..."
                className="flex-1 bg-transparent text-sm outline-none text-[#233e3a]"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="grid size-8 place-items-center rounded-full bg-[#A85735] text-white disabled:opacity-50 transition"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
