import * as k from './iso-kit'
import type { Point3 } from './iso-kit'

/*
 * Fig 03 · SKD training pipeline as a sorting bench.
 * A skin image rides a belt, is pressed (resize + normalise), slides under four glass
 * layers (convolutions: each pane lifts and a 3×3 kernel sweeps it), then a pusher knocks
 * it into one of three class bins. Beside it a pen plotter draws the training loss, and a
 * gauge climbs to the validation accuracy; a checkpoint card seats when it is saved.
 */

export const WIDTH = 640
export const HEIGHT = 450

const PLATE = { x: -164, y: -92, w: 292, d: 220, r: 10 }
const PLATE_H = 12
const FOOT_H = 5

export const BELT_X0 = -128
export const BELT_X1 = 92
const BELT_Z = 5
export const TILE_Z = 6.5
export const BELT_START = -122
export const PRESS_X = -100
export const PORTALS = [-70, -48, -26, -4]
export const STATIONS = [20, 45, 70]
export const BIN_TY = 40
const TILE_HALF = 13

/** where the tile sits in the painter's order: how many of these it has passed */
export const THRESHOLDS = [-88, ...PORTALS]
export const SORT_FROM = 12

const PANE = { y: 24, z0: 16, z1: 46, cols: 7, rows: 5, lift: 5 }
const PRESS_LIFT = 10

const CHART = { x0: -134, w: 82, yHigh: 72, yLow: 104, z: 4.8 }
const PAPER = { x: -150, y: 60, w: 114, d: 58 }
const PEN_OFFSET = 5

export const GAUGE: [number, number] = [22, 96]
const GAUGE_R = 18
const GAUGE_TOP = 12
export const GAUGE_MIN = -120
export const GAUGE_MAX = 120
export const ACCURACY = 0.859

const CARD = { x: 56, y: 87, w: 26, d: 12 }
export const CARD_LIFT = 14

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...k.boxCorners({ x: -150, y: -70, w: 250, d: 190, r: 0 }, 0, 66),
  ],
  WIDTH,
  HEIGHT,
  { pad: 16, azimuth: 45 },
)

const at = (point: Point3) => k.iso(point, P)
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style)
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style)
const D = (points: Array<[number, number]>, style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style)
const byDepth = (points: Array<[number, number]>) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))
const plan = (x: number, y: number, w: number, d: number, r = 1): k.Plan => ({ x, y, w, d, r })
const slab = (p: k.Plan, z: number, h: number, steps = 3, bevel = 0.4) => k.slabOf(p, z, h, P, steps, bevel)

/* ---------- the plate and the belt ---------- */

