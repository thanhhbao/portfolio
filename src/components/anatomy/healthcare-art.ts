import * as k from './iso-kit'
import type { Point3 } from './iso-kit'

/*
 * Fig 02 · a sealed glass box (the browser) with an ONNX model inside.
 * A skin image rides in on a carriage, is scanned, the needle reads "Medium",
 * and the net socket on the wall stays unplugged: nothing leaves the box.
 */

export const WIDTH = 640
export const HEIGHT = 450

const PLATE = { x: -150, y: -94, w: 326, d: 200, r: 10 }
const PLATE_H = 12
const FOOT_H = 5

export const BOX = { x: -120, y: -62, w: 170, d: 124, r: 3 }
const X0 = BOX.x
const Y0 = BOX.y
const X1 = BOX.x + BOX.w
const Y1 = BOX.y + BOX.d
const FLOOR = 5
const POST = 6
const ZTOP = 80
const BAR_TOP = 85

const SLOT = { y: 26, h: 22 }
export const GATE_LIFT = 24

const RAIL_Y = [-17, 12]
const RAIL_IN = -44
const RAIL_OUT = 160

export const CARRIAGE_START = 118
export const SCAN_X = -6
const CARRIAGE = { x: -22, y: -22, w: 44, d: 44, r: 3 }
const TILE_Z = 13
const SKIN_Z = 15

const ARCH_X = SCAN_X
const LENS_Z = 37

export const GEAR = { teeth: 12, root: 10, tip: 13.8, z: 9, h: 4 }
const G1: [number, number] = [-100, -39]
const G2: [number, number] = [-76, -39]
const CRYSTAL: [number, number] = [-44, -39]

export const DIAL: [number, number] = [-78, 30]
const DIAL_R = 22
const DIAL_TOP = 18
export const NEEDLE_REST = -120
export const NEEDLE_MEDIUM = 0
export const NEEDLE_HIGH = 60

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...k.boxCorners(BOX, 0, BAR_TOP + 2),
    [CARRIAGE_START + 22, 0, 16],
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

/* ---------- static art ---------- */

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
  const strip = plan(-128, 92, 290, 7, 1)
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }))
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }))
  return out.join('')
}

const paneBack = () => {
  const x = k.pathOf([at([X0, Y0, FLOOR]), at([X0, Y1, FLOOR]), at([X0, Y1, ZTOP]), at([X0, Y0, ZTOP])], true)
  const y = k.pathOf([at([X0, Y0, FLOOR]), at([X1, Y0, FLOOR]), at([X1, Y0, ZTOP]), at([X0, Y0, ZTOP])], true)
  return `<path class="hc-glass hc-glass-back" d="${x}"/><path class="hc-glass hc-glass-back" d="${y}"/>`
}

const post = (x: number, y: number) => {
  const p = plan(x, y, POST, POST, 1.2)
  return [
    S(k.slabOf(p, FLOOR, ZTOP - FLOOR, P, 3, 0.5), { tone: 'mid' }),
    D([at([x + POST / 2, y + POST / 2, ZTOP])], { size: 0.45 }),
  ].join('')
}

const bar = (p: k.Plan) => S(k.slabOf(p, ZTOP, BAR_TOP - ZTOP, P, 3, 0.5), { tone: 'mid' })

function boxBack() {
  const out = [paneBack()]
  out.push(S(k.slabOf(BOX, 0, FLOOR, P, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(BOX, 3.5), FLOOR, P), { tone: 'faint' }))
  out.push(post(X0, Y0))
  out.push(bar(plan(X0, Y0, BOX.w, 5, 1)))
  out.push(bar(plan(X0, Y0, 5, BOX.d, 1)))
  return out.join('')
}

