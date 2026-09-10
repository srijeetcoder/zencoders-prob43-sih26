import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLenis } from './smoothScroll'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

export default function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', pathname + search)
    }
    const lenis = getLenis()
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, search])
  return null
}
