'use client'

import { useEffect } from 'react'

interface CountdownLoaderProps {
  onComplete: () => void
  isDataLoading: boolean
  label?: string
}

export default function CountdownLoader({ onComplete, isDataLoading }: CountdownLoaderProps) {
  useEffect(() => {
    if (!isDataLoading) {
      onComplete()
    }
  }, [isDataLoading, onComplete])

  return (
    <div className="bg-[#f8fafc] w-full min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Hero Skeleton matching exact page bounds */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 rounded-2xl bg-slate-200 shrink-0" />
          <div className="flex-1 w-full space-y-3">
            <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="flex gap-3 pt-4">
              <div className="h-11 bg-slate-200 rounded-xl w-32" />
              <div className="h-11 bg-slate-200 rounded-xl w-32" />
            </div>
          </div>
        </div>

        {/* Content & Sidebar Skeleton matching 2-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
