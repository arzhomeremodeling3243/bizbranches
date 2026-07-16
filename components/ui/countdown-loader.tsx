'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface CountdownLoaderProps {
  onComplete: () => void
  isDataLoading: boolean
  label?: string
}

const INTERACTIVE_MESSAGES = [
  "We are fetching business details...",
  "Combining directory pages...",
  "Verifying active phone and contact info...",
  "We value our customers...",
  "Formatting layout for your device...",
  "Ensuring direct WhatsApp connections...",
  "Almost ready to show details..."
]

// Local Skyscraper Ad component to load multiple unique 160x600 banner ads
function LocalSkyscraperAd({ id, className = '' }: { id: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''

    // Set the options on the window object
    ;(window as any).atOptions = {
      key: '07e5beba21527d8979cd7e4953709385',
      format: 'iframe',
      height: 600,
      width: 160,
      params: {},
    }

    const script = document.createElement('script')
    script.src = 'https://www.highperformanceformat.com/07e5beba21527d8979cd7e4953709385/invoke.js'
    script.async = true

    containerRef.current.appendChild(script)
  }, [id])

  return (
    <div className={`w-[160px] h-[600px] bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100/50 shadow-sm shrink-0 ${className}`}>
      <div ref={containerRef} id={id} className="w-[160px] h-[600px]" />
    </div>
  )
}

export default function CountdownLoader({ onComplete, isDataLoading, label }: CountdownLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0)

  // Rotate message index every 400ms
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % INTERACTIVE_MESSAGES.length)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  // Auto-complete when data is loaded, with a hard timeout cap of 2.1 seconds (2100ms)
  useEffect(() => {
    const maxTimeout = setTimeout(() => {
      onComplete()
    }, 2100)

    if (!isDataLoading) {
      onComplete()
      clearTimeout(maxTimeout)
    }

    return () => clearTimeout(maxTimeout)
  }, [isDataLoading, onComplete])

  const displayMessage = label || INTERACTIVE_MESSAGES[msgIndex]

  return (
    <div className="bg-[#f8fafc] py-12 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 px-4 w-full min-h-screen">
      {/* Left Sidebar Ad - Only one Skyscraper Banner */}
      <div className="flex flex-col gap-6 shrink-0 lg:w-[160px] w-full items-center lg:items-end">
        <LocalSkyscraperAd id="left-ad-1" />
      </div>

      {/* Central Countdown Loader Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,43,61,0.08)] border border-slate-100 max-w-md w-full text-center flex flex-col items-center relative overflow-hidden self-center lg:mt-24">
        {/* Dynamic Glow Background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl" />

        {/* Circular Progress Container */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="64"
              cy="64"
              r="48"
              className="text-slate-100"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Front Circle (Static active styling since numbers are removed) */}
            <circle
              cx="64"
              cy="64"
              r="48"
              className="text-[#60a5fa]"
              strokeWidth="6"
              strokeDasharray="301.6"
              strokeDashoffset="75.4" // partially filled indicator
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          {/* Central Spinner */}
          <div className="absolute flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#60a5fa] animate-spin" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-2">
              Loading
            </span>
          </div>
        </div>

        {/* Engagement Title */}
        <h3 className="text-lg font-bold text-[#0f2b3d] mb-2">
          Polishing Details
        </h3>

        {/* Rotating Engagement Message */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs transition-all duration-300">
            {displayMessage}
          </p>
        </div>

        {/* Progress Bar (Visual indicator) */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-[#60a5fa] h-full rounded-full w-2/3 animate-pulse" />
        </div>

        {/* Footer Brand Label */}
        <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mt-6 flex items-center gap-1.5">
          <span>PakBiz</span>
          <span className="text-[#60a5fa]">Branches</span>
          <span className="text-emerald-500 w-1.5 h-1.5 rounded-full animate-ping" />
        </p>
      </div>

      {/* Right Sidebar Ad - Only one Skyscraper Banner */}
      <div className="flex flex-col gap-6 shrink-0 lg:w-[160px] w-full items-center lg:items-start">
        <LocalSkyscraperAd id="right-ad-1" />
      </div>
    </div>
  )
}
