'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Edit2, Trash2, Eye, Users, Building2, Mail, Phone, Shield, LogOut, CheckCircle, XCircle, AlertCircle, Star, Settings, DollarSign, Calendar, TrendingUp, Wallet, Coins, ArrowUpRight, MessageSquare, MessageCircle, X, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdminLogin from '@/components/admin-login'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { MAIN_PAGES } from '@/lib/pages-config'

interface Business {
  id: string
  businessName: string
  contactPerson?: string
  email?: string
  phone: string
  whatsapp?: string
  city: string
  address: string
  category: string
  description: string
  websiteUrl?: string
  facebookPage?: string
  googleBusiness?: string
  youtubeChannel?: string
  logoUrl?: string
  slug?: string
  createdAt: any
  updatedAt?: any
  approvedAt?: any
  status: string
  isFeatured?: boolean
  businessId?: string
  paymentScreenshotUrl?: string
  paymentSubmittedAt?: any
  paymentPlan?: 'standard' | 'express' | 'authority' | 'priority'
  paymentPlanPrice?: number
  customerMessage?: string
}

interface EarningRecord {
  id: string
  businessId?: string
  businessName: string
  city?: string
  category?: string
  paymentPlan?: string
  amount: number
  approvedAt: any
  paymentScreenshotUrl?: string
}

interface ContactForm {
  id: string
  name: string
  email: string
  subject: string
  message: string
  timestamp: any
}

const PAST_ALL_TIME_EARNINGS = 310

function getBusinessPrice(b: Business): number {
  if (typeof b.paymentPlanPrice === 'number' && b.paymentPlanPrice > 0) {
    return b.paymentPlanPrice
  }
  if (b.paymentPlan === 'express') return 20
  if (b.paymentPlan === 'standard') return 10
  if (b.paymentPlan === 'authority' || b.paymentPlan === 'priority') return 50
  return 10
}

function parseTimestampDate(ts: any): Date | null {
  if (!ts) return null
  if (ts.toDate && typeof ts.toDate === 'function') return ts.toDate()
  if (ts.seconds) return new Date(ts.seconds * 1000)
  if (typeof ts === 'string') {
    const d = new Date(ts)
    if (!isNaN(d.getTime())) return d
  }
  return null
}

