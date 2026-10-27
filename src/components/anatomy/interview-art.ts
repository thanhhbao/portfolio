import * as k from './iso-kit'
import type { Point3 } from './iso-kit'

/*
 * Fig 01 · a signal-fusion console for InterviewAI.
 * A resume card is parsed under a gate, a microphone feeds a row of bar meters,
 * a camera head tracks a bouncing behaviour marker, and three cables merge into
 * a fusion block whose dial settles on 87.
 */

export const WIDTH = 640
export const HEIGHT = 450

const PLATE = { x: -150, y: -92, w: 326, d: 192, r: 10 }
const PLATE_H = 12
const FOOT_H = 5

// resume parser
const PARSER = { x: -142, y: -82, w: 86, d: 46, r: 3 }
const PARSER_Z = 8
const FRAME_X = -97
export const CARD_Y = -59
export const CARD_START = -126
export const CARD_END = -78
const CHIPS = [-136, -124, -112, -100]

// mixing desk
const DESK = { x: -40, y: -84, w: 140, d: 62, r: 3 }
const DESK_Z = 12
export const BAR_X = Array.from({ length: 8 }, (_, i) => -28 + i * 16)
const BAR_Y = -78
const FADER_Y = [-62, -34]

// fusion block
const BLOCK = { x: 112, y: -70, w: 60, d: 50, r: 3 }
const BLOCK_Z = 22
export const DIAL: [number, number] = [136, -45]
const DIAL_R = 17
const DIAL_TOP = 30
const PORTS = [122, 138, 154]
export const NEEDLE_REST = -120
export const SCORE = 87
export const NEEDLE_SCORE = -120 + 2.4 * SCORE

// microphone
export const MIC_BASE: [number, number] = [-110, 35]
export const MIC_TIP: [number, number] = [-68, 35]

// camera station
const PAD = { x: 125, y: 30, w: 44, d: 44, r: 3 }
export const PAD_C: [number, number] = [147, 52]
const PAD_Z = 3
const BEAM_Z = 44
export const LENS_Z = 29.5

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [122, 49, 54],
    [172, 55, 54],
    [DIAL[0] + 20, DIAL[1], 36],
    [MIC_BASE[0], MIC_BASE[1], 44],
    [PARSER.x, PARSER.y, 26],
    [DESK.x, DESK.y, 44],
  ],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: 45 },
)

const at = (point: Point3) => k.iso(point, P)
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style)
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style)
const D = (points: Array<[number, number]>, style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style)
const byDepth = (points: Array<[number, number]>) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))
const plan = (x: number, y: number, w: number, d: number, r = 1): k.Plan => ({ x, y, w, d, r })

/* ---------- bench ---------- */

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
  const strip = plan(-128, 86, 290, 7, 1)
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }))
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }))
  return out.join('')
}

/* ---------- resume parser ---------- */

function parserBase() {
  const out: string[] = []
  out.push(S(k.slabOf(PARSER, 0, PARSER_Z, P, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(PARSER, 3), PARSER_Z, P, 3), { tone: 'faint' }))
  out.push(
    D(
      k.corners(PARSER, 6).map(([x, y]) => at([x, y, PARSER_Z])),
      { size: 0.45 },
    ),
  )
  // guide rails the card rides on
  for (const y of [CARD_Y - 13, CARD_Y + 10]) {
    out.push(S(k.slabOf(plan(-138, y, 78, 3, 1), PARSER_Z, 1.2, P, 2), { tone: 'mid', crease: 'none' }))
  }
  // output connector on the front face
  out.push(S(k.slabOf(plan(-84, PARSER.y + PARSER.d, 8, 4, 1), 2, 6, P, 2, 0.3), { tone: 'hi' }))
  out.push(L(k.sideRing([-80, PARSER.y + PARSER.d + 4, 5], 2, 'y', P, 14), { tone: 'lo' }))
  return out.join('')
}

const frameBack = () => S(k.slabOf(plan(FRAME_X, -77, 6, 4, 1), PARSER_Z, 15, P, 2, 0.4), { tone: 'mid' })

