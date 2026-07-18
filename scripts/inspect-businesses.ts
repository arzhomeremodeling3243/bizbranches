import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function inspectBusiness(id: string) {
  console.log(`Checking ID: ${id}`)
  const docRef = doc(db, 'businesses', id)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    console.log(`✅ Found by doc ID: ${id}`)
    console.log(JSON.stringify(docSnap.data(), null, 2))
    return docSnap.data()
  } else {
    console.log(`❌ Not found by doc ID: ${id}. Trying to query by 'id' field...`)
    const q = query(collection(db, 'businesses'), where('id', '==', id))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      console.log(`✅ Found by 'id' field query:`)
      querySnapshot.forEach((doc) => {
        console.log(`Document ID: ${doc.id}`)
        console.log(JSON.stringify(doc.data(), null, 2))
      })
      return querySnapshot.docs[0].data()
    } else {
      console.log(`❌ Not found by 'id' field either.`)
    }
  }
  return null
}

async function main() {
  await inspectBusiness('89349784')
  await inspectBusiness('5242642')
  process.exit(0)
}

main().catch(console.error)