function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`]
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }))
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }))
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }))
  const screws = k.corners(PLATE, 10)
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }))
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }))
  // a short ruler along the back edge
  const strip = plan(-140, -84, 170, 6, 1)
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }))
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.7, 0.6, [1.8, 3.2], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([strip.x + 2, strip.y + 3, 0.6]), at([strip.x + strip.w - 2, strip.y + 3, 0.6])], { size: 0.45 }))
  return out.join('')
}

function barrels() {
  const out: string[] = []
  for (const xs of STATIONS) {
    out.push(S(slab(plan(xs - 9, -64, 18, 22, 2), 0, 4, 3, 0.4), { tone: 'mid' }))
    out.push(D([[xs - 6, -61], [xs + 6, -61], [xs - 6, -45], [xs + 6, -45]].map(([x, y]) => at([x, y, 4])), { size: 0.4 }))
    out.push(S(slab(plan(xs - 6, -66, 12, 30, 3), 4, 10, 4, 0.6), { tone: 'mid' }))
    out.push(S(slab(plan(xs - 7, -39, 14, 3, 1), 3.6, 11, 2, 0.3), { tone: 'mid', crease: 'none' }))
    out.push(L(k.sideSeam(plan(xs - 6, -66, 12, 30, 3), 9, P, 4), { tone: 'faint' }))
    for (const y of [-58, -47]) {
      out.push(S(k.cylinder(xs, y, 1.7, 14, 3, P, 14), { tone: 'mid' }))
      out.push(L(k.ring(xs, y, 0.8, 17, P, 10), { tone: 'lo' }))
    }
    out.push(L(k.lineOnTop([xs - 3, -66 + 4], [xs - 3, -42], 14, P) + k.lineOnTop([xs + 3, -62], [xs + 3, -42], 14, P), { tone: 'faint' }))
  }
  return out.join('')
}

/** the pusher rod and head, rebuilt when the stroke changes */
export function pusherSvg(xs: number, stroke: number) {
  const headY = -36 + stroke
  const out: string[] = []
  if (headY + 36 > 1) out.push(S(slab(plan(xs - 2, -36, 4, headY + 36, 1.2), 8, 3.5, 2, 0.3), { tone: 'mid', crease: 'none' }))
  out.push(S(slab(plan(xs - 8, headY, 16, 3, 1), 7, 7, 2, 0.4), { tone: 'mid' }))
  out.push(D([[xs - 5, headY + 3], [xs + 5, headY + 3]].map(([x, y]) => at([x, y, 12])), { size: 0.4 }))
  return out.join('')
}

function beltBody() {
  const out: string[] = []
  const body = plan(BELT_X0, -25, BELT_X1 - BELT_X0, 50, 4)
  out.push(`<path class="iso-halo" d="${k.haloOf(body, 0, 5, P)}" style="filter:blur(5px)"/>`)
  out.push(S(slab(body, 0, BELT_Z, 5, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(body, 2.4), BELT_Z, P, 4), { tone: 'faint' }))
  // belt surface
  const belt = plan(BELT_X0 + 5, -20, BELT_X1 - BELT_X0 - 10, 40, 2)
  out.push(S(k.slabOf(belt, BELT_Z, TILE_Z - BELT_Z, P, 3, 0.2), { tone: 'hi', crease: 'lo' }))
  // guide rails with a gap at every station
  const segments: Array<[number, number]> = [[BELT_X0, STATIONS[0] - 10], [STATIONS[0] + 10, STATIONS[1] - 10], [STATIONS[1] + 10, STATIONS[2] - 10], [STATIONS[2] + 10, BELT_X1]]
  for (const y of [-25, 21]) {
    for (const [a, b] of segments) {
      out.push(S(slab(plan(a, y, b - a, 4, 0.8), BELT_Z, 7, 2, 0.4), { tone: 'mid' }))
    }
    out.push(D([[BELT_X0 + 8], [PRESS_X], [-40], [STATIONS[0] - 14], [BELT_X1 - 6]].map(([x]) => at([x, y + 2, BELT_Z + 7])), { size: 0.4 }))
  }
  // end rollers and their bearing blocks
  for (const x of [BELT_X0 - 3, BELT_X1 - 3]) {
    out.push(S(slab(plan(x, -23, 6, 46, 3), 1, 8, 4, 0.5), { tone: 'mid' }))
    for (const y of [-26, 23]) out.push(S(slab(plan(x - 1, y, 8, 3, 0.8), 0, 10, 2, 0.3), { tone: 'mid', crease: 'none' }))
    out.push(D([-18, 18].map((y) => at([x + 3, y, 9])), { size: 0.45 }))
  }
  return out.join('')
}

const beltLines = () => `<path data-part="beltlines" class="iso-line" data-tone="lo" d=""/>`

/** transverse belt lines, shifted with the belt so it visibly moves */
export function beltLinesD(offset: number) {
  const out: string[] = []
  const gap = 12
  const start = BELT_X0 + 7
  const end = BELT_X1 - 7
  for (let x = start + (((offset % gap) + gap) % gap) - gap; x <= end; x += gap) {
    if (x < start) continue
    out.push(k.lineOnTop([x, -19], [x, 19], TILE_Z, P))
  }
  return out.join('')
}

function motor() {
  const out: string[] = []
  const m = plan(-150, -16, 22, 32, 3)
  out.push(S(slab(m, 0, 18, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.sideSeam(m, 9, P, 4), { tone: 'faint' }))
  out.push(L([3, 6, 9, 12].map((y) => k.lineOnTop([m.x + 4, m.y + 6 + y * 1.4], [m.x + m.w - 4, m.y + 6 + y * 1.4], 18, P)).join(''), { tone: 'lo' }))
  out.push(S(k.cylinder(-139, 0, 5, 18, 4, P, 24), { tone: 'mid' }))
  out.push(L(k.knurl(-139, 0, 5, 18, 22, 24, P, 0.3), { tone: 'lo' }))
  out.push(L(k.lineOnTop([-139, 0], [-139 + 5, 0], 22, P), { tone: 'hi' }))
  out.push(D([at([-139, 0, 22]), at([m.x + 3, m.y + 3, 18]), at([m.x + m.w - 3, m.y + m.d - 3, 18])], { size: 0.45 }))
  // drive link to the belt's first roller
  out.push(S(slab(plan(-128, -3, 8, 6, 1.2), 5, 3, 2, 0.3), { tone: 'mid', crease: 'none' }))
  return out.join('')
}

/* ---------- the tile ---------- */

function tile() {
  const out: string[] = []
  const bezel = plan(-TILE_HALF, -TILE_HALF, TILE_HALF * 2, TILE_HALF * 2, 2)
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(bezel, 2), TILE_Z, 0.1, P)}" style="filter:blur(3px)"/>`)
  out.push(S(slab(bezel, TILE_Z, 2.5, 4, 0.5), { tone: 'hi' }))
  const skinZ = TILE_Z + 2.5
  out.push(`<path class="hc-skin" d="${k.planOutline(plan(-11, -11, 22, 22, 1.4), skinZ, P, 4)}"/>`)
  const blot: Array<[number, number]> = []
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    blot.push([1.5 + Math.cos(a) * (4 + Math.sin(a * 3) * 0.55), -1.5 + Math.sin(a) * (3.3 + Math.cos(a * 2) * 0.45)])
  }
  out.push(`<path class="hc-lesion-halo" d="${k.onTop(blot.map(([x, y]) => [1.5 + (x - 1.5) * 1.55, -1.5 + (y + 1.5) * 1.55] as [number, number]), skinZ, P, true)}"/>`)
  out.push(`<path class="hc-lesion" d="${k.onTop(blot, skinZ, P, true)}"/>`)
  // normalisation grid, shown once the press has stamped it
  const grid = [-3.7, 3.7].map((v) => k.lineOnTop([v, -11], [v, 11], skinZ + 0.1, P) + k.lineOnTop([-11, v], [11, v], skinZ + 0.1, P)).join('')
  out.push(`<g data-part="grid" class="sk-grid" style="opacity:0">${L(grid, { tone: 'lit' })}</g>`)
  return out.join('')
}

