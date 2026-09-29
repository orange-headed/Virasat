'use client'

import React, { useMemo } from 'react'
import { appName, appTagline, heritageItems, recommendHeritage } from '@/lib/heritage-data'
import { useAppContext } from '@/lib/store'
import { Discover } from '@/components/discover/Discover'
import { MapView } from '@/components/map/MapView'
import { Journey } from '@/components/journey/Journey'
import { Saved } from '@/components/saved/Saved'
import { DNA } from '@/components/dna/DNA'
import { Detail } from '@/components/heritage/Detail'
import { Profile } from '@/components/profile/Profile'
import { AppShell } from '@/components/app-shell/AppShell'

export default function Page() {
  const { activeScreen, detailId, dna } = useAppContext()
  const detail = detailId ? heritageItems.find((item) => item.id === detailId) : null
  const recommendation = useMemo(() => recommendHeritage(dna)[0], [dna])

  return (
    <AppShell>
      {detail ? (
        <Detail item={detail} />
      ) : activeScreen === 'Discover' ? (
        <Discover />
      ) : activeScreen === 'Map' ? (
        <MapView />
      ) : activeScreen === 'Journey' ? (
        <Journey />
      ) : activeScreen === 'Saved' ? (
        <Saved />
      ) : activeScreen === 'Profile' ? (
        <Profile />
      ) : (
        <DNA />
      )}
      <div className="sr-only">
        Current recommendation: {recommendation?.name}. App: {appName}. {appTagline}
      </div>
    </AppShell>
  )
}
