'use client'

import { useEffect, useRef } from 'react'

interface SkyscraperAdProps {
  className?: string
}

export default function SkyscraperAd({ className = '' }: SkyscraperAdProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current) return

    // Clear any existing children to prevent duplicate scripts or iframes on hot-reloading
    containerRef.current.innerHTML = ''

    // Set the options on the window object
    const atOptions = {
      key: '07e5beba21527d8979cd7e4953709385',
      format: 'iframe',
      height: 600,
      width: 160,
      params: {},
    }
    ;(window as any).atOptions = atOptions

    const script = document.createElement('script')
    script.src = 'https://www.highperformanceformat.com/07e5beba21527d8979cd7e4953709385/invoke.js'
    script.async = true

    containerRef.current.appendChild(script)
  }, [])

  return (
    <div className={`w-[160px] h-[600px] bg-slate-50/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100 ${className}`}>
      <div ref={containerRef} id="container-07e5beba21527d8979cd7e4953709385" className="w-[160px] h-[600px]" />
    </div>
  )
}
