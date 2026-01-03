# FESTIVA BUSINESS CARDS - COMPLETE PRD PART 2 (BACKEND & SERVICES)
## Backend Implementation, State Management, Card Generation & Deployment

---

# 3. BACKEND SERVICES & FIREBASE

## 3.1 Firebase Configuration

```javascript
// src/services/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Persistence not available');
    }
  });
}

export default app;
```

---

## 3.2 Business Service (CRUD Operations)

```javascript
// src/services/firebase/businessService.js
import { db, storage } from './config';
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  getDocs, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getDeviceId } from '../../utils/deviceId';
import { compressImage } from '../../utils/imageCompression';

// Create business profile
export async function createBusinessProfile({ name, phone, description, logoFile }) {
  try {
    const deviceId = getDeviceId();
    
    // Upload logo if provided
    let logoUrl = null;
    if (logoFile) {
      const compressed = await compressImage(logoFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512
      });
      
      const storageRef = ref(storage, `logos/${deviceId}_${Date.now()}.jpg`);
      await uploadBytes(storageRef, compressed);
      logoUrl = await getDownloadURL(storageRef);
    }
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'businesses'), {
      userId: deviceId,
      name,
      phone,
      description,
      logo: logoUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      id: docRef.id,
      name,
      phone,
      description,
      logo: logoUrl
    };
  } catch (error) {
    console.error('Create business failed:', error);
    throw new Error('Failed to create business profile');
  }
}

// Get all businesses for device
export async function getBusinessProfiles() {
  try {
    const deviceId = getDeviceId();
    const q = query(
      collection(db, 'businesses'),
      where('userId', '==', deviceId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get businesses failed:', error);
    return [];
  }
}

// Update business profile
export async function updateBusinessProfile(id, updates) {
  try {
    const docRef = doc(db, 'businesses', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Update business failed:', error);
    throw new Error('Failed to update business profile');
  }
}

// Delete business profile
export async function deleteBusinessProfile(id, logoUrl) {
  try {
    // Delete logo from storage if exists
    if (logoUrl) {
      const logoRef = ref(storage, logoUrl);
      await deleteObject(logoRef).catch(() => {});
    }
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'businesses', id));
  } catch (error) {
    console.error('Delete business failed:', error);
    throw new Error('Failed to delete business profile');
  }
}
```

---

## 3.3 Card Service (Save & Retrieve Cards)

```javascript
// src/services/firebase/cardService.js
import { db, storage } from './config';
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDeviceId } from '../../utils/deviceId';

// Save created card
export async function saveCard({
  businessId,
  businessName,
  festivalImageFile,
  festivalImageUrl,
  format,
  bannerStyle,
  bannerPosition,
  bannerColors,
  exportedImageBlob
}) {
  try {
    const deviceId = getDeviceId();
    
    // Upload exported image
    const exportFilename = `card_${deviceId}_${Date.now()}.png`;
    const exportRef = ref(storage, `exports/${exportFilename}`);
    await uploadBytes(exportRef, exportedImageBlob);
    const exportUrl = await getDownloadURL(exportRef);
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'cards'), {
      userId: deviceId,
      businessId,
      businessName,
      festivalImageUrl,
      format,
      bannerStyle,
      bannerPosition,
      bannerColors,
      exportedImageUrl: exportUrl,
      createdAt: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}×${window.screen.height}`
      }
    });
    
    return {
      id: docRef.id,
      exportUrl
    };
  } catch (error) {
    console.error('Save card failed:', error);
    throw new Error('Failed to save card');
  }
}

