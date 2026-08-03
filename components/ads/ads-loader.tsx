// Server Component: no 'use client' directive needed.
// Reserving fixed min-height containers for ad units prevents Cumulative Layout Shift (CLS).

type BannerVariant = 'inline' | 'sidebar' | 'sticky-mobile'

interface BannerAdLoaderProps {
  variant?: BannerVariant
  className?: string
}

export function BannerAdLoader({ variant = 'inline', className = '' }: BannerAdLoaderProps) {
  if (variant === 'sticky-mobile') {
    return <div className={`min-h-[50px] w-full bg-slate-100/50 rounded-lg border border-slate-200/50 ${className}`} aria-hidden="true" />
  }

  if (variant === 'sidebar') {
    return <div className={`min-h-[250px] w-full bg-slate-100/50 rounded-xl border border-slate-200/50 ${className}`} aria-hidden="true" />
  }

  return (
    <div className={`min-h-[90px] sm:min-h-[120px] w-full bg-slate-100/40 rounded-xl border border-slate-200/40 flex items-center justify-center ${className}`} aria-hidden="true">
      <span className="text-xs text-slate-400 font-medium tracking-wide">Advertisement</span>
    </div>
  )
}

export function NativeAdLoader() {
  return (
    <div className="min-h-[140px] sm:min-h-[180px] w-full bg-slate-100/40 rounded-2xl border border-slate-200/40 p-4 flex flex-col justify-between" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-200/60 animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-1/3 bg-slate-200/60 rounded animate-pulse" />
          <div className="h-2.5 w-2/3 bg-slate-200/40 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-2 bg-slate-200/30 rounded w-1/4 self-end" />
    </div>
  )
}

export function SkyscraperAdLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`min-h-[600px] w-[300px] bg-slate-100/50 rounded-2xl border border-slate-200/50 flex items-center justify-center ${className}`} aria-hidden="true">
      <span className="text-xs text-slate-400 font-medium tracking-wide">Sponsored</span>
    </div>
  )
}
