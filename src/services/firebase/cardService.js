// Card Service - Save and retrieve cards with localStorage fallback

import { db, storage, isFirebaseConfigured } from './config'
import { getDeviceId } from '../../utils/deviceId'
import { fileToBase64 } from '../../utils/imageCompression'

const LOCAL_STORAGE_KEY = 'festiva_cards'
const MAX_LOCAL_CARDS = 50

// Get cards from localStorage
function getLocalCards() {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch {
        return []
    }
}

// Save cards to localStorage
function saveLocalCards(cards) {
    try {
        // Keep only the most recent cards
        const trimmed = cards.slice(0, MAX_LOCAL_CARDS)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed))
    } catch (err) {
        console.warn('Failed to save cards to localStorage:', err)
    }
}

// Save a card
export async function saveCard(cardData) {
    const deviceId = getDeviceId()
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const createdAt = new Date().toISOString()

    // Convert blob to base64 for storage
    let exportedImageUrl = null
    if (cardData.exportedImageBlob) {
        try {
            exportedImageUrl = await blobToBase64(cardData.exportedImageBlob)
        } catch (err) {
            console.warn('Failed to convert blob:', err)
        }
    }

    const card = {
        id: cardId,
        userId: deviceId,
        businessId: cardData.businessId,
        businessName: cardData.businessName,
        festivalImageUrl: cardData.festivalImageUrl,
        format: cardData.format,
        bannerStyle: cardData.bannerStyle,
        bannerPosition: cardData.bannerPosition,
        bannerColors: cardData.bannerColors,
        exportedImageUrl,
        createdAt
    }

    if (isFirebaseConfigured && db) {
        try {
            const { collection, addDoc } = await import('firebase/firestore')
            const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')

            // Upload exported image to Firebase Storage
            if (cardData.exportedImageBlob) {
                const storageRef = ref(storage, `exports/${cardId}.png`)
                await uploadBytes(storageRef, cardData.exportedImageBlob)
                card.exportedImageUrl = await getDownloadURL(storageRef)
            }

            await addDoc(collection(db, 'cards'), card)
        } catch (err) {
            console.warn('Firebase save failed, saving locally:', err)
            saveToLocal(card)
        }
    } else {
        saveToLocal(card)
    }

    return card
}

function saveToLocal(card) {
    const cards = getLocalCards()
    cards.unshift(card) // Add to beginning
    saveLocalCards(cards)
}

// Get card history
export async function getCardHistory(businessIdFilter = null) {
    const deviceId = getDeviceId()

    if (isFirebaseConfigured && db) {
        try {
            const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore')

            let q = query(
                collection(db, 'cards'),
                where('userId', '==', deviceId),
                orderBy('createdAt', 'desc')
            )

            const snapshot = await getDocs(q)
            let cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            if (businessIdFilter) {
                cards = cards.filter(c => c.businessId === businessIdFilter)
            }

            return cards
        } catch (err) {
            console.warn('Firebase fetch failed, using local:', err)
        }
    }

    // Fallback to localStorage
    let cards = getLocalCards().filter(c => c.userId === deviceId)
    if (businessIdFilter) {
        cards = cards.filter(c => c.businessId === businessIdFilter)
    }
    return cards
}

// Delete a card
export async function deleteCard(cardId) {
    if (isFirebaseConfigured && db) {
        try {
            const { doc, deleteDoc } = await import('firebase/firestore')
            await deleteDoc(doc(db, 'cards', cardId))
        } catch (err) {
            console.warn('Firebase delete failed:', err)
        }
    }

    // Also remove from localStorage
    const cards = getLocalCards().filter(c => c.id !== cardId)
    saveLocalCards(cards)
}

// Helper: Convert Blob to Base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}