function deck() {
  const out: string[] = []
  const d = plan(-114, -58, 102, 38, 2)
  out.push(S(k.slabOf(d, FLOOR, 4, P, 3, 0.5), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(d, 2.4), FLOOR + 4, P, 3), { tone: 'faint' }))
  out.push(
    D(
      [
        [d.x + 4, d.y + 4],
        [d.x + d.w - 4, d.y + 4],
        [d.x + 4, d.y + d.d - 4],
        [d.x + d.w - 4, d.y + d.d - 4],
      ].map(([x, y]) => at([x, y, FLOOR + 4])),
      { size: 0.45 },
    ),
  )
  out.push(k.faceTextSvg(k.topMatrix([-108, -22.4], FLOOR + 4, P, 'x'), 'ONNX', { size: 3, tone: 'lo' }))
  // link rod from the second gear to the crystal
  out.push(S(k.slabOf(plan(G2[0], G2[1] - 2, CRYSTAL[0] - G2[0], 4, 1.2), 16, 2.6, P, 3, 0.3), { tone: 'mid' }))
  // crystal pedestal
  out.push(S(k.cylinder(CRYSTAL[0], CRYSTAL[1], 11.5, FLOOR + 4, 5, P, 32, 0.4), { tone: 'mid' }))
  out.push(L(k.ring(CRYSTAL[0], CRYSTAL[1], 9.2, FLOOR + 9, P, 32), { tone: 'lo' }))
  return out.join('')
}

const crystalGlow = () => `<path data-part="glow" class="hc-glow" d="${k.cylinder(CRYSTAL[0], CRYSTAL[1], 10, 14, 22, P, 6).fill}"/>`
const crystal = () =>
  `<g data-part="crystal">${S(k.cylinder(CRYSTAL[0], CRYSTAL[1], 8.5, 14, 22, P, 6, 0.6), { tone: 'hi' })}${L(k.ring(CRYSTAL[0], CRYSTAL[1], 4.6, 36, P, 6), { tone: 'lo' })}</g>`

/** a gear, rebuilt every frame because it turns about z */
export function gearSvg(centre: [number, number], rot: number, spokes: number) {
  const { teeth, root, tip, z, h } = GEAR
  const step = (Math.PI * 2) / teeth
  const ring: Array<[number, number]> = []
  for (let i = 0; i < teeth; i++) {
    const a = rot + i * step
    const point = (r: number, da: number): [number, number] => [centre[0] + Math.cos(a + da) * r, centre[1] + Math.sin(a + da) * r]
    ring.push(point(root, -step * 0.28), point(tip, -step * 0.13), point(tip, step * 0.13), point(root, step * 0.28), point(root - 0.2, step * 0.5))
  }
  const out: string[] = []
  out.push(S(k.extrude(ring, z, h, P, { convex: false }), { tone: 'mid', crease: 'lo' }))
  out.push(L(k.ring(centre[0], centre[1], root - 1.8, z + h, P, 40), { tone: 'lo' }))
  const arms: string[] = []
  for (let i = 0; i < spokes; i++) {
    const a = rot * (spokes === 3 ? 1 : 1) + (i / spokes) * Math.PI * 2
    arms.push(k.lineOnTop([centre[0] + Math.cos(a) * 3.8, centre[1] + Math.sin(a) * 3.8], [centre[0] + Math.cos(a) * (root - 1.8), centre[1] + Math.sin(a) * (root - 1.8)], z + h, P))
  }
  out.push(L(arms.join(''), { tone: 'lo' }))
  out.push(S(k.cylinder(centre[0], centre[1], 3.6, z + h, 3, P, 18, 0.3), { tone: 'mid' }))
  out.push(L(k.ring(centre[0], centre[1], 1.5, z + h + 3, P, 12), { tone: 'mid' }))
  return out.join('')
}

export const gearPair = (angle: number) => ({
  one: gearSvg(G1, angle, 3),
  two: gearSvg(G2, Math.PI / GEAR.teeth - angle, 3),
})

