// Firebase Configuration with graceful fallback

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Check if Firebase is configured
const isFirebaseConfigured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'your-api-key-here'
)

let app = null
let db = null
let storage = null
let analytics = null

if (isFirebaseConfigured) {
    try {
        const { initializeApp } = await import('firebase/app')
        const { getFirestore, enableIndexedDbPersistence } = await import('firebase/firestore')
        const { getStorage } = await import('firebase/storage')
        const { getAnalytics } = await import('firebase/analytics')

        app = initializeApp(firebaseConfig)
        db = getFirestore(app)
        storage = getStorage(app)

        if (typeof window !== 'undefined') {
            try {
                analytics = getAnalytics(app)
            } catch (e) {
                console.log('Analytics not available')
            }
        }

        enableIndexedDbPersistence(db).catch((err) => {
            console.warn('Firestore persistence error:', err.code)
        })

        console.log('✅ Firebase initialized successfully')
    } catch (error) {
        console.error('Firebase initialization error:', error)
    }
} else {
    console.log('ℹ️ Firebase not configured - running in local-only mode')
}

export { app, db, storage, analytics, isFirebaseConfigured }
