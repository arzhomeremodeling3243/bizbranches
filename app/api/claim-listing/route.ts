import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// In-memory rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 5 // max 5 submissions per minute per IP

  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter(t => now - t < windowMs)

  if (recent.length >= maxRequests) {
    return false
  }

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return true
}

function sanitizeText(str: string): string {
  if (!str) return ''
  return str
    .replace(/[<>]/g, '') // strip HTML tag brackets to prevent XSS
    .trim()
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const businessSlug = sanitizeText(body.businessSlug)
    const businessName = sanitizeText(body.businessName)
    const claimantName = sanitizeText(body.claimantName)
    const claimantEmail = sanitizeText(body.claimantEmail)
    const claimantPhone = sanitizeText(body.claimantPhone)
    const claimantRole = sanitizeText(body.claimantRole || 'Business Owner')
    const requestType = sanitizeText(body.requestType || 'claim_ownership')
    const requestedUpdates = sanitizeText(body.requestedUpdates || '')
    const verificationProof = sanitizeText(body.verificationProof || '')

    // 2. Strict Input Validation
    if (!businessSlug || !businessName) {
      return NextResponse.json(
        { success: false, error: 'Business identification is required.' },
        { status: 400 }
      )
    }

    if (!claimantName || claimantName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!claimantEmail || !emailRegex.test(claimantEmail)) {
      return NextResponse.json(
        { success: false, error: 'Valid business email address is required.' },
        { status: 400 }
      )
    }

    const cleanPhone = claimantPhone.replace(/[^0-9+]/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Valid contact phone number is required (e.g. 0300 1234567).' },
        { status: 400 }
      )
    }

    const validRequestTypes = ['claim_ownership', 'update_info', 'report_incorrect', 'request_removal']
    if (!validRequestTypes.includes(requestType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request type selected.' },
        { status: 400 }
      )
    }

    // 3. Generate Official Ticket ID
    const ticketId = `PKB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    const claimRecord = {
      ticketId,
      businessSlug,
      businessName,
      claimantName,
      claimantEmail,
      claimantPhone: cleanPhone,
      claimantRole,
      requestType,
      requestedUpdates,
      verificationProof,
      // CRITICAL: New claims are ALWAYS pending editorial verification
      status: 'pending_verification',
      isVerified: false,
      submittedAt: new Date().toISOString(),
      ipAddress: ip,
    }

    // 4. Persist to local claims ledger
    try {
      const claimsPath = path.join(process.cwd(), 'lib', 'listing-claims.json')
      let existingClaims: any[] = []
      if (fs.existsSync(claimsPath)) {
        existingClaims = JSON.parse(fs.readFileSync(claimsPath, 'utf8'))
      }
      existingClaims.unshift(claimRecord)
      fs.writeFileSync(claimsPath, JSON.stringify(existingClaims, null, 2))
    } catch (fsErr) {
      console.error('Error persisting claim to local storage:', fsErr)
    }

    // 5. Attempt Firestore write if connection available
    try {
      if (db) {
        await addDoc(collection(db, 'claim_requests'), {
          ...claimRecord,
          createdAt: serverTimestamp(),
        })
      }
    } catch (dbErr) {
      console.warn('Firestore write skipped or timed out, saved locally:', dbErr)
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Your verification request has been logged under Ticket #${ticketId}. Our compliance desk will verify the submitted evidence and contact you within 24–48 hours. No modifications are published without manual editorial approval.`,
    })
  } catch (err: any) {
    console.error('Error processing business claim:', err)
    return NextResponse.json(
      { success: false, error: 'An internal error occurred while processing your request. Please try again or contact support.' },
      { status: 500 }
    )
  }
}
