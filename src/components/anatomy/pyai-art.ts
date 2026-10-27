import * as k from './iso-kit'
import type { Point3 } from './iso-kit'

/*
 * Fig 04 · a card-index machine for PyAI Review.
 * A code card drops from the hopper onto a carriage, is typed on (EDIT), lit by a
 * lamp that raises a hint tag (HINT), stamped with a tick (CHECK), and filed in the tray.
 * Four lamps on the console fill as the card passes each step.
 */

export const WIDTH = 680
export const HEIGHT = 450

const PLATE = { x: -170, y: -72, w: 360, d: 160, r: 10 }
const PLATE_H = 12
const FOOT_H = 5

export const HOP_X = -104
export const EDIT_X = -38
export const HINT_X = 20
export const CHECK_X = 68
export const END_X = 100
export const TRAY_X = 160

const RAIL_Y = [-20, 15]
export const CARRIAGE_Z = 11 // top of the carriage = underside of a card
export const CARD_H = 1.2
const CARRIAGE = { x: -20, y: -18, w: 40, d: 36, r: 3 }
const CARD = { x: -16, y: -13, w: 32, d: 26, r: 1.5 }

export const PEG_Y = [-12, -6, 0, 6, 12]
export const PEG_TRAVEL = 6.6
export const STAMP_TRAVEL = 11
export const TAG_LIFT = 9

export const LAMP_X = [32, 47, 62, 77]
const LAMP_Y = 55
const LAMP_Z = 10

const PULLEY = [
  [-120, -53],
  [112, -53],
] as const
const PULLEY_R = 7

export const CHARS = 'opt.step()'.length

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [HOP_X, 0, 62],
    [CHECK_X, 0, 62],
    [TRAY_X + 24, 0, 20],
  ],
  WIDTH,
  HEIGHT,
  { pad: 20, azimuth: 40 },
)

const at = (point: Point3) => k.iso(point, P)
const S = (paths: k.SolidPaths, style?: k.SolidStyle) => k.solidSvg(paths, style)
const L = (d: string, style?: k.LineStyle) => k.lineSvg(d, style)
const D = (points: Array<[number, number]>, style?: { size?: number; tone?: k.Tone }) => k.dotsSvg(points, style)
const byDepth = (points: Array<[number, number]>) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))
const plan = (x: number, y: number, w: number, d: number, r = 1): k.Plan => ({ x, y, w, d, r })

/* ---------- base, drive, track ---------- */

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
  const strip = plan(-150, 74, 320, 7, 1)
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }))
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }))
  return out.join('')
}

/** pulley spokes turn about z, so the lines are rebuilt as the carriage moves */
export const spokesD = (side: 0 | 1, angle: number) => {
  const [cx, cy] = PULLEY[side]
  const arms: string[] = []
  for (let i = 0; i < 3; i++) {
    const a = angle + (i / 3) * Math.PI * 2
    arms.push(k.lineOnTop([cx + Math.cos(a) * 2.6, cy + Math.sin(a) * 2.6], [cx + Math.cos(a) * (PULLEY_R - 1.6), cy + Math.sin(a) * (PULLEY_R - 1.6)], 5, P))
  }
  return arms.join('')
}

function belt() {
  const out: string[] = []
  const [a, b] = PULLEY
  for (const dy of [-PULLEY_R, PULLEY_R]) {
    out.push(S(k.slabOf(plan(a[0], a[1] + dy - 0.7, b[0] - a[0], 1.4, 0.4), 1.2, 2.2, P, 2), { tone: 'lo', crease: 'none' }))
  }
  for (const [cx, cy] of PULLEY) {
    out.push(S(k.cylinder(cx, cy, PULLEY_R, 0, 5, P, 36, 0.4), { tone: 'mid' }))
    out.push(L(k.ring(cx, cy, PULLEY_R - 1.2, 5, P, 36), { tone: 'lo' }))
    out.push(L(k.knurl(cx, cy, PULLEY_R, 1, 4.4, 28, P, 0.3), { tone: 'lo' }))
  }
  return out.join('')
}

const spokesLayer = () =>
  [0, 1 as const]
    .map((side) => {
      const [cx, cy] = PULLEY[side as 0 | 1]
      return `<path data-part="spokes-${side}" class="iso-line" data-tone="lo" d="${spokesD(side as 0 | 1, 0)}"/>${S(k.cylinder(cx, cy, 2.2, 5, 2, P, 14), { tone: 'mid' })}`
    })
    .join('')

