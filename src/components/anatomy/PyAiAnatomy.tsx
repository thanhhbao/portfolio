import { useEffect, useRef } from 'react'
import './healthcare.css'
import './pyai.css'
import * as art from './pyai-art'

const CYCLE = 13 // seconds for one card
const REST_TEXT = 'step 4/4 · checked'
const EDIT_ARRIVE = art.EDIT_X + 11
const CHAR_PITCH = 1.47
const EDIT_END = EDIT_ARRIVE - CHAR_PITCH * art.CHARS
const STAMP_PRESS = [0.72, 0.765]

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const sm = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** everything the machine does is a function of where we are in the cycle, 0..1 */
function poseAt(p: number) {
  // carriage
  let x = art.HOP_X
  let chars = p < 0.03 ? art.CHARS : 0
  let punch = -1
  let punchDepth = 0
  if (p < 0.07) x = art.HOP_X
  else if (p < 0.2) x = lerp(art.HOP_X, EDIT_ARRIVE, sm(0.07, 0.2, p))
  else if (p < 0.4) {
    const n = ((p - 0.2) / 0.2) * art.CHARS
    const whole = Math.floor(n)
    const f = n - whole
    x = EDIT_ARRIVE - CHAR_PITCH * (whole + sm(0, 0.5, f))
    chars = Math.min(art.CHARS, whole + (f > 0.3 ? 1 : 0))
    punch = whole % art.PEG_Y.length
    punchDepth = f < 0.55 ? Math.sin((Math.PI * f) / 0.55) : 0
  } else if (p < 0.5) {
    x = lerp(EDIT_END, art.HINT_X, sm(0.4, 0.5, p))
    chars = art.CHARS
  } else if (p < 0.64) {
    x = art.HINT_X
    chars = art.CHARS
  } else if (p < 0.72) {
    x = lerp(art.HINT_X, art.CHECK_X, sm(0.64, 0.72, p))
    chars = art.CHARS
  } else if (p < 0.8) {
    x = art.CHECK_X
    chars = art.CHARS
  } else if (p < 0.87) {
    x = lerp(art.CHECK_X, art.END_X, sm(0.8, 0.87, p))
    chars = art.CHARS
  } else if (p < 0.88) {
    x = art.END_X
    chars = art.CHARS
  } else {
    x = lerp(art.END_X, art.HOP_X, sm(0.88, 0.98, p))
    chars = art.CHARS
  }
  if (p >= 0.4) chars = art.CHARS

  // card: dropped from the hopper, rides the carriage, slides into the tray, is filed away
  let cardX = x
  let cardZ = art.CARRIAGE_Z
  let cardOpacity = 1
  if (p < 0.03) {
    cardX = art.TRAY_X
    cardZ = art.PILE_TOP - 3 * sm(0, 0.03, p)
    cardOpacity = 1 - sm(0, 0.03, p)
  } else if (p < 0.07) {
    cardX = art.HOP_X
    cardZ = art.CARRIAGE_Z + 6.5 * Math.pow(1 - sm(0.03, 0.07, p), 2)
    cardOpacity = sm(0.03, 0.045, p)
  } else if (p >= 0.87) {
    const e = sm(0.87, 0.94, p)
    cardX = lerp(art.END_X, art.TRAY_X, e)
    cardZ = lerp(art.CARRIAGE_Z, art.PILE_TOP, sm(0.6, 1, e))
  }

  const tick = p < 0.03 ? 1 : p < 0.5 ? 0 : sm(0.755, 0.785, p)

  // lamps on the console: one per step
  const ramps = [sm(0.38, 0.41, p), sm(0.6, 0.63, p), sm(0.78, 0.81, p), sm(0.935, 0.955, p)]
  const carry = p < 0.1 ? 1 - sm(0.01, 0.04, p) : 0
  const lamps = ramps.map((r) => Math.max(r, carry))

  const lampHint = clamp01(sm(0.5, 0.54, p) - sm(0.62, 0.66, p))
  const lift = clamp01(sm(0.53, 0.58, p) - sm(0.6, 0.64, p))
  const pressing = p >= STAMP_PRESS[0] && p < STAMP_PRESS[1]

  const text =
    p < 0.03
      ? REST_TEXT
      : p < 0.07
        ? 'feeding a card'
        : p < 0.4
          ? 'edit · step 1/4'
          : p < 0.64
            ? 'hint · step 2/4'
            : p < 0.87
              ? 'check · step 3/4'
              : p < 0.94
                ? 'filing · step 4/4'
                : REST_TEXT

  return { x, cardX, cardZ, cardOpacity, chars, punch, punchDepth, tick, lamps, lampHint, lift, pressing, text }
}

