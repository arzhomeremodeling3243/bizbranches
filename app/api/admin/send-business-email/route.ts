import { NextRequest, NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FROM_EMAIL = process.env.FROM_EMAIL || 'admin@pakbizbranhces.online'

function escapeHtml(str: string) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildHtml(message: string) {
  const formattedMessage = escapeHtml(message).replace(/\n/g, '<br/>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>About Your Business Listing</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;line-height:1.6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,0.06);border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#0f2b3d;padding:24px 32px;text-align:left;">
              <h2 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">PakBizBranches</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#1e293b;font-weight:500;">Dear Sir/Madam,</p>
              
              <div style="font-size:15px;color:#334155;margin-bottom:24px;line-height:1.6;">
                ${formattedMessage}
              </div>

              <br/>

              <div style="border-top:1px solid #e2e8f0;padding-top:20px;font-size:14px;color:#475569;">
                <p style="margin:0 0 4px 0;font-weight:bold;color:#1e293b;">Kind regards,</p>
                <p style="margin:0 0 4px 0;font-weight:bold;color:#0f2b3d;">PakBizBranches Team</p>
                <p style="margin:0 0 4px 0;"><a href="mailto:admin@pakbizbranhces.online" style="color:#2563eb;text-decoration:none;">admin@pakbizbranhces.online</a></p>
                <p style="margin:0 0 0 0;"><a href="https://www.pakbizbranhces.online" style="color:#2563eb;text-decoration:none;">www.pakbizbranhces.online</a></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildText(message: string) {
  return `Dear Sir/Madam,

${message}

Kind regards,

PakBizBranches Team
admin@pakbizbranhces.online
www.pakbizbranhces.online`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessId, message, recipientEmail: customRecipient, businessName: customBizName } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ ok: false, error: 'Message body cannot be empty' }, { status: 400 })
    }

    let recipient = customRecipient
    let businessName = customBizName

    // If recipient is missing, attempt to fetch from Firestore
    if (!recipient && businessId) {
      try {
        const bizRef = doc(db, 'businesses', businessId)
        const snap = await getDoc(bizRef)
        if (snap.exists()) {
          const data = snap.data()
          recipient = data.email
          businessName = data.businessName || businessName
        }
      } catch (err) {
        console.error('Firestore fetch business error:', err)
      }
    }

    if (!recipient || !recipient.trim()) {
      return NextResponse.json({ ok: false, error: 'Business has no valid email address' }, { status: 400 })
    }

    const cleanRecipient = recipient.trim()
    const trimmedMessage = message.trim()

    let resendMessageId = null
    let emailStatus = 'success'
    let errorMessage = null

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === 're_placeholder_key_for_build' || apiKey.startsWith('re_placeholder')) {
      return NextResponse.json({
        ok: false,
        error: 'Resend API key is not configured. Please add a valid RESEND_API_KEY to your .env.local file.'
      }, { status: 500 })
    }

    try {
      const fromSender = FROM_EMAIL.includes('<') ? FROM_EMAIL : `PakBizBranches <${FROM_EMAIL}>`
      const sendRes = await resend.emails.send({
        from: fromSender,
        to: [cleanRecipient],
        subject: 'About Your Business Listing',
        html: buildHtml(trimmedMessage),
        text: buildText(trimmedMessage),
      })

      if (sendRes.error) {
        emailStatus = 'error'
        const errMsg = sendRes.error.message || ''
        if (errMsg.toLowerCase().includes('api key') || sendRes.error.name === 'invalid_api_key') {
          errorMessage = 'Your Resend API key (RESEND_API_KEY in .env.local) is invalid or expired. Please update it with a valid key from resend.com.'
        } else {
          errorMessage = errMsg
        }
      } else {
        resendMessageId = sendRes.data?.id || null
      }
    } catch (err: any) {
      emailStatus = 'error'
      const errMsg = err?.message || String(err)
      if (errMsg.toLowerCase().includes('api key')) {
        errorMessage = 'Your Resend API key (RESEND_API_KEY in .env.local) is invalid or expired. Please update it with a valid key from resend.com.'
      } else {
        errorMessage = errMsg
      }
    }

    // Always log sending attempt into Firestore email_logs collection
    try {
      await addDoc(collection(db, 'email_logs'), {
        businessId: businessId || 'N/A',
        businessName: businessName || 'Unknown Business',
        recipient: cleanRecipient,
        message: trimmedMessage,
        sentAt: serverTimestamp(),
        status: emailStatus,
        error: errorMessage || null,
        resendId: resendMessageId || null,
      })
    } catch (logErr) {
      console.error('Failed to save email_logs record in Firestore:', logErr)
    }

    if (emailStatus === 'error') {
      return NextResponse.json({ ok: false, error: errorMessage || 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      messageId: resendMessageId,
      recipient: cleanRecipient,
    })
  } catch (err: any) {
    console.error('Admin send-business-email API error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
