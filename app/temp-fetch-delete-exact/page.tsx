'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'

export default function TempFetchDeleteExactPage() {
  const [data1, setData1] = useState<any>(null)
  const [data2, setData2] = useState<any>(null)
  const [status, setStatus] = useState<string>('Initializing...')
  const [deleteStatus, setDeleteStatus] = useState<string>('')

  async function sendToApi(bizData: any) {
    try {
      const res = await fetch('/api/save-biz-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bizData)
      })
      const result = await res.json()
      console.log('Saved to local codebase:', result)
    } catch (e) {
      console.error('Error saving to API:', e)
    }
  }

  async function fetchData() {
    setStatus('Fetching data...')
    try {
      const docSnap1 = await getDoc(doc(db, 'businesses', 'kqXAz9HnuDpcQ06x3q0'))
      let fetched1: any = null
      if (docSnap1.exists()) {
        fetched1 = { docId: docSnap1.id, ...docSnap1.data() }
        setData1(fetched1)
        await sendToApi(fetched1)
      }

      const docSnap2 = await getDoc(doc(db, 'businesses', 'MgE9cP29tvrjQ7RZ3prF'))
      let fetched2: any = null
      if (docSnap2.exists()) {
        fetched2 = { docId: docSnap2.id, ...docSnap2.data() }
        setData2(fetched2)
        await sendToApi(fetched2)
      }
      setStatus('Fetched and saved to local codebase successfully.')
    } catch (e: any) {
      console.error(e)
      setStatus('Error: ' + e.message)
    }
  }

  async function deleteData() {
    setDeleteStatus('Deleting...')
    try {
      await deleteDoc(doc(db, 'businesses', 'kqXAz9HnuDpcQ06x3q0'))
      await deleteDoc(doc(db, 'businesses', 'MgE9cP29tvrjQ7RZ3prF'))
      setDeleteStatus('Successfully deleted both documents from Firestore.')
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
      <h1>Temp Fetch & Delete Exact Page</h1>
      <div><strong>Status:</strong> {status}</div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Business 1 (kqXAz9HnuDpcQ06x3q0)</h3>
        <pre id="data-exact-1" style={{ background: '#f4f4f4', padding: '10px', whiteSpace: 'pre-wrap' }}>
          {data1 ? JSON.stringify(data1, null, 2) : 'Not found yet'}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Business 2 (MgE9cP29tvrjQ7RZ3prF)</h3>
        <pre id="data-exact-2" style={{ background: '#f4f4f4', padding: '10px', whiteSpace: 'pre-wrap' }}>
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
