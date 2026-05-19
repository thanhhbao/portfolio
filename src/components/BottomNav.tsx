import { Github, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BottomNav() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => {
      const contact = document.getElementById('contact')
      const projects = document.getElementById('projects')
      const heroPassed = window.scrollY > window.innerHeight * 0.82
      const enteringProjects = projects
        ? projects.getBoundingClientRect().top < window.innerHeight * 0.78
        : false
      const nearContact = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.86
        : false

      setIsVisible(heroPassed && !enteringProjects && !nearContact)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  return (
    <nav
      className={`fixed bottom-5 left-1/2 z-50 hidden -translate-x-1/2 transition-all duration-500 ease-out sm:block ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center gap-5 rounded-full border border-[#051A24]/10 bg-white/78 px-6 py-2 opacity-85 shadow-[0_16px_60px_rgba(5,26,36,0.12)] backdrop-blur-md transition-opacity duration-300 hover:opacity-100 md:gap-6 md:px-8">
        {/* Logo */}
        <span className="font-serif text-2xl font-semibold text-[#051A24]">TB</span>

        {/* Divider */}
        <div className="w-px h-6 bg-[#051A24]/10" />

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <a
            href="#projects"
            className="text-sm text-[#051A24] hover:opacity-70 transition-opacity"
          >
            Projects
          </a>
          <a
            href="https://github.com/thanhhbao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="mailto:thanhhbao4123@gmail.com"
            className="text-sm text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        </div>
      </div>
    </nav>
  )
}
