'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface CountdownLoaderProps {
  onComplete: () => void
  isDataLoading: boolean
  label?: string
}

const ENGAGEMENT_MESSAGES = [
  "Connecting to PakBizBranches database...",
  "Searching verified listings in Karachi, Lahore & Islamabad...",
  "Confirming active WhatsApp and contact details...",
  "Optimizing layout for mobile and desktop screens...",
  "Almost there! Opening directory listings..."
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
  const [secondsLeft, setSecondsLeft] = useState(5)

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!isDataLoading) {
        onComplete()
      }
      return
    }

    const timer = setTimeout(() => {
      setSecondsLeft(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [secondsLeft, isDataLoading, onComplete])

  // Map 5..1 down to index 0..4
  const messageIndex = Math.max(0, Math.min(4, 5 - secondsLeft))
  const displayMessage = label || ENGAGEMENT_MESSAGES[messageIndex]

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

        {/* Circular Progress Countdown */}
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
            {/* Animated Front Circle */}
            <circle
              cx="64"
              cy="64"
              r="48"
              className="text-[#60a5fa] transition-all duration-1000 ease-linear"
              strokeWidth="6"
              strokeDasharray="301.6"
              strokeDashoffset={301.6 - (301.6 * secondsLeft) / 5}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          {/* Central Countdown Text */}
          <div className="absolute flex flex-col items-center">
            {secondsLeft > 0 ? (
              <span key={secondsLeft} className="text-4xl font-extrabold text-[#0f2b3d] animate-scale-up">
                {secondsLeft}
              </span>
            ) : (
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              {secondsLeft > 0 ? "seconds" : "loading"}
            </span>
          </div>
        </div>

        {/* Engagement Title */}
        <h3 className="text-lg font-bold text-[#0f2b3d] mb-2">
          {secondsLeft > 0 ? "Loading Directory" : "Polishing Details"}
        </h3>

        {/* Rotating Engagement Message */}
        <div className="h-12 flex items-center justify-center">
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs transition-all duration-300">
            {displayMessage}
          </p>
        </div>

        {/* Progress Bar (Visual indicator) */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-400 to-[#60a5fa] h-full rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(5 - secondsLeft) * 20}%` }}
          />
        </div>

        {/* Footer Brand Label */}
        <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase mt-6 flex items-center gap-1.5">
          <span>PakBiz</span>
          <span className="text-[#60a5fa]">Branches</span>
          <span className="text-emerald-500 w-1.5 h-1.5 rounded-full animate-ping" />
        </p>

        {/* CSS Keyframe Injector */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scaleUp {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-up {
            animation: scaleUp 0.3s ease-out forwards;
          }
        `}} />
      </div>

      {/* Right Sidebar Ad - Only one Skyscraper Banner */}
      <div className="flex flex-col gap-6 shrink-0 lg:w-[160px] w-full items-center lg:items-start">
        <LocalSkyscraperAd id="right-ad-1" />
      </div>
    </div>
  )
}