function track() {
  const out: string[] = []
  const bed = plan(-135, -24, 265, 48, 3)
  out.push(S(k.slabOf(bed, 0, 4, P, 4, 0.5), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(bed, 2.6), 4, P), { tone: 'faint' }))
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf(plan(-128, y, 252, 5, 1), 4, 3, P, 3, 0.4), { tone: 'mid' }))
    out.push(D([-120, -60, 0, 60, 116].map((x) => at([x, y + 2.5, 7])), { size: 0.4 }))
  }
  out.push(S(k.slabOf(plan(-136, -22, 7, 44, 1.2), 4, 7, P, 3, 0.5), { tone: 'mid' }))
  out.push(D([-17, 17].map((y) => at([-132.5, y, 11])), { size: 0.45 }))
  out.push(S(k.slabOf(plan(122, -22, 7, 44, 1.2), 4, 7, P, 3, 0.5), { tone: 'mid' }))
  out.push(D([-17, 17].map((y) => at([125.5, y, 11])), { size: 0.45 }))
  return out.join('')
}

/* ---------- the carriage and the cards ---------- */

function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), 7, 0.1, P)}" style="filter:blur(4px)"/>`]
  out.push(S(k.slabOf(CARRIAGE, 7, CARRIAGE_Z - 7, P, 5, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(CARRIAGE, 2.6), CARRIAGE_Z, P, 4), { tone: 'faint' }))
  out.push(D([[-16, -14], [16, -14], [-16, 14], [16, 14]].map(([x, y]) => at([x, y, CARRIAGE_Z])), { size: 0.4, tone: 'lo' }))
  const knob: [number, number] = [8, CARRIAGE.y + CARRIAGE.d + 3]
  out.push(S(k.slabOf(plan(knob[0] - 2, CARRIAGE.y + CARRIAGE.d - 1, 4, 4, 1), 8, 2.6, P, 2), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(knob[0], knob[1] + 1, 3, 7, 4.4, P, 20), { tone: 'mid' }))
  out.push(L(k.knurl(knob[0], knob[1] + 1, 3, 7, 11.4, 18, P), { tone: 'lo' }))
  return out.join('')
}

const LINES: Array<{ text: string; x: number; y: number }> = [
  { text: 'def train_step(x):', x: -14, y: -6.4 },
  { text: 'loss = f(x)', x: -11, y: -2.4 },
  { text: 'loss.backward()', x: -11, y: 1.6 },
]
const TYPED = { x: -11, y: 5.6 }

/** a code card, drawn about its own centre at z = 0 */
function cardBody(typed: boolean, full = false) {
  const out: string[] = []
  out.push(S(k.slabOf(CARD, 0, CARD_H, P, 3, 0.3), { tone: 'hi', crease: 'lo' }))
  out.push(L(k.lineOnTop([-14, -9.6], [14, -9.6], CARD_H, P), { tone: 'faint' }))
  out.push(D([-9, -4.5, 0, 4.5, 9].map((y) => at([14.2, y, CARD_H])), { size: 0.4, tone: 'lo' }))
  out.push(`<path class="py-tab" d="${k.planOutline(plan(-14, -11.6, 6, 1.5, 0.4), CARD_H, P, 2)}"/>`)
  for (const line of LINES) out.push(k.faceTextSvg(k.topMatrix([line.x, line.y], CARD_H, P, 'x'), line.text, { size: 2.3, tone: 'hi' }))
  if (typed) {
    out.push(`<g data-part="typed">${k.faceTextSvg(k.topMatrix([TYPED.x, TYPED.y], CARD_H, P, 'x'), full ? 'opt.step()' : '', { size: 2.3, tone: 'hi' })}</g>`)
    out.push(`<path data-part="tick" class="py-tick" style="opacity:0" d="${k.onTop([[6, 3], [9, 7], [14.5, -2]], CARD_H + 0.1, P)}"/>`)
  } else {
    out.push(k.faceTextSvg(k.topMatrix([TYPED.x, TYPED.y], CARD_H, P, 'x'), 'opt.step()', { size: 2.3, tone: 'hi' }))
  }
  return out.join('')
}

const cardAt = (x: number, z: number, body: string) => `<g transform="${k.translateAlong(P, [x, 0, z])}">${body}</g>`

/* ---------- hopper ---------- */

const HOPPER_POSTS = { left: -127, right: -86, back: -28, front: 23 }
const hopperPost = (x: number, y: number) => S(k.slabOf(plan(x, y, 5, 5, 1), 0, 45, P, 2, 0.4), { tone: 'mid' }) + D([at([x + 2.5, y + 2.5, 45])], { size: 0.45 })

