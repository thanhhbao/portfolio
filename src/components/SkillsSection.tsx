import { useState } from 'react'
import { useInViewAnimation } from '@/hooks/useInViewAnimation'

const skillClusters = [
  {
    title: 'AI / ML',
    stage: 'Train',
    role: 'Train and evaluate the model: preprocess data, run experiments, checkpoint the best weights.',
    projects: ['SKD', 'InterviewAI'],
    skills: ['Python', 'Computer Vision Classification', 'Medical Image Classification', 'Model Evaluation', 'Data Preprocessing', 'Checkpointing'],
  },
  {
    title: 'Deployment / Integration',
    stage: 'Ship',
    role: 'Export the model to ONNX and run it inside the browser so data never leaves the device.',
    projects: ['AI Healthcare'],
    skills: ['ONNX Export', 'onnxruntime-web', 'In-browser Inference', 'Client-side ML Integration', 'Model-to-Product Workflow'],
  },
  {
    title: 'Web Development',
    stage: 'Build',
    role: 'Wrap the model in a fast, typed interface people can actually use.',
    projects: ['PyAI Review', 'AI Healthcare'],
    skills: ['JavaScript', 'TypeScript', 'Next.js', 'React', 'Node.js', 'Express.js', 'Tailwind CSS'],
  },
  {
    title: 'Mobile / Product',
    stage: 'Deliver',
    role: 'Turn it into a product: auth, storage, mobile UI and deployment.',
    projects: ['TravelEase', 'Spotify App'],
    skills: ['MongoDB', 'Auth / DB / Storage', 'Git', 'GitHub', 'Vercel', 'Flutter', 'Dart'],
  },
]

export function SkillsSection() {
  const { ref, isInView } = useInViewAnimation()
  const [active, setActive] = useState(0)
  const current = skillClusters[active]

  return (
    <section ref={ref} className="section-fog cinematic-section relative px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div
          className={`paper-texture cinematic-glass relative overflow-hidden rounded-[34px] p-7 md:p-10 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#A8D4E4]/18 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-[#C8AD62]/10 blur-3xl" />
          <div className="absolute right-8 top-8 hidden text-xs uppercase tracking-[0.22em] text-[#051A24]/28 md:block">
            Toolbox
          </div>
          <div className="grid gap-6 md:grid-cols-[0.78fr_1fr] md:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-[#051A24]/45">
                Toolbox
              </span>
              <h2 className="mt-3 text-[32px] leading-[1.08] tracking-tight text-[#0D212C] md:text-[46px]">
                Skills I build with.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[#273C46] md:text-base">
              A mix of web, mobile, and product tools I use across projects.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4 md:gap-0">
            {skillClusters.map((cluster, i) => (
              <div
                key={cluster.title}
                onMouseEnter={() => setActive(i)}
                className={`relative border-[#051A24]/10 transition-opacity duration-300 md:border-l md:first:border-l-0 md:px-5 ${
                  i === active ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <h3 className="text-base font-medium text-[#051A24]">{cluster.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cluster.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/45 bg-white/42 px-3 py-1.5 text-xs text-[#273C46] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/72"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-[#051A24]/10 pt-8">
            <span className="text-xs uppercase tracking-[0.22em] text-[#051A24]/45">Skill Anatomy</span>
            <p className="mt-2 max-w-xl text-sm text-[#273C46]">
              How the pieces connect, from a trained model to a shipped product. Pick a stage.
            </p>

            <div className="relative mt-8">
              <div className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-[#051A24]/15 md:block" />
              <div
                className="absolute left-[12.5%] top-5 hidden h-px bg-[#2F7F9A] transition-all duration-500 md:block"
                style={{ width: `${(active / (skillClusters.length - 1)) * 75}%` }}
              />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {skillClusters.map((cluster, i) => (
                  <button
                    key={cluster.title}
                    type="button"
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={i === active}
                    className="group relative flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs transition duration-300 ${
                        i === active
                          ? 'scale-110 border-[#2F7F9A] bg-[#2F7F9A] text-white shadow-[0_0_0_6px_rgba(47,127,154,0.15)]'
                          : i < active
                            ? 'border-[#2F7F9A] bg-white/80 text-[#2F7F9A]'
                            : 'border-[#051A24]/20 bg-white/70 text-[#051A24]/50 group-hover:border-[#2F7F9A]'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-[#051A24]">{cluster.stage}</span>
                  </button>
                ))}
              </div>
            </div>

            <div
              key={current.title}
              className="animate-fade-in-up mt-8 grid gap-4 rounded-[24px] border border-white/45 bg-white/42 p-5 md:grid-cols-[1.2fr_1fr] md:p-6"
            >
              <div>
                <h4 className="text-lg font-medium text-[#0D212C]">{current.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[#273C46]">{current.role}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#051A24]/45">Used in</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current.projects.map((project) => (
                    <span key={project} className="rounded-full bg-[#2F7F9A]/12 px-3 py-1.5 text-xs text-[#1F5568]">
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