function frameFront() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(FRAME_X, -47, 6, 4, 1), PARSER_Z, 15, P, 2, 0.4), { tone: 'mid' }))
  const lintel = plan(FRAME_X - 1, -78, 8, 34, 1.5)
  out.push(S(k.slabOf(lintel, PARSER_Z + 14, 6, P, 3, 0.5), { tone: 'mid' }))
  out.push(D([at([FRAME_X + 3, -74, PARSER_Z + 20]), at([FRAME_X + 3, -48, PARSER_Z + 20])], { size: 0.45 }))
  // the scan slit: a lit line under the lintel
  out.push(L(k.lineOnTop([FRAME_X + 3, -73], [FRAME_X + 3, -50], PARSER_Z + 14, P), { tone: 'lit' }))
  return out.join('')
}

/** the resume card, drawn about its own centre (x = 0) and slid with translateAlong */
function card() {
  const out: string[] = []
  const body = plan(-15, CARD_Y - 11, 30, 22, 2)
  out.push(S(k.slabOf(body, PARSER_Z + 1.2, 1.6, P, 3, 0.4), { tone: 'hi' }))
  const top = PARSER_Z + 2.8
  out.push(S(k.slabOf(plan(-12, CARD_Y - 8, 8, 8, 1), top, 0.5, P, 2), { tone: 'mid', crease: 'none' }))
  const rows = [-6, -2, 2, 6].map((dy, i) => k.lineOnTop([-1.5, CARD_Y + dy - 1], [i % 2 ? 9 : 12, CARD_Y + dy - 1], top, P)).join('')
  out.push(L(rows, { tone: 'mid', free: true }))
  const lower = [4, 7.5].map((dy, i) => k.lineOnTop([-12, CARD_Y + dy], [i ? 6 : 11, CARD_Y + dy], top, P)).join('')
  out.push(L(lower, { tone: 'lo', free: true }))
  return out.join('')
}

/** tags the parser pulls out of the card: they rise one after another */
export function chipsSvg(heights: number[]) {
  const out: string[] = []
  CHIPS.forEach((x, i) => {
    const h = Math.max(0.01, heights[i])
    out.push(S(k.slabOf(plan(x, PARSER.y + PARSER.d - 9, 9, 5, 1.2), PARSER_Z, h, P, 2, h > 1 ? 0.3 : 0), { tone: h > 2.5 ? 'hi' : 'mid', lit: h > 2.5 }))
  })
  return out.join('')
}

/* ---------- microphone ---------- */

function mic() {
  const out: string[] = []
  const [bx, by] = MIC_BASE
  const [tx, ty] = MIC_TIP
  out.push(`<path class="iso-halo" d="${k.cylinder(bx, by, 13, 0, 1, P, 40).fill}" style="filter:blur(5px)"/>`)
  out.push(S(k.cylinder(bx, by, 13, 0, 3, P, 40, 0.5), { tone: 'mid' }))
  out.push(L(k.ring(bx, by, 10, 3, P, 36), { tone: 'lo' }))
  out.push(D([[7, 7], [-7, 7], [7, -7], [-7, -7]].map(([dx, dy]) => at([bx + dx, by + dy, 3])), { size: 0.4 }))
  out.push(S(k.cylinder(bx, by, 4.6, 3, 3, P, 24), { tone: 'mid' }))
  out.push(S(k.cylinder(bx, by, 2.4, 6, 32, P, 20), { tone: 'mid', crease: 'none' }))
  out.push(L([14, 24].map((z) => k.sideArc(bx, by, 2.4, z, P, 12)).join(''), { tone: 'faint' }))
  out.push(S(k.cylinder(bx, by, 3.6, 36, 2, P, 20), { tone: 'mid' }))
  // boom arm with a counterweight behind the post
  out.push(S(k.slabOf(plan(bx - 9, by - 2.8, 12, 5.6, 1.5), 38, 4, P, 3, 0.4), { tone: 'mid' }))
  out.push(S(k.slabOf(plan(bx - 2, by - 2.4, tx - bx + 2, 4.8, 1.4), 38, 3.6, P, 3, 0.4), { tone: 'mid' }))
  out.push(D([at([bx - 5, by, 42]), at([tx - 3, ty, 41.6])], { size: 0.45 }))
  // microphone body, shock-mount bands and grille
  out.push(S(k.cylinder(tx, ty, 5.2, 36, 2.4, P, 24), { tone: 'mid' }))
  out.push(S(k.cylinder(tx, ty, 4.4, 24, 12, P, 28), { tone: 'hi', crease: 'lo' }))
  out.push(L(k.knurl(tx, ty, 4.4, 25, 35, 18, P, 0.3), { tone: 'lo' }))
  out.push(S(k.cylinder(tx, ty, 5.6, 30, 1.6, P, 28), { tone: 'mid' }))
  out.push(S(k.cylinder(tx, ty, 5, 20, 4.2, P, 28, 0.3), { tone: 'hi', lit: true }))
  out.push(L(k.knurl(tx, ty, 5, 20.6, 23.6, 24, P, 0.3), { tone: 'mid' }))
  return out.join('')
}

