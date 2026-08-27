import { Metadata } from 'next'
import { Suspense } from 'react'
import AddBusinessClient from './add-business-client'

export const metadata: Metadata = {
  title: 'Add Business: List Your Pakistan Business Free Now',
  description:
    'Submit your business to Pakistan\'s leading free directory. Reach local customers, add contact info, and get verified instantly on PakBizBranches.',
  keywords: 'list business free Pakistan, add business Pakistan directory, free business listing Pakistan, register business online Pakistan, business directory submission Pakistan',
  alternates: {
    canonical: 'https://www.pakbizbranhces.online/add-business/',
  },
}

export default function AddBusinessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AddBusinessClient />
    </Suspense>
  )
}