/* ---------- the press (preprocessing) ---------- */

function pressFrame() {
  const out: string[] = []
  const x = PRESS_X
  for (const y of [-33, 27]) {
    out.push(S(slab(plan(x - 5, y, 10, 6, 1), 0, 54, 3, 0.5), { tone: 'mid' }))
    out.push(D([at([x, y + 3, 54])], { size: 0.45 }))
  }
  return out.join('')
}

const pressHead = () =>
  [
    S(k.cylinder(PRESS_X, 0, 3.6, 17, 36, P, 20), { tone: 'mid', crease: 'none' }),
    L(k.ring(PRESS_X, 0, 3.6, 30, P, 16) + k.ring(PRESS_X, 0, 3.6, 40, P, 16), { tone: 'faint' }),
    S(slab(plan(PRESS_X - 12, -13, 24, 26, 2), 10, 5.5, 4, 0.5), { tone: 'hi' }),
    L(k.planOutline(plan(PRESS_X - 9.5, -10.5, 19, 21, 1), 15.5, P, 3), { tone: 'faint' }),
    L(k.lineOnTop([PRESS_X - 6, 0], [PRESS_X + 6, 0], 15.5, P) + k.lineOnTop([PRESS_X, -6], [PRESS_X, 6], 15.5, P), { tone: 'lo' }),
    D([[-9, -9], [9, -9], [-9, 9], [9, 9]].map(([x, y]) => at([PRESS_X + x, y, 15.5])), { size: 0.4 }),
  ].join('')