const RING_R = [8, 26]
export function ringD(u: number) {
  const r = RING_R[0] + (RING_R[1] - RING_R[0]) * u
  return k.ring(MIC_TIP[0], MIC_TIP[1], r, 0.2, P, 44)
}
export const RING_COUNT = 3

/* ---------- mixing desk ---------- */

function desk() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(-38, DESK.y, 136, 3, 1), DESK_Z, 30, P, 2, 0.4), { tone: 'mid' }))
  out.push(S(k.slabOf(DESK, 0, DESK_Z, P, 4, 0.7), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(DESK, 3), DESK_Z, P, 3), { tone: 'faint' }))
  out.push(
    D(
      k.corners(DESK, 6).map(([x, y]) => at([x, y, DESK_Z])),
      { size: 0.45 },
    ),
  )
  // meter scale on the back panel, one short tick ladder beside every bar
  const ticks: string[] = []
  for (const x of BAR_X) {
    for (let z = 16; z <= 40; z += 4) ticks.push(k.segment([x - 7, DESK.y + 3, z], [x - (z % 8 === 0 ? 4 : 5.2), DESK.y + 3, z], P))
  }
  out.push(L(ticks.join(''), { tone: 'lo' }))
  // a recessed seat for every bar
  out.push(L(BAR_X.map((x) => k.planOutline(plan(x - 5.5, BAR_Y - 1.5, 11, 11, 1.4), DESK_Z, P, 3)).join(''), { tone: 'faint' }))
  // fader slots with a screw at each end
  const slots = BAR_X.map((x) => k.planOutline(plan(x - 1.8, FADER_Y[0], 3.6, FADER_Y[1] - FADER_Y[0], 1.6), DESK_Z, P, 3)).join('')
  out.push(L(slots, { tone: 'lo' }))
  out.push(D(BAR_X.flatMap((x) => [at([x, FADER_Y[0] - 2, DESK_Z]), at([x, FADER_Y[1] + 2, DESK_Z])]), { size: 0.4, tone: 'lo' }))
  // rotary knobs and two push buttons along the front
  const knobs: Array<[number, number]> = [[-24, -28], [-2, -28], [20, -28]]
  for (const [x, y] of knobs) {
    out.push(L(k.ring(x, y, 5.2, DESK_Z, P, 24), { tone: 'faint' }))
    out.push(S(k.cylinder(x, y, 3.6, DESK_Z, 4.6, P, 24, 0.4), { tone: 'hi' }))
    out.push(L(k.knurl(x, y, 3.6, DESK_Z + 0.6, DESK_Z + 4, 14, P, 0.3), { tone: 'lo' }))
    out.push(L(k.lineOnTop([x, y], [x + 2.6, y - 1.6], DESK_Z + 4.6, P), { tone: 'hi' }))
  }
  for (const x of [50, 66]) {
    out.push(S(k.slabOf(plan(x - 4, -31, 8, 6, 1.4), DESK_Z, 2.6, P, 3, 0.3), { tone: 'hi' }))
    out.push(D([at([x, -28, DESK_Z + 2.6])], { size: 0.45, tone: 'mid' }))
  }
  out.push(L(k.lineOnTop([84, -28], [92, -28], DESK_Z, P) + k.lineOnTop([84, -25], [92, -25], DESK_Z, P), { tone: 'lo', free: true }))
  return out.join('')
}

/** eight bar meters; heights change every frame */
export function barsSvg(heights: number[]) {
  return BAR_X.map((x, i) => {
    const h = Math.max(1.2, heights[i])
    const top = h > 19
    return S(k.slabOf(plan(x - 4, BAR_Y, 8, 8, 1.2), DESK_Z, h, P, 2, 0.3), { tone: 'hi', lit: true, crease: top ? 'mid' : 'faint' })
  }).join('')
}