export default function AdminPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [contacts, setContacts] = useState<ContactForm[]>([])
  const [earningRecords, setEarningRecords] = useState<EarningRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Business>>({})
  const [activeTab, setActiveTab] = useState<'businesses' | 'contacts' | 'pages' | 'earnings'>('businesses')
  const [earningsFilter, setEarningsFilter] = useState<'all' | 'lastWeek'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [messageBiz, setMessageBiz] = useState<Business | null>(null)
  const [messageNoteText, setMessageNoteText] = useState<string>('')
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false)
  const [noteSavedSuccess, setNoteSavedSuccess] = useState<boolean>(false)

  const handleSaveCustomerNote = async () => {
    if (!messageBiz) return
    setIsSavingNote(true)
    try {
      const bizRef = doc(db, 'businesses', messageBiz.id)
      const updatedMsg = messageNoteText.trim()
      await updateDoc(bizRef, {
        customerMessage: updatedMsg
      })
      setNoteSavedSuccess(true)
      setTimeout(() => setNoteSavedSuccess(false), 3000)
      setBusinesses(prev => prev.map(b => b.id === messageBiz.id ? { ...b, customerMessage: updatedMsg } : b))
      setMessageBiz(prev => prev ? { ...prev, customerMessage: updatedMsg } : null)
    } catch (err) {
      console.error('Error saving customer note:', err)
    } finally {
      setIsSavingNote(false)
    }
  }

  // Web Audio chime synthesis
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15); // C6
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      
      osc1.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.error('Failed to play audio chime:', e);
    }
  }

  useEffect(() => {
    // Check localStorage authentication
    const isAuth = localStorage.getItem('admin_authenticated') === 'true'
    const adminEmail = localStorage.getItem('admin_email')
    
    if (isAuth && adminEmail) {
      setIsAuthenticated(true)
      setCurrentUser({ email: adminEmail })
      
      // Set up real-time listener for businesses
      setLoading(true)
      const businessesQuery = query(
        collection(db, 'businesses'),
        orderBy('createdAt', 'desc')
      )
      
      let isFirstEmission = true
      const unsubscribe = onSnapshot(businessesQuery, (snapshot) => {
        const businessesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Business))
        
        setBusinesses(businessesData)
        setLoading(false)

        // Play chime on new pending listings or screenshot uploads
        if (!isFirstEmission) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              playChime()
            }
          })
        }
        isFirstEmission = false
      }, (error) => {
        console.error('Real-time listener failed:', error)
        setLoading(false)
      })

      // Set up real-time listener for earnings_records
      const earningsQuery = query(
        collection(db, 'earnings_records'),
        orderBy('approvedAt', 'desc')
      )
      const unsubscribeEarnings = onSnapshot(earningsQuery, (snapshot) => {
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as EarningRecord))
        setEarningRecords(records)
      }, (error) => {
        console.error('Earnings records listener failed:', error)
      })

      fetchContacts()

      return () => {
        unsubscribe()
        unsubscribeEarnings()
      }
    } else {
      setIsAuthenticated(false)
      setCurrentUser(null)
    }
  }, [isAuthenticated])

  async function fetchContacts() {
    try {
      const contactsQuery = query(
        collection(db, 'contactForms'),
        orderBy('timestamp', 'desc')
      )
      const contactsSnapshot = await getDocs(contactsQuery)
      const contactsData = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContactForm))
      setContacts(contactsData)
    } catch (error) {
      console.log('Contact forms collection not found yet')
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  async function handleLogout() {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_email')
    setIsAuthenticated(false)
    setCurrentUser(null)
    router.push('/')
  }

  async function handleDeleteBusiness(businessId: string) {
    if (!confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      return
    }

    try {
      const business = businesses.find(b => b.id === businessId)
      await deleteDoc(doc(db, 'businesses', businessId))
      
      if (business?.slug) {
        fetch('/api/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [`${window.location.origin}/${business.slug}/`] })
        }).catch(() => {})
      }

      setBusinesses(prev => prev.filter(b => b.id !== businessId))
      setDeleteConfirm(null)
      alert('Business deleted successfully')
    } catch (error) {
      console.error('Error deleting business:', error)
      alert('Failed to delete business')
    }
  }

  function handleEditBusiness(business: Business) {
    setSelectedBusiness(business)
    setEditForm(business)
    setIsEditing(true)
  }

  async function handleUpdateBusiness(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedBusiness) return

    try {
      const businessRef = doc(db, 'businesses', selectedBusiness.id)
      await updateDoc(businessRef, editForm)
      
      if (selectedBusiness.slug) {
        fetch('/api/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [`${window.location.origin}/${selectedBusiness.slug}/`] })
        }).catch(() => {})
      }

      setBusinesses(prev => prev.map(b => 
        b.id === selectedBusiness.id ? { ...b, ...editForm } : b
      ))
      
      setIsEditing(false)
      setSelectedBusiness(null)
      setEditForm({})
      alert('Business updated successfully')
    } catch (error) {
      console.error('Error updating business:', error)
      alert('Failed to update business')
    }
  }

  async function handleSetActive(businessId: string) {
    try {
      const business = businesses.find(b => b.id === businessId)
      const businessRef = doc(db, 'businesses', businessId)
      const nowIso = new Date().toISOString()
      
      await updateDoc(businessRef, { 
        status: 'approved',
        approvedAt: nowIso
      })

      // Save permanent record to earnings_records collection
      if (business) {
        const earningRef = doc(collection(db, 'earnings_records'))
        await setDoc(earningRef, {
          businessId: business.businessId || business.id,
          businessName: business.businessName,
          city: business.city,
          category: business.category,
          paymentPlan: business.paymentPlan || 'standard',
          amount: getBusinessPrice(business),
          approvedAt: nowIso,
          paymentScreenshotUrl: business.paymentScreenshotUrl || ''
        })
      }
      
      if (business?.slug) {
        fetch('/api/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: [
            `${window.location.origin}/${business.slug}/`,
            `${window.location.origin}/sitemaps/businesses.xml`,
          ] })
        }).catch(() => {})
      }

      setBusinesses(prev => prev.map(b =>
        b.id === businessId ? { ...b, status: 'approved', approvedAt: nowIso } : b
      ))
    } catch (error) {
      console.error('Error activating business:', error)
      alert('Failed to activate business')
    }
  }

  async function handleToggleFeatured(businessId: string, currentStatus: boolean) {
    try {
      const businessRef = doc(db, 'businesses', businessId)
      await updateDoc(businessRef, {
        isFeatured: !currentStatus
      })
      
      setBusinesses(prev => prev.map(b => 
        b.id === businessId ? { ...b, isFeatured: !currentStatus } : b
      ))
      
      alert(`Business ${!currentStatus ? 'marked as featured' : 'removed from featured'}`)
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Failed to toggle featured status')
    }
  }

  const filteredBusinesses = businesses.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/seed"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                >
                  Seed Sample Data
                </Link>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  View Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Real-time Payment Screenshot Alerts */}
          {businesses.filter(b => b.paymentScreenshotUrl && b.status !== 'approved').length > 0 && (
            <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm animate-pulseFast">
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
                  Pending Payment Activations ({businesses.filter(b => b.paymentScreenshotUrl && b.status !== 'approved').length})
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {businesses.filter(b => b.paymentScreenshotUrl && b.status !== 'approved').map((biz) => (
                  <div key={biz.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border border-amber-100 rounded-xl shadow-xs hover:border-amber-200 transition-all">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{biz.businessName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Category: {biz.category} | City: {biz.city} | Plan: <span className="font-bold text-blue-600 uppercase tracking-wider">{biz.paymentPlan || 'standard'}</span> (RS {biz.paymentPlanPrice || 10})
                      </div>
                      {biz.businessId && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-100 text-slate-600 rounded">
                          ID: {biz.businessId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                      <a
                        href={biz.paymentScreenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Receipt
                      </a>
                      <button
                        onClick={() => handleSetActive(biz.id)}
                        className="inline-flex items-center gap-1 text-xs text-white hover:bg-green-700 bg-green-600 font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve & Publish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contact Forms</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {businesses.filter(b => b.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cities Covered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {[...new Set(businesses.map(b => b.city))].length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'businesses'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Businesses ({businesses.length})
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'contacts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Contact Forms ({contacts.length})
                </button>
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === 'pages'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Page Settings
                </button>
                <button
                  onClick={() => setActiveTab('earnings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                    activeTab === 'earnings'
                      ? 'border-emerald-500 text-emerald-600 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Coins className="w-4 h-4 text-emerald-600" />
                  Earnings
                </button>
              </nav>
            </div>
          </div>

          {/* Businesses Tab */}
          {activeTab === 'businesses' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search businesses..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Businesses Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading businesses...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBusinesses.map((business) => (
                        <tr key={business.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{business.businessName}</div>
                              <div className="text-xs text-gray-500">{business.category}</div>
                              {business.businessId && (
                                <div className="mt-1 flex flex-wrap gap-2">
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded">
                                    ID: {business.businessId}
                                  </span>
                                  {business.paymentPlan && (
                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                                      business.paymentPlan === 'express' 
                                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                        : 'bg-slate-50 text-slate-700 border-slate-100'
                                    }`}>
                                      Plan: {business.paymentPlan} (RS {business.paymentPlanPrice})
                                    </span>
                                  )}
                                </div>
                              )}
                              {business.customerMessage ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMessageBiz(business)
                                    setMessageNoteText(business.customerMessage || '')
                                  }}
                                  className="mt-1.5 p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium max-w-xs text-left transition-colors cursor-pointer flex items-start gap-1.5"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span><strong className="text-amber-800">Customer Note:</strong> {business.customerMessage}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMessageBiz(business)
                                    setMessageNoteText('')
                                  }}
                                  className="mt-1 flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 font-medium cursor-pointer"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>+ Add Message Note</span>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{business.phone}</div>
                            <div className="text-sm text-gray-500">{business.email || 'No email'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{business.city}</td>
                          <td className="px-6 py-4">
                            {business.paymentScreenshotUrl ? (
                              <a
                                href={business.paymentScreenshotUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                View Receipt
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No receipt</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {business.status === 'approved' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                  {business.status || 'pending'}
                                </span>
                                <button
                                  onClick={() => handleSetActive(business.id)}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                                  title="Approve and activate this business"
                                >
                                  Approve
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleFeatured(business.id, business.isFeatured || false)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                business.isFeatured
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              title={business.isFeatured ? 'Click to remove from featured' : 'Click to mark as featured'}
                            >
                              <Star className="w-3.5 h-3.5" />
                              {business.isFeatured ? 'Featured' : 'Not Featured'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setMessageBiz(business)
                                  setMessageNoteText(business.customerMessage || '')
                                }}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer relative ${
                                  business.customerMessage
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 shadow-xs'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                                title={business.customerMessage ? `Message: ${business.customerMessage}` : 'View / Send Customer Message'}
                              >
                                <MessageSquare className="w-4 h-4" />
                                {business.customerMessage && (
                                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                                )}
                              </button>
                              <button
                                onClick={() => handleEditBusiness(business)}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Business"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(business.id)}
                                className="text-red-600 hover:text-red-900 cursor-pointer p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Business"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/${business.slug || business.id}/`}
                                target="_blank"
                                className="text-gray-600 hover:text-gray-900 cursor-pointer p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Live Page"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No contact forms submitted yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{contact.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{contact.subject}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {contact.timestamp?.toDate()?.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Management</h3>
                <p className="text-sm text-gray-600">Configure and manage main website pages</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {MAIN_PAGES.map((page) => (
                  <div key={page.slug} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{page.title}</h4>
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {page.slug || '/'}
                          </span>
                          {page.requiresAuth && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Protected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Priority: <strong>#{page.priority}</strong></span>
                          <span>Status: <strong className={page.enabled ? 'text-green-600' : 'text-red-600'}>
                            {page.enabled ? 'Enabled' : 'Disabled'}
                          </strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-blue-50 border-t border-gray-200">
                <h4 className="font-semibold text-blue-900 mb-2">About Page Settings</h4>
                <p className="text-sm text-blue-800 mb-3">
                  This system maintains 10 core pages to optimize performance. Extra pages are controlled in <code className="bg-white px-2 py-1 rounded font-mono">/lib/pages-config.ts</code>
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Each page can be enabled or disabled</li>
                  <li>Protected pages require authentication</li>
                  <li>Modify pages-config.ts to change settings</li>
                  <li>robots.txt ensures crawlers only index active pages</li>
                </ul>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {/* Earnings Overview Hero Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
                <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-800/60">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-1">
                      <Coins className="w-5 h-5" />
                      Revenue & Earnings Dashboard
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white">Platform Earnings Overview</h2>
                    <p className="text-emerald-200/80 text-sm mt-1">
                      When you verify and approve business plan payments (10 PKR, 20 PKR, 50 PKR), earnings update automatically.
                    </p>
                  </div>
                </div>

                {/* Two Option Cards: All-Time Earnings & Last Week (7 Days) Earnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Option 1: All Time Earnings */}
                  <div
                    onClick={() => setEarningsFilter('all')}
                    className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all transform hover:-translate-y-0.5 ${
                      earningsFilter === 'all'
                        ? 'bg-white/10 border-emerald-400 shadow-lg ring-2 ring-emerald-400/30'
                        : 'bg-white/5 border-emerald-800/50 hover:bg-white/10 hover:border-emerald-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-700/50">
                            Option 1
                          </span>
                          <span className="text-sm font-semibold text-emerald-200">All-Time Revenue</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
                          RS {PAST_ALL_TIME_EARNINGS + earningRecords.reduce((acc, r) => acc + (r.amount || 10), 0)}
                        </h3>
                        <p className="text-xs text-emerald-200/80 mt-2 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          Permanent total • {earningRecords.length} Permanent Approval Records
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl">
                        <Wallet className="w-7 h-7 text-emerald-300" />
                      </div>
                    </div>
                    {earningsFilter === 'all' && (
                      <div className="mt-4 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-xs text-emerald-300 font-bold">
                        <span>● Selected View Mode</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Option 2: Last Week Earnings */}
                  <div
                    onClick={() => setEarningsFilter('lastWeek')}
                    className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all transform hover:-translate-y-0.5 ${
                      earningsFilter === 'lastWeek'
                        ? 'bg-white/10 border-blue-400 shadow-lg ring-2 ring-blue-400/30'
                        : 'bg-white/5 border-emerald-800/50 hover:bg-white/10 hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-700/50">
                            Option 2
                          </span>
                          <span className="text-sm font-semibold text-blue-200">Last 7 Days (Last Week)</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
                          RS {earningRecords.filter(r => {
                            const d = parseTimestampDate(r.approvedAt)
                            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            return d && d.getTime() >= sevenDaysAgo.getTime()
                          }).reduce((acc, r) => acc + (r.amount || 10), 0)}
                        </h3>
                        <p className="text-xs text-blue-200/80 mt-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          Rolling 7-day total • {earningRecords.filter(r => {
                            const d = parseTimestampDate(r.approvedAt)
                            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            return d && d.getTime() >= sevenDaysAgo.getTime()
                          }).length} Recent Approvals
                        </p>
                      </div>
                      <div className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                        <TrendingUp className="w-7 h-7 text-blue-300" />
                      </div>
                    </div>
                    {earningsFilter === 'lastWeek' && (
                      <div className="mt-4 pt-3 border-t border-blue-700/50 flex items-center justify-between text-xs text-blue-300 font-bold">
                        <span>● Selected View Mode</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown List Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {earningsFilter === 'all' ? 'All-Time Approved Earnings List' : 'Last 7 Days (Last Week) Earnings List'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      View all approved business listings with Business IDs, plan prices (RS 10/20/50), dates, and payment receipt screenshots.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setEarningsFilter('all')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        earningsFilter === 'all'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All Time
                    </button>
                    <button
                      onClick={() => setEarningsFilter('lastWeek')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        earningsFilter === 'lastWeek'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Last 7 Days
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Business ID & Name</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">City & Category</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Selected Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Earned Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Approval Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receipt Screenshot</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {earningRecords
                        .filter(r => {
                          if (earningsFilter === 'lastWeek') {
                            const d = parseTimestampDate(r.approvedAt)
                            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            return d && d.getTime() >= sevenDaysAgo.getTime()
                          }
                          return true
                        })
                        .map(r => {
                          const appDate = parseTimestampDate(r.approvedAt)
                          const price = r.amount || 10
                          return (
                            <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-gray-900">{r.businessName}</div>
                                {r.businessId ? (
                                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded">
                                    ID: {r.businessId}
                                  </span>
                                ) : (
                                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-50 rounded">
                                    Record ID: {r.id.substring(0, 8)}...
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-600">
                                <div className="font-semibold text-gray-800">{r.city || 'Pakistan'}</div>
                                <div className="text-gray-500">{r.category || 'General'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-800 border border-slate-200">
                                  {r.paymentPlan || 'Standard'} (RS {price})
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-base font-extrabold text-emerald-600">
                                  RS {price}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-600">
                                {appDate ? appDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Saved Earning'}
                              </td>
                              <td className="px-6 py-4">
                                {r.paymentScreenshotUrl ? (
                                  <a
                                    href={r.paymentScreenshotUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                                    View Receipt
                                  </a>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">No receipt file</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  Approved & Saved
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      {earningRecords.filter(r => {
                        if (earningsFilter === 'lastWeek') {
                          const d = parseTimestampDate(r.approvedAt)
                          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          return d && d.getTime() >= sevenDaysAgo.getTime()
                        }
                        return true
                      }).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No earning records found for this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Edit Modal */}
        {isEditing && selectedBusiness && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Edit Business</h2>
              </div>
              
              <form onSubmit={handleUpdateBusiness} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={editForm.businessName || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={editForm.contactPerson || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setSelectedBusiness(null)
                      setEditForm({})
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Business
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this business? This action cannot be undone and will remove the business from both the frontend and Firebase database.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBusiness(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Business
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Message Box Modal */}
        {messageBiz && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100">
              {/* Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base leading-tight">{messageBiz.businessName}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ID: {messageBiz.businessId || messageBiz.id.substring(0, 8)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMessageBiz(null)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Contact Details Grid */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Contact Person</span>
                    <span className="font-bold text-slate-800">{messageBiz.contactPerson || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone Number</span>
                    <span className="font-bold text-slate-800">{messageBiz.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">City</span>
                    <span className="font-bold text-slate-800">{messageBiz.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email Address</span>
                    <span className="font-bold text-slate-800 truncate block">{messageBiz.email || 'N/A'}</span>
                  </div>
                </div>

                {/* Message Input Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span>Customer Message Note</span>
                  </label>
                  <textarea
                    value={messageNoteText}
                    onChange={(e) => setMessageNoteText(e.target.value)}
                    rows={4}
                    placeholder="Type or view customer message..."
                    className="w-full p-3.5 border-2 border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all leading-relaxed text-slate-800"
                  />
                  {noteSavedSuccess && (
                    <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Message note updated successfully in database!
                    </p>
                  )}
                </div>

                {/* Direct Action Connect Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  {messageBiz.phone && (
                    <a
                      href={`https://wa.me/${messageBiz.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Chat</span>
                    </a>
                  )}

                  {messageBiz.phone && (
                    <a
                      href={`tel:${messageBiz.phone}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </a>
                  )}

                  {messageBiz.email && (
                    <a
                      href={`mailto:${messageBiz.email}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setMessageBiz(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomerNote}
                    disabled={isSavingNote}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNote ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

