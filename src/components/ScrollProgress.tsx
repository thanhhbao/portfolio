import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(1, Math.max(0, nextProgress)))
      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateProgress)
    }

    updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-[70] h-1.5 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-full border border-white/45 bg-white/35 shadow-[0_10px_38px_rgba(5,26,36,0.12)] backdrop-blur-md">
      <div
        className="h-full origin-left rounded-full bg-[#051A24] shadow-[0_0_20px_rgba(168,212,228,0.28)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