/** one fader knob, drawn at the middle of its slot and slid along y */
function faderKnob(x: number) {
  const mid = (FADER_Y[0] + FADER_Y[1]) / 2
  return [
    S(k.slabOf(plan(x - 4.5, mid - 3, 9, 6, 1.2), DESK_Z, 4.4, P, 3, 0.4), { tone: 'hi' }),
    L(k.lineOnTop([x - 4.5, mid], [x + 4.5, mid], DESK_Z + 4.4, P), { tone: 'mid' }),
  ].join('')
}
export const faderGroups = () => BAR_X.map((x, i) => `<g data-fader="${i}" transform="${k.translateAlong(P, [0, 0, 0])}">${faderKnob(x)}</g>`).join('')
export const faderTransform = (dy: number) => k.translateAlong(P, [0, dy, 0])

/* ---------- fusion block ---------- */

function fusion() {
  const out: string[] = []
  out.push(`<path class="iso-halo" d="${k.haloOf(BLOCK, 0, 1, P)}" style="filter:blur(5px)"/>`)
  out.push(S(k.slabOf(BLOCK, 0, BLOCK_Z, P, 4, 0.7), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(BLOCK, 3), BLOCK_Z, P, 3), { tone: 'faint' }))
  out.push(
    D(
      k.corners(BLOCK, 5).map(([x, y]) => at([x, y, BLOCK_Z])),
      { size: 0.45 },
    ),
  )
  // three input connectors on the front face
  for (const x of PORTS) {
    out.push(S(k.slabOf(plan(x - 4.5, BLOCK.y + BLOCK.d, 9, 4, 1), 3, 7, P, 2, 0.3), { tone: 'hi' }))
    out.push(L(k.sideRing([x, BLOCK.y + BLOCK.d + 4, 6.5], 2.2, 'y', P, 14), { tone: 'lo' }))
  }
  // label plate: three rule lines
  out.push(S(k.slabOf(plan(114, -67, 14, 8, 1), BLOCK_Z, 0.8, P, 2), { tone: 'lo', crease: 'none' }))
  out.push(L([-65.2, -63, -60.8].map((y) => k.lineOnTop([115.6, y], [y === -63 ? 124 : 126.4, y], BLOCK_Z + 0.8, P)).join(''), { tone: 'lo', free: true }))
  // report slot
  out.push(S(k.slabOf(plan(155, -64, 8, 26, 1.4), BLOCK_Z, 1, P, 2), { tone: 'lo', crease: 'none' }))
  // dial
  const [x, y] = DIAL
  out.push(S(k.cylinder(x, y, DIAL_R, BLOCK_Z, 6, P, 48, 0.7), { tone: 'mid' }))
  out.push(L(k.knurl(x, y, DIAL_R, BLOCK_Z + 1, BLOCK_Z + 5.4, 60, P, 0.3), { tone: 'lo' }))
  out.push(S(k.cylinder(x, y, DIAL_R - 2.2, BLOCK_Z + 6, DIAL_TOP - BLOCK_Z - 6, P, 48), { tone: 'hi', crease: 'lo' }))
  out.push(L(k.ring(x, y, DIAL_R - 4, DIAL_TOP, P, 48), { tone: 'lo' }))
  const from = (-120 * Math.PI) / 180
  const ticks = k.radialTicks(x, y, DIAL_R - 4.6, 24, 4, DIAL_TOP, [1.3, 2.6], P, from, (240 * Math.PI) / 180)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  const arc = (a0: number, a1: number, r: number) => {
    const points: Array<[number, number]> = []
    for (let i = 0; i <= 16; i++) {
      const a = ((a0 + ((a1 - a0) * i) / 16) * Math.PI) / 180
      points.push([x + Math.sin(a) * r, y - Math.cos(a) * r])
    }
    return k.onTop(points, DIAL_TOP, P)
  }
  out.push(L(arc(-120, -24, 8.4), { tone: 'lo' }))
  out.push(L(arc(-18, 48, 8.4), { tone: 'mid' }))
  out.push(`<path class="iv-arc" d="${arc(54, 120, 8.4)}"/>`)
  out.push(S(k.cylinder(x, y, 2.4, DIAL_TOP, 2, P, 16), { tone: 'mid' }))
  return out.join('')
}

export function needleD(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  const [x, y] = DIAL
  const z = DIAL_TOP + 2.2
  return k.lineOnTop([x - Math.sin(a) * 3.6, y + Math.cos(a) * 3.6], [x + Math.sin(a) * (DIAL_R - 6.4), y - Math.cos(a) * (DIAL_R - 6.4)], z, P)
}

