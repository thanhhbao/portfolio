import { useEffect, useRef } from 'react'
import './healthcare.css'
import * as art from './healthcare-art'

const CYCLE = 11 // seconds for one scan
const REST_TEXT = 'Medium risk · 0 bytes sent'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const sm = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** everything the machine does is a function of where we are in the cycle, 0..1 */
function poseAt(p: number) {
  let x = art.CARRIAGE_START
  if (p < 0.04) x = art.CARRIAGE_START
  else if (p < 0.4) x = lerp(art.CARRIAGE_START, art.SCAN_X, sm(0.04, 0.4, p))
  else if (p < 0.46) x = art.SCAN_X
  else if (p < 0.7) {
    const u = (p - 0.46) / 0.24
    x = art.SCAN_X + 13 * Math.sin(u * Math.PI * 2) * Math.sin(u * Math.PI)
  } else if (p < 0.9) x = art.SCAN_X
  else x = lerp(art.SCAN_X, art.CARRIAGE_START, sm(0.9, 0.99, p))

  const gate = clamp01(sm(0.02, 0.08, p) - sm(0.42, 0.48, p) + sm(0.86, 0.92, p) - sm(0.97, 1, p))
  const tile = p < 0.5 ? sm(0, 0.035, p) : 1 - sm(0.8, 0.86, p)
  const beam = clamp01(sm(0.44, 0.5, p) - sm(0.66, 0.7, p))
  const lit = clamp01(sm(0.48, 0.54, p) - sm(0.7, 0.76, p))
  const spin = 3 * clamp01(sm(0.46, 0.54, p) - sm(0.68, 0.8, p))
  const target = p < 0.48 ? art.NEEDLE_REST : p < 0.58 ? art.NEEDLE_HIGH : p < 0.9 ? art.NEEDLE_MEDIUM : art.NEEDLE_REST
  const text =
    p < 0.04 ? 'waiting for an image' : p < 0.42 ? 'image in · gate sealing' : p < 0.66 ? 'inferring on-device' : p < 0.86 ? REST_TEXT : 'memory cleared'
  return { x, gate, tile, beam, lit, spin, target, text }
}

export function HealthcareAnatomy() {
  const root = useRef<HTMLElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = root.current
    const tiltEl = tilt.current
    const readoutEl = readout.current
    if (!host || !tiltEl || !readoutEl) return
    const q = <T extends Element>(selector: string) => host.querySelector(selector) as T

    const carriage = q<SVGGElement>('[data-part="carriage"]')
    const tile = q<SVGGElement>('[data-part="tile"]')
    const gate = q<SVGGElement>('[data-part="gate"]')
    const beam = q<SVGGElement>('[data-part="beam"]')
    const signal = q<SVGGElement>('[data-part="signal"]')
    const crystal = q<SVGGElement>('[data-part="crystal"]')
    const glow = q<SVGPathElement>('[data-part="glow"]')
    const needle = q<SVGPathElement>('[data-part="needle"]')
    const gearOne = q<SVGGElement>('[data-part="gear-one"]')
    const gearTwo = q<SVGGElement>('[data-part="gear-two"]')
    const slotIn = q<SVGGElement>('[data-slot="in"]')
    const slotOut = q<SVGGElement>('[data-slot="out"]')

    const stillQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let calm = stillQuery.matches
    let t = -1.6 // a beat for the parts to land before anything moves
    let angle = 0
    let drawnAngle = Number.NaN
    const needleState = { a: art.NEEDLE_REST, v: 0 }
    const tiltState = { rx: 0, ry: 0, tx: 0, ty: 0 }
    let slot: 'in' | 'out' | '' = ''
    let lastText = ''
    let visible = false
    let frame = 0
    let last = 0

    const draw = (p: number, dt: number) => {
      const pose = poseAt(p)
      angle += pose.spin * dt

      carriage.setAttribute('transform', art.translate(pose.x))
      const nextSlot = pose.x > 44 ? 'out' : 'in'
      if (nextSlot !== slot) {
        slot = nextSlot
        ;(nextSlot === 'out' ? slotOut : slotIn).appendChild(carriage)
      }
      tile.style.opacity = pose.tile.toFixed(3)
      gate.setAttribute('transform', art.translate(0, pose.gate * art.GATE_LIFT))
      beam.style.opacity = pose.beam.toFixed(3)
      signal.style.opacity = pose.lit.toFixed(3)
      glow.style.opacity = (pose.lit * 0.85).toFixed(3)
      if (pose.lit > 0.5) crystal.firstElementChild?.setAttribute('data-lit', '')
      else crystal.firstElementChild?.removeAttribute('data-lit')

      // the needle is a real spring, so it overshoots toward High and settles on Medium
      const substeps = 4
      for (let i = 0; i < substeps; i++) {
        needleState.v += ((pose.target - needleState.a) * 55 - needleState.v * 9) * (dt / substeps)
        needleState.a += needleState.v * (dt / substeps)
      }
      needle.setAttribute('d', art.needleD(needleState.a))

      if (Math.abs(angle - drawnAngle) > 0.004 || Number.isNaN(drawnAngle)) {
        const gears = art.gearPair(angle)
        gearOne.innerHTML = gears.one
        gearTwo.innerHTML = gears.two
        drawnAngle = angle
      }
      if (pose.text !== lastText) {
        lastText = pose.text
        readoutEl.textContent = pose.text
      }
    }

    const drawTilt = (dt: number) => {
      const k = 1 - Math.exp(-dt / 0.2)
      tiltState.rx += (tiltState.tx - tiltState.rx) * k
      tiltState.ry += (tiltState.ty - tiltState.ry) * k
      tiltEl.style.transform = `rotateX(${tiltState.rx.toFixed(2)}deg) rotateY(${tiltState.ry.toFixed(2)}deg)`
    }

    const showResult = () => {
      // reduced motion: hold the finished pose, no loop and no tilt
      host.setAttribute('data-calm', '')
      needleState.a = art.NEEDLE_MEDIUM
      const resting = 0.74
      angle = 0.4
      draw(resting, 0)
      lastText = ''
      readoutEl.textContent = REST_TEXT
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
      draw(wrapped(t), dt)
      drawTilt(dt)
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (calm || frame || !visible) return
      last = 0
      frame = requestAnimationFrame(tick)
    }

    draw(0, 0)
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
      aria-label="Fig 02: a sealed glass box scans a skin image on-device. Press Enter to replay."
      className="hc relative m-0 h-full min-h-[260px] sm:min-h-[360px] cursor-pointer select-none overflow-hidden rounded-[24px] border border-white/45 bg-[#E8F1F3]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-[#2F7F9A]/50"
    >
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#9CC7D5]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:right-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Client-side inference
      </div>
      <div className="pointer-events-none absolute left-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:left-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Fig 02
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