// Get card history
export async function getCardHistory(businessId = null) {
  try {
    const deviceId = getDeviceId();
    let q;
    
    if (businessId) {
      q = query(
        collection(db, 'cards'),
        where('userId', '==', deviceId),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'cards'),
        where('userId', '==', deviceId),
        orderBy('createdAt', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get cards failed:', error);
    return [];
  }
}

// Delete card
export async function deleteCard(id) {
  try {
    await deleteDoc(doc(db, 'cards', id));
  } catch (error) {
    console.error('Delete card failed:', error);
    throw new Error('Failed to delete card');
  }
}
```

---

## 3.4 Card Generator (Canvas-based Image Generation)

```javascript
// src/services/cardGenerator.js

export class CardGenerator {
  async generate({ festivalImageUrl, businessData, format, bannerConfig }) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set dimensions
    canvas.width = 1080;
    canvas.height = format === 'square' ? 1080 : 1920;
    
    // 1. Draw festival image (background)
    await this.drawFestivalImage(ctx, festivalImageUrl, canvas.width, canvas.height);
    
    // 2. Draw business banner
    await this.drawBanner(ctx, businessData, bannerConfig, canvas.width, canvas.height);
    
    // 3. Convert to blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });
    
    // 4. Create URL
    const url = URL.createObjectURL(blob);
    
    return { blob, url };
  }
  
  async drawFestivalImage(ctx, imageUrl, width, height) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
    
    // Calculate scale to cover canvas
    const scale = Math.max(width / img.width, height / img.height);
    const x = (width - img.width * scale) / 2;
    const y = (height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }
  
  async drawBanner(ctx, businessData, bannerConfig, canvasWidth, canvasHeight) {
    const { style, position, colors } = bannerConfig;
    const bannerHeight = canvasHeight > 1500 ? 300 : 220; // Taller for portrait
    const bannerY = position === 'top' ? 0 : canvasHeight - bannerHeight;
    
    // Background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, bannerY, canvasWidth, bannerHeight);
    
    // Content
    if (style === 'classic') {
      await this.drawClassicBanner(ctx, businessData, colors, bannerY, canvasWidth, bannerHeight);
    } else {
      await this.drawFullBanner(ctx, businessData, colors, bannerY, canvasWidth, bannerHeight);
    }
  }
  
  async drawClassicBanner(ctx, business, colors, y, width, height) {
    ctx.fillStyle = colors.text;
    
    // Logo (if exists)
    if (business.logo) {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      await new Promise(resolve => {
        logo.onload = resolve;
        logo.src = business.logo;
      });
      
      const logoSize = 120;
      const logoX = 40;
      const logoY = y + (height - logoSize) / 2;
      
      // Draw circular clipped logo
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    }
    
    const textX = business.logo ? 200 : 40;
    const centerY = y + height / 2;
    
    // Business name
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(business.name, textX, centerY - 30);
    
    // Phone
    ctx.font = '36px Inter, sans-serif';
    ctx.fillText(`📞 ${business.phone}`, textX, centerY + 20);
    
    // Description
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText(business.description, textX, centerY + 65);
  }
  
  async drawFullBanner(ctx, business, colors, y, width, height) {
    ctx.fillStyle = colors.text;
    const centerX = width / 2;
    ctx.textAlign = 'center';
    
    // Logo (if exists)
    if (business.logo) {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      await new Promise(resolve => {
        logo.onload = resolve;
        logo.src = business.logo;
      });
      
      const logoSize = 140;
      const logoY = y + 50;
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, centerX - logoSize/2, logoY, logoSize, logoSize);
      ctx.restore();
    }
    
    const startY = business.logo ? y + 220 : y + 80;
    
    // Business name
    ctx.font = 'bold 52px Poppins, sans-serif';
    ctx.fillText(business.name, centerX, startY);
    
    // Description
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText(business.description, centerX, startY + 55);
    
    // Phone
    ctx.font = '38px Inter, sans-serif';
    ctx.fillText(`📞 ${business.phone}`, centerX, startY + 110);
  }
}

