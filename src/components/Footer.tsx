import { Button } from './Button'
import { ArrowUpRight, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="cinematic-section w-full px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-start justify-between gap-10 border-t border-[#051A24]/10 pt-10 md:flex-row">
          {/* Left - CTA */}
          <div>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-[#273C46]">
              A student portfolio about learning applied AI, software engineering, and model-to-product workflows.
            </p>
            <a href="mailto:thanhhbao4123@gmail.com">
              <Button variant="primary">
                <Mail className="w-4 h-4" />
                Email Me
              </Button>
            </a>
          </div>

          {/* Right - Links */}
          <div className="flex gap-12 md:gap-16">
            <div className="flex flex-col gap-3">
              <a
                href="#projects"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                AI Projects
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#skills"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                Skills
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                Contact
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/thanhhbao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                GitHub
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                LinkedIn
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                Resume
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