function hopperBack() {
  return hopperPost(HOPPER_POSTS.left, HOPPER_POSTS.back) + hopperPost(HOPPER_POSTS.right, HOPPER_POSTS.back)
}

function hopperFront() {
  const out: string[] = []
  // ledges that hold the pile, and the posts that carry them
  out.push(S(k.slabOf(plan(-127, -28, 9, 56, 1), 13, 2.5, P, 2, 0.3), { tone: 'mid' }))
  out.push(S(k.slabOf(plan(-90, -28, 9, 56, 1), 13, 2.5, P, 2, 0.3), { tone: 'mid' }))
  out.push(hopperPost(HOPPER_POSTS.left, HOPPER_POSTS.front))
  out.push(hopperPost(HOPPER_POSTS.right, HOPPER_POSTS.front))
  // the pile: four cards, the top one engraved
  for (let i = 0; i < 4; i++) out.push(cardAt(HOP_X, 15 + i * 1.8, cardBody(false)))
  return out.join('')
}

function hopperTop() {
  const out: string[] = []
  // top frame on the far side only, so it never crosses the pile
  out.push(S(k.slabOf(plan(-127, -28, 46, 5, 1), 40, 5, P, 2, 0.4), { tone: 'mid' }))
  out.push(S(k.slabOf(plan(-127, -28, 5, 56, 1), 40, 5, P, 2, 0.4), { tone: 'mid' }))
  out.push(L(k.lineOnTop([-121, -25.5], [-86, -25.5], 45, P), { tone: 'faint' }))
  out.push(L(k.lineOnTop([-124.5, -22], [-124.5, 22], 45, P), { tone: 'faint' }))
  return out.join('')
}

/* ---------- EDIT: type bars ---------- */

function editBack() {
  return S(k.slabOf(plan(EDIT_X - 4, -33, 8, 6, 1), 0, 42, P, 2, 0.4), { tone: 'mid' })
}

/** one peg, drawn at rest and moved down with translateAlong */
const pegShaft = (y: number) =>
  S(k.cylinder(EDIT_X, y, 1.9, 20, 30, P, 16), { tone: 'hi', crease: 'none' }) + S(k.cylinder(EDIT_X, y, 2.7, 20, 2.2, P, 16), { tone: 'mid', crease: 'none' })

const pegsLayer = () => PEG_Y.map((y, i) => `<g data-part="peg-${i}">${pegShaft(y)}</g>`).join('')

function editFront() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(EDIT_X - 4, 27, 8, 6, 1), 0, 42, P, 2, 0.4), { tone: 'mid' }))
  const bridge = plan(EDIT_X - 6, -36, 12, 72, 2)
  out.push(S(k.slabOf(bridge, 42, 8, P, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(bridge, 2), 50, P, 3), { tone: 'faint' }))
  const ticks = k.topTicks(-12 - 16, 12 + 16, 4, 5, EDIT_X + 1.6, 50, [1.5, 2.8], P, 'y')
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  for (const y of PEG_Y) {
    out.push(S(k.cylinder(EDIT_X, y, 3.1, 39, 3, P, 18), { tone: 'mid', crease: 'none' }))
    out.push(L(k.ring(EDIT_X, y, 1.2, 50, P, 10), { tone: 'mid' }))
  }
  out.push(D([at([EDIT_X, -32, 50]), at([EDIT_X, 32, 50])], { size: 0.45 }))
  out.push(k.faceTextSvg(k.topMatrix([EDIT_X - 4.4, 25], 50, P, 'x'), 'EDIT', { size: 2.6, tone: 'lo' }))
  return out.join('')
}

/* ---------- HINT: lamp on an arm, and a tag that rises into its light ---------- */

function hintBack() {
  const out: string[] = []
  const housing = plan(HINT_X - 6, -36, 12, 10, 1.5)
  out.push(S(k.slabOf(housing, 0, 40, P, 3, 0.5), { tone: 'mid' }))
  out.push(L(k.sideSeam(housing, 14, P, 3) + k.sideSeam(housing, 26, P, 3), { tone: 'faint' }))
  out.push(D([at([HINT_X, -26, 33])], { size: 0.5 }))
  return out.join('')
}

const hintCone = () => {
  const lens = at([HINT_X, 0, 27])
  const a = at([HINT_X - 11, -10, CARRIAGE_Z + CARD_H])
  const b = at([HINT_X + 11, -10, CARRIAGE_Z + CARD_H])
  const c = at([HINT_X + 11, 10, CARRIAGE_Z + CARD_H])
  const d = at([HINT_X - 11, 10, CARRIAGE_Z + CARD_H])
  return `<path data-part="cone" class="py-cone" style="opacity:0" d="${k.pathOf([lens, a, b, c, d], true)}"/>`
}