export const cardGenerator = new CardGenerator();
```

---

## 3.5 State Management (Zustand Store)

```javascript
// src/store/useAppStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Device ID
      deviceId: null,
      setDeviceId: (id) => set({ deviceId: id }),
      
      // Business profiles
      businesses: [],
      selectedBusinessId: null,
      setBusinesses: (businesses) => set({ businesses }),
      addBusiness: (business) => set((state) => ({
        businesses: [business, ...state.businesses]
      })),
      updateBusiness: (id, updates) => set((state) => ({
        businesses: state.businesses.map(b => 
          b.id === id ? { ...b, ...updates } : b
        )
      })),
      deleteBusiness: (id) => set((state) => ({
        businesses: state.businesses.filter(b => b.id !== id)
      })),
      selectBusiness: (id) => set({ selectedBusinessId: id }),
      
      // Card creation flow
      cardFlow: {
        businessId: null,
        format: 'square',
        festivalImageUrl: null,
        festivalImageFile: null,
        bannerStyle: 'classic',
        bannerPosition: 'bottom',
        bannerColors: {
          background: '#FF6B35',
          text: '#FFFFFF'
        }
      },
      updateCardFlow: (updates) => set((state) => ({
        cardFlow: { ...state.cardFlow, ...updates }
      })),
      resetCardFlow: () => set({
        cardFlow: {
          businessId: null,
          format: 'square',
          festivalImageUrl: null,
          festivalImageFile: null,
          bannerStyle: 'classic',
          bannerPosition: 'bottom',
          bannerColors: {
            background: '#FF6B35',
            text: '#FFFFFF'
          }
        }
      }),
      
      // Card history
      cards: [],
      setCards: (cards) => set({ cards }),
      addCard: (card) => set((state) => ({
        cards: [card, ...state.cards]
      })),
      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter(c => c.id !== id)
      })),
      
      // UI state
      loading: false,
      setLoading: (loading) => set({ loading }),
      
      // Toast
      toast: null,
      showToast: (message, type = 'info') => set({ 
        toast: { message, type, id: Date.now() } 
      }),
      hideToast: () => set({ toast: null }),
    }),
    {
      name: 'festiva-storage',
      partialize: (state) => ({
        deviceId: state.deviceId,
        businesses: state.businesses,
        selectedBusinessId: state.selectedBusinessId,
      })
    }
  )
);
```

---

## 3.6 Image Compression Utility

```javascript
// src/utils/imageCompression.js
import imageCompression from 'browser-image-compression';

export async function compressImage(file, options = {}) {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.85,
  };

  try {
    const compressedFile = await imageCompression(
      file,
      { ...defaultOptions, ...options }
    );
    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    return file;
  }
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

---

## 3.7 Device ID Utility

```javascript
// src/utils/deviceId.js

export function getDeviceId() {
  let deviceId = localStorage.getItem('festiva_device_id');
  
  if (!deviceId) {
    deviceId = `device_${generateRandomId()}`;
    localStorage.setItem('festiva_device_id', deviceId);
  }
  
  return deviceId;
}

function generateRandomId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
```

---

# 4. DEPLOYMENT

## 4.1 Environment Variables

```bash
# .env.local
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=festiva-business.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=festiva-business
VITE_FIREBASE_STORAGE_BUCKET=festiva-business.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 4.2 Firebase Configuration Files

```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  },
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /businesses/{businessId} {
      allow read: if true;
      allow write: if request.resource.data.userId is string;
    }
    
    match /cards/{cardId} {
      allow read: if true;
      allow write: if request.resource.data.userId is string;
    }
  }
}
```

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

## 4.3 Deployment Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# Or combined
npm run deploy
```

## 4.4 Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy"
  }
}
```

---

# 5. TESTING CHECKLIST

## Critical Path Testing
- [ ] Create business profile with logo
- [ ] Upload festival image
- [ ] Customize banner colors
- [ ] Export card (download)
- [ ] Share to WhatsApp
- [ ] View card history
- [ ] Delete card

## Cross-Browser Testing
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Chrome Desktop

## Performance Testing
- [ ] Page load < 3 seconds
- [ ] Image upload < 5 seconds
- [ ] Card export < 10 seconds

---

This covers all critical backend services. Copy Part 1 + Part 2 into your AI code generator for complete implementation!