function pressBar() {
  const out: string[] = []
  out.push(S(slab(plan(PRESS_X - 6, -33, 12, 66, 1.5), 54, 8, 3, 0.5), { tone: 'mid' }))
  out.push(S(k.cylinder(PRESS_X, 0, 6.5, 62, 8, P, 28, 0.5), { tone: 'mid' }))
  out.push(L(k.knurl(PRESS_X, 0, 6.5, 63, 69, 28, P, 0.3), { tone: 'lo' }))
  out.push(L(k.ring(PRESS_X, 0, 3.2, 70, P, 14), { tone: 'mid' }))
  const t = k.topTicks(-24, 24, 4, 4, PRESS_X - 1.2, 62, [1.4, 2.6], P, 'y')
  out.push(L(t.minor, { tone: 'lo' }), L(t.major, { tone: 'mid' }))
  out.push(D([at([PRESS_X, -29, 62]), at([PRESS_X, 29, 62])], { size: 0.45 }))
  return out.join('')
}

/* ---------- convolution portals ---------- */

const paneCells = () => {
  const ys: number[] = []
  for (let c = 0; c < PANE.cols; c++) ys.push(-21 + c * 7)
  const zs: number[] = []
  for (let r = 0; r < PANE.rows; r++) zs.push(20 + r * 5.5)
  return { ys, zs }
}

function portalBack(xi: number) {
  const out: string[] = []
  out.push(S(slab(plan(xi - 3, -33, 6, 6, 1), 0, 52, 3, 0.5), { tone: 'mid' }))
  out.push(S(slab(plan(xi - 2.5, -27, 5, 3, 0.5), 14, 36, 2, 0.2), { tone: 'lo', crease: 'none' }))
  out.push(D([at([xi, -30, 52])], { size: 0.45 }))
  return out.join('')
}

function pane(index: number, xi: number) {
  const out: string[] = []
  const edge = (y: number, z: number) => at([xi, y, z])
  const outline = k.pathOf([edge(-PANE.y, PANE.z0), edge(PANE.y, PANE.z0), edge(PANE.y, PANE.z1), edge(-PANE.y, PANE.z1)], true)
  out.push(`<path class="hc-glass" d="${outline}"/>`)
  const inner = k.pathOf([edge(-PANE.y + 1.6, PANE.z0 + 1.6), edge(PANE.y - 1.6, PANE.z0 + 1.6), edge(PANE.y - 1.6, PANE.z1 - 1.6), edge(-PANE.y + 1.6, PANE.z1 - 1.6)], true)
  out.push(L(inner, { tone: 'lo' }))
  const { ys, zs } = paneCells()
  const cells: Array<[number, number]> = []
  const lit: Array<[number, number]> = []
  ys.forEach((y, c) =>
    zs.forEach((z, r) => {
      const p = at([xi, y, z])
      cells.push(p)
      if ((r * 7 + c * 3 + index) % 3 === 0) lit.push(p)
    }),
  )
  out.push(D(cells, { size: 0.55, tone: 'mid' }))
  out.push(`<g data-part="act-${index}" class="sk-act" style="opacity:0">${D(lit, { size: 1.15, tone: 'hi' })}</g>`)
  out.push(`<path data-part="kernel-${index}" class="sk-kernel" style="opacity:0" d="${kernelD(index, 0)}"/>`)
  out.push(`<path class="hc-shine" d="${k.pathOf([edge(-19, 42), edge(-8, 24)])}"/>`)
  return out.join('')
}

export function kernelD(index: number, u: number) {
  const xi = PORTALS[index]
  const yc = -14 + 28 * u
  const z0 = 20 + 5.5 - 2.75
  const z1 = 20 + 5.5 * 3 + 2.75
  const edge = (y: number, z: number) => at([xi + 0.3, y, z])
  return k.pathOf([edge(yc - 10.5, z0), edge(yc + 10.5, z0), edge(yc + 10.5, z1), edge(yc - 10.5, z1)], true)
}

