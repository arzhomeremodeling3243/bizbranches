'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Loader2, AlertCircle, Upload, X, CheckCircle2, Eye, MessageCircle, 
  Zap, Copy, Check, Sparkles, Smartphone, Landmark, HelpCircle, 
  AlertTriangle, User, LogOut, ArrowRight, ArrowLeft, ShieldCheck, 
  ExternalLink, Clock, PlusCircle, Building2, MapPin, Phone, Mail, 
  Globe, EyeOff, Lock
} from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CitySearchDropdown from '@/components/ui/city-search-dropdown'
import { CATEGORIES } from '@/lib/data'
import { db, auth } from '@/lib/firebase'
import { 
  collection, addDoc, query, where, getDocs, serverTimestamp, 
  limit, doc, updateDoc, onSnapshot, orderBy 
} from 'firebase/firestore'
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  updateProfile, signOut, onAuthStateChanged, User as FirebaseUser 
} from 'firebase/auth'
import { sendBusinessSubmissionEmail } from '@/lib/email-service'
import { normalizeCategoryForStorage } from '@/lib/category-mappings'

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error'

const MAX_LOGO_MB = 2.5
const MAX_DESCRIPTION_CHARS = 2000

// Sub-categories for each main category
const SUB_CATEGORIES: Record<string, string[]> = {
  'restaurants': ['Fast Food', 'Fine Dining', 'Cafe', 'Bakery', 'Catering', 'Food Truck'],
  'real-estate': ['Residential', 'Commercial', 'Industrial', 'Land', 'Rental', 'Property Management'],
  'technology': ['Software Development', 'Web Design', 'IT Support', 'Digital Marketing', 'Mobile Apps', 'Cloud Services'],
  'healthcare': ['Hospitals', 'Clinics', 'Pharmacies', 'Dental', 'Laboratories', 'Medical Equipment'],
  'education': ['Schools', 'Colleges', 'Universities', 'Tuition Centers', 'Training Institutes', 'Online Learning'],
  'retail': ['Supermarkets', 'Clothing', 'Electronics', 'Jewelry', 'Books', 'Department Stores'],
  'construction': ['Building Contractors', 'Architecture', 'Interior Design', 'Building Materials', 'Civil Engineering', 'Renovation'],
  'automotive': ['Car Dealers', 'Mechanics', 'Parts', 'Accessories', 'Service Centers', 'Car Rental'],
  'finance': ['Banks', 'Insurance', 'Investment', 'Accounting', 'Loans', 'Financial Advisors'],
  'travel': ['Airlines', 'Hotels', 'Tour Operators', 'Transport', 'Travel Agencies', 'Car Rental'],
  'beauty': ['Salons', 'Spas', 'Gyms', 'Cosmetics', 'Beauty Products', 'Wellness Centers'],
  'logistics': ['Courier', 'Cargo', 'Warehousing', 'Transport', 'Supply Chain', 'Freight Forwarding'],
}

interface UserBusiness {
  id: string
  businessId?: string
  businessName: string
  slug: string
  city: string
  category: string
  address: string
  phone: string
  whatsapp?: string
  email?: string
  websiteUrl?: string
  logoUrl?: string
  status: string
  createdAt: any
  isFeatured?: boolean
  paymentPlan?: string
  paymentScreenshotUrl?: string
}

