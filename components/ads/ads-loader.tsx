'use client'

type BannerVariant = 'inline' | 'sidebar' | 'sticky-mobile'

interface BannerAdLoaderProps {
  variant?: BannerVariant
  className?: string
}

export function BannerAdLoader({ variant = 'inline', className }: BannerAdLoaderProps) {
  return null
}

export function NativeAdLoader() {
  return null
}

export function SkyscraperAdLoader({ className }: { className?: string }) {
  return null
}
