import { useInViewAnimation } from '@/hooks/useInViewAnimation'

const skillClusters = [
  {
    title: 'AI / ML',
    skills: ['Python', 'Computer Vision Classification', 'Medical Image Classification', 'Model Evaluation', 'Data Preprocessing', 'Checkpointing'],
  },
  {
    title: 'Deployment / Integration',
    skills: ['ONNX Export', 'onnxruntime-web', 'In-browser Inference', 'Client-side ML Integration', 'Model-to-Product Workflow'],
  },
  {
    title: 'Web Development',
    skills: ['JavaScript', 'TypeScript', 'Next.js', 'React', 'Node.js', 'Express.js', 'Tailwind CSS'],
  },
  {
    title: 'Mobile / Product',
    skills: ['MongoDB', 'Auth / DB / Storage', 'Git', 'GitHub', 'Vercel', 'Flutter', 'Dart'],
  },
]

export function SkillsSection() {
  const { ref, isInView } = useInViewAnimation()

  return (
    <section ref={ref} className="section-fog relative bg-[#F7F4EF] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div
          className={`paper-texture relative overflow-hidden rounded-[34px] border border-[#051A24]/10 bg-white/50 p-7 shadow-[0_22px_86px_rgba(5,26,36,0.045)] md:p-10 ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="absolute right-8 top-8 hidden text-xs uppercase tracking-[0.22em] text-[#051A24]/28 md:block">
            Learning Inventory
          </div>
          <div className="grid gap-6 md:grid-cols-[0.78fr_1fr] md:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-[#051A24]/45">
                Learning Inventory
              </span>
              <h2 className="mt-3 text-[32px] leading-[1.08] tracking-tight text-[#0D212C] md:text-[46px]">
                Skills picked up along the way.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[#273C46] md:text-base">
              A mix of AI, web, and product tools I&apos;ve been learning through projects.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4 md:gap-0">
            {skillClusters.map((cluster) => (
              <div key={cluster.title} className="border-[#051A24]/10 md:border-l md:first:border-l-0 md:px-5">
                <h3 className="text-base font-medium text-[#051A24]">{cluster.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cluster.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#F7F4EF]/72 px-3 py-1.5 text-xs text-[#273C46] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
            </div>
    </section>
  )
}
