import { useEffect, useRef } from 'react'
import './healthcare.css'
import './skd.css'
import * as art from './skd-art'

const CYCLE = 12 // seconds per image
const REST_TEXT = 'val acc 0.859 · checkpoint saved'
const REST_PHASE = 0.84
const REST_CLASS = 1

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const sm = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** everything the bench does is a function of the position in the cycle, 0..1 */
function poseAt(p: number, cls: number) {
  const xs = art.STATIONS[cls]
  let x = art.BELT_START
  if (p < 0.04) x = art.BELT_START
  else if (p < 0.14) x = lerp(art.BELT_START, art.PRESS_X, sm(0.04, 0.14, p))
  else if (p < 0.22) x = art.PRESS_X
  else if (p < 0.62) x = lerp(art.PRESS_X, xs, sm(0.22, 0.62, p))
  else x = xs

  const reach = 60 * sm(0.66, 0.76, p)
  const strokeNow = p < 0.77 ? reach : 60 * (1 - sm(0.77, 0.83, p))
  const y = clamp01((reach - 20) / 40) * art.BIN_TY
  const z = -4 * sm(20, 32, y)
  const tileOpacity = p < 0.5 ? sm(0, 0.035, p) : 1 - sm(0.88, 0.94, p)
  const grid = sm(0.17, 0.2, p)
  const press = art.pressLift * (1 - (sm(0.13, 0.17, p) - sm(0.19, 0.23, p)))

  const acts = art.PORTALS.map((xi) => (y > 1 ? 0 : clamp01(1 - sm(2, 22, Math.abs(x - xi)))))
  const kernels = art.PORTALS.map((xi) => clamp01((x - xi + 16) / 32))

  const e = clamp01((p - 0.05) / 0.76)
  const reset = sm(0.94, 0.99, p)
  const penE = e * (1 - reset)
  const curveOpacity = 1 - reset
  const value = art.ACCURACY * ((1 - Math.exp(-4 * e)) / (1 - Math.exp(-4))) * (1 - reset)
  const needle = art.GAUGE_MIN + (art.GAUGE_MAX - art.GAUGE_MIN) * value
  const card = art.CARD_LIFT * (1 - sm(0.8, 0.86, p)) + art.CARD_LIFT * sm(0.94, 0.99, p)
  const seated = card < art.CARD_LIFT * 0.3
  const lamp = p >= 0.76 && p < 0.92

  const text =
    p < 0.04
      ? 'loading image'
      : p < 0.22
        ? 'preprocess · resize + normalise'
        : p < 0.62
          ? 'forward pass · conv layers'
          : p < 0.78
            ? `sorting · class ${cls + 1}`
            : p < 0.92
              ? REST_TEXT
              : 'next image'
  return { x, y, z, strokeNow, tileOpacity, grid, press, acts, kernels, e, penE, curveOpacity, needle, card, seated, lamp, text, cls }
}