function portalFront(index: number, xi: number) {
  const out: string[] = []
  out.push(S(slab(plan(xi - 3, 27, 6, 6, 1), 0, 52, 3, 0.5), { tone: 'mid' }))
  out.push(S(slab(plan(xi - 2.5, 24, 5, 3, 0.5), 14, 36, 2, 0.2), { tone: 'lo', crease: 'none' }))
  out.push(S(slab(plan(xi - 4, -33, 8, 66, 1.5), 52, 6, 3, 0.5), { tone: 'mid' }))
  const dots: Array<[number, number]> = []
  for (let i = 0; i <= index; i++) dots.push(at([xi, -9 + i * 6, 58]))
  out.push(D(dots, { size: 0.7, tone: 'hi' }))
  out.push(D([at([xi, -29, 58]), at([xi, 29, 58])], { size: 0.45 }))
  out.push(L(k.lineOnTop([xi - 1.6, -23], [xi - 1.6, 23], 58, P), { tone: 'faint' }))
  return out.join('')
}

/* ---------- the bins (sorting) ---------- */

function bins() {
  const before: string[] = []
  const after: string[] = []
  STATIONS.forEach((xs, i) => {
    const floor = plan(xs - 11, 25, 22, 35, 1.5)
    before.push(S(slab(floor, 0, 2.5, 3, 0.3), { tone: 'mid' }))
    before.push(L(k.planOutline(k.insetPlan(floor, 2.4), 2.5, P, 3), { tone: 'faint' }))
    before.push(S(slab(plan(xs - 11, 25, 2, 35, 0.6), 2.5, 7.5, 2, 0.3), { tone: 'mid' }))
    before.push(S(slab(plan(xs - 8, 25, 16, 2, 0.5), 2.5, 2.5, 2, 0.2), { tone: 'lo', crease: 'none' }))
    after.push(S(slab(plan(xs + 9, 25, 2, 35, 0.6), 2.5, 7.5, 2, 0.3), { tone: 'mid' }))
    after.push(S(slab(plan(xs - 11, 57.5, 22, 2.5, 0.8), 2.5, 7.5, 3, 0.4), { tone: 'mid' }))
    const dots: Array<[number, number]> = []
    for (let n = 0; n <= i; n++) dots.push(at([xs - 3 + n * 3, 60, 7]))
    after.push(D(dots, { size: 0.55, tone: 'hi' }))
    after.push(`<path data-part="lampglow-${i}" class="sk-glow" d="${k.cylinder(xs, 58.8, 3, 10, 3, P, 14).fill}" style="opacity:0"/>`)
    after.push(`<g data-part="lamp-${i}">${S(k.cylinder(xs, 58.8, 2.2, 10, 2.4, P, 14, 0.3), { tone: 'mid' })}</g>`)
    after.push(D([at([xs - 9, 58.8, 10]), at([xs + 9, 58.8, 10])], { size: 0.4 }))
  })
  return { before: before.join(''), after: after.join('') }
}

/* ---------- the plotter ---------- */

const loss = (e: number) => 0.14 + 0.86 * Math.exp(-3.3 * e) + 0.03 * Math.sin(e * 42) * Math.exp(-2.4 * e)
const chartPoint = (e: number): [number, number] => [CHART.x0 + e * CHART.w, CHART.yLow - loss(e) * (CHART.yLow - CHART.yHigh)]

export const PLOT_START = chartPoint(0)

export function curveD(e: number) {
  const n = Math.max(2, Math.round(e * 90))
  if (e <= 0.004) return ''
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= n; i++) pts.push(chartPoint((i / n) * e))
  return k.onTop(pts, CHART.z, P)
}

export const penAt = (e: number) => {
  const [x, y] = chartPoint(e)
  return { bx: x - PEN_OFFSET, py: y }
}