/** one lamp per input, above its connector */
function lampsSvg() {
  return PORTS.map((x, i) => `<g data-lamp="${i}">${S(k.cylinder(x, -23.5, 1.9, BLOCK_Z, 1.8, P, 14), { tone: 'mid' })}</g>`).join('')
}

/** the printed report that rises out of the slot */
export function slipSvg(share: number) {
  const h = 15 * share
  if (h < 0.4) return ''
  const x = 158.6
  const out = [S(k.slabOf(plan(x, -60, 1.2, 18, 0.3), BLOCK_Z + 1, h, P, 2), { tone: 'hi' })]
  const lines: string[] = []
  for (let z = BLOCK_Z + 5; z < BLOCK_Z + 1 + h - 1.6; z += 3.4) lines.push(k.segment([x + 1.2, -57.5, z], [x + 1.2, z % 2 ? -46 : -43, z], P))
  out.push(L(lines.join(''), { tone: 'mid', free: true }))
  return out.join('')
}

/* ---------- cables ---------- */

const CABLES: Point3[][] = [
  [[-80, PARSER.y + PARSER.d + 4, 5], [-80, -14, 1.2], [PORTS[0], -14, 1.2], [PORTS[0], BLOCK.y + BLOCK.d + 4, 6.5]],
  [[MIC_BASE[0] + 12, MIC_BASE[1], 1.2], [-98, MIC_BASE[1], 1.2], [-98, -6, 1.2], [PORTS[1], -6, 1.2], [PORTS[1], BLOCK.y + BLOCK.d + 4, 1.2], [PORTS[1], BLOCK.y + BLOCK.d + 4, 6.5]],
  [[PORTS[2], PAD.y - 4, 5], [PORTS[2], PAD.y - 4, 1.2], [PORTS[2], BLOCK.y + BLOCK.d + 4, 1.2], [PORTS[2], BLOCK.y + BLOCK.d + 4, 6.5]],
]

function cables() {
  const out: string[] = []
  CABLES.forEach((route, i) => {
    const d = k.pathOf(route.map(at))
    out.push(L(d, { tone: 'mid', className: 'iv-cable' }))
    out.push(`<g data-pulse="${i}" style="opacity:0">${L(d, { tone: 'lit', flow: true, className: 'iv-pulse' })}</g>`)
    const first = route[0]
    const last = route[route.length - 1]
    out.push(D([at(first), at(last)], { size: 1.1, tone: 'hi' }))
  })
  // the camera's port sits beside the pad
  out.push(S(k.slabOf(plan(PORTS[2] - 4, PAD.y - 5, 8, 5, 1), 2, 5, P, 2, 0.3), { tone: 'hi' }))
  return out.join('')
}

/* ---------- camera station ---------- */

function pad() {
  const out: string[] = []
  out.push(S(k.slabOf(PAD, 0, PAD_Z, P, 4, 0.5), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(PAD, 2.4), PAD_Z, P, 3), { tone: 'faint' }))
  const [cx, cy] = PAD_C
  out.push(L(k.ring(cx, cy, 17, PAD_Z, P, 44) + k.ring(cx, cy, 9, PAD_Z, P, 32), { tone: 'lo' }))
  const spokes = [0, 90, 180, 270].map((deg) => {
    const a = (deg * Math.PI) / 180
    return k.lineOnTop([cx + Math.cos(a) * 9, cy + Math.sin(a) * 9], [cx + Math.cos(a) * 17, cy + Math.sin(a) * 17], PAD_Z, P)
  })
  out.push(L(spokes.join(''), { tone: 'lo' }))
  out.push(D(k.corners(PAD, 5).map(([x, y]) => at([x, y, PAD_Z])), { size: 0.4 }))
  return out.join('')
}

const marker = () => {
  const [cx, cy] = PAD_C
  return [
    `<g data-part="marker-shadow">${L(k.ring(cx, cy, 5.4, PAD_Z, P, 24), { tone: 'lit', className: 'iv-track' })}</g>`,
    `<g data-part="marker">${S(k.cylinder(cx, cy, 3.2, PAD_Z + 0.4, 2.6, P, 22, 0.3), { tone: 'hi', lit: true })}${L(k.ring(cx, cy, 1.3, PAD_Z + 3, P, 10), { tone: 'lit' })}</g>`,
  ].join('')
}