function rails() {
  const out: string[] = []
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf(plan(RAIL_IN, y, X1 - RAIL_IN, 5, 1), FLOOR, 3, P, 3, 0.4), { tone: 'mid' }))
    out.push(D([RAIL_IN + 6, X1 - 6].map((x) => at([x, y + 2.5, FLOOR + 3])), { size: 0.4 }))
  }
  out.push(S(k.slabOf(plan(RAIL_IN - 6, -23, 6, 46, 1.2), FLOOR, 7, P, 3, 0.5), { tone: 'mid' }))
  out.push(D([-18, 18].map((y) => at([RAIL_IN - 3, y, FLOOR + 7])), { size: 0.45 }))
  return out.join('')
}

const archBack = () => S(k.slabOf(plan(ARCH_X - 5, -33, 10, 6, 1), FLOOR, 39, P, 3, 0.4), { tone: 'mid' })

function archFront() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(ARCH_X - 5, 27, 10, 6, 1), FLOOR, 39, P, 3, 0.4), { tone: 'mid' }))
  const barPlan = plan(ARCH_X - 6, -35, 12, 70, 2)
  out.push(S(k.slabOf(barPlan, 44, 8, P, 4, 0.6), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(barPlan, 2), 52, P, 3), { tone: 'faint' }))
  const ticks = k.topTicks(-30, 30, 4, 5, ARCH_X - 1.6, 52, [1.6, 3], P, 'y')
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  out.push(D([at([ARCH_X, -31, 52]), at([ARCH_X, 31, 52])], { size: 0.45 }))
  // lens barrel
  out.push(S(k.cylinder(ARCH_X, 0, 6.5, LENS_Z, 7, P, 28, 0.4), { tone: 'hi', lit: true }))
  out.push(L(k.knurl(ARCH_X, 0, 6.5, LENS_Z + 1, LENS_Z + 6, 24, P, 0.3), { tone: 'lo' }))
  out.push(S(k.cylinder(ARCH_X, 0, 3.4, LENS_Z - 1.5, 1.5, P, 20), { tone: 'hi', lit: true }))
  return out.join('')
}

/** the carriage, drawn around its own centre and moved with translateAlong */
function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), FLOOR + 3, 0.1, P)}" style="filter:blur(4px)"/>`]
  out.push(S(k.slabOf(CARRIAGE, FLOOR + 3, TILE_Z - FLOOR - 3, P, 5, 0.6), { tone: 'mid' }))
  out.push(
    D(
      [[-18, -18], [18, -18], [-18, 18], [18, 18]].map(([x, y]) => at([x, y, TILE_Z])),
      { size: 0.4, tone: 'lo' },
    ),
  )
  const handle: [number, number] = [CARRIAGE.x + CARRIAGE.w - 8, CARRIAGE.y + CARRIAGE.d + 3]
  out.push(S(k.slabOf(plan(handle[0] - 2, CARRIAGE.y + CARRIAGE.d - 1, 4, 4, 1), FLOOR + 4, 3, P, 2), { tone: 'mid', crease: 'none' }))
  out.push(S(k.cylinder(handle[0], handle[1] + 1, 3, FLOOR + 3, 5, P, 20), { tone: 'mid' }))
  out.push(L(k.knurl(handle[0], handle[1] + 1, 3, FLOOR + 3, FLOOR + 8, 18, P), { tone: 'lo' }))
  return out.join('')
}

function tile() {
  const out: string[] = []
  const bezel = plan(-18, -18, 36, 36, 2.5)
  out.push(S(k.slabOf(bezel, TILE_Z, SKIN_Z - TILE_Z, P, 4, 0.5), { tone: 'hi' }))
  out.push(`<path class="hc-skin" d="${k.planOutline(plan(-15.5, -15.5, 31, 31, 1.8), SKIN_Z, P, 4)}"/>`)
  const blot: Array<[number, number]> = []
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    blot.push([2 + Math.cos(a) * (5.4 + Math.sin(a * 3) * 0.7), -2 + Math.sin(a) * (4.4 + Math.cos(a * 2) * 0.6)])
  }
  out.push(`<path class="hc-lesion-halo" d="${k.onTop(blot.map(([x, y]) => [2 + (x - 2) * 1.55, -2 + (y + 2) * 1.55] as [number, number]), SKIN_Z, P, true)}"/>`)
  out.push(`<path class="hc-lesion" d="${k.onTop(blot, SKIN_Z, P, true)}"/>`)
  const reg = [-11, 11].flatMap((x) => [-11, 11].map((y) => k.lineOnTop([x, y], [x + Math.sign(-x) * 3, y], SKIN_Z, P) + k.lineOnTop([x, y], [x, y + Math.sign(-y) * 3], SKIN_Z, P)))
  out.push(L(reg.join(''), { tone: 'mid' }))
  return out.join('')
}