export function SkdAnatomy() {
  const root = useRef<HTMLElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const host = root.current
    const tiltEl = tilt.current
    const readoutEl = readout.current
    if (!host || !tiltEl || !readoutEl) return
    const q = <T extends Element>(selector: string) => host.querySelector(selector) as T

    const tile = q<SVGGElement>('[data-part="tile"]')
    const grid = q<SVGGElement>('[data-part="grid"]')
    const press = q<SVGGElement>('[data-part="press"]')
    const beltLines = q<SVGPathElement>('[data-part="beltlines"]')
    const curve = q<SVGPathElement>('[data-part="curve"]')
    const bridge = q<SVGGElement>('[data-part="bridge"]')
    const pen = q<SVGGElement>('[data-part="pen"]')
    const needle = q<SVGPathElement>('[data-part="needle"]')
    const card = q<SVGGElement>('[data-part="card"]')
    const ckptLamp = q<SVGGElement>('[data-part="ckpt-lamp"]')
    const ckptGlow = q<SVGPathElement>('[data-part="ckpt-glow"]')
    const pushers = art.STATIONS.map((_, i) => q<SVGGElement>(`[data-part="push-${i}"]`))
    const lamps = art.STATIONS.map((_, i) => q<SVGGElement>(`[data-part="lamp-${i}"]`))
    const glows = art.STATIONS.map((_, i) => q<SVGPathElement>(`[data-part="lampglow-${i}"]`))
    const panes = art.PORTALS.map((_, i) => q<SVGGElement>(`[data-part="pane-${i}"]`))
    const acts = art.PORTALS.map((_, i) => q<SVGGElement>(`[data-part="act-${i}"]`))
    const kernels = art.PORTALS.map((_, i) => q<SVGPathElement>(`[data-part="kernel-${i}"]`))
    const slots = Array.from({ length: 7 }, (_, i) => q<SVGGElement>(`[data-slot="${i}"]`))
    const pen0 = art.pen(0)

    const stillQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let calm = stillQuery.matches
    let t = -1.6 // a beat for the parts to land before anything moves
    const needleState = { a: art.GAUGE_MIN, v: 0 }
    const tiltState = { rx: 0, ry: 0, tx: 0, ty: 0 }
    const strokes = [-1, -1, -1]
    let slot = -1
    let lastText = ''
    let lastE = -1
    let lastBelt = Number.NaN
    let visible = false
    let frame = 0
    let last = 0

    const slotFor = (x: number) => (x >= art.SORT_FROM ? 6 : art.THRESHOLDS.filter((threshold) => threshold <= x).length)

    const draw = (p: number, cls: number, dt: number, snap = false) => {
      const pose = poseAt(p, cls)

      tile.setAttribute('transform', art.translate(pose.x, pose.y, pose.z))
      const next = slotFor(pose.x)
      if (next !== slot) {
        slot = next
        slots[next].appendChild(tile)
      }
      tile.style.opacity = pose.tileOpacity.toFixed(3)
      grid.style.opacity = pose.grid.toFixed(3)
      press.setAttribute('transform', art.translate(0, 0, pose.press))
      if (pose.x !== lastBelt) {
        lastBelt = pose.x
        beltLines.setAttribute('d', art.beltLinesD(pose.x))
      }

      art.PORTALS.forEach((_, i) => {
        panes[i].setAttribute('transform', art.translate(0, 0, art.lift * pose.acts[i]))
        acts[i].style.opacity = pose.acts[i].toFixed(3)
        kernels[i].style.opacity = pose.acts[i].toFixed(3)
        if (pose.acts[i] > 0.01) kernels[i].setAttribute('d', art.kernelD(i, pose.kernels[i]))
      })

      art.STATIONS.forEach((xs, i) => {
        const stroke = i === cls ? pose.strokeNow : 0
        if (Math.abs(stroke - strokes[i]) > 0.05) {
          strokes[i] = stroke
          pushers[i].innerHTML = art.pusherSvg(xs, stroke)
        }
        const on = i === cls && pose.lamp
        if (on) lamps[i].firstElementChild?.setAttribute('data-lit', '')
        else lamps[i].firstElementChild?.removeAttribute('data-lit')
        glows[i].style.opacity = on ? '0.85' : '0'
      })

      if (Math.abs(pose.penE - lastE) > 0.0015 || lastE < 0) {
        lastE = pose.penE
        const { bx, py } = art.pen(pose.penE)
        bridge.setAttribute('transform', art.translate(bx - pen0.bx, 0, 0))
        pen.setAttribute('transform', art.translate(0, py - pen0.py, 0))
        curve.setAttribute('d', art.curveD(pose.e))
      }
      curve.style.opacity = pose.curveOpacity.toFixed(3)

      // the gauge needle is a real spring: it overshoots a hair and settles
      if (snap) {
        needleState.a = pose.needle
        needleState.v = 0
      } else {
        const substeps = 4
        for (let i = 0; i < substeps; i++) {
          needleState.v += ((pose.needle - needleState.a) * 60 - needleState.v * 10) * (dt / substeps)
          needleState.a += needleState.v * (dt / substeps)
        }
      }
      needle.setAttribute('d', art.needleD(needleState.a))

      card.setAttribute('transform', art.translate(0, 0, pose.card))
      if (pose.seated) ckptLamp.firstElementChild?.setAttribute('data-lit', '')
      else ckptLamp.firstElementChild?.removeAttribute('data-lit')
      ckptGlow.style.opacity = pose.seated ? '0.85' : '0'

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
      lastE = -1
      draw(REST_PHASE, REST_CLASS, 0, true)
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
      const cycle = Math.max(0, Math.floor(t / CYCLE))
      draw(wrapped(t), (cycle + 1) % 3, dt)
      drawTilt(dt)
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (calm || frame || !visible) return
      last = 0
      frame = requestAnimationFrame(tick)
    }

    draw(0, REST_CLASS, 0, true)
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
      aria-label="Fig 03: a sorting bench presses, convolves and classifies a skin image while a plotter draws the training loss. Press Enter to replay."
      className="hc relative m-0 h-full min-h-[260px] sm:min-h-[360px] cursor-pointer select-none overflow-hidden rounded-[24px] border border-white/45 bg-[#EEF3F2]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-[#2F7F9A]/50"
    >
      <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-[#9CC7D5]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:right-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Training pipeline
      </div>
      <div className="pointer-events-none absolute left-4 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.1em] sm:left-6 sm:top-4 sm:text-[11px] sm:tracking-[0.18em] text-[#051A24]/45">
        Fig 03
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