const hintTag = () => {
  const out: string[] = []
  out.push(S(k.slabOf(plan(-8, -6, 16, 12, 1.5), 0, 0.9, P, 3, 0.2), { tone: 'mid' }))
  out.push(`<path class="py-hint" d="${k.planOutline(plan(-6.6, -4.6, 13.2, 9.2, 1), 0.9, P, 3)}"/>`)
  out.push(k.faceTextSvg(k.topMatrix([0, 2.4], 0.9, P, 'x'), '?', { size: 6, tone: 'hi', anchor: 'middle' }))
  return out.join('')
}

function hintFront() {
  const out: string[] = []
  const arm = plan(HINT_X - 3, -30, 6, 36, 1.5)
  out.push(S(k.slabOf(arm, 36, 4, P, 3, 0.4), { tone: 'mid' }))
  out.push(D([at([HINT_X, -26, 40]), at([HINT_X, 2, 40])], { size: 0.45 }))
  out.push(`<path data-part="lamp-glow-hint" class="py-glow py-glow-gold" d="${k.cylinder(HINT_X, 0, 6, 27, 8, P, 20).fill}"/>`)
  out.push(S(k.cylinder(HINT_X, 0, 5, 30, 6, P, 24, 0.4), { tone: 'hi' }))
  out.push(L(k.knurl(HINT_X, 0, 5, 30.8, 35.2, 20, P, 0.3), { tone: 'lo' }))
  out.push(`<g data-part="lens">${S(k.cylinder(HINT_X, 0, 3.4, 28.4, 1.8, P, 20), { tone: 'hi' })}</g>`)
  out.push(k.faceTextSvg(k.topMatrix([HINT_X - 5.4, -29], 40, P, 'x'), 'HINT', { size: 2.6, tone: 'lo' }))
  return out.join('')
}

/* ---------- CHECK: the stamp ---------- */

function checkBack() {
  return S(k.slabOf(plan(CHECK_X - 4, -33, 8, 6, 1), 0, 46, P, 2, 0.4), { tone: 'mid' })
}

const stampRod = () =>
  [
    S(k.cylinder(CHECK_X, 0, 2.6, 30, 27, P, 16), { tone: 'hi', crease: 'none' }),
    S(k.cylinder(CHECK_X, 0, 4.4, 34, 1.6, P, 18), { tone: 'mid' }),
    S(k.cylinder(CHECK_X, 0, 4.4, 38, 1.6, P, 18), { tone: 'mid' }),
    S(k.slabOf(plan(CHECK_X - 9, -11, 18, 22, 2), 24, 6, P, 3, 0.5), { tone: 'hi' }),
    L(k.planOutline(plan(CHECK_X - 6.6, -8.6, 13.2, 17.2, 1), 30, P, 3), { tone: 'faint' }),
    D([at([CHECK_X - 6, -7.8, 30]), at([CHECK_X + 6, -7.8, 30]), at([CHECK_X - 6, 7.8, 30]), at([CHECK_X + 6, 7.8, 30])], { size: 0.4 }),
  ].join('')

function checkFront() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(CHECK_X - 4, 27, 8, 6, 1), 0, 46, P, 2, 0.4), { tone: 'mid' }))
  const bridge = plan(CHECK_X - 6, -36, 12, 72, 2)
  out.push(S(k.slabOf(bridge, 46, 8, P, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(bridge, 2), 54, P, 3), { tone: 'faint' }))
  out.push(S(k.cylinder(CHECK_X, 0, 5.4, 54, 2.4, P, 24, 0.3), { tone: 'mid' }))
  out.push(L(k.ring(CHECK_X, 0, 3.2, 56.4, P, 16), { tone: 'lo' }))
  out.push(D([at([CHECK_X, -32, 54]), at([CHECK_X, 32, 54])], { size: 0.45 }))
  out.push(k.faceTextSvg(k.topMatrix([CHECK_X - 6.4, 25], 54, P, 'x'), 'CHECK', { size: 2.6, tone: 'lo' }))
  return out.join('')
}

/* ---------- tray ---------- */

const TRAY = plan(134, -30, 50, 60, 3)
const PILE_Z = 3
const PILE_STEP = 1.5