function beam() {
  const lens = at([ARCH_X, 0, LENS_Z - 1.5])
  const a = at([ARCH_X, -15, SKIN_Z])
  const b = at([ARCH_X, 15, SKIN_Z])
  const fan = k.pathOf([lens, a, b], true)
  return [
    `<path class="hc-beam" d="${fan}"/>`,
    L(k.pathOf([lens, a]) + k.pathOf([lens, b]), { tone: 'lit' }),
    L(k.lineOnTop([ARCH_X, -15], [ARCH_X, 15], SKIN_Z + 0.2, P), { tone: 'lit', className: 'hc-scanline' }),
  ].join('')
}

const wireToCrystal = () => k.wireSvg(at([ARCH_X, -34, 50]), at([CRYSTAL[0], CRYSTAL[1] + 4, 36]), { tone: 'lit', flow: true, size: 1.1, via: [at([-26, -36, 56])] })

function dial() {
  const out: string[] = []
  const [x, y] = DIAL
  out.push(`<path class="iso-halo" d="${k.cylinder(x, y, DIAL_R, FLOOR, 1, P, 40).fill}" style="filter:blur(5px)"/>`)
  out.push(S(k.cylinder(x, y, DIAL_R, FLOOR, 11, P, 56, 0.8), { tone: 'mid' }))
  out.push(L(k.knurl(x, y, DIAL_R, FLOOR + 3, FLOOR + 10, 72, P, 0.3), { tone: 'lo' }))
  out.push(S(k.cylinder(x, y, DIAL_R - 2.4, FLOOR + 11, DIAL_TOP - FLOOR - 11, P, 56), { tone: 'hi', crease: 'lo' }))
  out.push(L(k.ring(x, y, DIAL_R - 4.4, DIAL_TOP, P, 56), { tone: 'lo' }))
  const from = (-120 * Math.PI) / 180
  const span = (240 * Math.PI) / 180
  const ticks = k.radialTicks(x, y, DIAL_R - 5, 24, 4, DIAL_TOP, [1.5, 3], P, from, span)
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }))
  const arc = (a0: number, a1: number, r: number) => {
    const points: Array<[number, number]> = []
    for (let i = 0; i <= 16; i++) {
      const a = ((a0 + ((a1 - a0) * i) / 16) * Math.PI) / 180
      points.push([x + Math.sin(a) * r, y - Math.cos(a) * r])
    }
    return k.onTop(points, DIAL_TOP, P)
  }
  out.push(L(arc(-120, -42, 11.6), { tone: 'lo' }))
  out.push(`<path class="hc-arc" d="${arc(-36, 36, 11.6)}"/>`)
  out.push(L(arc(42, 120, 11.6), { tone: 'mid' }))
  out.push(S(k.cylinder(x, y, 2.6, DIAL_TOP, 2, P, 16), { tone: 'mid' }))
  return out.join('')
}

export function needleD(angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  const [x, y] = DIAL
  const z = DIAL_TOP + 2.2
  return k.lineOnTop([x - Math.sin(a) * 4, y + Math.cos(a) * 4], [x + Math.sin(a) * (DIAL_R - 6.5), y - Math.cos(a) * (DIAL_R - 6.5)], z, P)
}

/* ---------- the glass, the gate, the tray ---------- */

