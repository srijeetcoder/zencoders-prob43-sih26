import { useEffect } from 'react'
import { initSmooth, destroySmooth } from '../lib/smoothScroll'

export default function SmoothScroll() {
  useEffect(() => {
    initSmooth()
    return destroySmooth
  }, [])
  return null
}