function plotter() {
  const out: string[] = []
  const base = plan(PAPER.x, PAPER.y, PAPER.w, PAPER.d, 4)
  out.push(`<path class="iso-halo" d="${k.haloOf(base, 0, 4, P)}" style="filter:blur(5px)"/>`)
  out.push(S(slab(base, 0, 4, 5, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(base, 2.6), 4, P, 4), { tone: 'faint' }))
  const paper = plan(-144, 66, 102, 46, 1)
  out.push(S(k.slabOf(paper, 4, 0.8, P, 2, 0), { tone: 'hi', crease: 'lo' }))
  // paper clips
  for (const [x, y] of [[-144, 66], [-42 - 5, 66], [-144, 112 - 3], [-42 - 5, 112 - 3]]) out.push(S(slab(plan(x, y, 5, 3, 0.6), 4.8, 1.8, 2, 0.2), { tone: 'mid', crease: 'none' }))
  // chart: grid, axes and ticks
  const gx = CHART.x0
  const grid: string[] = []
  for (let i = 1; i <= 10; i++) grid.push(k.lineOnTop([gx + (i * CHART.w) / 10, CHART.yLow], [gx + (i * CHART.w) / 10, CHART.yHigh - 1], CHART.z, P))
  for (let j = 1; j <= 4; j++) grid.push(k.lineOnTop([gx, CHART.yLow - (j * (CHART.yLow - CHART.yHigh)) / 4], [gx + CHART.w + 2, CHART.yLow - (j * (CHART.yLow - CHART.yHigh)) / 4], CHART.z, P))
  out.push(L(grid.join(''), { tone: 'faint' }))
  out.push(L(k.onTop([[gx, CHART.yHigh - 3], [gx, CHART.yLow], [gx + CHART.w + 4, CHART.yLow]], CHART.z, P), { tone: 'mid' }))
  const xt = k.topTicks(gx, gx + CHART.w, CHART.w / 20, 5, CHART.yLow + 0.4, CHART.z, [1.4, 2.8], P)
  out.push(L(xt.minor, { tone: 'lo' }), L(xt.major, { tone: 'mid' }))
  out.push(k.faceTextSvg(k.topMatrix([gx + 2, CHART.yHigh - 3.4], CHART.z, P, 'x'), 'LOSS', { size: 2.6, tone: 'lo' }))
  // rails with their end stops
  for (const y of [61.5, 113.5]) {
    out.push(S(slab(plan(-148, y, 110, 3, 0.8), 4, 3, 2, 0.3), { tone: 'mid' }))
    out.push(D([-143, -43].map((x) => at([x, y + 1.5, 7])), { size: 0.4 }))
  }
  for (const x of [-150, -40]) out.push(S(slab(plan(x, 60, 3, 58, 1), 4, 5, 2, 0.3), { tone: 'mid', crease: 'none' }))
  // stepper on the left
  const stepper = plan(-158, 80, 9, 20, 2)
  out.push(S(slab(stepper, 0, 12, 3, 0.4), { tone: 'mid' }))
  out.push(D([at([-153.5, 90, 12])], { size: 0.5 }))
  return out.join('')
}

const bridgeAt = (bx: number, py: number) => {
  const out: string[] = []
  // end carriages on the rails and the bridge beam (all drawn around bx)
  for (const y of [60.5, 112.5]) out.push(S(slab(plan(bx - 5, y, 10, 6, 1), 7, 7, 2, 0.4), { tone: 'mid' }))
  out.push(S(slab(plan(bx - 2.5, 60, 5, 58, 1), 14, 4, 2, 0.4), { tone: 'mid' }))
  out.push(D([at([bx, 62, 18]), at([bx, 116, 18])], { size: 0.45 }))
  void py
  return out.join('')
}

const bridge = () => bridgeAt(CHART.x0 - PEN_OFFSET, chartPoint(0)[1])

function penCarriage() {
  const out: string[] = []
  const bx = CHART.x0 - PEN_OFFSET
  const py = chartPoint(0)[1]
  out.push(S(slab(plan(bx + 2.5, py - 4, 6, 8, 1.2), 10, 10, 2, 0.4), { tone: 'hi' }))
  out.push(S(k.cylinder(bx + PEN_OFFSET, py, 1.3, 5, 6, P, 12), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(bx + PEN_OFFSET, py, 0.6, 4.8, 0.4, P, 8), { tone: 'hi', lit: true }))
  out.push(D([at([bx + 5.5, py - 2, 20]), at([bx + 5.5, py + 2, 20])], { size: 0.4 }))
  return out.join('')
}