const paneX = () => {
  const edge = (yy: number, z: number) => at([X1, yy, z])
  const d = k.pathOf(
    [edge(Y0, FLOOR), edge(Y0, ZTOP), edge(Y1, ZTOP), edge(Y1, FLOOR), edge(SLOT.y, FLOOR), edge(SLOT.y, FLOOR + SLOT.h), edge(-SLOT.y, FLOOR + SLOT.h), edge(-SLOT.y, FLOOR)],
    true,
  )
  const shine = k.pathOf([edge(-50, 70), edge(-14, 40)]) + k.pathOf([edge(-36, 74), edge(-10, 52)]) + k.pathOf([edge(26, 72), edge(48, 44)])
  return `<path class="hc-glass" d="${d}"/><path class="hc-shine" d="${shine}"/>`
}

const paneY = () => {
  const edge = (x: number, z: number) => at([x, Y1, z])
  const d = k.pathOf([edge(X0, FLOOR), edge(X1, FLOOR), edge(X1, ZTOP), edge(X0, ZTOP)], true)
  const shine = k.pathOf([edge(-96, 72), edge(-60, 36)]) + k.pathOf([edge(-82, 74), edge(-56, 48)]) + k.pathOf([edge(8, 70), edge(34, 40)])
  return `<path class="hc-glass" d="${d}"/><path class="hc-shine" d="${shine}"/>`
}

function frameFront() {
  const out: string[] = []
  out.push(post(X1 - POST, Y0))
  out.push(post(X0, Y1 - POST))
  out.push(bar(plan(X1 - 5, Y0, 5, BOX.d, 1)))
  out.push(bar(plan(X0, Y1 - 5, BOX.w, 5, 1)))
  out.push(post(X1 - POST, Y1 - POST))
  return out.join('')
}

function tray() {
  const out: string[] = []
  out.push(S(k.slabOf(plan(X1, -34, RAIL_OUT + 6 - X1, 68, 3), 0, FLOOR, P, 4, 0.5), { tone: 'mid' }))
  out.push(L(k.planOutline(k.insetPlan(plan(X1, -34, RAIL_OUT + 6 - X1, 68, 3), 3), FLOOR, P), { tone: 'faint' }))
  for (const y of RAIL_Y) {
    out.push(S(k.slabOf(plan(X1, y, RAIL_OUT - X1, 5, 1), FLOOR, 3, P, 3, 0.4), { tone: 'mid' }))
    out.push(D([X1 + 8, RAIL_OUT - 6].map((x) => at([x, y + 2.5, FLOOR + 3])), { size: 0.4 }))
  }
  out.push(S(k.slabOf(plan(RAIL_OUT, -23, 6, 46, 1.2), FLOOR, 7, P, 3, 0.5), { tone: 'mid' }))
  out.push(D([-18, 18].map((y) => at([RAIL_OUT + 3, y, FLOOR + 7])), { size: 0.45 }))
  // low side walls and a chevron to say which way the image goes
  out.push(S(k.slabOf(plan(X1 + 6, -34, RAIL_OUT - X1 - 6, 3, 1), FLOOR, 3, P, 2), { tone: 'mid', crease: 'none' }))
  const chevrons = [92, 104, 116].map((x) => k.onTop([[x + 4, -26], [x, -23], [x + 4, -20]], FLOOR, P)).join('')
  out.push(L(chevrons, { tone: 'lo' }))
  return out.join('')
}

const gateGuides = () =>
  [-31, 27]
    .map((y) => S(k.slabOf(plan(X1 - 3, y, 6, 4, 1), FLOOR, 47, P, 2, 0.4), { tone: 'mid' }) + D([at([X1, y + 2, FLOOR + 47])], { size: 0.45 }))
    .join('')

const gate = () => {
  const p = plan(X1 - 1.6, -SLOT.y, 3.2, SLOT.y * 2, 0.8)
  return [
    S(k.slabOf(p, FLOOR, SLOT.h, P, 2, 0.4), { tone: 'hi' }),
    S(k.slabOf(plan(X1 - 2.2, -9, 4.4, 18, 1), FLOOR + SLOT.h, 3, P, 2, 0.3), { tone: 'mid' }),
    L(k.sideSeam(plan(X1 - 1.6, -SLOT.y, 3.2, SLOT.y * 2, 0.8), FLOOR + 6, P, 2), { tone: 'faint' }),
  ].join('')
}

