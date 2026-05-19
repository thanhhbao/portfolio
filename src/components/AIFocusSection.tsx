import { useInViewAnimation } from '@/hooks/useInViewAnimation'
import { Check, Layers, MonitorSmartphone } from 'lucide-react'

const areas = [
  {
    title: 'Applied AI Practice',
    description:
      'I am building foundations through computer vision classification, preprocessing, training loops, model evaluation, and deployment-ready exports.',
    items: ['Computer vision classification', 'Data preprocessing', 'Precision / recall / F1 / AUC', 'ONNX export', 'Client-side inference'],
    icon: Layers,
  },
  {
    title: 'Software Product Practice',
    description:
      'Alongside AI study, I practice building interfaces and backend flows so model output can become something people can actually use.',
    items: ['Next.js and React UI', 'Node.js / Express basics', 'Tailwind CSS layouts', 'MongoDB integration', 'Flutter mobile UI'],
    icon: MonitorSmartphone,
  },
]

export function AIFocusSection() {
  const { ref, isInView } = useInViewAnimation()

  return (
    <section ref={ref} className="bg-[#F7F4EF] px-6 py-10 md:py-16">
      <div className="mx-auto grid max-w-[1100px] gap-5 md:grid-cols-2">
        {areas.map((area, index) => {
          const Icon = area.icon

          return (
            <div
              key={area.title}
              className={`animated-hairline relative rounded-[28px] border border-[#051A24]/10 bg-white/50 p-6 shadow-[0_16px_70px_rgba(5,26,36,0.05)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:bg-white/65 md:p-8 ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#051A24]/5 text-[#051A24]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-[24px] font-medium text-[#051A24] md:text-[30px]">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#273C46]">{area.description}</p>

              <ul className="mt-7 grid gap-3">
                {area.items.map((item) => (
                  <li key={item} className="group flex items-center gap-3 text-sm text-[#0D212C]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F7F4EF] text-[#051A24] transition duration-300 group-hover:bg-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