export function PyAiAnatomy() {
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
    const card = q<SVGGElement>('[data-part="card"]')
    const typed = q<SVGGElement>('[data-part="typed"]')
    const typedText = typed.firstElementChild as SVGTextElement
    const tick = q<SVGPathElement>('[data-part="tick"]')
    const stamp = q<SVGGElement>('[data-part="stamp"]')
    const tag = q<SVGGElement>('[data-part="tag"]')
    const cone = q<SVGPathElement>('[data-part="cone"]')
    const lens = q<SVGGElement>('[data-part="lens"]')
    const hintGlow = q<SVGPathElement>('[data-part="lamp-glow-hint"]')
    const spokes = [q<SVGPathElement>('[data-part="spokes-0"]'), q<SVGPathElement>('[data-part="spokes-1"]')]
    const pegs = art.PEG_Y.map((_, i) => q<SVGGElement>(`[data-part="peg-${i}"]`))
    const lamps = [0, 1, 2, 3].map((i) => ({
      body: q<SVGGElement>(`[data-part="lamp-${i}"]`),
      glow: q<SVGPathElement>(`[data-part="lamp-glow-${i}"]`),
    }))

    const stillQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let calm = stillQuery.matches
    let t = -1.6 // a beat for the parts to land before anything moves
    const stampState = { z: 0, v: 0 }
    const tiltState = { rx: 0, ry: 0, tx: 0, ty: 0 }
    let lastText = ''
    let lastChars = -1
    let lastPulley = Number.NaN
    let lastCardOpacity = -1
    let visible = false
    let frame = 0
    let last = 0

    const draw = (p: number, dt: number) => {
      const pose = poseAt(p)

      carriage.setAttribute('transform', art.translate(pose.x))
      card.setAttribute('transform', art.translate(pose.cardX, pose.cardZ))
      if (pose.cardOpacity !== lastCardOpacity) {
        lastCardOpacity = pose.cardOpacity
        card.style.opacity = pose.cardOpacity.toFixed(3)
      }
      if (pose.chars !== lastChars) {
        lastChars = pose.chars
        typedText.textContent = 'opt.step()'.slice(0, pose.chars)
      }
      tick.style.opacity = pose.tick.toFixed(3)

      // type bars punch one after another
      pegs.forEach((peg, i) => {
        const depth = pose.punch === i ? pose.punchDepth * art.PEG_TRAVEL : 0
        peg.setAttribute('transform', art.translate(0, -depth))
      })

      // the stamp is a spring: it falls, hits the card and bounces back
      const target = pose.pressing ? -art.STAMP_TRAVEL : 0
      const substeps = 4
      for (let i = 0; i < substeps; i++) {
        stampState.v += ((target - stampState.z) * 380 - stampState.v * 20) * (dt / substeps)
        stampState.z += stampState.v * (dt / substeps)
        if (stampState.z < -art.STAMP_TRAVEL) {
          stampState.z = -art.STAMP_TRAVEL
          stampState.v = Math.abs(stampState.v) * 0.25
        }
      }
      stamp.setAttribute('transform', art.translate(0, stampState.z))

      tag.style.opacity = pose.lift.toFixed(3)
      tag.setAttribute('transform', art.translateXYZ(art.HINT_X, 0, art.CARRIAGE_Z + art.CARD_H + 3 + pose.lift * art.TAG_LIFT))
      cone.style.opacity = (pose.lampHint * 0.95).toFixed(3)
      hintGlow.style.opacity = (pose.lampHint * 0.8).toFixed(3)
      if (pose.lampHint > 0.5) lens.firstElementChild?.setAttribute('data-lit', '')
      else lens.firstElementChild?.removeAttribute('data-lit')

      lamps.forEach((lamp, i) => {
        lamp.glow.style.opacity = (pose.lamps[i] * 0.85).toFixed(3)
        if (pose.lamps[i] > 0.5) lamp.body.firstElementChild?.setAttribute('data-lit', '')
        else lamp.body.firstElementChild?.removeAttribute('data-lit')
      })

      // belt pulleys follow the carriage
      const angle = -pose.x / 7
      if (Math.abs(angle - lastPulley) > 0.01 || Number.isNaN(lastPulley)) {
        lastPulley = angle
        spokes[0].setAttribute('d', art.spokesD(0, angle))
        spokes[1].setAttribute('d', art.spokesD(1, angle))
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

    const wrapped = (time: number) => ((time > 0 ? time : 0) / CYCLE) % 1
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const tick_ = (now: number) => {
      // phones: draw every other frame, the figure is rebuilt as SVG strings each frame
      if (coarse && last && now - last < 30) {
        frame = visible ? requestAnimationFrame(tick_) : 0
        return
      }
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
      last = now
      t += dt
      draw(wrapped(t), dt)
      drawTilt(dt)
      frame = visible ? requestAnimationFrame(tick_) : 0
    }
    const start = () => {
      if (calm || frame || !visible) return
      last = 0
      frame = requestAnimationFrame(tick_)
    }

    // reduced motion: hold the finished pose, no loop and no tilt
    const showResult = () => {
      host.setAttribute('data-calm', '')
      stampState.z = 0
      stampState.v = 0
      lastChars = -1
      lastCardOpacity = -1
      draw(0.97, 0)
      readoutEl.textContent = REST_TEXT
    }

    draw(0.97, 0)
    lastText = ''
    if (calm) {
      showResult()
      host.setAttribute('data-built', '')
    } else {
      // before it scrolls into view, rest where the cycle begins
      draw(0, 0)
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
      t = 0.03 * CYCLE
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
      aria-label="Fig 04: a card-index machine edits, hints, checks and files a Python exercise card. Press Enter to replay."
      className="hc relative m-0 h-full min-h-[260px] sm:min-h-[360px] cursor-pointer select-none overflow-hidden rounded-[24px] border border-white/45 bg-[#EEF3F2]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-[#2F7F9A]/50"
    >
      <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-[#9CC7D5]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:right-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Review loop
      </div>
      <div className="pointer-events-none absolute left-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:left-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Fig 04
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
