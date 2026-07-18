'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'

export default function TempFetchPage() {
  const [data1, setData1] = useState<any>(null)
  const [data2, setData2] = useState<any>(null)
  const [status, setStatus] = useState<string>('Initializing...')
  const [deleteStatus, setDeleteStatus] = useState<string>('')

  async function fetchBiz(id: string, slug: string) {
    try {
      // 1. Try by Doc ID
      const docSnap = await getDoc(doc(db, 'businesses', id))
      if (docSnap.exists()) {
        return { _docId: docSnap.id, ...docSnap.data() }
      }

      // 2. Try by field id
      let q = query(collection(db, 'businesses'), where('id', '==', id))
      let snap = await getDocs(q)
      if (!snap.empty) {
        return { _docId: snap.docs[0].id, ...snap.docs[0].data() }
      }

      // 3. Try by slug
      q = query(collection(db, 'businesses'), where('slug', '==', slug))
      snap = await getDocs(q)
      if (!snap.empty) {
        return { _docId: snap.docs[0].id, ...snap.docs[0].data() }
      }
    } catch (e) {
      console.error('Error fetching ' + slug, e)
    }
    return null
  }

  async function fetchData() {
    setStatus('Fetching data...')
    const biz1 = await fetchBiz('89349784', 'rank-seo-strategies-gujranwala')
    const biz2 = await fetchBiz('5242642', 'hamza-production-islamabad')
    
    setData1(biz1)
    setData2(biz2)
    setStatus('Fetched successfully.')
  }

  async function deleteData() {
    setDeleteStatus('Deleting...')
    try {
      let count = 0
      if (data1?._docId) {
        await deleteDoc(doc(db, 'businesses', data1._docId))
        count++
      }
      if (data2?._docId) {
        await deleteDoc(doc(db, 'businesses', data2._docId))
        count++
      }
      setDeleteStatus(`Successfully deleted ${count} documents from Firestore.`)
    } catch (e: any) {
      console.error(e)
      setDeleteStatus('Error deleting: ' + e.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Temp Fetch & Delete Page</h1>
      <div><strong>Status:</strong> {status}</div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Business 1 (rank-seo-strategies-gujranwala)</h3>
        <pre id="data-1" style={{ background: '#f4f4f4', padding: '10px', whiteSpace: 'pre-wrap' }}>
          {data1 ? JSON.stringify(data1, null, 2) : 'Not found yet'}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Business 2 (hamza-production-islamabad)</h3>
        <pre id="data-2" style={{ background: '#f4f4f4', padding: '10px', whiteSpace: 'pre-wrap' }}>
          {data2 ? JSON.stringify(data2, null, 2) : 'Not found yet'}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button id="delete-btn" onClick={deleteData} style={{ padding: '10px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
          Delete Both From Firestore
        </button>
        <div id="delete-status" style={{ marginTop: '10px', fontWeight: 'bold' }}>{deleteStatus}</div>
      </div>
    </div>
  )
}
