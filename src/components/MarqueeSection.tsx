import { Brain, FileText, Mic, Eye, BarChart3, Shield, Code, Layers, Monitor, Smartphone, Cpu, Network, Activity, Zap } from 'lucide-react'

const panels = [
  {
    id: 1,
    title: 'InterviewAI',
    subtitle: 'Multimodal LLM interview assistant',
    gradient: 'from-[#051A24] via-[#0D212C] to-[#1a3a4a]',
    content: (
      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-white/80">Resume</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 flex items-center gap-2">
            <Mic className="w-5 h-5 text-violet-400" />
            <span className="text-xs text-white/80">Audio</span>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-white/80">Vision</span>
          </div>
        </div>
        <div className="mt-auto">
          <div className="h-16 flex items-end gap-1">
            {[40, 65, 55, 80, 70, 90, 75, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t opacity-80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-xs">Score</span>
              <span className="text-cyan-400 text-lg font-medium">87/100</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-cyan-500/5 pointer-events-none rounded-2xl" />
      </div>
    ),
  },
  {
    id: 2,
    title: 'AI Healthcare',
    subtitle: 'Client-side skin cancer diagnosis',
    gradient: 'from-[#0D212C] via-[#051A24] to-[#0a2a3a]',
    content: (
      <div className="relative h-full p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(139,92,246,0.3),transparent_50%)]" />
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 relative">
                <div className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-amber-600 to-rose-700 top-6 left-8 animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-violet-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Privacy-First
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-white/60 text-xs mb-1">Risk Level</div>
            <div className="text-amber-400 text-sm font-medium">Medium</div>
          </div>
          <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-white/60 text-xs mb-1">Inference</div>
            <div className="text-green-400 text-sm font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              ONNX
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'SKD',
    subtitle: 'Skin cancer detection pipeline',
    gradient: 'from-[#1a2e3a] via-[#0D212C] to-[#051A24]',
    content: (
      <div className="relative h-full p-6">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 relative overflow-hidden"
            >
              <div className="absolute inset-1 border border-cyan-500/50 rounded" />
              <div
                className="absolute bottom-1 right-1 text-[8px] text-cyan-400 bg-black/50 px-1 rounded"
              >
                {(0.85 + Math.random() * 0.14).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-xs">Training Progress</span>
            <span className="text-cyan-400 text-xs">Epoch 45/50</span>
          </div>
          <div className="h-20 flex items-end gap-0.5">
            {[...Array(20)].map((_, i) => {
              const baseHeight = 90 - (i * 3)
              const noise = Math.sin(i * 0.5) * 10
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t opacity-70"
                  style={{ height: `${Math.max(20, baseHeight + noise)}%` }}
                />
              )
            })}
          </div>
          <div className="mt-2 text-center text-white/40 text-xs">Loss Curve</div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'PyAI Review',
    subtitle: 'AI-focused Python learning',
    gradient: 'from-[#051A24] via-[#0a2535] to-[#0D212C]',
    content: (
      <div className="relative h-full p-6">
        <div className="bg-[#1e1e1e] rounded-xl p-4 mb-4 font-mono text-xs overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-blue-400">def</div>
          <div className="text-yellow-300 ml-4">train_model<span className="text-white">(data):</span></div>
          <div className="text-gray-400 ml-8"># Your code here</div>
          <div className="text-purple-400 ml-8">model</div>
          <div className="text-white ml-8">= Sequential()</div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-gradient-to-br from-violet-500/20 to-violet-600/20 rounded-xl p-3 border border-violet-500/30">
            <Brain className="w-5 h-5 text-violet-400 mb-2" />
            <div className="text-white text-xs">AI Hint</div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-3 border border-green-500/30">
            <BarChart3 className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-white text-xs">Progress</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: 'LLM Pipeline',
    subtitle: 'End-to-end AI workflow',
    gradient: 'from-[#0D212C] via-[#051A24] to-[#0a1a24]',
    content: (
      <div className="relative h-full p-6 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          {['Data', 'Model', 'Inference', 'Eval', 'Product'].map((step, i) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${
                i === 4 ? 'bg-cyan-500' : 'bg-white/10'
              }`}>
                {i === 0 && <Layers className="w-5 h-5 text-white" />}
                {i === 1 && <Brain className="w-5 h-5 text-white" />}
                {i === 2 && <Zap className="w-5 h-5 text-white" />}
                {i === 3 && <BarChart3 className="w-5 h-5 text-white" />}
                {i === 4 && <Monitor className="w-5 h-5 text-white" />}
              </div>
              <span className="text-white/60 text-[10px] mt-2">{step}</span>
              {i < 4 && (
                <div className="absolute" style={{ left: `${(i + 1) * 20}%`, top: '50%' }}>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 h-1 bg-gradient-to-r from-slate-700 via-cyan-500 to-slate-700 rounded-full" />
      </div>
    ),
  },
  {
    id: 6,
    title: 'Computer Vision',
    subtitle: 'Image classification & detection',
    gradient: 'from-[#0a2535] via-[#0D212C] to-[#051A24]',
    content: (
      <div className="relative h-full p-6">
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-video rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-8 border-2 border-green-500 rounded animate-pulse" />
              </div>
              <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] px-2 py-0.5 rounded">
                {(0.92 + Math.random() * 0.07).toFixed(2)}
              </div>
              <div className="absolute bottom-2 left-2 text-white/60 text-[10px]">
                Class {i + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          {['Detection', 'Segment', 'Classify'].map((tag) => (
            <span
              key={tag}
              className="bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: 'ONNX Inference',
    subtitle: 'Browser-based AI processing',
    gradient: 'from-[#051A24] via-[#0D212C] to-[#1a3a4a]',
    content: (
      <div className="relative h-full p-6 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
            <Network className="w-16 h-16 md:w-20 md:h-20 text-cyan-400" />
          </div>
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <div className="bg-violet-500/20 text-violet-300 text-xs px-4 py-2 rounded-full border border-violet-500/30">
            WebGL
          </div>
          <div className="bg-cyan-500/20 text-cyan-300 text-xs px-4 py-2 rounded-full border border-cyan-500/30">
            WASM
          </div>
        </div>
        <p className="mt-4 text-white/40 text-xs text-center">No server required</p>
      </div>
    ),
  },
  {
    id: 8,
    title: 'Product Engineering',
    subtitle: 'Web & mobile experiences',
    gradient: 'from-[#0D212C] via-[#0a2535] to-[#051A24]',
    content: (
      <div className="relative h-full p-6">
        <div className="flex gap-4 items-start">
          <div className="w-48 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20 p-3">
            <div className="w-full h-4 bg-white/20 rounded mb-2" />
            <div className="w-3/4 h-3 bg-white/10 rounded mb-2" />
            <div className="w-1/2 h-3 bg-white/10 rounded" />
            <div className="mt-4 flex gap-2">
              <div className="w-12 h-6 bg-cyan-500/50 rounded" />
              <div className="w-12 h-6 bg-white/10 rounded" />
            </div>
          </div>
          <div className="w-20 h-36 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-2">
            <div className="w-full h-full bg-slate-800 rounded-xl flex flex-col items-center justify-center gap-2">
              <Smartphone className="w-6 h-6 text-white/40" />
              <div className="w-8 h-1 bg-white/20 rounded" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          {['React', 'Next.js', 'Flutter'].map((tech) => (
            <span
              key={tech}
              className="bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    ),
  },
]

export function MarqueeSection() {
  const duplicatedPanels = [...panels, ...panels]

  return (
    <section className="mt-16 md:mt-20 mb-16 overflow-hidden">
      <div className="animate-marquee flex">
        {duplicatedPanels.map((panel, index) => (
          <div
            key={`${panel.id}-${index}`}
            className={`flex-shrink-0 h-[280px] md:h-[500px] w-[420px] md:w-[720px] mx-3 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br ${panel.gradient} relative`}
          >
            {panel.content}
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white font-serif text-xl md:text-2xl font-medium">
                {panel.title}
              </h3>
              <p className="text-white/60 text-sm mt-1">{panel.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
