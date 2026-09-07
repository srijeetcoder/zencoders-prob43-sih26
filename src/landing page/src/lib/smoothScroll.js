import Lenis from 'lenis'

let lenis = null
let rafId = 0

function loop(time) {
  if (!lenis) return
  lenis.raf(time)
  rafId = requestAnimationFrame(loop)
}

export function initSmooth() {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: true,
    anchors: true,
  })
  rafId = requestAnimationFrame(loop)
  return lenis
}

export function destroySmooth() {
  cancelAnimationFrame(rafId)
  rafId = 0
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}

export function getLenis() {
  return lenis
}