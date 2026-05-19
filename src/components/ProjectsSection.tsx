import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { Button } from './Button'
import { ExternalLink, Github } from 'lucide-react'

type Project = {
  number?: string
  name: string
  category: string
  description: string
  tech: string[]
  github: string
  demo?: string
  visual: JSX.Element
}

function InterviewMockup() {
  return (
    <div className="deep-glass relative h-full min-h-[360px] overflow-hidden rounded-[24px] p-5 text-white">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#8DB6C7]/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#8DB6C7]/10 to-transparent" />

      <div className="relative grid h-full gap-4 md:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs text-white/75">Resume</span>
            <span className="font-mono text-xs text-[#A8D4E4]">parsed</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-white/42" />
            <div className="h-3 w-2/3 rounded-full bg-white/22" />
            <div className="h-3 w-5/6 rounded-full bg-white/22" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {['LLM', 'Qwen', 'LoRA', 'Report'].map((tag) => (
              <span key={tag} className="rounded-lg bg-white/8 px-3 py-2 text-xs text-white/65">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#A8D4E4]/18 px-3 py-1 text-xs text-[#D9F2FA]">Audio</span>
              <span className="text-xs text-white/45">speech signal</span>
            </div>
            <div className="flex h-16 items-end gap-1.5">
              {[30, 58, 42, 75, 48, 82, 54, 68, 36, 70, 46, 60].map((height, index) => (
                <span key={index} className="flex-1 rounded-full bg-[#A8D4E4]/70" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs text-white/70">Vision</span>
              <div className="relative mt-8 h-24">
                {[['top-0 left-6'], ['top-9 right-6'], ['bottom-0 left-1/2']].map(([pos], index) => (
                  <span key={index} className={`pulse-dot absolute ${pos} h-3 w-3 rounded-full bg-[#A8D4E4]`} />
                ))}
                <div className="absolute left-8 top-3 h-px w-24 rotate-[24deg] bg-white/18" />
                <div className="absolute bottom-6 left-16 h-px w-20 -rotate-[18deg] bg-white/18" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#F7F4EF] p-4 text-[#051A24]">
              <span className="rounded-full bg-[#051A24]/8 px-3 py-1 text-xs">Score</span>
              <div className="mt-7 font-serif text-5xl">87</div>
              <div className="mt-2 text-xs text-[#273C46]">interview readiness</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthcareMockup() {
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[24px] border border-white/45 bg-[#E8F1F3]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md">
      <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#9CC7D5]/30 blur-3xl" />
      <div className="relative grid h-full gap-4 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#051A24]/10 bg-white/70 p-5 shadow-[0_20px_70px_rgba(5,26,36,0.07)]">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-[#051A24]/70">skin image</span>
            <span className="rounded-full bg-[#0D212C]/8 px-3 py-1 text-xs text-[#051A24]">private</span>
          </div>
          <div className="relative mx-auto aspect-square max-w-[230px] rounded-[28px] bg-gradient-to-br from-[#F4D9D1] to-[#D9B8B0]">
            <div className="absolute left-[42%] top-[38%] h-14 w-12 rounded-full bg-gradient-to-br from-[#9A5C4D] to-[#6C3B35] opacity-80 blur-[1px]" />
            <div className="absolute inset-5 rounded-[22px] border border-white/50" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-[#051A24]/10 bg-white/75 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-[#051A24]/40">Risk assessment</div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-3xl text-[#051A24]">Medium</div>
                <div className="mt-1 text-sm text-[#273C46]">needs next-step guidance</div>
              </div>
              <div className="rounded-full bg-[#DDEDF2] px-3 py-1.5 text-xs text-[#0D212C]">ONNX</div>
            </div>
          </div>
          <div className="rounded-3xl border border-[#051A24]/10 bg-[#0D212C] p-5 text-white">
            <div className="text-sm text-white/62">Client-side inference</div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[78%] rounded-full bg-[#A8D4E4]" />
            </div>
            <div className="mt-4 text-xs text-white/50">no image upload required for inference</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkdMockup() {
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[24px] border border-white/45 bg-[#EEF3F2]/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md">
      <div className="grid h-full gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-[#051A24]/10 bg-white/65 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-[#051A24]/70">classification grid</span>
            <span className="font-mono text-xs text-[#051A24]/40">val batch</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-xl bg-gradient-to-br from-[#CFD8DA] to-[#EEF0EC] p-1">
                <div className="h-full rounded-lg border border-[#6F8790]/25 bg-[#F6E0D8]/50" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-[#051A24]/10 bg-[#071D28] p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/68">training curve</span>
              <span className="font-mono text-xs text-[#A8D4E4]">epoch 45/50</span>
            </div>
            <div className="mt-7 flex h-28 items-end gap-1">
              {[18, 28, 26, 40, 36, 52, 48, 63, 58, 72, 70, 82, 78, 88].map((height, index) => (
                <span key={index} className="flex-1 rounded-t bg-[#A8D4E4]/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Accuracy', '0.859'],
              ['F1', '0.640'],
              ['AUC', '0.902'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#051A24]/10 bg-white/70 p-4">
                <div className="text-xs text-[#051A24]/45">{label}</div>
                <div className="mt-2 text-xl text-[#051A24]">{value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white/55 px-4 py-3 font-mono text-xs text-[#273C46]">
            exp_18 / EdgeNeXt + Focal Loss / best checkpoint saved
          </div>
        </div>
      </div>
    </div>
  )
}

function PyAiMockup() {
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[24px] border border-white/45 bg-[#F4F1EA]/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md">
      <div className="grid h-full gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-[#071D28] p-4 text-white shadow-[0_18px_60px_rgba(5,26,36,0.16)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E9A29A]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E8C87E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#98C7A4]" />
            <span className="ml-3 font-mono text-xs text-white/42">exercise_03.py</span>
          </div>
          <div className="space-y-3 font-mono text-sm">
            <p><span className="text-[#A8D4E4]">def</span> train_model(data):</p>
            <p className="pl-5 text-white/45"># complete the loop</p>
            <p className="pl-5">model.fit(X_train, y_train)</p>
            <p className="pl-5 text-[#A8D4E4]">return metrics</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-[#051A24]/10 bg-white/72 p-5">
            <span className="rounded-full bg-[#051A24]/7 px-3 py-1 text-xs text-[#051A24]">Python exercise</span>
            <h4 className="mt-5 text-2xl text-[#051A24]">Review the training step</h4>
          </div>
          <div className="rounded-3xl border border-[#051A24]/10 bg-white/72 p-5">
            <div className="text-sm text-[#051A24]/50">Hint panel</div>
            <p className="mt-3 text-sm leading-relaxed text-[#273C46]">Think about validation metrics before changing the model.</p>
          </div>
          <div className="rounded-3xl border border-[#051A24]/10 bg-white/72 p-5">
            <div className="mb-3 flex justify-between text-xs text-[#051A24]/45">
              <span>Progress</span>
              <span>12/20</span>
            </div>
            <div className="h-2 rounded-full bg-[#051A24]/8">
              <div className="h-full w-[60%] rounded-full bg-[#071D28]" />
            </div>
            <div className="mt-4 flex gap-2 text-xs text-[#051A24]/55">
              <span>Python</span><span>AI Context</span><span>Hints</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TravelMockup() {
  return (
    <div className="relative min-h-[240px] rounded-[22px] border border-white/45 bg-[#F4F1EA]/74 p-4 backdrop-blur-md">
      <div className="rounded-3xl border border-[#051A24]/10 bg-white/72 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#051A24]/55">TravelEase</span>
          <span className="rounded-full bg-[#051A24]/7 px-3 py-1 text-xs">Step 2/4</span>
        </div>
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#C9D5D8] to-[#EFE7DC] p-4">
          <div className="text-2xl text-[#051A24]">Da Nang</div>
          <div className="mt-8 h-2 w-2/3 rounded-full bg-white/65" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Search', 'Book', 'Pay'].map((step) => (
            <span key={step} className="rounded-full bg-[#F7F4EF] px-3 py-2 text-center text-xs text-[#051A24]/60">{step}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SpotifyMockup() {
  return (
    <div className="relative flex min-h-[240px] items-center justify-center rounded-[22px] border border-white/45 bg-[#EEF3F3]/70 p-4 backdrop-blur-md">
      <div className="w-[150px] rounded-[30px] border border-[#051A24]/10 bg-[#071D28] p-3 text-white shadow-[0_18px_60px_rgba(5,26,36,0.18)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#A8D4E4] to-[#F0D7B8]" />
        <div className="mt-4 h-3 w-3/4 rounded-full bg-white/70" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-white/28" />
        <div className="mt-5 flex items-center justify-between">
          <span className="h-8 w-8 rounded-full bg-white/10" />
          <span className="h-10 w-10 rounded-full bg-white text-[#071D28]" />
          <span className="h-8 w-8 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="absolute right-5 top-5 rounded-full bg-white/70 px-3 py-1 text-xs text-[#051A24]/60">theme</div>
    </div>
  )
}

const aiProjects: Project[] = [
  {
    number: '01',
    name: 'InterviewAI',
    category: 'AI / LLM / Multimodal',
    description:
      'An exploration of how LLMs, audio, and visual signals can support interview preparation through resume parsing, question generation, speech analysis, behavior signals, score fusion, and reporting.',
    tech: ['Python', 'LLM', 'LoRA', 'QLoRA', 'Qwen', 'Whisper', 'MediaPipe'],
    github: 'https://github.com/thanhhbao/interviewAI',
    visual: <InterviewMockup />,
  },
  {
    number: '02',
    name: 'AI Healthcare',
    category: 'AI / Healthcare / Client-side Inference',
    description:
      'A browser-based skin cancer diagnosis project using ONNX Runtime Web for privacy-preserving client-side inference.',
    tech: ['Next.js', 'TypeScript', 'ONNX Runtime Web', 'Tailwind CSS', 'shadcn/ui'],
    github: 'https://github.com/thanhhbao/ai_healthcare',
    demo: 'https://ai-healthcare-gamma.vercel.app',
    visual: <HealthcareMockup />,
  },
  {
    number: '03',
    name: 'SKD',
    category: 'AI / Medical Imaging',
    description:
      'My core AI practice project: a configurable skin lesion classification pipeline with training loops, model evaluation, metrics logging, and experiment tracking.',
    tech: ['Python', 'Deep Learning', 'Computer Vision', 'Medical Imaging', 'Model Evaluation'],
    github: 'https://github.com/thanhhbao/SKD',
    visual: <SkdMockup />,
  },
  {
    number: '04',
    name: 'PyAI Review',
    category: 'AI / Education / Interactive Learning',
    description:
      'A small learning product for practicing Python syntax in AI contexts, with interactive exercises, a Monaco-style editor, hints, progress tracking, and smooth UI motion.',
    tech: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Monaco Editor', 'Zod'],
    github: 'https://github.com/thanhhbao/PyAI_Review',
    visual: <PyAiMockup />,
  },
]

const productProjects: Project[] = [
  {
    name: 'TravelEase',
    category: 'Web / Product Engineering',
    description:
      'A travel booking product interface where I practiced discovery pages, booking flow, database-backed features, and payment-ready interface thinking.',
    tech: ['React', 'Laravel', 'MySQL', 'Stripe'],
    github: 'https://github.com/thanhhbao/TravelEase',
    visual: <TravelMockup />,
  },
  {
    name: 'Spotify App',
    category: 'Mobile / Flutter',
    description:
      'A Flutter mobile UI project for practicing playback screens, dynamic themes, profile pages, settings, and mobile app structure.',
    tech: ['Flutter', 'Dart', 'Firebase', 'BLoC', 'Clean Architecture'],
    github: 'https://github.com/thanhhbao/spotify_app-',
    visual: <SpotifyMockup />,
  },
]

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <a href={project.github} target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" size="sm">
          <Github className="h-4 w-4" />
          GitHub
        </Button>
      </a>
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer">
          <Button variant="tertiary" size="sm">
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </Button>
        </a>
      )}
    </div>
  )
}

function FeaturedProjectScene({ project, index }: { project: Project; index: number }) {
  const visualFirst = index % 2 === 1

  return (
    <article
      className="cinematic-glass group relative min-h-[520px] overflow-hidden rounded-[38px] p-5 transition duration-700 hover:-translate-y-1 md:p-7"
      style={{ animationDelay: `${0.12 + index * 0.08}s` }}
    >
      <div className="project-scene-glow" />
      <div className="atmospheric-ring -right-12 -top-16 h-52 w-52 opacity-65" />
      <div className="atmospheric-stone bottom-7 left-7 h-16 w-24 opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-[#071D28]/5 opacity-80" />

      <div className={`relative grid min-h-[480px] gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center ${visualFirst ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="flex h-full flex-col justify-center px-1 py-5 md:px-4">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-serif text-6xl text-[#051A24]/14 md:text-7xl">{project.number}</span>
            <span className="h-px flex-1 bg-[#051A24]/12" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#051A24]/42">{project.category}</span>
          <h3 className="mt-4 font-serif text-[42px] font-semibold leading-[1.02] tracking-tight text-[#051A24] md:text-[64px]">
            {project.name}
          </h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#273C46]">
            {project.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="rounded-full border border-[#051A24]/10 bg-[#F7F4EF]/80 px-3 py-1.5 text-xs text-[#051A24]/70">
                {tech}
              </span>
            ))}
          </div>
          <ProjectActions project={project} />
        </div>

        <div className="relative transition duration-700 group-hover:-translate-y-2 group-hover:scale-[1.01]">
          {project.visual}
        </div>
      </div>
    </article>
  )
}

function ProductProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className="cinematic-glass rounded-[28px] p-4 transition duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${0.14 + index * 0.08}s` }}
    >
      {project.visual}
      <div className="pt-5">
        <span className="text-xs uppercase tracking-[0.16em] text-[#051A24]/38">{project.category}</span>
        <h3 className="mt-2 font-serif text-2xl font-semibold text-[#051A24]">{project.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#273C46]">{project.description}</p>
        <ProjectActions project={project} />
      </div>
    </article>
  )
}

function ChapterMarker({ nextNumber }: { nextNumber: string }) {
  const { ref, isInView } = useInViewAnimation(0.45)

  return (
    <div
      ref={ref}
      className={`chapter-marker mx-auto mt-8 flex max-w-[1040px] items-center gap-4 text-xs uppercase tracking-[0.22em] text-[#051A24]/28 ${
        isInView ? 'is-visible' : ''
      }`}
    >
      <span className="chapter-marker-label">chapter marker</span>
      <span className="chapter-marker-line h-px flex-1 bg-[#051A24]/10" />
      <span className="chapter-marker-number">{nextNumber}</span>
    </div>
  )
}

export function ProjectsSection() {
  const { ref, isInView } = useInViewAnimation()

  return (
    <section id="projects" ref={ref} className="section-fog cinematic-section relative px-6 py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="mb-14 grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <span className={`text-xs uppercase tracking-[0.22em] text-[#051A24]/45 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Featured AI Projects
            </span>
            <h2
              className={`mt-3 text-[38px] leading-[1.04] tracking-tight text-[#0D212C] md:text-[58px] ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.06s' }}
            >
              Projects from the learning curve.
            </h2>
          </div>
          <p
            className={`max-w-xl text-sm leading-relaxed text-[#273C46] md:ml-auto md:text-base ${
              isInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.12s' }}
          >
            Each project taught me a different part of applied AI — from medical imaging and ONNX inference to LLM workflows and interactive learning tools.
          </p>
        </div>

        <div className="space-y-9 md:space-y-12">
          {aiProjects.map((project, index) => (
            <div key={project.name} className={isInView ? 'animate-fade-in-up' : 'opacity-0'}>
              <FeaturedProjectScene project={project} index={index} />
              {index < aiProjects.length - 1 && (
                <ChapterMarker nextNumber={String(index + 2).padStart(2, '0')} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-[#051A24]/38">Other product experiments</span>
              <h3 className="mt-3 text-[28px] tracking-tight text-[#0D212C] md:text-[38px]">
                Smaller UI reps that helped the product side.
              </h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#273C46]">
              Smaller UI reps that helped the product side.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {productProjects.map((project, index) => (
              <ProductProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
