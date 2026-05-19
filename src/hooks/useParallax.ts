import { useEffect, useRef, useState } from 'react'

export function useParallax(maxOffset = 180) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect()
          const windowHeight = window.innerHeight
          const elementCenter = rect.top + rect.height / 2
          const viewportCenter = windowHeight / 2
          const distance = elementCenter - viewportCenter
          const normalizedDistance = distance / windowHeight
          const parallaxOffset = normalizedDistance * maxOffset
          
          setOffset(Math.max(-maxOffset, Math.min(maxOffset, parallaxOffset)))
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [maxOffset])

  return { ref, offset }
}
