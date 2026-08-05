// Server Component: Returns null when no ad content is loaded to eliminate blank space.

type BannerVariant = 'inline' | 'sidebar' | 'sticky-mobile'

interface BannerAdLoaderProps {
  variant?: BannerVariant
  className?: string
  children?: React.ReactNode
}

export function BannerAdLoader({ variant = 'inline', className = '', children }: BannerAdLoaderProps) {
  if (children) {
    return <div className={className}>{children}</div>
  }
  return null
}

export function NativeAdLoader({ children }: { children?: React.ReactNode }) {
  if (children) {
    return <div>{children}</div>
  }
  return null
}

export function SkyscraperAdLoader({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  if (children) {
    return <div className={className}>{children}</div>
  }
  return null
}
