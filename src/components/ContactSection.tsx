import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { Button } from './Button'
import { Facebook, Github, Linkedin, Mail, MessageCircle, Send, X } from 'lucide-react'
import { FormEvent, useState } from 'react'

const contactEndpoint =
  (import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined) || '/api/contact'

export function ContactSection() {
  const { ref, isInView } = useInViewAnimation()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const closeForm = () => {
    setIsFormOpen(false)
    setStatus('idle')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || 'Anonymous')
    const email = String(formData.get('email') || '')
    const message = String(formData.get('message') || '')
    const botField = String(formData.get('company') || '')
    const mode = email ? 'email' : 'anonymous'

    if (botField) return

    if (!contactEndpoint) {
      const body = encodeURIComponent(
        `Mode: ${mode}\nName: ${name}\nEmail: ${email || 'Anonymous'}\n\n${message}`
      )
      window.location.href = `mailto:thanhhbao4123@gmail.com?subject=Portfolio message from ${encodeURIComponent(name)}&body=${body}`
      return
    }

    try {
      setStatus('sending')
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, mode }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={ref} className="section-fog cinematic-section relative px-6 py-16 md:py-24">
      <div className="animated-hairline cinematic-glass relative mx-auto max-w-[1100px] overflow-hidden rounded-[32px] p-8 md:p-12">
        <div className="absolute -right-12 top-1/3 h-64 w-64 rounded-full bg-[#A8D4E4]/18 blur-3xl" />
        <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-[#C8AD62]/18" />
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
        <div className="grid gap-10 md:grid-cols-[0.92fr_1.08fr] md:items-start">
          <div className="relative z-10 self-start">
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
            className={`md:pt-36 lg:pt-44 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.16s' }}
          >
            <p className="text-sm leading-relaxed text-[#273C46] md:text-base">
              I am open to internships, training programs, and collaborations where I can strengthen my AI foundations and contribute to practical product work.
            </p>

            <div
              className={`flex origin-top flex-col gap-3 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex-row ${
                isFormOpen
                  ? 'mt-0 max-h-0 scale-95 opacity-0'
                  : 'mt-7 max-h-20 scale-100 opacity-100'
              }`}
              aria-hidden={isFormOpen}
            >
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(true)
                  setStatus('idle')
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#051A24] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_42px_rgba(5,26,36,0.22),inset_0_1px_0_rgba(255,255,255,0.24)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#082838]"
              >
                <MessageCircle className="h-4 w-4" />
                Send a message
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`origin-top overflow-hidden rounded-[28px] border border-white/45 bg-white/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_18px_54px_rgba(5,26,36,0.06)] backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isFormOpen
                  ? 'mt-5 max-h-[560px] translate-x-0 scale-100 p-4 opacity-100 md:p-5'
                  : 'mt-0 max-h-0 translate-x-8 scale-95 p-0 opacity-0'
              }`}
              aria-hidden={!isFormOpen}
            >
              <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
              <input type="hidden" name="_subject" value="New portfolio message" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#051A24]">Leave contact info, or stay anonymous</p>
                  <p className="text-xs text-[#273C46]/70">Name and email are optional. Leave them blank if you want.</p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-[#051A24]/10 bg-white/50 p-2 text-[#051A24] transition hover:bg-white"
                  aria-label="Close message form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#051A24]/45">Name optional</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-[#051A24]/10 bg-white/56 px-4 py-3 text-sm text-[#051A24] outline-none transition focus:border-[#A8D4E4]/70 focus:bg-white/76"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-[#051A24]/45">Email optional</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="or stay anonymous"
                    className="w-full rounded-2xl border border-[#051A24]/10 bg-white/56 px-4 py-3 text-sm text-[#051A24] outline-none transition focus:border-[#A8D4E4]/70 focus:bg-white/76"
                  />
                </label>
              </div>
              <label className="mt-3 block space-y-2">
                <span className="text-xs uppercase tracking-[0.18em] text-[#051A24]/45">Message</span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Send a note, opportunity, idea, or anonymous feedback..."
                  className="w-full resize-none rounded-2xl border border-[#051A24]/10 bg-white/56 px-4 py-3 text-sm leading-relaxed text-[#051A24] outline-none transition focus:border-[#A8D4E4]/70 focus:bg-white/76"
                />
              </label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-[#273C46]/70">
                  {status === 'sent'
                    ? 'Message sent. Thank you.'
                    : status === 'error'
                      ? 'Could not send. Please use email.'
                      : 'This sends to thanhhbao4123@gmail.com. Optional contact info.'}
                </p>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#051A24] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_42px_rgba(5,26,36,0.22),inset_0_1px_0_rgba(255,255,255,0.24)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#082838] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="mailto:thanhhbao4123@gmail.com">
                <Button variant="secondary" size="sm">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </a>
              <a href="https://github.com/thanhhbao" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </a>
              <a href="https://www.linkedin.com/in/thanhbao1/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
              </a>
              <a href="https://www.facebook.com/thanhhbao.0412" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