function trayBase() {
  const out: string[] = []
  out.push(S(k.slabOf(TRAY, 0, PILE_Z, P, 4, 0.5), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(TRAY, 3), PILE_Z, P), { tone: 'faint' }))
  out.push(S(k.slabOf(plan(134, -30, 50, 3, 1), PILE_Z, 5, P, 2, 0.3), { tone: 'mid', crease: 'none' }))
  out.push(S(k.slabOf(plan(134, 27, 50, 3, 1), PILE_Z, 2.4, P, 2, 0.3), { tone: 'mid', crease: 'none' }))
  out.push(D([at([140, -28.5, PILE_Z + 5]), at([178, -28.5, PILE_Z + 5])], { size: 0.4 }))
  for (let i = 0; i < 3; i++) out.push(cardAt(TRAY_X, PILE_Z + i * PILE_STEP, cardBody(false)))
  return out.join('')
}

const trayEnd = () => S(k.slabOf(plan(181, -30, 3, 60, 1), PILE_Z, 12, P, 2, 0.4), { tone: 'mid' }) + D([at([182.5, -22, PILE_Z + 12]), at([182.5, 22, PILE_Z + 12])], { size: 0.45 })

export const PILE_TOP = PILE_Z + 3 * PILE_STEP

/* ---------- console with four lamps ---------- */

function consoleArt() {
  const out: string[] = []
  const body = plan(20, 46, 70, 18, 2.5)
  out.push(`<path class="iso-halo" d="${k.haloOf(body, 0, 10, P)}" style="filter:blur(5px)"/>`)
  out.push(S(k.slabOf(body, 0, 10, P, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(body, 2.4), 10, P, 3), { tone: 'faint' }))
  const ticks = k.topTicks(26, 84, 3, 5, 61, 10, [1.2, 2.2], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([[23.5, 49.5], [86.5, 49.5], [23.5, 60.5], [86.5, 60.5]].map(([x, y]) => at([x, y, 10])), { size: 0.45 }))
  LAMP_X.forEach((x, i) => {
    out.push(`<path data-part="lamp-glow-${i}" class="py-glow" d="${k.cylinder(x, LAMP_Y, 5.6, 10, 4, P, 20).fill}"/>`)
    out.push(S(k.cylinder(x, LAMP_Y, 4.6, LAMP_Z, 1.2, P, 22), { tone: 'mid' }))
    out.push(`<g data-part="lamp-${i}">${S(k.cylinder(x, LAMP_Y, 3.3, LAMP_Z + 1.2, 2, P, 20, 0.3), { tone: 'hi' })}</g>`)
  })
  return out.join('')
}

/* ---------- assembled figure ---------- */

const wrap = (index: number, drop: number, body: string) => `<g class="hc-asm" style="--i:${index};--drop:${drop}px">${body}</g>`

export const TEXT = {
  label:
    'A card-index machine for Python practice. A code card drops from a hopper onto a carriage, slides to a typing station where a row of pegs types the last line, to a lamp that lights a hint tag, and to a stamp that presses a tick onto it, then it is filed in the tray while four lamps on the console light one by one.',
}

export const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.label,
  className: 'hc-svg',
  body: [
    wrap(0, 18, plate()),
    wrap(1, 26, belt() + spokesLayer()),
    wrap(2, 30, track()),
    wrap(3, 40, hopperBack() + editBack() + hintBack() + checkBack()),
    wrap(4, 30, trayBase()),
    `<g data-part="carriage" transform="${k.translateAlong(P, [HOP_X, 0, 0])}"><g class="hc-asm" style="--i:5;--drop:34px">${carriage()}</g></g>`,
    `<g data-part="card" transform="${k.translateAlong(P, [HOP_X, 0, CARRIAGE_Z])}"><g class="hc-asm" style="--i:6;--drop:40px">${cardBody(true)}</g></g>`,
    wrap(4, 24, trayEnd()),
    wrap(7, 38, hopperFront() + hopperTop()),
    wrap(8, 42, pegsLayer()),
    wrap(8, 42, editFront()),
    wrap(9, 40, hintCone()),
    `<g data-part="tag" style="opacity:0" transform="${k.translateAlong(P, [HINT_X, 0, CARRIAGE_Z + CARD_H + 3])}">${hintTag()}</g>`,
    wrap(10, 44, hintFront()),
    wrap(11, 44, `<g data-part="stamp" transform="${k.translateAlong(P, [0, 0, 0])}">${stampRod()}</g>`),
    wrap(11, 44, checkFront()),
    wrap(12, 22, consoleArt()),
  ],
})

export const translate = (x: number, z = 0) => k.translateAlong(P, [x, 0, z])
export const translateY = (y: number, z = 0) => k.translateAlong(P, [0, y, z])
export const translateXYZ = (x: number, y: number, z: number) => k.translateAlong(P, [x, y, z])