/* ---------- the gauge and the checkpoint card ---------- */

function gauge() {
  const out: string[] = []
  const [x, y] = GAUGE
  out.push(`<path class="iso-halo" d="${k.cylinder(x, y, GAUGE_R, 0, 1, P, 40).fill}" style="filter:blur(5px)"/>`)
  out.push(S(k.cylinder(x, y, GAUGE_R, 0, 10, P, 56, 0.8), { tone: 'mid' }))
  out.push(L(k.knurl(x, y, GAUGE_R, 3, 9.5, 64, P, 0.3), { tone: 'lo' }))
  out.push(S(k.cylinder(x, y, GAUGE_R - 2.2, 10, GAUGE_TOP - 10, P, 56), { tone: 'hi', crease: 'lo' }))
  out.push(L(k.ring(x, y, GAUGE_R - 4.2, GAUGE_TOP, P, 56), { tone: 'lo' }))
  const from = (GAUGE_MIN * Math.PI) / 180
  const span = ((GAUGE_MAX - GAUGE_MIN) * Math.PI) / 180
  const ticks = k.radialTicks(x, y, GAUGE_R - 5, 20, 5, GAUGE_TOP, [1.4, 2.8], P, from, span)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  const arc = (a0: number, a1: number, r: number) => {
    const points: Array<[number, number]> = []
    for (let i = 0; i <= 14; i++) {
      const a = ((a0 + ((a1 - a0) * i) / 14) * Math.PI) / 180
      points.push([x + Math.sin(a) * r, y - Math.cos(a) * r])
    }
    return k.onTop(points, GAUGE_TOP, P)
  }
  out.push(L(arc(GAUGE_MIN, 72, 10.8), { tone: 'lo' }))
  out.push(`<path class="hc-arc" d="${arc(72, 120, 10.8)}"/>`)
  // the saved-checkpoint notch on the scale
  const notch = ((GAUGE_MIN + (GAUGE_MAX - GAUGE_MIN) * ACCURACY) * Math.PI) / 180
  out.push(L(k.lineOnTop([x + Math.sin(notch) * 8.8, y - Math.cos(notch) * 8.8], [x + Math.sin(notch) * (GAUGE_R - 3), y - Math.cos(notch) * (GAUGE_R - 3)], GAUGE_TOP, P), { tone: 'hi' }))
  out.push(k.faceTextSvg(k.topMatrix([x - 4, y + 11], GAUGE_TOP, P, 'x'), 'ACC', { size: 2.6, tone: 'lo' }))
  out.push(S(k.cylinder(x, y, 2.6, GAUGE_TOP, 2, P, 16), { tone: 'mid' }))
  return out.join('')
}

export function needleD(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  const [x, y] = GAUGE
  const z = GAUGE_TOP + 2.2
  return k.lineOnTop([x - Math.sin(a) * 3.6, y + Math.cos(a) * 3.6], [x + Math.sin(a) * (GAUGE_R - 6), y - Math.cos(a) * (GAUGE_R - 6)], z, P)
}

function checkpoint() {
  const out: string[] = []
  const housing = plan(52, 84, 34, 18, 2)
  out.push(`<path class="iso-halo" d="${k.haloOf(housing, 0, 12, P)}" style="filter:blur(5px)"/>`)
  out.push(S(slab(housing, 0, 12, 3, 0.5), { tone: 'mid' }))
  out.push(L(k.planOutline(plan(55, 86, 28, 14, 1.2), 12, P, 3), { tone: 'faint' }))
  out.push(D([[54.5, 86], [81.5, 86], [54.5, 99.5], [81.5, 99.5]].map(([a, b]) => at([a, b, 12])), { size: 0.4 }))
  out.push(`<path data-part="ckpt-glow" class="sk-glow" d="${k.cylinder(83, 100, 3, 12, 2, P, 12).fill}" style="opacity:0"/>`)
  out.push(`<g data-part="ckpt-lamp">${S(k.cylinder(83, 100, 1.5, 12, 1.6, P, 12, 0.2), { tone: 'mid' })}</g>`)
  return out.join('')
}

