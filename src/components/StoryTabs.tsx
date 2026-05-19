export function StoryTabs() {
  return (
    <section className="section-fog cinematic-section relative px-6 pb-24 pt-8 md:pb-32 md:pt-12">
      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="atmospheric-ring -right-10 top-10 h-40 w-40 md:h-56 md:w-56" />
        <div className="atmospheric-stone -bottom-8 left-8 h-24 w-36 opacity-45" />
        <div className="animated-hairline paper-texture cinematic-glass relative overflow-hidden rounded-[34px] p-7 transition duration-700 hover:-translate-y-1 md:p-12 lg:p-14">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/60 to-transparent" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#AEC5CB]/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-44 w-44 rounded-full border border-[#C8AD62]/20" />
          <div className="absolute right-8 top-8 hidden font-mono text-[11px] uppercase tracking-[0.24em] text-[#051A24]/32 md:block">
            learning log / 2026
          </div>

          <div className="relative grid min-h-[380px] gap-10 md:grid-cols-[0.28fr_1fr] md:items-center">
            <aside className="border-l border-[#051A24]/12 pl-4">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#051A24]/45">
                Notebook note
              </p>
              <div className="mt-6 hidden h-32 w-px bg-gradient-to-b from-[#051A24]/20 via-[#051A24]/8 to-transparent md:block" />
            </aside>

            <div className="max-w-[760px]">
              <div className="mb-7 h-px w-24 bg-[#051A24]/16" />
              <p className="text-[25px] font-normal leading-[1.24] tracking-tight text-[#0D212C] md:text-[36px] lg:text-[40px]">
                Hi, I’m Bảo — a Software Engineering student currently on the path to becoming an AI Engineer.
              </p>
              <div className="mt-10 max-w-[680px] space-y-5 border-l border-[#051A24]/12 pl-5 md:pl-7">
                <p className="text-[19px] leading-[1.6] tracking-tight text-[#273C46] md:text-[24px]">
                  I used to believe code was only meant to make machines run.
                </p>
                <p className="text-[19px] leading-[1.6] tracking-tight text-[#273C46] md:text-[24px]">
                  But now, I’ve discovered that code can also teach machines how to &quot;think&quot;.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