/** the net socket on the wall, and the cable that lies unplugged beside it */
function socket() {
  const out: string[] = []
  const sx = 35
  out.push(S(k.slabOf(plan(sx - 8, Y1, 16, 5, 1.2), 20, 15, P, 3, 0.5), { tone: 'mid' }))
  out.push(L(k.sideRing([sx, Y1 + 5, 27.5], 4.6, 'y', P, 24) + k.sideRing([sx, Y1 + 5, 27.5], 2.4, 'y', P, 16), { tone: 'hi' }))
  out.push(D([at([sx - 5.4, Y1 + 5, 22.5]), at([sx + 5.4, Y1 + 5, 22.5]), at([sx - 5.4, Y1 + 5, 32.5]), at([sx + 5.4, Y1 + 5, 32.5])], { size: 0.4 }))
  return out.join('')
}

function cable() {
  const out: string[] = []
  const sx = 35
  out.push(S(k.slabOf(plan(sx - 6, 75, 12, 8, 2), 0, 8, P, 3, 0.5), { tone: 'hi' }))
  out.push(L(k.sideRing([sx, 75, 4], 2.6, 'y', P, 16), { tone: 'lo' }))
  out.push(S(k.slabOf(plan(sx - 4, 83, 8, 6, 2), 0, 6, P, 3), { tone: 'mid' }))
  const spring = k.coil(-30, sx - 4, [88, 3.4], 3.4, 11, 'x', P)
  out.push(L(spring.back, { tone: 'lo' }), L(spring.front, { tone: 'mid' }))
  out.push(D([at([-30, 88, 3.4])], { size: 1, tone: 'mid' }))
  return out.join('')
}

/* ---------- assembled figure ---------- */

const wrap = (index: number, drop: number, body: string, extra = '') =>
  `<g class="hc-asm" style="--i:${index};--drop:${drop}px"${extra}>${body}</g>`

export const TEXT = {
  label:
    'A sealed glass box standing for the browser. A skin image rides in on a carriage through a gated slot, is scanned by a lens arch, and the ONNX model inside, two gears and a crystal, turns a dial to Medium risk. The network socket on the wall is unplugged, so nothing leaves the box.',
}

export const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.label,
  className: 'hc-svg',
  body: [
    wrap(0, 18, plate()),
    wrap(1, 30, boxBack()),
    wrap(2, 36, deck() + rails()),
    wrap(3, 40, '<g data-part="gear-one"></g><g data-part="gear-two"></g>'),
    wrap(4, 42, crystalGlow() + crystal() + `<g data-part="signal" style="opacity:0">${wireToCrystal()}</g>`),
    wrap(5, 44, dial() + `<path data-part="needle" class="iso-line" data-tone="lit" data-free="start" style="stroke-width:1.2" d="${needleD(NEEDLE_REST)}"/>`),
    wrap(6, 46, archBack()),
    `<g data-slot="in"></g>`,
    wrap(7, 28, `<g data-part="beam" style="opacity:0">${beam()}</g>`),
    wrap(8, 50, archFront()),
    wrap(11, 12, paneX(), ' data-glass'),
    wrap(9, 30, tray()),
    wrap(10, 30, gateGuides()),
    `<g data-part="gate" transform="${k.translateAlong(P, [0, 0, 0])}"><g class="hc-asm" style="--i:10;--drop:30px">${gate()}</g></g>`,
    `<g data-slot="out"></g>`,
    wrap(11, 12, paneY(), ' data-glass'),
    wrap(12, 20, frameFront()),
    wrap(13, 22, socket() + cable()),
    `<g data-part="carriage" transform="${k.translateAlong(P, [CARRIAGE_START, 0, 0])}"><g class="hc-asm" style="--i:8;--drop:34px">${carriage()}<g data-part="tile">${tile()}</g></g></g>`,
  ],
})

export const translate = (x: number, z = 0) => k.translateAlong(P, [x, 0, z])
