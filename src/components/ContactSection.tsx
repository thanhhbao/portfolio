import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { Button } from './Button'
import { Github, Mail } from 'lucide-react'

export function ContactSection() {
  const { ref, isInView } = useInViewAnimation()

  return (
    <section ref={ref} className="bg-[#F7F4EF] px-6 py-16 md:py-24">
      <div className="animated-hairline relative mx-auto max-w-[1100px] overflow-hidden rounded-[32px] border border-[#051A24]/10 bg-white/55 p-8 shadow-[0_24px_90px_rgba(5,26,36,0.06)] md:p-12">
        <div className="absolute right-6 top-6 hidden gap-2 md:flex">
          {['Internship', 'Applied AI', 'Product'].map((label, index) => (
            <span
              key={label}
              className="soft-drift rounded-full border border-[#051A24]/10 bg-[#F7F4EF]/70 px-3 py-1.5 text-xs text-[#051A24]/55"
              style={{ animationDelay: `${index * 0.6}s` }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <span
              className={`text-xs uppercase tracking-[0.22em] text-[#051A24]/45 ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              Contact
            </span>
            <h2
              className={`mt-4 font-serif text-[44px] leading-[1.03] text-[#0D212C] md:text-[72px] ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.08s' }}
            >
              I&apos;m looking for a place to keep learning by building.
            </h2>
          </div>

          <div
            className={`${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.16s' }}
          >
            <p className="text-sm leading-relaxed text-[#273C46] md:text-base">
              I am open to internships, training programs, and collaborations where I can strengthen my AI foundations and contribute to practical product work.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="mailto:thanhhbao4123@gmail.com">
                <Button variant="primary" size="lg">
                  <Mail className="h-5 w-5" />
                  Email Thanh Bao
                </Button>
              </a>
              <a href="https://github.com/thanhhbao" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">
                  <Github className="h-5 w-5" />
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
