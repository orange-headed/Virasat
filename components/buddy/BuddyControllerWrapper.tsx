'use client'

import dynamic from 'next/dynamic'

export const BuddyControllerWrapper = dynamic(
  () => import('./BuddyController').then((mod) => mod.BuddyController),
  { ssr: false }
)