export default function AddBussinessClient() {
  const router = useRouter()

  // ─── AUTH STATES ──────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  
  // Auth Form Fields
  const [authFullName, setAuthFullName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')
  const [showAuthPassword, setShowAuthPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState(false)

  // ─── VIEW NAVIGATION TABS ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard'>('form')

  // ─── USER DASHBOARD STATES ───────────────────────────────────────────────
  const [userBusinesses, setUserBusinesses] = useState<UserBusiness[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // ─── 5-STEP FORM WIZARD STATES ───────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<number>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    subcategory: '',
    branchCode: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    address: '',
    city: '',
    logoUrl: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [descriptionCharCount, setDescriptionCharCount] = useState(0)
  const [existingBusinesses, setExistingBusinesses] = useState<string[]>([])
  const [submittedSlug, setSubmittedSlug] = useState<string | null>(null)

  // Payment portal & submission states
  const [submittedBusinessId, setSubmittedBusinessId] = useState<string | null>(null)
  const [submittedDocId, setSubmittedDocId] = useState<string | null>(null)
  const [paymentStep, setPaymentStep] = useState<'details' | 'upload' | 'complete'>('details')
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash' | 'mashreq'>('easypaisa')
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [screenshotUploading, setScreenshotUploading] = useState(false)
  const [businessIdInput, setBusinessIdInput] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'express' | 'authority'>('authority')
  const [showWhyPayModal, setShowWhyPayModal] = useState(false)
  const [customerMessage, setCustomerMessage] = useState('')
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  // Modal for payment from dashboard
  const [activePaymentModalBiz, setActivePaymentModalBiz] = useState<UserBusiness | null>(null)

  // ─── AUTH STATE LISTENER ──────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setAuthLoading(false)
      if (user) {
        // Prepopulate email and phone if available
        setFormData(prev => ({
          ...prev,
          email: prev.email || user.email || '',
        }))
      }
    })
    return () => unsubscribe()
  }, [])

  // ─── FETCH USER BUSINESSES REALTIME ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser) {
      setUserBusinesses([])
      return
    }

    setDashboardLoading(true)
    const userEmail = currentUser.email?.toLowerCase().trim()
    const userId = currentUser.uid

    // Query businesses for this user
    const q = query(
      collection(db, 'businesses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      let bizList = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserBusiness))
      
      // If none found by userId, fallback to query by email
      if (bizList.length === 0 && userEmail) {
        try {
          const fallbackQ = query(
            collection(db, 'businesses'),
            where('email', '==', userEmail)
          )
          const fallbackSnap = await getDocs(fallbackQ)
          bizList = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserBusiness))
        } catch (e) {
          console.error('Fallback query error:', e)
        }
      }

      setUserBusinesses(bizList)
      setDashboardLoading(false)
    }, (error) => {
      console.error('Error listening to user businesses:', error)
      // Fallback one-time query if orderBy needs an index
      if (userEmail) {
        const fallbackQ = query(
          collection(db, 'businesses'),
          where('email', '==', userEmail)
        )
        getDocs(fallbackQ).then(snap => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserBusiness))
          setUserBusinesses(list)
        }).catch(console.error)
      }
      setDashboardLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser])

  // Web Audio chime synthesis
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.15);
      
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

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => {
      setCopiedField(null)
    }, 2000)
  }

  // ─── AUTH HANDLERS ────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please provide both email and password.')
      return
    }
    setAuthSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword)
      setAuthSubmitting(false)
    } catch (err: any) {
      setAuthSubmitting(false)
      const msg = err.message || ''
      if (msg.includes('user-not-found') || msg.includes('invalid-credential')) {
        setAuthError('No account found with these credentials. Please check your email/password or create a new account.')
      } else if (msg.includes('wrong-password')) {
        setAuthError('Incorrect password. Please try again.')
      } else if (msg.includes('invalid-email')) {
        setAuthError('Please enter a valid email address.')
      } else {
        setAuthError('Sign in failed: ' + (err.message || 'Please try again.'))
      }
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (!authFullName.trim()) {
      setAuthError('Please enter your full name.')
      return
    }
    if (!authPhone.trim()) {
      setAuthError('Please enter your active phone number.')
      return
    }
    if (!authEmail.trim()) {
      setAuthError('Please enter your email address.')
      return
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.')
      return
    }
    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.')
      return
    }

    setAuthSubmitting(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword)
      if (cred.user) {
        await updateProfile(cred.user, {
          displayName: authFullName.trim(),
        })
      }
      setFormData(prev => ({
        ...prev,
        phone: prev.phone || authPhone.trim(),
        whatsapp: prev.whatsapp || authPhone.trim(),
        email: prev.email || authEmail.trim(),
      }))
      setAuthSubmitting(false)
    } catch (err: any) {
      setAuthSubmitting(false)
      const msg = err.message || ''
      if (msg.includes('email-already-in-use')) {
        setAuthError('An account with this email already exists. Please switch to the Sign In tab.')
      } else if (msg.includes('invalid-email')) {
        setAuthError('Please enter a valid email address.')
      } else if (msg.includes('weak-password')) {
        setAuthError('Password is too weak. Please use at least 6 characters.')
      } else {
        setAuthError('Sign up failed: ' + (err.message || 'Please try again.'))
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setCurrentStep(1)
      setSubmissionStatus('idle')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // ─── UNIQUE BUSINESS ID GENERATOR ─────────────────────────────────────────
  const generateUniqueBusinessId = async () => {
    let isUnique = false
    let resultId = ''
    let attempts = 0
    
    while (!isUnique && attempts < 15) {
      const randomNum = Math.floor(100000 + Math.random() * 99899999)
      resultId = randomNum.toString()
      
      const q = query(
        collection(db, 'businesses'),
        where('businessId', '==', resultId),
        limit(1)
      )
      const snap = await getDocs(q)
      if (snap.empty) {
        isUnique = true
      }
      attempts++
    }
    return resultId || Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Check for duplicate businesses
  useEffect(() => {
    async function checkExistingBusinesses() {
      if (!formData.phone && !formData.email) return

      try {
        const q = query(
          collection(db, 'businesses'),
          where('status', '==', 'approved')
        )
        const querySnapshot = await getDocs(q)
        const businesses = querySnapshot.docs.map(doc => doc.data())
        
        const duplicates = businesses
          .filter(business => 
            (formData.phone && business.phone === formData.phone) ||
            (formData.email && business.email === formData.email)
          )
          .map(business => business.businessName as string)

        setExistingBusinesses(duplicates)
      } catch (error) {
        console.error('Error checking existing businesses:', error)
      }
    }

    const timeoutId = setTimeout(checkExistingBusinesses, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.phone, formData.email])

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ ...prev, subcategory: '' }))
    }
  }, [formData.category])

  // ─── PER-STEP VALIDATION ──────────────────────────────────────────────────
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required'
      }
      if (!formData.category) {
        newErrors.category = 'Please select a category'
      }
    }

    if (stepNumber === 2) {
      if (!formData.city.trim()) {
        newErrors.city = 'City is required'
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (!/^(\+92|0)?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., 0300 1234567)'
      }
      if (formData.whatsapp && !/^(\+92|0)?[0-9]{2,4}[ -]?[0-9]{3,4}[ -]?[0-9]{3,4}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
        newErrors.whatsapp = 'Please enter a valid WhatsApp number'
      }
    }

    if (stepNumber === 3) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    if (stepNumber === 4) {
      if (formData.description.trim() && formData.description.length > MAX_DESCRIPTION_CHARS) {
        newErrors.description = `Description must not exceed ${MAX_DESCRIPTION_CHARS} characters`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const isSlugUnique = async (slug: string) => {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('slug', '==', slug),
        limit(1)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.empty
    } catch (error) {
      console.error('Error checking slug uniqueness:', error)
      return true
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    if (name === 'description') {
      setDescriptionCharCount(value.length)
    }
  }

  function compressImage(base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      const timeout = setTimeout(() => {
        resolve(base64Str)
      }, 2000)

      img.src = base64Str
      img.onload = () => {
        clearTimeout(timeout)
        try {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/webp', 0.7))
        } catch (e) {
          resolve(base64Str)
        }
      }
      img.onerror = () => {
        clearTimeout(timeout)
        resolve(base64Str)
      }
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: `Logo must be smaller than ${MAX_LOGO_MB}MB` }))
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, logo: 'Please upload an image file' }))
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target?.result as string
      try {
        const compressed = await compressImage(result, 200, 200)
        setLogoPreview(compressed)
        setFormData(prev => ({ ...prev, logoUrl: compressed }))
      } catch (err) {
        setLogoPreview(result)
        setFormData(prev => ({ ...prev, logoUrl: result }))
      }
      setErrors(prev => ({ ...prev, logo: '' }))
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setFormData(prev => ({ ...prev, logoUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateSlug = (businessName: string, city: string) => {
    const cleanName = businessName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const cleanCity = city
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    return cleanCity ? `${cleanName}-${cleanCity}` : cleanName;
  }

  // ─── SUBMISSION HANDLER ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all steps
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step)
        return
      }
    }

    setSubmissionStatus('loading')
    try {
      const baseSlug = generateSlug(formData.businessName, formData.city)
      let finalSlug = baseSlug
      let isUnique = await isSlugUnique(finalSlug)
      let counter = 1
      
      while (!isUnique) {
        finalSlug = `${baseSlug}-${counter}`
        isUnique = await isSlugUnique(finalSlug)
        counter++
        if (counter > 10) break
      }

      const uniqueBizId = await generateUniqueBusinessId()

      const businessData = {
        ...formData,
        userId: currentUser?.uid || '',
        userEmail: currentUser?.email || formData.email.trim().toLowerCase(),
        businessId: uniqueBizId,
        businessName: formData.businessName.trim(),
        description: formData.description.trim() || `Verified ${formData.category} company in ${formData.city}, Pakistan.`,
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        email: formData.email.trim().toLowerCase() || currentUser?.email || '',
        websiteUrl: formData.website.trim(),
        facebookPage: formData.facebook.trim(),
        instagramProfile: formData.instagram.trim(),
        tiktokProfile: formData.tiktok.trim(),
        youtubeChannel: formData.youtube.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        branchCode: formData.branchCode?.trim() || '',
        category: normalizeCategoryForStorage(formData.category),
        categoryId: normalizeCategoryForStorage(formData.category),
        categorySlug: normalizeCategoryForStorage(formData.category),
        subCategory: formData.subcategory.trim(),
        slug: finalSlug,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, 'businesses'), businessData)

      // Send email notification
      const categoryLabel =
        CATEGORIES.find(c => c.id === normalizeCategoryForStorage(formData.category))?.name
        || formData.category

      if (formData.email || currentUser?.email) {
        sendBusinessSubmissionEmail({
          to: formData.email || currentUser?.email || '',
          businessName: formData.businessName.trim(),
          businessId: docRef.id,
          email: formData.email || currentUser?.email || '',
          phone: formData.phone.trim(),
          category: categoryLabel,
          city: formData.city.trim(),
          address: formData.address.trim(),
          description: formData.description.trim(),
          slug: businessData.slug,
        }).catch(err => console.error('Email dispatch error:', err))
      }

      playChime()

      setSubmittedBusinessId(uniqueBizId)
      setSubmittedDocId(docRef.id)
      setBusinessIdInput(uniqueBizId)
      setSubmittedSlug(businessData.slug)
      setSelectedPlan('authority')
      setPaymentStep('details')
      setSubmissionStatus('success')
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error submitting business:', error)
      setSubmissionStatus('error')
    }
  }

  // ─── PAYMENT SCREENSHOT SUBMISSION ────────────────────────────────────────
  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Screenshot file size must be less than 5MB')
      return
    }

    setScreenshotFile(file)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target?.result as string
      try {
        const compressed = await compressImage(result, 800, 800)
        setScreenshotPreview(compressed)
      } catch (err) {
        setScreenshotPreview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleScreenshotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!screenshotPreview) {
      alert('Please upload a screenshot first')
      return
    }
    if (!businessIdInput.trim()) {
      alert('Please enter your Business ID')
      return
    }

    setScreenshotUploading(true)
    try {
      let businessDocId = ''

      if (submittedDocId && businessIdInput.trim() === submittedBusinessId) {
        businessDocId = submittedDocId
      } else if (activePaymentModalBiz) {
        businessDocId = activePaymentModalBiz.id
      } else {
        const q = query(
          collection(db, 'businesses'),
          where('businessId', '==', businessIdInput.trim()),
          limit(1)
        )
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) {
          alert('Invalid Business ID. Please verify the ID.')
          setScreenshotUploading(false)
          return
        }
        businessDocId = querySnapshot.docs[0].id
      }

      const compressedBase64 = await compressImage(screenshotPreview)

      await updateDoc(doc(db, 'businesses', businessDocId), {
        paymentScreenshotUrl: compressedBase64,
        paymentSubmittedAt: serverTimestamp(),
        paymentPlan: selectedPlan,
        paymentPlanPrice: selectedPlan === 'standard' ? 10 : selectedPlan === 'express' ? 20 : 50,
        customerMessage: customerMessage.trim(),
        status: 'pending'
      })

      playChime()
      setPaymentStep('complete')
      if (activePaymentModalBiz) {
        setTimeout(() => {
          setActivePaymentModalBiz(null)
          setScreenshotPreview(null)
          setScreenshotFile(null)
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting payment screenshot:', error)
      alert('Failed to upload screenshot. Please try again.')
    } finally {
      setScreenshotUploading(false)
    }
  }

  // ─── AUTHENTICATION LOADING SCREEN ────────────────────────────────────────
  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 font-semibold">Loading PakBizBranches Portal...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ─── UNAUTHENTICATED VIEW: SIGN IN / SIGN UP GATE ──────────────────────────
  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f2b3d] to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Header / Intro */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-400/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Verified Business Directory
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                List Your Business Free
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Sign in or create an account in 30 seconds to submit, track, and manage your verified business profile on Google.
              </p>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 bg-slate-100/80 p-1.5 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError('') }}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account (New)
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError('') }}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In (Existing)
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* Error Banner */}
                {authError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-xs sm:text-sm font-semibold">{authError}</p>
                  </div>
                )}

                {/* SIGN UP FORM */}
                {authMode === 'signup' ? (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={authFullName}
                          onChange={(e) => setAuthFullName(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Active Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="0300 1234567"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Create Password (min 6 chars) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          required
                          value={authConfirmPassword}
                          onChange={(e) => setAuthConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      {authSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account & Add Business
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* SIGN IN FORM */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      {authSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In & Continue
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Quick Benefits Checklist */}
            <div className="mt-8 text-center text-xs text-slate-400 space-y-2">
              <p>✓ 100% Free Business Listing Submission</p>
              <p>✓ Track approval and Google indexing status in real-time</p>
              <p>✓ Reach thousands of local Pakistani clients daily</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ─── AUTHENTICATED USER PORTAL ─────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Top User Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {currentUser.displayName || 'Business Owner'}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => { setActiveTab('form'); setSubmissionStatus('idle') }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Add New Business
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                My Listings ({userBusinesses.length})
                {userBusinesses.some(b => b.status === 'pending') && (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute -top-1 -right-1" />
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 1: USER DASHBOARD (MY SUBMITTED BUSINESSES)
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Submitted Businesses</h2>
                  <p className="text-slate-600 text-sm">
                    Track the live status, verification, and Google indexing of your business profiles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setActiveTab('form'); setSubmissionStatus('idle'); setCurrentStep(1); }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Another Business
                </button>
              </div>

              {dashboardLoading ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                  <p className="text-slate-600 font-semibold text-sm">Fetching your submitted listings...</p>
                </div>
              ) : userBusinesses.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
                  <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Businesses Submitted Yet</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    You haven't submitted any business listings yet. Create your first listing now to get found by thousands of local customers.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('form'); setSubmissionStatus('idle') }}
                    className="px-6 py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Submit Your First Business Free
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {userBusinesses.map((biz) => {
                    const isApproved = biz.status === 'approved'

                    return (
                      <div
                        key={biz.id}
                        className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all shadow-sm ${
                          isApproved 
                            ? 'border-emerald-200 hover:border-emerald-400' 
                            : 'border-amber-300/80 hover:border-red-400'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          
                          {/* Business Info Column */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                                {biz.businessName}
                              </h3>
                              
                              {/* Status Badge */}
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  APPROVED & LIVE ON GOOGLE
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  PENDING APPROVAL
                                </span>
                              )}

                              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase">
                                {biz.category}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 font-medium">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{biz.city || 'Pakistan'}, {biz.address}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>{biz.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-500">ID: {biz.businessId || biz.id.slice(0, 8)}</span>
                              </div>
                            </div>

                            {/* ─── PENDING URGENCY WARNING CALLOUT ─── */}
                            {!isApproved && (
                              <div className="mt-4 p-5 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-2 border-red-300 rounded-2xl text-left shadow-sm">
                                <div className="flex items-start gap-3.5">
                                  <div className="p-2.5 bg-red-600 text-white rounded-xl shrink-0 mt-0.5 shadow-md">
                                    <AlertTriangle className="w-5 h-5 animate-bounce" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <h4 className="font-black text-red-950 text-sm sm:text-base">
                                      ⚠️ Action Required: Your Listing is Pending & NOT Indexed on Google Yet!
                                    </h4>
                                    <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-semibold">
                                      Aap ka business listing request submit ho chuka hai lekin abhi Google Search par index nahi hua. 
                                      <strong className="text-red-700"> Admin approval & 1-2 hours fast-track indexing</strong> ke liye neechay di gayi small activation fee pay karein. Unverified listings expire or remove ho sakti hain!
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActivePaymentModalBiz(biz)
                                          setSubmittedBusinessId(biz.businessId || biz.id)
                                          setBusinessIdInput(biz.businessId || biz.id)
                                          setPaymentStep('details')
                                        }}
                                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                                      >
                                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                                        Pay & Fast-Track Approval Now
                                      </button>

                                      <a
                                        href={`https://wa.me/923402885226?text=${encodeURIComponent(`Hello PakBizBranches Admin, I want fast-track approval for my business: ${biz.businessName} (ID: ${biz.businessId || biz.id})`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-105 flex items-center gap-1.5"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                        WhatsApp Support
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button Column */}
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center min-w-[200px]">
                            {isApproved ? (
                              <Link
                                href={`/${biz.slug}/`}
                                target="_blank"
                                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-extrabold text-center transition-all hover:scale-102 shadow-md flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Live Profile
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePaymentModalBiz(biz)
                                  setSubmittedBusinessId(biz.businessId || biz.id)
                                  setBusinessIdInput(biz.businessId || biz.id)
                                  setPaymentStep('details')
                                }}
                                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-extrabold text-center transition-all hover:scale-102 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <Upload className="w-4 h-4" />
                                Upload Receipt / Pay
                              </button>
                            )}

                            {biz.slug && (
                              <Link
                                href={`/${biz.slug}/`}
                                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Preview Slug Link
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              TAB 2: 5-STEP BUSINESS SUBMISSION WIZARD
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'form' && (
            <div>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                  Submit Your Business Profile
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                  Complete these 5 quick steps to publish your verified business profile and get discovered by thousands of Pakistani customers.
                </p>
              </div>

              {/* SUCCESS CONFIRMATION & PAYMENT SCREEN */}
              {submissionStatus === 'success' ? (
                <div className="mb-12 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl max-w-3xl mx-auto overflow-hidden animate-fadeIn">
                  
                  {/* Step Progress Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-6 sm:px-8 py-4 flex justify-between items-center text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">✓</div>
                      <span>1. Submitted</span>
                    </div>
                    <div className="h-0.5 w-8 sm:w-16 bg-slate-200 flex-1 mx-2 sm:mx-4"></div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">2</div>
                      <span>2. Fast-Track Approval</span>
                    </div>
                    <div className="h-0.5 w-8 sm:w-16 bg-slate-200 flex-1 mx-2 sm:mx-4"></div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black">3</div>
                      <span>3. Live on Google</span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10">
                    {/* Success Intro */}
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                        Your Business Has Been Submitted!
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Aap ka business submit ho chuka hai aur hamari admin team isay review kar rahi hai. 
                        <strong> Approval ke foran baad aap ka page live aur Google par index ho jaye ga.</strong>
                      </p>
                      
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 inline-block">
                        👉 Aap apne business ka status is page par login karke kabhi bhi check kar saktay hain!
                      </div>
                    </div>

                    {/* Urgent Action Notice Box */}
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-300 rounded-3xl p-5 sm:p-6 mb-8 text-left shadow-sm">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-red-600 text-white rounded-2xl shrink-0 mt-0.5 shadow-md">
                          <AlertTriangle className="w-6 h-6 animate-bounce" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-black text-red-950">
                            ⚠️ Important: Activate Fast-Track 1-2 Hours Approval & Google Indexing!
                          </h3>
                          <p className="text-xs sm:text-sm text-red-900 leading-relaxed font-semibold">
                            Normal free submissions ko queue me 7-14 din lag saktay hain. <strong>1 se 2 hours me guaranteed approval aur instant Google ranking</strong> ke liye neechay di gayi small activation fee abhi send karein!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Business ID Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Business ID</span>
                        <div className="text-xl font-mono font-black text-slate-800">{submittedBusinessId}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(submittedBusinessId || '', 'bizId')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        {copiedField === 'bizId' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'bizId' ? 'Copied' : 'Copy ID'}</span>
                      </button>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Select Payment Method</h4>
                      <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('easypaisa')}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            selectedMethod === 'easypaisa'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-black shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 font-bold hover:border-slate-300'
                          }`}
                        >
                          <Landmark className="w-5 h-5 mb-1 text-emerald-600" />
                          <span className="text-[11px]">Easypaisa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('jazzcash')}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            selectedMethod === 'jazzcash'
                              ? 'border-red-500 bg-red-50 text-red-900 font-black shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 font-bold hover:border-slate-300'
                          }`}
                        >
                          <Smartphone className="w-5 h-5 mb-1 text-red-600" />
                          <span className="text-[11px]">JazzCash</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('mashreq')}
                          className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                            selectedMethod === 'mashreq'
                              ? 'border-orange-500 bg-orange-50 text-orange-900 font-black shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 font-bold hover:border-slate-300'
                          }`}
                        >
                          <Building2 className="w-5 h-5 mb-1 text-orange-600" />
                          <span className="text-[11px]">Mashreq Bank</span>
                        </button>
                      </div>
                    </div>

                    {/* Account Details Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 mb-8 max-w-md mx-auto text-left space-y-3.5">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <span className="text-xs text-slate-500 font-medium">Account Type</span>
                        <span className="text-xs font-black uppercase text-slate-800">
                          {selectedMethod === 'easypaisa' ? 'Easypaisa Mobile Account' : selectedMethod === 'jazzcash' ? 'JazzCash Mobile Account' : 'Mashreq Bank Account'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <div>
                          <span className="text-[11px] text-slate-400 block font-medium">Account Number</span>
                          <span className="font-mono font-black text-slate-900 text-base">
                            {selectedMethod === 'easypaisa' ? '03402885226' : selectedMethod === 'jazzcash' ? '03019316123' : '089200179683'}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(selectedMethod === 'easypaisa' ? '03402885226' : selectedMethod === 'jazzcash' ? '03019316123' : '089200179683', 'payNum')}
                          className="px-2.5 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          {copiedField === 'payNum' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <span className="text-xs text-slate-500 font-medium">Account Title</span>
                        <span className="text-xs font-bold text-slate-800">
                          {selectedMethod === 'easypaisa' ? 'Muhammad Habib Ullah' : 'Muhammad Imran'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Fast-Track Setup Fee</span>
                        <span className="text-sm font-black text-blue-600">RS: 50 / 200 (Feature)</span>
                      </div>
                    </div>

                    {/* Screenshot Upload Form */}
                    {paymentStep === 'details' ? (
                      <div className="space-y-3 max-w-md mx-auto">
                        <button
                          type="button"
                          onClick={() => setPaymentStep('upload')}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Payment Done — Upload Screenshot
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('dashboard')}
                          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                        >
                          Skip & Go To My Listings Dashboard
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleScreenshotSubmit} className="max-w-md mx-auto text-left space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Upload Payment Screenshot *
                          </label>
                          <input
                            ref={screenshotInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotSelect}
                            className="hidden"
                          />
                          {!screenshotPreview ? (
                            <button
                              type="button"
                              onClick={() => screenshotInputRef.current?.click()}
                              className="w-full py-8 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer"
                            >
                              <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-xs font-bold text-slate-700">Select Receipt Image</span>
                              <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 5MB</span>
                            </button>
                          ) : (
                            <div className="relative border border-slate-200 rounded-2xl p-2 bg-slate-50">
                              <img src={screenshotPreview} alt="Receipt" className="max-h-48 w-full object-contain rounded-xl bg-white" />
                              <button
                                type="button"
                                onClick={() => { setScreenshotFile(null); setScreenshotPreview(null) }}
                                className="absolute top-4 right-4 p-1.5 bg-red-600 text-white rounded-full"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Optional Note / Transaction ID
                          </label>
                          <textarea
                            rows={2}
                            value={customerMessage}
                            onChange={(e) => setCustomerMessage(e.target.value)}
                            placeholder="e.g. Sent via Easypaisa TRX #938294..."
                            className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentStep('details')}
                            className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={screenshotUploading || !screenshotFile}
                            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {screenshotUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Receipt'}
                          </button>
                        </div>
                      </form>
                    )}

                  </div>
                </div>
              ) : (
                /* 5-STEP FORM CONTAINER */
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 max-w-3xl mx-auto">
                  
                  {/* Step Progress Indicator */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      {[
                        { num: 1, label: 'Basic Info' },
                        { num: 2, label: 'Location' },
                        { num: 3, label: 'Online' },
                        { num: 4, label: 'Details' },
                        { num: 5, label: 'Review' },
                      ].map((step) => (
                        <div key={step.num} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all ${
                              currentStep === step.num
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                                : currentStep > step.num
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {currentStep > step.num ? '✓' : step.num}
                          </div>
                          <span className={`text-[10px] sm:text-xs font-bold mt-1.5 hidden sm:block ${
                            currentStep === step.num ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    
                    {/* ─── STEP 1: BASIC INFORMATION ─── */}
                    {currentStep === 1 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                          <h3 className="text-xl font-bold text-slate-800">Step 1: Business Identity</h3>
                          <p className="text-xs text-slate-500">Provide the primary name and industry classification for your business.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="e.g. Apex Tech Solutions"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800"
                          />
                          {errors.businessName && <p className="text-xs text-red-600 font-semibold mt-1">{errors.businessName}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Main Category *
                            </label>
                            <select
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800 bg-white"
                            >
                              <option value="">Select Category</option>
                              {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                            {errors.category && <p className="text-xs text-red-600 font-semibold mt-1">{errors.category}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Sub-Category (Optional)
                            </label>
                            <select
                              name="subcategory"
                              value={formData.subcategory}
                              onChange={handleInputChange}
                              disabled={!formData.category}
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-800 bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
                            >
                              <option value="">Select Subcategory</option>
                              {formData.category && SUB_CATEGORIES[formData.category]?.map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Branch Code / Specific Branch Title (Optional)</span>
                            <span className="text-[10px] text-slate-400 font-normal">e.g. Head Office, G-9 Markaz</span>
                          </label>
                          <input
                            type="text"
                            name="branchCode"
                            value={formData.branchCode}
                            onChange={handleInputChange}
                            placeholder="e.g. Main Boulevard Branch"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                          />
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 2: LOCATION & CONTACT ─── */}
                    {currentStep === 2 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                          <h3 className="text-xl font-bold text-slate-800">Step 2: Location & Direct Contact</h3>
                          <p className="text-xs text-slate-500">Add phone, WhatsApp, and location so customers can contact you immediately.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            City in Pakistan *
                          </label>
                          <CitySearchDropdown
                            value={formData.city}
                            onChange={(city) => {
                              setFormData(prev => ({ ...prev, city }))
                              if (errors.city) setErrors(prev => ({ ...prev, city: '' }))
                            }}
                          />
                          {errors.city && <p className="text-xs text-red-600 font-semibold mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Physical Address / Landmark *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="e.g. Plaza #14, Sector F-7 Markaz, Islamabad"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                          />
                          {errors.address && <p className="text-xs text-red-600 font-semibold mt-1">{errors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Primary Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="0300 1234567"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                            {errors.phone && <p className="text-xs text-red-600 font-semibold mt-1">{errors.phone}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              WhatsApp Number (Optional)
                            </label>
                            <input
                              type="tel"
                              name="whatsapp"
                              value={formData.whatsapp}
                              onChange={handleInputChange}
                              placeholder="0300 1234567"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 3: ONLINE PRESENCE & BRANDING ─── */}
                    {currentStep === 3 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                          <h3 className="text-xl font-bold text-slate-800">Step 3: Online Presence & Logo</h3>
                          <p className="text-xs text-slate-500">Enhance your listing credibility with official web links and business branding.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Official Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="contact@yourbusiness.com"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                            {errors.email && <p className="text-xs text-red-600 font-semibold mt-1">{errors.email}</p>}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Website URL (Optional)
                            </label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://www.yourbusiness.com"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Facebook Page URL (Optional)
                            </label>
                            <input
                              type="text"
                              name="facebook"
                              value={formData.facebook}
                              onChange={handleInputChange}
                              placeholder="https://facebook.com/yourpage"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Instagram Profile (Optional)
                            </label>
                            <input
                              type="text"
                              name="instagram"
                              value={formData.instagram}
                              onChange={handleInputChange}
                              placeholder="@yourprofile or https://instagram.com/yourhandle"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              TikTok Profile (Optional)
                            </label>
                            <input
                              type="text"
                              name="tiktok"
                              value={formData.tiktok}
                              onChange={handleInputChange}
                              placeholder="@yourhandle or https://tiktok.com/@yourhandle"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                              YouTube Channel (Optional)
                            </label>
                            <input
                              type="text"
                              name="youtube"
                              value={formData.youtube}
                              onChange={handleInputChange}
                              placeholder="https://youtube.com/@yourchannel"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
                            />
                          </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Business Logo / Profile Photo (Optional)
                          </label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          {!logoPreview ? (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-8 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer"
                            >
                              <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-xs font-bold text-slate-700">Click to Upload Business Logo</span>
                              <span className="text-[10px] text-slate-400 mt-1">Auto-optimized to next-gen WebP format (max 2.5MB)</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                              <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200" />
                              <div className="flex-1">
                                <span className="text-xs font-bold text-emerald-700 block">Logo Uploaded & Compressed</span>
                                <span className="text-[11px] text-slate-400">Ready for profile display</span>
                              </div>
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 4: DESCRIPTION & DETAILS ─── */}
                    {currentStep === 4 && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                          <h3 className="text-xl font-bold text-slate-800">Step 4: About Your Business & Services</h3>
                          <p className="text-xs text-slate-500">Describe what makes your services unique to rank higher in local search results.</p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                              Business Description
                            </label>
                            <span className="text-xs text-slate-400">
                              {descriptionCharCount}/{MAX_DESCRIPTION_CHARS}
                            </span>
                          </div>
                          <textarea
                            rows={5}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your services, products, operating hours, client guarantees, and special offers..."
                            className="w-full p-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 leading-relaxed"
                          />
                          {errors.description && <p className="text-xs text-red-600 font-semibold mt-1">{errors.description}</p>}
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 5: REVIEW & FINAL SUBMIT ─── */}
                    {currentStep === 5 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                          <h3 className="text-xl font-bold text-slate-800">Step 5: Review & Confirm Details</h3>
                          <p className="text-xs text-slate-500">Please review your business profile information before submitting.</p>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center gap-4">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Logo" className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200" />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center">
                                {formData.businessName.charAt(0).toUpperCase() || 'B'}
                              </div>
                            )}
                            <div>
                              <h4 className="text-lg font-black text-slate-900">{formData.businessName}</h4>
                              <span className="text-xs font-bold text-blue-600 uppercase">
                                {formData.category} {formData.subcategory ? `• ${formData.subcategory}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-200/80 pt-3">
                            <div><strong>City:</strong> {formData.city}</div>
                            <div><strong>Address:</strong> {formData.address}</div>
                            <div><strong>Phone:</strong> {formData.phone}</div>
                            <div><strong>WhatsApp:</strong> {formData.whatsapp || formData.phone}</div>
                            <div><strong>Email:</strong> {formData.email || 'N/A'}</div>
                            <div><strong>Website:</strong> {formData.website || 'N/A'}</div>
                          </div>

                          {formData.description && (
                            <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-3 leading-relaxed">
                              <strong>Description:</strong> {formData.description}
                            </div>
                          )}
                        </div>

                        {/* Notice */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed font-semibold">
                          💡 By clicking Submit, your profile will be queued for review and assigned a tracking ID. You will be able to track live Google verification status in your dashboard.
                        </div>
                      </div>
                    )}

                    {/* Step Navigation Buttons */}
                    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Previous Step
                        </button>
                      ) : <div />}

                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          Next Step
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submissionStatus === 'loading'}
                          className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2 ml-auto"
                        >
                          {submissionStatus === 'loading' ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting Profile...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Submit Business Profile
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL: PAYMENT FROM DASHBOARD MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      {activePaymentModalBiz && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-fadeIn relative">
            <button
              onClick={() => setActivePaymentModalBiz(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 fill-red-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Fast-Track Approval: {activePaymentModalBiz.businessName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Complete payment to guarantee 1-2 hour approval and instant indexing on Google.
              </p>
            </div>

            {/* Account Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Easypaisa Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900">03402885226</span>
                  <button onClick={() => copyToClipboard('03402885226', 'mEp')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                    {copiedField === 'mEp' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">JazzCash Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900">03019316123</span>
                  <button onClick={() => copyToClipboard('03019316123', 'mJz')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                    {copiedField === 'mJz' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Mashreq Bank Account</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900">089200179683</span>
                  <button onClick={() => copyToClipboard('089200179683', 'mMash')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                    {copiedField === 'mMash' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Account Title</span>
                <span className="font-bold text-slate-800 text-right">Muhammad Habib Ullah (Easypaisa) / Muhammad Imran (JazzCash & Mashreq Bank)</span>
              </div>
            </div>

            {/* Upload Receipt */}
            <form onSubmit={handleScreenshotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload Payment Screenshot *
                </label>
                <input
                  ref={screenshotInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotSelect}
                  className="hidden"
                />
                {!screenshotPreview ? (
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Attach Screenshot</span>
                  </button>
                ) : (
                  <div className="relative border border-slate-200 rounded-2xl p-2 bg-slate-50">
                    <img src={screenshotPreview} alt="Receipt" className="max-h-40 w-full object-contain rounded-xl bg-white" />
                    <button
                      type="button"
                      onClick={() => { setScreenshotFile(null); setScreenshotPreview(null) }}
                      className="absolute top-4 right-4 p-1.5 bg-red-600 text-white rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Queries (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customerMessage}
                  onChange={(e) => setCustomerMessage(e.target.value)}
                  placeholder="e.g. Paid RS 200 for priority promotion..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePaymentModalBiz(null)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={screenshotUploading || !screenshotFile}
                  className="flex-[2] py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {screenshotUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
