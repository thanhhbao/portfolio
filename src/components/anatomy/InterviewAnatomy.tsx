import { useEffect, useRef } from 'react'
import './healthcare.css'
import './interview.css'
import * as art from './interview-art'

const CYCLE = 12 // seconds for one pass
const REST_TEXT = `Score ${art.SCORE} · interview readiness`

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const sm = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** everything the console does is a function of where we are in the cycle, 0..1 */
function poseAt(p: number) {
  const card = p < 0.05 ? art.CARD_START : p < 0.3 ? lerp(art.CARD_START, art.CARD_END, sm(0.05, 0.3, p)) : p < 0.92 ? art.CARD_END : art.CARD_START
  const cardOpacity = p < 0.5 ? sm(0, 0.035, p) : 1 - sm(0.88, 0.93, p)
  const away = 1 - sm(0.9, 0.95, p)
  const chips = [0, 1, 2, 3].map((j) => 5 * sm(0.2 + 0.03 * j, 0.26 + 0.03 * j, p) * away)
  const flows = [sm(0.2, 0.26, p) - sm(0.5, 0.58, p), sm(0.3, 0.36, p) - sm(0.62, 0.68, p), sm(0.42, 0.48, p) - sm(0.72, 0.78, p)].map(clamp01)
  const lamps = [0.22, 0.32, 0.44].map((s) => sm(s, s + 0.04, p) * away > 0.5)
  const audio = clamp01(sm(0.28, 0.34, p) - sm(0.58, 0.64, p))
  const cam = clamp01(sm(0.4, 0.46, p) - sm(0.7, 0.76, p))
  const target = p < 0.66 ? art.NEEDLE_REST : p < 0.95 ? art.NEEDLE_SCORE : art.NEEDLE_REST
  const slip = sm(0.78, 0.86, p) * away
  const tape = sm(0.2, 0.5, p) * away
  const spin = clamp01(sm(0.2, 0.26, p) - sm(0.48, 0.54, p))
  const text =
    p < 0.05
      ? 'waiting for a candidate'
      : p < 0.28
        ? 'parsing resume · drafting questions'
        : p < 0.66
          ? 'reading speech and behaviour'
          : p < 0.95
            ? ''
            : 'report sent · resetting'
  return { card, cardOpacity, chips, flows, lamps, audio, cam, target, slip, tape, spin, text }
}

/** the finished pose, for reduced motion */
const FINISHED = (() => {
  const pose = poseAt(0.82)
  return { ...pose, flows: [0.8, 0.8, 0.8], tape: 1, audio: 0.7, cam: 1, lamps: [true, true, true] }
})()