const postAt = (x: number) => S(k.slabOf(plan(x, PAD_C[1] - 3, 6, 6, 1.2), PAD_Z, BEAM_Z + 6 - PAD_Z, P, 3, 0.4), { tone: 'mid' })

function beamRail() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(122, PAD_C[1] - 3, 50, 6, 1.2), BEAM_Z, 6, P, 3, 0.5), { tone: 'mid' }))
  const ticks = k.topTicks(128, 166, 4, 5, PAD_C[1] - 0.2, BEAM_Z + 6, [1.4, 2.6], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([125, PAD_C[1], BEAM_Z + 6]), at([169, PAD_C[1], BEAM_Z + 6])], { size: 0.45 }))
  return out.join('')
}

/** camera carriage, drawn at the middle of the rail and slid along x */
function camera() {
  const out: string[] = []
  const [cx, cy] = PAD_C
  out.push(S(k.slabOf(plan(cx - 7, cy - 6.5, 14, 13, 2), BEAM_Z - 4, 12, P, 3, 0.5), { tone: 'hi' }))
  out.push(D([at([cx - 4, cy + 6.5, BEAM_Z + 8 - 2]), at([cx + 4, cy + 6.5, BEAM_Z + 8 - 2])], { size: 0.4, tone: 'mid' }))
  out.push(S(k.cylinder(cx, cy, 4.8, LENS_Z + 1.5, BEAM_Z - 4 - LENS_Z - 1.5, P, 24, 0.3), { tone: 'mid' }))
  out.push(L(k.knurl(cx, cy, 4.8, LENS_Z + 2.5, BEAM_Z - 5, 18, P, 0.3), { tone: 'lo' }))
  out.push(S(k.cylinder(cx, cy, 3, LENS_Z, 1.5, P, 20), { tone: 'hi', lit: true }))
  return out.join('')
}

/** the sight line from the lens to the marker */
export function sightD(cameraX: number, mx: number, my: number, mz: number) {
  const [cx, cy] = PAD_C
  return k.segment([cameraX, cy, LENS_Z], [cx + mx, cy + my, PAD_Z + 3.2 + mz], P)
}


/* ---------- question printer ---------- */

const PRINTER = plan(-26, 20, 60, 34, 3)
const PRINTER_Z = 12
const SPOOL: [number, number] = [-6, 37]
const TAPE_LEN = 36

function printer() {
  const out: string[] = []
  out.push(`<path class="iso-halo" d="${k.haloOf(PRINTER, 0, 1, P)}" style="filter:blur(5px)"/>`)
  out.push(S(k.slabOf(PRINTER, 0, PRINTER_Z, P, 4, 0.7), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(PRINTER, 3), PRINTER_Z, P, 3), { tone: 'faint' }))
  out.push(D(k.corners(PRINTER, 5).map(([x, y]) => at([x, y, PRINTER_Z])), { size: 0.45 }))
  // spool seat, spool and hub
  out.push(L(k.ring(SPOOL[0], SPOOL[1], 11, PRINTER_Z, P, 36), { tone: 'faint' }))
  out.push(S(k.cylinder(SPOOL[0], SPOOL[1], 9, PRINTER_Z, 2.4, P, 36, 0.5), { tone: 'hi' }))
  out.push(L(k.knurl(SPOOL[0], SPOOL[1], 9, PRINTER_Z + 0.5, PRINTER_Z + 2, 40, P, 0.3), { tone: 'lo' }))
  out.push(L(k.ring(SPOOL[0], SPOOL[1], 7.4, PRINTER_Z + 2.4, P, 32), { tone: 'lo' }))
  out.push(S(k.cylinder(SPOOL[0], SPOOL[1], 2, PRINTER_Z + 2.4, 2.6, P, 14), { tone: 'mid' }))
  // feed slot on the +x face and its lip
  const x = PRINTER.x + PRINTER.w
  out.push(L(k.pathOf([at([x, 30, 2.6]), at([x, 44, 2.6]), at([x, 44, 5.4]), at([x, 30, 5.4])], true), { tone: 'hi' }))
  out.push(S(k.slabOf(plan(x, 30, 2, 14, 0.4), 0, 2.2, P, 2), { tone: 'mid', crease: 'none' }))
  // a status ring and a button on the +y face
  out.push(L(k.sideRing([-16, PRINTER.y + PRINTER.d, 7], 2.2, 'y', P, 14), { tone: 'hi' }))
  out.push(D([at([-16, PRINTER.y + PRINTER.d, 7]), at([14, PRINTER.y + PRINTER.d, 7]), at([22, PRINTER.y + PRINTER.d, 7])], { size: 0.5, tone: 'mid' }))
  return out.join('')
}

