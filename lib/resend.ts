import { Resend } from 'resend'

// Dynamically get active Resend client instance
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY || 're_placeholder_key_for_build'
  return new Resend(apiKey)
}

export const resend = getResendClient()
