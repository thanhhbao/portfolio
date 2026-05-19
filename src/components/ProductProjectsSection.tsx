import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { Button } from './Button'
import { Github, CreditCard, Smartphone, Globe, Database } from 'lucide-react'

const products = [
  {
    name: 'TravelEase',
    description:
      'Travel booking product interface with discovery, booking flow, and payment-ready experience.',
    tech: ['React', 'Laravel', 'MySQL', 'Stripe'],
    github: 'https://github.com/thanhhbao/TravelEase',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    name: 'Spotify App',
    description:
      'Flutter music streaming app interface with playback UI, dynamic themes, profiles, and settings.',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLoC', 'Clean Architecture'],
    github: 'https://github.com/thanhhbao/spotify_app-',
    icon: <Smartphone className="w-6 h-6" />,
  },
]

export function ProductProjectsSection() {
  const { ref, isInView } = useInViewAnimation()

  return (
    <section ref={ref} className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h2
          className={`text-[32px] md:text-[40px] text-[#0D212C] tracking-tight ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Product <span className="font-serif">engineering</span>
        </h2>
        <p
          className={`text-base text-[#273C46] max-w-xl mt-3 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.1s' }}
        >
          Web and mobile projects that support my ability to ship usable product experiences.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, index) => (
          <div
            key={product.name}
            className={`bg-white rounded-[32px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] group ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#051A24]/5 flex items-center justify-center text-[#051A24] mb-5 group-hover:bg-[#051A24] group-hover:text-white transition-colors duration-300">
              {product.icon}
            </div>
            <h3 className="text-xl font-semibold text-[#051A24] mb-2">{product.name}</h3>
            <p className="text-sm text-[#051A24]/70 leading-relaxed mb-5">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tech.map((t) => (
                <span
                  key={t}
                  className="bg-[#051A24]/5 text-[#051A24] text-xs px-3 py-1.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
            <a href={product.github} target="_blank" rel="noopener noreferrer">
              <Button variant="tertiary" size="sm">
                <Github className="w-4 h-4" />
                View on GitHub
              </Button>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
