import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { Brain, Cpu, ScanLine, Sparkles } from 'lucide-react'

const signals = [
  { label: 'Studying LLM workflows', icon: Brain },
  { label: 'Practicing client-side inference', icon: Cpu },
  { label: 'Exploring medical imaging', icon: ScanLine },
]

export function AIQuoteSection() {
  const { ref, isInView } = useInViewAnimation()

  return (
    <section ref={ref} className="bg-[#F7F4EF] px-6 py-16 md:py-24">
      <div className="animated-hairline relative mx-auto max-w-[1100px] rounded-[32px] border border-[#051A24]/10 bg-white/45 p-6 shadow-[0_20px_80px_rgba(5,26,36,0.05)] backdrop-blur-sm md:p-10">
        <div className="pulse-dot absolute right-8 top-8 h-3 w-3 rounded-full bg-[#051A24]/35" />
        <div className="pulse-dot absolute bottom-8 left-8 h-2 w-2 rounded-full bg-[#051A24]/20" style={{ animationDelay: '1.2s' }} />
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div>
            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full border border-[#051A24]/10 bg-[#F7F4EF]/80 px-4 py-2 text-sm text-[#051A24]/70 ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              A learning path into applied AI
            </div>
            <blockquote
              className={`max-w-2xl text-[30px] leading-[1.12] tracking-tight text-[#0D212C] md:text-[44px] ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.08s' }}
            >
              I learn best by turning small model experiments into clear, testable{' '}
              <span className="font-serif">product</span> experiences.
            </blockquote>
          </div>

          <div
            className={`space-y-3 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.16s' }}
          >
            {signals.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-[#051A24]/10 bg-white/55 p-4 transition duration-500 hover:-translate-x-1 hover:bg-white/75"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#051A24]/5 text-[#051A24]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm text-[#273C46] md:text-base">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
