import { Resend } from 'resend'

// Provide a safe placeholder key during build time so Next.js static collection never throws Missing API key
const apiKey = process.env.RESEND_API_KEY || 're_placeholder_key_for_build'

export const resend = new Resend(apiKey)
