'use client'

import { useState, useEffect } from 'react'
import { X, Send, Loader2, CheckCircle2, AlertCircle, Mail, Building2 } from 'lucide-react'

interface BusinessMessageModalProps {
  isOpen: boolean
  onClose: () => void
  business: {
    id: string
    businessName: string
    email?: string
    contactPerson?: string
  } | null
  onSuccess?: () => void
}

export default function BusinessMessageModal({
  isOpen,
  onClose,
  business,
  onSuccess,
}: BusinessMessageModalProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Reset state whenever modal opens or business recipient changes
  useEffect(() => {
    if (isOpen) {
      setMessage('')
      setToast(null)
      setIsSending(false)
    }
  }, [isOpen, business?.id])

  if (!isOpen || !business) return null

  const handleCloseModal = () => {
    setMessage('')
    setToast(null)
    setIsSending(false)
    onClose()
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setToast({ type: 'error', message: 'Please enter a message body before sending.' })
      return
    }

    if (!business.email || !business.email.trim()) {
      setToast({ type: 'error', message: 'This business does not have a valid email address.' })
      return
    }

    setIsSending(true)
    setToast(null)

    try {
      const res = await fetch('/api/admin/send-business-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.businessName,
          recipientEmail: business.email,
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send email.')
      }

      setToast({ type: 'success', message: `Email successfully sent to ${business.email}!` })
      setMessage('')
      if (onSuccess) onSuccess()

      setTimeout(() => {
        setToast(null)
        onClose()
      }, 2000)
    } catch (err: any) {
      console.error('Error sending business email:', err)
      setToast({ type: 'error', message: err?.message || 'Error sending email. Please try again.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0f2b3d] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base leading-tight truncate">{business.businessName}</h3>
              <p className="text-xs text-slate-300 font-medium">Send Official Email</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isSending}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSend} className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* Toast Banner */}
          {toast && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          )}

          {/* Recipient Email (Read-only) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Recipient Email (Read-only)
            </label>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{business.email || 'No email address available'}</span>
            </div>
          </div>

          {/* Predefined Subject (Read-only Preview) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Subject Line (Predefined)
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-medium">
              About Your Business Listing
            </div>
          </div>

          {/* Predefined Greeting */}
          <div className="text-xs text-slate-500 font-bold tracking-wide pt-1">
            Dear Sir/Madam,
          </div>

          {/* Editable Message Body Area */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Message Body <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                {message.length} / 1000 chars
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
              rows={4}
              disabled={isSending}
              placeholder="e.g. Your business listing has been verified and is now live on PakBizBranches."
              className="w-full p-3.5 border-2 border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all leading-relaxed text-slate-800 disabled:bg-slate-50"
              required
            />
          </div>

          {/* Predefined Footer Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 space-y-1 font-medium">
            <p className="font-bold text-slate-700">Kind regards,</p>
            <p className="font-bold text-blue-700">PakBizBranches Team</p>
            <p className="text-slate-500">admin@pakbizbranhces.online</p>
            <p className="text-slate-500">www.pakbizbranhces.online</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSending}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !message.trim() || !business.email}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
