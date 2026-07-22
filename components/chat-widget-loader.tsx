'use client'

// Client wrapper — ssr:false is only valid inside a Client Component.
// layout.tsx (Server Component) imports this file instead of ChatWidget directly.
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), {
  ssr: false,
  loading: () => null,
})

export default function ChatWidgetLoader() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    const handleInteraction = () => {
      setShouldRender(true)
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('pointerdown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }

    timer = setTimeout(() => {
      setShouldRender(true)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('pointerdown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }, 4000)

    window.addEventListener('scroll', handleInteraction, { passive: true, once: true })
    window.addEventListener('pointerdown', handleInteraction, { passive: true, once: true })
    window.addEventListener('touchstart', handleInteraction, { passive: true, once: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('pointerdown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  if (!shouldRender) return null

  return <ChatWidget />
}
