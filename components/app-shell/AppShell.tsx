'use client'

import React from 'react'
import { TopNav } from '@/components/navigation/TopNav'
import { MobileNav } from '@/components/navigation/MobileNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-primary flex flex-col pb-20 md:pb-0">
      <div className="hidden border-b border-border bg-primary px-5 py-2 text-center text-xs text-primary-foreground/75 md:block">
        Virasat is a cultural heritage prototype · <span className="text-[#e4b08d]">Learn with care, listen with respect.</span>
      </div>
      <TopNav />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