const card = () => {
  const out: string[] = []
  out.push(S(k.slabOf(plan(CARD.x, CARD.y, CARD.w, CARD.d, 1.4), 12, 1.8, P, 3, 0.2), { tone: 'hi', lit: true }))
  out.push(L(k.lineOnTop([CARD.x + 3, CARD.y + 3.2], [CARD.x + CARD.w - 3, CARD.y + 3.2], 13.8, P), { tone: 'lit' }))
  out.push(L(k.lineOnTop([CARD.x + 3, CARD.y + 6], [CARD.x + CARD.w - 9, CARD.y + 6], 13.8, P), { tone: 'lo' }))
  out.push(D([at([CARD.x + CARD.w - 3.5, CARD.y + CARD.d - 3, 13.8])], { size: 0.5, tone: 'hi' }))
  return out.join('')
}

/* ---------- assembled figure ---------- */

const wrap = (index: number, drop: number, body: string, extra = '') =>
  `<g class="hc-asm" style="--i:${index};--drop:${drop}px"${extra}>${body}</g>`

const anchors = (n: number) => `<g data-slot="${n}"></g>`

export const TEXT = {
  label:
    'A sorting bench for a skin image. A belt carries the image under a press that resizes and normalises it, then under four glass layers that each lift and sweep a 3 by 3 kernel across their grid, then a pusher knocks it into one of three class bins. Beside the belt a pen plotter draws the training loss, a gauge climbs to a validation accuracy of 0.859, and a checkpoint card seats when it is saved.',
}

const binParts = bins()

export const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.label,
  className: 'hc-svg',
  body: [
    wrap(0, 18, plate()),
    wrap(1, 30, barrels()),
    wrap(2, 34, beltBody() + motor()),
    wrap(3, 20, beltLines()),
    wrap(4, 26, STATIONS.map((xs, i) => `<g data-part="push-${i}">${pusherSvg(xs, 0)}</g>`).join('')),
    anchors(0),
    wrap(5, 40, pressFrame() + `<g data-part="press">${pressHead()}</g>` + pressBar()),
    anchors(1),
    ...PORTALS.flatMap((xi, i) => [
      wrap(6 + i, 36, portalBack(xi)),
      `<g data-part="pane-${i}" transform="${k.translateAlong(P, [0, 0, 0])}"><g class="hc-asm" style="--i:${9 + i};--drop:24px">${pane(i, xi)}</g></g>`,
      wrap(6 + i, 40, portalFront(i, xi)),
      anchors(i + 2),
    ]),
    wrap(10, 24, binParts.before),
    anchors(6),
    wrap(11, 24, binParts.after),
    wrap(12, 22, plotter()),
    `<path data-part="curve" class="sk-curve" d="" style="opacity:1"/>`,
    wrap(12, 40, `<g data-part="bridge" transform="${k.translateAlong(P, [0, 0, 0])}">${bridge()}<g data-part="pen" transform="${k.translateAlong(P, [0, 0, 0])}">${penCarriage()}</g></g>`),
    wrap(13, 28, gauge() + `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" style="stroke-width:1.2" d="${needleD(GAUGE_MIN)}"/>`),
    wrap(13, 30, checkpoint() + `<g data-part="card" transform="${k.translateAlong(P, [0, 0, CARD_LIFT])}">${card()}</g>`),
    `<g data-part="tile" transform="${k.translateAlong(P, [BELT_START, 0, 0])}"><g class="hc-asm" style="--i:5;--drop:34px">${tile()}</g></g>`,
  ],
})

export const translate = (x: number, y = 0, z = 0) => k.translateAlong(P, [x, y, z])
export const lift = PANE.lift
export const pressLift = PRESS_LIFT
export const tileHalf = TILE_HALF
export { penAt as pen }
