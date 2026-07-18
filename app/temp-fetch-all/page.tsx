'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function TempFetchAllPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [status, setStatus] = useState<string>('Initializing...')

  async function fetchData() {
    setStatus('Fetching all businesses...')
    try {
      const snap = await getDocs(collection(db, 'businesses'))
      const list: any[] = []
      snap.forEach((doc) => {
        list.push({
          docId: doc.id,
          ...doc.data()
        })
      })
      setBusinesses(list)
      setStatus(`Fetched ${list.length} businesses successfully.`)
    } catch (e: any) {
      console.error(e)
      setStatus('Error: ' + e.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Temp Fetch All Page</h1>
      <div><strong>Status:</strong> {status}</div>
      
      <div style={{ marginTop: '20px' }}>
        <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Doc ID</th>
              <th>Field ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>City</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.docId}>
                <td>{b.docId}</td>
                <td>{b.id}</td>
                <td>{b.businessName}</td>
                <td>{b.slug}</td>
                <td>{b.city}</td>
                <td>{b.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
