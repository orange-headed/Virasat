import { useState, useEffect } from 'react'

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      setIsAtTop(scrollY < 20)

      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false
        return
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up')
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    // Initialize
    setIsAtTop(window.scrollY < 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { scrollDirection, isAtTop }
}