export function InterviewAnatomy() {
  const root = useRef<HTMLElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = root.current
    const tiltEl = tilt.current
    const readoutEl = readout.current
    if (!host || !tiltEl || !readoutEl) return
    const q = <T extends Element>(selector: string) => host.querySelector(selector) as T
    const qa = <T extends Element>(selector: string) => Array.from(host.querySelectorAll(selector)) as T[]

    const card = q<SVGGElement>('[data-part="card"]')
    const chips = q<SVGGElement>('[data-part="chips"]')
    const bars = q<SVGGElement>('[data-part="bars"]')
    const faders = qa<SVGGElement>('[data-fader]')
    const rings = qa<SVGPathElement>('[data-ring]')
    const flows = qa<SVGGElement>('[data-pulse]')
    const lamps = qa<SVGGElement>('[data-lamp]')
    const needle = q<SVGPathElement>('[data-part="needle"]')
    const slip = q<SVGGElement>('[data-part="slip"]')
    const tape = q<SVGGElement>('[data-part="tape"]')
    const spokes = q<SVGPathElement>('[data-part="spokes"]')
    const camera = q<SVGGElement>('[data-part="camera"]')
    const marker = q<SVGGElement>('[data-part="marker"]')
    const markerShadow = q<SVGGElement>('[data-part="marker-shadow"]')
    const sight = q<SVGGElement>('[data-part="sight"]')
    const sightLine = q<SVGPathElement>('[data-part="sight-line"]')

    const stillQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let calm = stillQuery.matches
    let t = -1.6 // a beat for the parts to land before anything moves
    let clock = 0
    const needleState = { a: art.NEEDLE_REST, v: 0 }
    const tiltState = { rx: 0, ry: 0, tx: 0, ty: 0 }
    let camX = art.PAD_C[0]
    let spool = 0
    let lastText = ''
    let visible = false
    let frame = 0
    let last = 0

    const draw = (pose: ReturnType<typeof poseAt>, dt: number, still: boolean) => {
      clock += dt
      const s = still ? 1.3 : clock

      card.setAttribute('transform', art.translate(pose.card))
      card.style.opacity = pose.cardOpacity.toFixed(3)
      chips.innerHTML = art.chipsSvg(pose.chips)

      // eight bar meters: the voice
      const heights = art.BAR_X.map((_, i) => {
        const v = 0.5 + 0.5 * Math.sin(s * 5.2 + i * 1.7) * Math.sin(s * 3.1 + i * 0.9)
        return 2.4 + pose.audio * 22 * (0.22 + 0.78 * v * v)
      })
      bars.innerHTML = art.barsSvg(heights)
      faders.forEach((fader, i) => {
        const dy = pose.audio * 8 * Math.sin(s * 1.9 + i * 1.3)
        fader.setAttribute('transform', art.translate(0, dy))
      })

      // voice ripples under the microphone
      rings.forEach((ring, i) => {
        const u = (s * 0.42 + i / art.RING_COUNT) % 1
        ring.setAttribute('d', art.ringD(u))
        ring.style.opacity = (pose.audio * (1 - u) * (still ? 0.8 : 1)).toFixed(3)
      })

      flows.forEach((flow, i) => (flow.style.opacity = pose.flows[i].toFixed(3)))
      lamps.forEach((lamp, i) => (pose.lamps[i] ? lamp.setAttribute('data-on', '') : lamp.removeAttribute('data-on')))

      // the behaviour marker hops about and the camera follows it along the rail
      const mx = pose.cam * 12 * Math.sin(s * 1.5)
      const my = pose.cam * 11 * Math.sin(s * 2.2 + 1)
      const mz = pose.cam * 2.6 * Math.abs(Math.sin(s * 4.4))
      marker.setAttribute('transform', art.translate(mx, my, mz))
      markerShadow.setAttribute('transform', art.translate(mx, my, 0))
      camX += (art.PAD_C[0] + mx * 0.9 - camX) * (still ? 1 : 1 - Math.exp(-dt / 0.22))
      camera.setAttribute('transform', art.translate(camX - art.PAD_C[0]))
      sight.style.opacity = pose.cam.toFixed(3)
      sightLine.setAttribute('d', art.sightD(camX, mx, my, mz))

      // the needle is a real spring: it overshoots, then settles on the score
      const substeps = 4
      for (let i = 0; i < substeps; i++) {
        needleState.v += ((pose.target - needleState.a) * 55 - needleState.v * 9) * (dt / substeps)
        needleState.a += needleState.v * (dt / substeps)
      }
      needle.setAttribute('d', art.needleD(needleState.a))
      slip.innerHTML = art.slipSvg(pose.slip)
      spool += pose.spin * 5 * dt
      spokes.setAttribute('d', art.spokesD(spool + (still ? 0.5 : 0)))
      tape.innerHTML = art.tapeSvg(pose.tape)

      const score = Math.max(0, Math.min(100, (needleState.a + 120) / 2.4))
      const text = pose.text || `Score ${Math.round(score)} · interview readiness`
      if (text !== lastText) {
        lastText = text
        readoutEl.textContent = text
      }
    }

    const drawTilt = (dt: number) => {
      const k = 1 - Math.exp(-dt / 0.2)
      tiltState.rx += (tiltState.tx - tiltState.rx) * k
      tiltState.ry += (tiltState.ty - tiltState.ry) * k
      tiltEl.style.transform = `rotateX(${tiltState.rx.toFixed(2)}deg) rotateY(${tiltState.ry.toFixed(2)}deg)`
    }

    const wrapped = (time: number) => ((time > 0 ? time : 0) / CYCLE) % 1
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const tick = (now: number) => {
      // phones: draw every other frame, the figure is rebuilt as SVG strings each frame
      if (coarse && last && now - last < 30) {
        frame = visible ? requestAnimationFrame(tick) : 0
        return
      }
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
      last = now
      t += dt
      draw(poseAt(wrapped(t)), dt, false)
      drawTilt(dt)
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (calm || frame || !visible) return
      last = 0
      frame = requestAnimationFrame(tick)
    }

    const showResult = () => {
      // reduced motion: hold the finished pose, no loop and no tilt
      host.setAttribute('data-calm', '')
      needleState.a = art.NEEDLE_SCORE
      needleState.v = 0
      camX = art.PAD_C[0]
      draw(FINISHED, 0, true)
      lastText = ''
      readoutEl.textContent = REST_TEXT
    }

    draw(poseAt(0), 0, false)
    if (calm) {
      showResult()
      host.setAttribute('data-built', '')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting
        if (visible) {
          host.setAttribute('data-built', '')
          start()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(host)

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (calm) return
      const box = tiltEl.getBoundingClientRect()
      const px = (event.clientX - box.left) / box.width - 0.5
      const py = (event.clientY - box.top) / box.height - 0.5
      tiltState.ty = Math.max(-0.5, Math.min(0.5, px)) * 9
      tiltState.tx = Math.max(-0.5, Math.min(0.5, py)) * -7
    }
    const onLeave = () => {
      tiltState.tx = 0
      tiltState.ty = 0
    }
    const replay = () => {
      if (calm) return
      t = 0
      start()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        replay()
      }
    }
    const onStill = () => {
      calm = stillQuery.matches
      if (calm) {
        cancelAnimationFrame(frame)
        frame = 0
        tiltEl.style.transform = ''
        showResult()
      } else {
        host.removeAttribute('data-calm')
        start()
      }
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('click', replay)
    host.addEventListener('keydown', onKey)
    stillQuery.addEventListener('change', onStill)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('click', replay)
      host.removeEventListener('keydown', onKey)
      stillQuery.removeEventListener('change', onStill)
    }
  }, [])

  return (
    <figure
      ref={root}
      tabIndex={0}
      aria-label="Fig 01: a signal-fusion console scores an interview from resume, voice and behaviour. Press Enter to replay."
      className="hc relative m-0 h-full min-h-[260px] sm:min-h-[360px] cursor-pointer select-none overflow-hidden rounded-[24px] border border-white/45 bg-[#E8F1F3]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-[#2F7F9A]/50"
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#9CC7D5]/30 blur-3xl" />
      <div className="pointer-events-none absolute left-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:left-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Fig 01
      </div>
      <div className="pointer-events-none absolute right-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:right-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Signal fusion
      </div>

      <div className="hc-stage relative flex h-full items-center justify-center px-1 pb-11 pt-8 sm:px-3 sm:pb-10">
        <div ref={tilt} className="hc-tilt w-full" dangerouslySetInnerHTML={{ __html: art.svg }} />
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-3 sm:inset-x-6 sm:bottom-4 z-10 flex items-end justify-between gap-4 font-mono text-[11px] text-[#051A24]/50">
        <span className="hidden sm:inline">Hover to tilt · click to replay</span>
        <span ref={readout} className="ml-auto rounded-full bg-white/60 px-3 py-1 text-[#0D212C]">
          {REST_TEXT}
        </span>
      </div>
    </figure>
  )
}
