import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import { Github } from 'lucide-react'
import { WordReveal } from './WordReveal'
import { StoryTabs } from './StoryTabs'

export function HeroSection() {
  const { ref, isInView } = useInViewAnimation()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    let ticking = false

    const updateProgress = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const progress = Math.min(1.25, Math.max(0, -rect.top / window.innerHeight))
      setScrollProgress(progress)
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
  }, [ref])

  const heroTextOpacity = Math.max(0.46, 1 - scrollProgress * 0.42)

  return (
    <>
      <section
        ref={ref}
        className="relative min-h-[118vh] md:min-h-[126vh] flex flex-col items-center justify-start px-5 pt-[9vh] md:pt-[10vh] pb-[32vh] overflow-hidden bg-[#EAF2F4]"
      >
        <div
          className="absolute inset-0 z-0 will-change-transform"
          style={{
            transform: `translate3d(0, ${scrollProgress * 110}px, 0) scale(${1.06 + scrollProgress * 0.035})`,
          }}
        >
          <video
            className="h-full w-full object-cover object-[65%_64%] lg:object-[center_66%]"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div
          className="hero-vignette absolute inset-0 z-[1] pointer-events-none will-change-transform"
          style={{ transform: `translate3d(0, ${scrollProgress * 28}px, 0)` }}
        />
        <div className="absolute inset-x-0 top-0 z-[2] h-36 bg-gradient-to-b from-[#EAF2F4]/85 to-transparent pointer-events-none" />
        <div
          className="hero-bottom-mist absolute inset-x-0 -bottom-[14vh] z-[2] h-[20vh] pointer-events-none will-change-transform"
          style={{ transform: `translate3d(0, ${scrollProgress * -12}px, 0)` }}
        />
        <div
          className="absolute left-1/2 top-[30vh] z-[2] h-[46vh] w-[76vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F7F4EF]/16 blur-3xl pointer-events-none will-change-transform"
          style={{ transform: `translate3d(-50%, calc(-50% + ${scrollProgress * -64}px), 0)` }}
        />
        <div
          className="relative z-10 w-full max-w-[760px] text-center px-2 py-7 md:px-6 md:py-9 will-change-transform"
          style={{
            opacity: heroTextOpacity,
            transform: `translate3d(0, ${scrollProgress * -72}px, 0)`,
          }}
        >
          {/* Logo */}
          <h1
            className={`font-serif text-[34px] md:text-[44px] lg:text-[52px] font-semibold tracking-tight mb-3 drop-shadow-[0_2px_18px_rgba(247,244,239,0.95)] text-sheen ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            Thanh Bao
          </h1>

          {/* Tagline */}
          <p
            className={`font-mono text-xs md:text-sm text-[#051A24] mb-4 md:mb-5 drop-shadow-[0_2px_14px_rgba(247,244,239,0.95)] ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Software Engineering student learning applied AI
          </p>

          {/* Main Heading */}
          <h2
            className={`text-[34px] md:text-[50px] lg:text-[64px] leading-[1.02] text-[#0D212C] tracking-tight drop-shadow-[0_3px_22px_rgba(247,244,239,0.95)] ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            
            <span className="mt-5 block text-[24px] leading-[1.18] md:text-[34px] lg:text-[40px]">
              <WordReveal text="Some say AI is becoming the new electricity." delay={0.92} />
              <br />
              <WordReveal text="I’m still learning the wiring." delay={1.08} />
            </span>
          </h2>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-7 ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.4s' }}
          >
            <a href="#projects">
            <Button variant="primary">View Projects</Button>
            </a>
            <a href="https://github.com/thanhhbao" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </a>
          </div>

          {/* Focus Areas */}
          <p
            className={`mx-auto mt-7 w-fit rounded-full border border-white/45 bg-white/40 px-4 py-2 text-sm text-[#273C46] shadow-[0_14px_45px_rgba(5,26,36,0.08)] backdrop-blur-md drop-shadow-[0_2px_14px_rgba(247,244,239,0.95)] soft-drift ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.5s' }}
          >
             AI · Mobile · Website 
          </p>
        </div>
      </section>

      <section className="section-fog cinematic-section relative px-6 py-10">
        <div className="relative z-10 mx-auto flex max-w-[1100px] items-center gap-4 text-xs uppercase tracking-[0.24em] text-[#051A24]/42">
          <span>Chapter 01</span>
          <span className="h-px flex-1 bg-[#051A24]/12" />
          <span>The learning curve</span>
        </div>
      </section>

      <StoryTabs />
    </>
  )
}