export function spokesD(angle: number) {
  const spokes: string[] = []
  for (let i = 0; i < 4; i++) {
    const a = angle + (i / 4) * Math.PI * 2
    spokes.push(k.lineOnTop([SPOOL[0] + Math.cos(a) * 2.6, SPOOL[1] + Math.sin(a) * 2.6], [SPOOL[0] + Math.cos(a) * 7.4, SPOOL[1] + Math.sin(a) * 7.4], PRINTER_Z + 2.4, P))
  }
  return spokes.join('')
}

/** the strip of questions that feeds out of the slot */
export function tapeSvg(share: number) {
  const len = TAPE_LEN * share
  if (len < 0.6) return ''
  const x0 = PRINTER.x + PRINTER.w + 2
  const out = [S(k.slabOf(plan(x0, 31, len, 12, 0.4), 0, 0.9, P, 2), { tone: 'hi', crease: 'faint' })]
  const lines: string[] = []
  ;[34.4, 37, 39.6].forEach((y, i) => {
    const end = x0 + len - 2
    if (end > x0 + 3) lines.push(k.lineOnTop([x0 + 2, y], [Math.min(end, x0 + (i % 2 ? 22 : 30)), y], 0.9, P))
  })
  out.push(L(lines.join(''), { tone: 'mid', free: true }))
  return out.join('')
}

/* ---------- assembled figure ---------- */

const wrap = (index: number, drop: number, body: string, extra = '') =>
  `<g class="hc-asm" style="--i:${index};--drop:${drop}px"${extra}>${body}</g>`

export const TEXT = {
  label:
    'A signal-fusion console on a bench. A resume card slides under a gate and is parsed into tags. A microphone feeds a row of eight bar meters, and a camera head on a rail tracks a bouncing marker on a pad. Three cables carry the signals into a fusion block whose dial settles on 87, and a report rises from its slot.',
}

export const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.label,
  className: 'hc-svg',
  body: [
    wrap(0, 18, plate()),
    wrap(1, 30, '<g data-part="rings">' + Array.from({ length: RING_COUNT }, (_, i) => `<path data-ring="${i}" class="iv-ring" d="${ringD(0.5)}" style="opacity:0"/>`).join('') + '</g>'),
    wrap(1, 34, parserBase()),
    wrap(2, 38, frameBack()),
    `<g data-part="card" transform="${k.translateAlong(P, [CARD_START, 0, 0])}"><g class="hc-asm" style="--i:3;--drop:40px">${card()}</g></g>`,
    wrap(2, 40, frameFront()),
    wrap(3, 28, '<g data-part="chips"></g>'),
    wrap(4, 44, mic()),
    wrap(5, 40, desk()),
    wrap(6, 34, '<g data-part="bars"></g>' + faderGroups()),
    wrap(7, 44, fusion() + lampsSvg()),
    wrap(7, 20, '<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" style="stroke-width:1.2" d="' + needleD(NEEDLE_REST) + '"/>'),
    wrap(8, 20, '<g data-part="slip"></g>'),
    wrap(8, 22, cables()),
    wrap(8, 30, printer() + '<path data-part="spokes" class="iso-line" data-tone="lo" data-free="start" d="' + spokesD(0) + '"/>'),
    wrap(8, 20, '<g data-part="tape"></g>'),
    wrap(9, 22, pad()),
    wrap(9, 22, marker()),
    wrap(9, 40, postAt(122)),
    wrap(10, 46, beamRail()),
    wrap(10, 40, postAt(166)),
    `<g data-part="camera" transform="${k.translateAlong(P, [0, 0, 0])}"><g class="hc-asm" style="--i:11;--drop:44px">${camera()}</g></g>`,
    `<g data-part="sight" style="opacity:0"><path data-part="sight-line" class="iso-line" data-tone="lit" d="${sightD(PAD_C[0], 0, 0, 0)}"/></g>`,
  ],
})

export const translate = (x: number, y = 0, z = 0) => k.translateAlong(P, [x, y, z])
