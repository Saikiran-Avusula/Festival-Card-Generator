# FESTIVA BUSINESS CARDS - COMPLETE PRD PART 1
## Architecture, UI/UX Design System, Component Library & Frontend Specifications

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Target Platform:** Progressive Web App (Mobile-First)  
**Tech Stack:** React + Vite + Firebase + Tailwind CSS  

---

# TABLE OF CONTENTS - PART 1

1. Product Overview & Architecture
2. Complete Design System
3. UI/UX Specifications (Screen by Screen)
4. Component Library (All Components)
5. State Management & Data Flow
6. Routing & Navigation

---

# 1. PRODUCT OVERVIEW & ARCHITECTURE

## 1.1 Product Vision

**Product Name:** Festiva Business Cards  
**Target Users:** Small business owners in India (Telugu-speaking communities)  
**Core Problem:** Business owners need to create festival greeting cards with their branding for WhatsApp/social media but lack design skills and budget.

**Solution:** Dead-simple web app where users upload a festival image, add their business details via a saved profile, customize a banner, and export/share in under 60 seconds.

## 1.2 User Journey (Critical Path)

```
NEW USER:
1. Opens app URL in mobile browser
2. Creates business profile (name, phone, description, logo)
3. Taps "Create Festival Card"
4. Selects their business
5. Chooses format (Square 1080×1080 or Portrait 1080×1920)
6. Uploads festival image from gallery
7. Customizes banner (style, position, colors)
8. Previews final card
9. Exports and shares to WhatsApp
10. Done! (Total time: 60-90 seconds)

RETURNING USER:
1. Opens app
2. Taps "Create Festival Card"
3. Business pre-selected
4. Upload image → Customize → Export
5. Done! (Total time: 30-45 seconds)
```

## 1.3 Technical Architecture

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│  ┌─────────────────────────────────┐   │
│  │    React Components (JSX)       │   │
│  │  - Pages (Home, Create, etc)    │   │
│  │  - Components (Button, Input)   │   │
│  │  - Layouts (Header, Navigation) │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          STATE MANAGEMENT LAYER         │
│  ┌─────────────────────────────────┐   │
│  │      Zustand Store              │   │
│  │  - Business profiles            │   │
│  │  - Card creation flow           │   │
│  │  - UI state (loading, toast)    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           SERVICE LAYER                 │
│  ┌──────────┬──────────┬─────────────┐ │
│  │ Business │   Card   │   Image     │ │
│  │ Service  │ Service  │ Processing  │ │
│  └──────────┴──────────┴─────────────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           FIREBASE BACKEND              │
│  ┌──────────┬──────────┬─────────────┐ │
│  │Firestore │ Storage  │  Hosting    │ │
│  │(Database)│(Files)   │ (Web App)   │ │
│  └──────────┴──────────┴─────────────┘ │
└─────────────────────────────────────────┘
```

### 1.3.1 Technology Stack Justification

```javascript
{
  "frontend": {
    "framework": "React 18.2",
    "reason": "Component-based, huge ecosystem, perfect for SPAs",
    
    "buildTool": "Vite 5.0",
    "reason": "10x faster than CRA, HMR, optimized builds",
    
    "styling": "Tailwind CSS 3.4",
    "reason": "Utility-first, rapid development, small bundle",
    
    "stateManagement": "Zustand 4.4",
    "reason": "Simple, lightweight (3kb), no boilerplate vs Redux",
    
    "routing": "React Router 6.20",
    "reason": "Industry standard, nested routes, code splitting"
  },
  
  "backend": {
    "database": "Firebase Firestore",
    "reason": "NoSQL, real-time, offline support, generous free tier",
    
    "storage": "Firebase Storage",
    "reason": "Direct uploads, CDN, automatic optimization",
    
    "hosting": "Firebase Hosting",
    "reason": "Free, HTTPS, CDN, automatic deploys from GitHub",
    
    "analytics": "Firebase Analytics",
    "reason": "Free, unlimited events, mobile-optimized"
  },
  
  "utilities": {
    "imageProcessing": "html2canvas 1.4.1",
    "reason": "Convert DOM to image for card export",
    
    "imageCompression": "browser-image-compression 2.0",
    "reason": "Client-side compression before upload",
    
    "colorPicker": "react-colorful 5.6.1",
    "reason": "Lightweight (2.2kb), accessible, mobile-friendly",
    
    "icons": "@tabler/icons-react 2.44",
    "reason": "Beautiful, consistent, 4000+ icons, tree-shakeable"
  }
}
```

### 1.3.2 Folder Structure

```
festiva-business-cards/
├── public/
│   ├── index.html
│   ├── manifest.json              # PWA manifest
│   ├── robots.txt
│   ├── favicon.ico
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
│
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   │   ├── Poppins-*.woff2    # Display font
│   │   │   └── Inter-*.woff2      # Body font
│   │   ├── images/
│   │   │   └── placeholder.png
│   │   └── illustrations/
│   │       └── empty-state.svg
│   │
│   ├── components/
│   │   ├── common/                # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── BottomSheet.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   │
│   │   ├── business/              # Business profile components
│   │   │   ├── BusinessProfileForm.jsx
│   │   │   ├── BusinessProfileCard.jsx
│   │   │   ├── BusinessSelector.jsx
│   │   │   └── LogoUploader.jsx
│   │   │
│   │   ├── card/                  # Card creation components
│   │   │   ├── FormatSelector.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── BannerCustomizer.jsx
│   │   │   ├── BannerStyleToggle.jsx
│   │   │   ├── BannerPositionToggle.jsx
│   │   │   ├── ColorPickerPanel.jsx
│   │   │   ├── ColorPresets.jsx
│   │   │   ├── LivePreview.jsx
│   │   │   └── CardGenerator.jsx
│   │   │
│   │   ├── history/               # Card history components
│   │   │   ├── CardHistoryItem.jsx
│   │   │   ├── CardActionMenu.jsx
│   │   │   ├── BusinessFilter.jsx
│   │   │   └── DateGroupHeader.jsx
│   │   │
│   │   └── layout/                # Layout components
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── PageContainer.jsx
│   │
│   ├── pages/                     # Route pages
│   │   ├── Home.jsx               # Dashboard
│   │   ├── CreateProfile.jsx      # New/edit business profile
│   │   ├── CreateCard/            # Multi-step card creation
│   │   │   ├── index.jsx          # Main component
│   │   │   ├── Step1.jsx          # Select business & format
│   │   │   ├── Step2.jsx          # Upload image
│   │   │   └── Step3.jsx          # Customize banner
│   │   ├── Preview.jsx            # Final preview & export
│   │   ├── History.jsx            # Card history
│   │   └── Settings.jsx           # App settings (future)
│   │
│   ├── services/                  # Business logic layer
│   │   ├── firebase/
│   │   │   ├── config.js          # Firebase initialization
│   │   │   ├── businessService.js # CRUD for business profiles
│   │   │   ├── cardService.js     # CRUD for cards
│   │   │   └── storageService.js  # File upload/download
│   │   │
│   │   ├── imageProcessing.js     # Image manipulation
│   │   ├── cardGenerator.js       # Canvas-based card generation
│   │   ├── exportService.js       # Download/share functionality
│   │   └── analyticsService.js    # Event tracking
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useBusinesses.js       # Fetch/manage businesses
│   │   ├── useCards.js            # Fetch/manage cards
│   │   ├── useImageUpload.js      # Handle image uploads
│   │   ├── useCardExport.js       # Handle exports
│   │   ├── useToast.js            # Toast notifications
│   │   └── useDeviceId.js         # Generate/get device ID
│   │
│   ├── store/                     # State management
│   │   └── useAppStore.js         # Zustand store
│   │
│   ├── utils/                     # Utility functions
│   │   ├── deviceId.js            # Device identification
│   │   ├── imageCompression.js    # Compress images
│   │   ├── formatters.js          # Date, number formatting
│   │   ├── validators.js          # Input validation
│   │   ├── constants.js           # App constants
│   │   ├── errorHandler.js        # Error handling utilities
│   │   └── helpers.js             # Misc helper functions
│   │
│   ├── styles/                    # Global styles
│   │   ├── globals.css            # Global CSS + Tailwind
│   │   ├── animations.css         # Custom animations
│   │   └── fonts.css              # Font imports
│   │
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── router.jsx                 # Route configuration
│
├── .env.local                     # Local environment variables
├── .env.production                # Production environment variables
├── .gitignore
├── package.json
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── firebase.json                  # Firebase configuration
├── firestore.rules                # Firestore security rules
├── storage.rules                  # Storage security rules
├── README.md
└── DEPLOYMENT.md
```

---

# 2. COMPLETE DESIGN SYSTEM

## 2.1 Design Philosophy

**Aesthetic Direction:** Modern Indian Festival Celebration
- Warm, vibrant colors inspired by Diwali, Sankranti, and other festivals
- Clean, approachable interface (not intimidating for non-tech users)
- Touch-optimized for mobile-first usage
- Celebratory yet professional tone
- Cultural relevance for Telugu-speaking communities

**Core Principles:**
1. **Simplicity First** - Every screen has one primary action
2. **Touch-Friendly** - Minimum 48px touch targets
3. **Fast Feedback** - Loading states, animations, haptics
4. **Forgiving** - Easy to undo mistakes, clear error messages
5. **Beautiful Default** - Even first-time users create great cards

## 2.2 Color System

### 2.2.1 Primary Palette

```css
/* Festival Colors - Core Brand Identity */
:root {
  /* Primary - Festival Orange (Diwali vibes) */
  --color-primary-orange: #FF6B35;
  --color-primary-orange-light: #FF8C5A;
  --color-primary-orange-dark: #E55520;
  
  /* Secondary - Festival Gold (Prosperity) */
  --color-primary-gold: #F7B731;
  --color-primary-gold-light: #F9C856;
  --color-primary-gold-dark: #E5A510;
  
  /* Accent - Celebration Red */
  --color-primary-red: #EE5A6F;
  --color-primary-red-light: #F27B8D;
  --color-primary-red-dark: #DC3F55;
}
```

### 2.2.2 Neutral Palette

```css
/* Neutrals - Text, Backgrounds, Borders */
:root {
  --color-neutral-50: #FAFAFA;    /* Lightest background */
  --color-neutral-100: #F5F5F5;   /* Light background */
  --color-neutral-200: #E5E5E5;   /* Borders */
  --color-neutral-300: #D4D4D4;   /* Dividers */
  --color-neutral-400: #A3A3A3;   /* Placeholder text */
  --color-neutral-500: #737373;   /* Secondary text */
  --color-neutral-600: #525252;   /* Body text */
  --color-neutral-700: #404040;   /* Strong text */
  --color-neutral-800: #262626;   /* Headings */
  --color-neutral-900: #171717;   /* Darkest text */
}
```

### 2.2.3 Semantic Colors

```css
/* Semantic - Status & Feedback */
:root {
  --color-success: #10B981;       /* Green - Success states */
  --color-success-light: #34D399;
  --color-success-dark: #059669;
  
  --color-error: #EF4444;         /* Red - Error states */
  --color-error-light: #F87171;
  --color-error-dark: #DC2626;
  
  --color-warning: #F59E0B;       /* Amber - Warning states */
  --color-warning-light: #FBBF24;
  --color-warning-dark: #D97706;
  
  --color-info: #3B82F6;          /* Blue - Info states */
  --color-info-light: #60A5FA;
  --color-info-dark: #2563EB;
}
```

### 2.2.4 Gradients

```css
/* Gradients - Buttons, Headers, Accents */
:root {
  --gradient-festival: linear-gradient(135deg, #FF6B35 0%, #F7B731 100%);
  --gradient-diwali: linear-gradient(135deg, #FF6B35 0%, #EE5A6F 100%);
  --gradient-sankranti: linear-gradient(135deg, #F7B731 0%, #10B981 100%);
  --gradient-sunset: linear-gradient(135deg, #EE5A6F 0%, #8B5CF6 100%);
}
```

### 2.2.5 Color Usage Guidelines

```javascript
// Usage examples
const colorUsage = {
  backgrounds: {
    page: 'neutral-50',           // Main background
    card: 'white',                // Card components
    input: 'white',               // Form inputs
    hover: 'neutral-100',         // Hover states
  },
  
  text: {
    primary: 'neutral-900',       // Headlines, important text
    secondary: 'neutral-600',     // Body text
    tertiary: 'neutral-500',      // Helper text
    disabled: 'neutral-400',      // Disabled text
    link: 'primary-orange',       // Links, CTAs
  },
  
  borders: {
    default: 'neutral-200',       // Default borders
    focus: 'primary-orange',      // Focused inputs
    error: 'error',               // Error states
    divider: 'neutral-300',       // Dividing lines
  },
  
  buttons: {
    primary: 'gradient-festival', // Main CTAs
    secondary: 'white',           // Secondary actions
    ghost: 'transparent',         // Tertiary actions
    danger: 'error',              // Destructive actions
  }
};
```

## 2.3 Typography System

### 2.3.1 Font Families

```css
/* Font Stack */
:root {
  /* Display - Headlines, Buttons, CTAs */
  --font-display: 'Poppins', 'Noto Sans Telugu', system-ui, -apple-system, sans-serif;
  
  /* Body - Paragraphs, Forms, UI Text */
  --font-body: 'Inter', 'Noto Sans Telugu', system-ui, -apple-system, sans-serif;
  
  /* Telugu - Telugu language content */
  --font-telugu: 'Noto Sans Telugu', sans-serif;
  
  /* Monospace - Code, Numbers (if needed) */
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

**Font Loading Strategy:**
```html
<!-- In index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2.3.2 Type Scale

```css
/* Type Scale - Based on 16px base */
:root {
  --text-xs: 12px;      /* 0.75rem - Fine print, captions */
  --text-sm: 14px;      /* 0.875rem - Small UI text */
  --text-base: 16px;    /* 1rem - Body text, inputs */
  --text-lg: 18px;      /* 1.125rem - Large body */
  --text-xl: 20px;      /* 1.25rem - Sub-headings */
  --text-2xl: 24px;     /* 1.5rem - Section headings */
  --text-3xl: 30px;     /* 1.875rem - Page headings */
  --text-4xl: 36px;     /* 2.25rem - Hero text */
  --text-5xl: 48px;     /* 3rem - Large hero (rare) */
}
```

### 2.3.3 Font Weights

```css
:root {
  --font-normal: 400;    /* Regular text */
  --font-medium: 500;    /* Emphasized text */
  --font-semibold: 600;  /* Sub-headings, buttons */
  --font-bold: 700;      /* Headings, CTAs */
}
```

### 2.3.4 Line Heights

```css
:root {
  --leading-none: 1;        /* Tight - Headlines */
  --leading-tight: 1.25;    /* Snug - Display text */
  --leading-normal: 1.5;    /* Default - Body text */
  --leading-relaxed: 1.75;  /* Loose - Long-form content */
}
```

### 2.3.5 Typography Usage

```javascript
// Component examples
const typographyUsage = {
  h1: {
    fontSize: 'text-3xl',        // 30px
    fontWeight: 'font-bold',     // 700
    fontFamily: 'font-display',  // Poppins
    lineHeight: 'leading-tight', // 1.25
    usage: 'Page titles'
  },
  
  h2: {
    fontSize: 'text-2xl',        // 24px
    fontWeight: 'font-semibold', // 600
    fontFamily: 'font-display',
    lineHeight: 'leading-tight',
    usage: 'Section headings'
  },
  
  h3: {
    fontSize: 'text-xl',         // 20px
    fontWeight: 'font-semibold',
    fontFamily: 'font-display',
    lineHeight: 'leading-normal',
    usage: 'Card titles'
  },
  
  body: {
    fontSize: 'text-base',       // 16px
    fontWeight: 'font-normal',   // 400
    fontFamily: 'font-body',     // Inter
    lineHeight: 'leading-normal',
    usage: 'Paragraphs, descriptions'
  },
  
  bodySmall: {
    fontSize: 'text-sm',         // 14px
    fontWeight: 'font-normal',
    fontFamily: 'font-body',
    lineHeight: 'leading-normal',
    usage: 'Helper text, secondary info'
  },
  
  button: {
    fontSize: 'text-base',       // 16px
    fontWeight: 'font-semibold', // 600
    fontFamily: 'font-display',  // Poppins
    lineHeight: 'leading-none',  // 1
    usage: 'Buttons, CTAs'
  },
  
  caption: {
    fontSize: 'text-xs',         // 12px
    fontWeight: 'font-medium',   // 500
    fontFamily: 'font-body',
    lineHeight: 'leading-normal',
    usage: 'Captions, timestamps'
  }
};
```

## 2.4 Spacing System

### 2.4.1 Base Grid (4px)

```css
/* All spacing is multiple of 4px */
:root {
  --space-0: 0;
  --space-1: 4px;      /* 0.25rem */
  --space-2: 8px;      /* 0.5rem */
  --space-3: 12px;     /* 0.75rem */
  --space-4: 16px;     /* 1rem */
  --space-5: 20px;     /* 1.25rem */
  --space-6: 24px;     /* 1.5rem */
  --space-7: 28px;     /* 1.75rem */
  --space-8: 32px;     /* 2rem */
  --space-10: 40px;    /* 2.5rem */
  --space-12: 48px;    /* 3rem */
  --space-16: 64px;    /* 4rem */
  --space-20: 80px;    /* 5rem */
  --space-24: 96px;    /* 6rem */
  --space-32: 128px;   /* 8rem */
}
```

### 2.4.2 Spacing Usage

```javascript
const spacingUsage = {
  // Padding
  containerPadding: 'space-4',      // 16px - Screen edges
  cardPadding: 'space-4',           // 16px - Card inner padding
  buttonPadding: 'space-3 space-6', // 12px 24px - Button
  
  // Margin
  sectionGap: 'space-6',            // 24px - Between sections
  elementGap: 'space-4',            // 16px - Between related elements
  tightGap: 'space-2',              // 8px - Tight spacing
  
  // Touch Targets
  minTouchTarget: 'space-12',       // 48px - Minimum button height
  
  // Layout
  headerHeight: 'space-14',         // 56px
  bottomNavHeight: 'space-14',      // 56px
  modalPadding: 'space-6',          // 24px
};
```

## 2.5 Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 8px;      /* Small elements, chips */
  --radius-md: 12px;     /* Cards, buttons, inputs */
  --radius-lg: 16px;     /* Large cards */
  --radius-xl: 24px;     /* Modals, sheets */
  --radius-2xl: 32px;    /* Extra large containers */
  --radius-full: 9999px; /* Circular elements */
}
```

## 2.6 Shadows & Elevation

```css
/* Shadows - Material Design inspired */
:root {
  /* Shadow levels */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
               0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Special shadows */
  --shadow-festival: 0 10px 40px -10px rgba(255, 107, 53, 0.3);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}

/* Elevation levels (z-index) */
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-toast: 70;
  --z-tooltip: 80;
}
```

## 2.7 Animation & Motion

### 2.7.1 Timing Functions

```css
:root {
  /* Duration */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  
  /* Easing */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 2.7.2 Animation Definitions

```css
/* Keyframe animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

@keyframes scaleIn {
  from { 
    transform: scale(0.95);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Utility classes */
.animate-fadeIn { animation: fadeIn var(--duration-normal) var(--ease-out); }
.animate-slideUp { animation: slideUp var(--duration-normal) var(--ease-out); }
.animate-slideDown { animation: slideDown var(--duration-normal) var(--ease-out); }
.animate-scaleIn { animation: scaleIn var(--duration-fast) var(--ease-out); }
.animate-spin { animation: spin 1s var(--ease-linear) infinite; }
.animate-pulse { animation: pulse 2s var(--ease-in-out) infinite; }
```

### 2.7.3 Transition Usage

```javascript
const transitionUsage = {
  // Hover states
  buttonHover: 'transition-all duration-200 ease-out',
  cardHover: 'transition-shadow duration-300 ease-out',
  
  // Focus states
  inputFocus: 'transition-colors duration-200 ease-in-out',
  
  // Page transitions
  pageEnter: 'animate-fadeIn',
  modalEnter: 'animate-scaleIn',
  sheetEnter: 'animate-slideUp',
  
  // Interactive feedback
  buttonPress: 'active:scale-95 transition-transform duration-100',
  tapFeedback: 'active:opacity-70 transition-opacity duration-100',
};
```

---

# 3. UI/UX SPECIFICATIONS (SCREEN BY SCREEN)

## 3.1 SCREEN 1: HOME / DASHBOARD

**Route:** `/`  
**Purpose:** Landing page showing business profiles, recent cards, and main CTA  
**User Actions:** View profiles, create new profile, start card creation, view history

### 3.1.1 Layout Structure

```
┌─────────────────────────────────────────┐
│ HEADER (56px height)                    │
│ [🎉 Festiva]                      [⚙️]  │
├─────────────────────────────────────────┤
│                                         │
│ BUSINESS PROFILES SECTION               │
│ ┌─────────────────────────────────────┐ │
│ │ Your Business Profiles              │ │
│ ├─────────────────────────────────────┤ │
│ │ [Profile Card 1]                    │ │ ← Tappable
│ │ [Profile Card 2]                    │ │
│ │ [+ Add New Business Profile]        │ │ ← Button
│ └─────────────────────────────────────┘ │
│                                         │
│ RECENT CARDS SECTION                    │
│ ┌─────────────────────────────────────┐ │
│ │ Recent Cards                        │ │
│ ├─────────────────────────────────────┤ │
│ │ [Card][Card][Card][Card] →          │ │ ← Horizontal scroll
│ └─────────────────────────────────────┘ │
│                                         │
│ (Flexible space - grows/shrinks)       │
│                                         │
├─────────────────────────────────────────┤
│ MAIN CTA (64px height + 16px margin)   │
│ [🎨 Create Festival Card]              │ ← Primary button
├─────────────────────────────────────────┤
│ BOTTOM SAFE AREA (if iOS)              │
└─────────────────────────────────────────┘

Measurements:
- Screen padding: 16px all sides
- Section spacing: 24px between sections
- Cards spacing: 12px between cards
- Total height: Dynamic (scrollable)
```

### 3.1.2 Component Breakdown

#### A. Header Component

```jsx
<header className="
  sticky top-0 z-40
  bg-white border-b border-neutral-200
  px-4 py-3
  flex items-center justify-between
  h-14
">
  {/* Logo/Brand */}
  <div className="flex items-center gap-3">
    <div className="
      w-10 h-10
      bg-gradient-festival
      rounded-xl
      flex items-center justify-center
      shadow-md
    ">
      <span className="text-2xl">🎉</span>
    </div>
    <div>
      <h1 className="text-lg font-bold text-neutral-900 font-display">
        Festiva
      </h1>
      <p className="text-xs text-neutral-500">
        Business Cards
      </p>
    </div>
  </div>
  
  {/* Settings Icon */}
  <button className="
    w-10 h-10
    rounded-lg
    hover:bg-neutral-100
    active:bg-neutral-200
    flex items-center justify-center
    transition-colors duration-200
  ">
    <SettingsIcon size={20} className="text-neutral-600" />
  </button>
</header>
```

**Specs:**
- Height: 56px (14 in Tailwind units)
- Sticky positioned at top
- Z-index: 40 (above content, below modals)
- Logo size: 40px circle
- Settings icon: 20px
- Touch target: 40px (larger than icon)

#### B. Business Profile Card Component

```jsx
<div className="
  bg-white
  rounded-xl
  border-2 border-neutral-200
  p-4
  flex items-center gap-4
  cursor-pointer
  hover:border-primary-orange
  hover:shadow-md
  active:scale-[0.98]
  transition-all duration-200
">
  {/* Logo */}
  {business.logo ? (
    <img 
      src={business.logo} 
      alt={`${business.name} logo`}
      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
    />
  ) : (
    <div className="
      w-16 h-16
      rounded-lg
      bg-gradient-festival
      flex items-center justify-center
      flex-shrink-0
    ">
      <span className="text-2xl">🏪</span>
    </div>
  )}
  
  {/* Info */}
  <div className="flex-1 min-w-0">
    <h3 className="
      font-semibold text-neutral-900
      text-base truncate
    ">
      {business.name}
    </h3>
    <p className="
      text-sm text-neutral-600
      flex items-center gap-1
      mt-1
    ">
      <PhoneIcon size={14} />
      {business.phone}
    </p>
    <p className="
      text-xs text-neutral-500
      mt-1 truncate
    ">
      {business.description}
    </p>
  </div>
  
  {/* Chevron */}
  <ChevronRightIcon 
    size={20} 
    className="text-neutral-400 flex-shrink-0" 
  />
</div>
```

**Specs:**
- Height: Auto (content-based, ~88px typical)
- Padding: 16px
- Border: 2px solid neutral-200 (becomes orange on hover)
- Logo: 64px circle or square
- Gap between elements: 16px
- Text hierarchy: Bold name → Phone → Description

#### C. Recent Cards Horizontal Scroll

```jsx
<div className="space-y-3">
  {/* Section header */}
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-neutral-900">
      Recent Cards
    </h2>
    <button className="
      text-sm text-primary-orange font-medium
      hover:underline
    ">
      View All
    </button>
  </div>
  
  {/* Scrollable container */}
  <div className="
    overflow-x-auto
    pb-4
    -mx-4 px-4
    scrollbar-hide
  ">
    <div className="flex gap-3 w-max">
      {recentCards.map(card => (
        <div 
          key={card.id}
          className="
            w-40 flex-shrink-0
            bg-white rounded-lg
            border border-neutral-200
            overflow-hidden
            cursor-pointer
            hover:shadow-lg
            active:scale-95
            transition-all duration-200
          "
        >
          {/* Thumbnail */}
          <img 
            src={card.exportedImageUrl} 
            alt="Card thumbnail"
            className="w-full aspect-square object-cover"
          />
          
          {/* Info */}
          <div className="p-2">
            <p className="text-xs text-neutral-600 truncate font-medium">
              {card.businessName}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {formatRelativeTime(card.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

**Specs:**
- Card width: 160px (fixed)
- Card aspect ratio: Square thumbnail + info section
- Gap between cards: 12px
- Scroll behavior: Horizontal, no scrollbar
- Touch-friendly swipe

#### D. Main CTA Button

```jsx
<button className="
  w-full max-w-md mx-auto
  h-16 px-8
  bg-gradient-festival
  text-white text-lg font-bold font-display
  rounded-2xl
  shadow-festival
  hover:shadow-xl
  active:scale-95
  transition-all duration-300
  flex items-center justify-center gap-3
">
  <SparklesIcon size={24} />
  Create Festival Card
</button>
```

**Specs:**
- Height: 64px
- Max width: 448px (md breakpoint)
- Border radius: 24px (2xl)
- Font size: 18px (lg)
- Icon size: 24px
- Shadow: Custom festival shadow (orange glow)

### 3.1.3 Empty States

**No Business Profiles:**
```jsx
<div className="
  py-12 px-6
  text-center
">
  <div className="
    w-20 h-20
    mx-auto mb-4
    bg-neutral-100
    rounded-full
    flex items-center justify-center
  ">
    <BuildingIcon size={36} className="text-neutral-400" />
  </div>
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    No Business Profiles Yet
  </h3>
  <p className="text-sm text-neutral-600 mb-6 max-w-xs mx-auto">
    Create your first business profile to start making festival cards
  </p>
  <button className="
    px-6 py-3
    bg-gradient-festival
    text-white font-semibold
    rounded-xl
    hover:shadow-lg
    transition-shadow
  ">
    Create Business Profile
  </button>
</div>
```

**No Recent Cards:**
```jsx
<div className="
  py-8 px-4
  text-center
  bg-neutral-50
  rounded-xl
  border-2 border-dashed border-neutral-300
">
  <span className="text-4xl mb-3 block">📸</span>
  <p className="text-sm text-neutral-600">
    Your created cards will appear here
  </p>
</div>
```

---

## 3.2 SCREEN 2: CREATE/EDIT BUSINESS PROFILE

**Route:** `/profile/new` or `/profile/:id/edit`  
**Purpose:** Form to create or edit business profile  
**User Actions:** Upload logo, enter details, save/update profile

### 3.2.1 Layout Structure

```
┌─────────────────────────────────────────┐
│ HEADER (56px)                           │
│ [←] Create Business Profile        [✓]  │
├─────────────────────────────────────────┤
│                                         │
│ FORM CONTENT (Scrollable)               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ LOGO UPLOAD SECTION                 │ │
│ │ [Upload area / Preview]             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ BUSINESS NAME INPUT *               │ │
│ │ [Text input]                        │ │
│ │ Helper text                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ PHONE NUMBER INPUT *                │ │
│ │ [Phone input with +91 prefix]       │ │
│ │ Helper text                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ DESCRIPTION INPUT *                 │ │
│ │ [Textarea, 2-3 lines]               │ │
│ │ Character count: 45/60              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ (More space if needed - scrollable)    │
│                                         │
├─────────────────────────────────────────┤
│ STICKY FOOTER                           │
│ [Save Business Profile]                 │ ← Full-width button
└─────────────────────────────────────────┘

Padding: 16px all sides
Gap between sections: 24px
Input height: 48px (touch-friendly)
```

### 3.2.2 Component Breakdown

#### A. Form Header with Save

```jsx
<header className="
  sticky top-0 z-40
  bg-white border-b border-neutral-200
  px-4 py-3
  flex items-center justify-between
  h-14
">
  {/* Back button */}
  <button 
    onClick={handleBack}
    className="
      w-10 h-10
      rounded-lg
      hover:bg-neutral-100
      active:bg-neutral-200
      flex items-center justify-center
      transition-colors duration-200
    "
  >
    <ArrowLeftIcon size={20} className="text-neutral-600" />
  </button>
  
  {/* Title */}
  <h1 className="
    text-lg font-semibold text-neutral-900
    absolute left-1/2 transform -translate-x-1/2
  ">
    {isEditing ? 'Edit Profile' : 'Create Profile'}
  </h1>
  
  {/* Save button */}
  <button 
    onClick={handleSave}
    disabled={!isValid || isSaving}
    className="
      w-10 h-10
      rounded-lg
      hover:bg-neutral-100
      active:bg-neutral-200
      flex items-center justify-center
      transition-colors duration-200
      disabled:opacity-40 disabled:cursor-not-allowed
    "
  >
    {isSaving ? (
      <LoaderIcon size={20} className="text-primary-orange animate-spin" />
    ) : (
      <CheckIcon size={20} className="text-primary-orange" />
    )}
  </button>
</header>
```

#### B. Logo Upload Component

```jsx
<div className="flex flex-col items-center gap-4">
  <label className="text-sm font-medium text-neutral-700">
    Upload Logo / Photo (Optional)
  </label>
  
  {/* Upload area */}
  <div className="relative">
    {/* Preview or placeholder */}
    {logo ? (
      <img 
        src={logo} 
        alt="Business logo preview"
        className="
          w-32 h-32
          rounded-full
          object-cover
          border-4 border-neutral-200
        "
      />
    ) : (
      <div className="
        w-32 h-32
        rounded-full
        bg-gradient-to-br from-neutral-100 to-neutral-200
        border-2 border-dashed border-neutral-300
        flex items-center justify-center
      ">
        <ImageIcon size={40} className="text-neutral-400" />
      </div>
    )}
    
    {/* Upload button overlay */}
    <label className="
      absolute bottom-0 right-0
      w-10 h-10
      rounded-full
      bg-primary-orange
      shadow-lg
      flex items-center justify-center
      cursor-pointer
      hover:scale-110
      active:scale-95
      transition-transform duration-200
    ">
      <CameraIcon size={20} className="text-white" />
      <input 
        type="file" 
        accept="image/jpeg,image/png"
        className="hidden" 
        onChange={handleLogoUpload}
        aria-label="Upload business logo"
      />
    </label>
  </div>
  
  {/* Helper text */}
  <p className="text-xs text-neutral-500 text-center max-w-xs">
    Upload your business logo or owner photo<br />
    <span className="text-neutral-400">(JPG or PNG, max 5MB)</span>
  </p>
</div>
```

**Specs:**
- Logo size: 128px circle
- Upload button: 40px circle, positioned bottom-right
- Border: 4px solid when image present, 2px dashed when empty
- File types: image/jpeg, image/png
- Max size: 5MB
- Compression: Automatic (target 500KB)

#### C. Form Input Components

**Business Name Input:**
```jsx
<div className="space-y-2">
  <label className="
    block text-sm font-medium text-neutral-700
  ">
    Business Name <span className="text-error">*</span>
  </label>
  
  <input 
    type="text"
    value={businessName}
    onChange={handleNameChange}
    onBlur={handleNameBlur}
    className={`
      w-full h-12 px-4
      border-2 rounded-lg
      text-base
      transition-all duration-200
      placeholder:text-neutral-400
      ${hasError 
        ? 'border-error focus:border-error focus:ring-4 focus:ring-error/10' 
        : 'border-neutral-200 focus:border-primary-orange focus:ring-4 focus:ring-primary-orange/10'
      }
      focus:outline-none
    `}
    placeholder="e.g., Tejaswini Gold Shop"
    maxLength={50}
    required
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby="name-helper name-error"
  />
  
  {/* Helper text */}
  {!hasError && (
    <p id="name-helper" className="text-xs text-neutral-500">
      This will appear on all your festival cards
    </p>
  )}
  
  {/* Error message */}
  {hasError && (
    <p id="name-error" className="text-xs text-error flex items-center gap-1">
      <AlertCircleIcon size={14} />
      {errorMessage}
    </p>
  )}
</div>
```

**Phone Number Input:**
```jsx
<div className="space-y-2">
  <label className="
    block text-sm font-medium text-neutral-700
  ">
    Phone Number <span className="text-error">*</span>
  </label>
  
  <div className="relative">
    {/* Country code prefix */}
    <div className="
      absolute left-4 top-1/2 -translate-y-1/2
      text-neutral-600 font-medium
      pointer-events-none
    ">
      +91
    </div>
    
    <input 
      type="tel"
      value={phoneNumber}
      onChange={handlePhoneChange}
      className="
        w-full h-12 pl-14 pr-4
        border-2 border-neutral-200
        rounded-lg
        text-base
        focus:border-primary-orange
        focus:outline-none
        focus:ring-4 focus:ring-primary-orange/10
        transition-all duration-200
      "
      placeholder="9866337106"
      maxLength={10}
      pattern="[0-9]{10}"
      required
      aria-required="true"
    />
  </div>
  
  <p className="text-xs text-neutral-500">
    Customers can call you directly from the card
  </p>
</div>
```

**Description Textarea:**
```jsx
<div className="space-y-2">
  <label className="
    block text-sm font-medium text-neutral-700
  ">
    Short Description <span className="text-error">*</span>
  </label>
  
  <textarea 
    value={description}
    onChange={handleDescriptionChange}
    className="
      w-full px-4 py-3
      border-2 border-neutral-200
      rounded-lg
      text-base
      resize-none
      focus:border-primary-orange
      focus:outline-none
      focus:ring-4 focus:ring-primary-orange/10
      transition-all duration-200
    "
    placeholder="e.g., Traditional gold jewelry for all occasions"
    rows={3}
    maxLength={60}
    required
    aria-required="true"
  />
  
  {/* Character count */}
  <div className="flex justify-between items-center">
    <p className="text-xs text-neutral-500">
      Briefly describe your business
    </p>
    <p className={`
      text-xs font-medium
      ${description.length > 55 ? 'text-warning' : 'text-neutral-400'}
    `}>
      {description.length}/60
    </p>
  </div>
</div>
```

#### D. Save Button (Sticky Footer)

```jsx
<div className="
  sticky bottom-0
  bg-white
  border-t border-neutral-200
  px-4 py-3
  safe-area-inset-bottom
">
  <button 
    onClick={handleSave}
    disabled={!isValid || isSaving}
    className="
      w-full h-14
      bg-gradient-festival
      text-white text-lg font-semibold font-display
      rounded-xl
      shadow-md
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:shadow-lg
      active:scale-[0.98]
      transition-all duration-200
      flex items-center justify-center gap-2
    "
  >
    {isSaving ? (
      <>
        <LoaderIcon size={20} className="animate-spin" />
        Saving...
      </>
    ) : (
      <>
        {isEditing ? 'Update Profile' : 'Save Business Profile'}
      </>
    )}
  </button>
</div>
```

### 3.2.3 Validation Rules

```javascript
const validationRules = {
  businessName: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\u0C00-\u0C7F]+$/, // Allow Telugu characters
    messages: {
      required: 'Business name is required',
      minLength: 'Name must be at least 3 characters',
      maxLength: 'Name cannot exceed 50 characters',
      pattern: 'Only letters, numbers, and spaces allowed'
    }
  },
  
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/, // Indian mobile numbers
    messages: {
      required: 'Phone number is required',
      pattern: 'Enter valid 10-digit Indian mobile number'
    }
  },
  
  description: {
    required: true,
    minLength: 10,
    maxLength: 60,
    messages: {
      required: 'Description is required',
      minLength: 'Description must be at least 10 characters',
      maxLength: 'Description cannot exceed 60 characters'
    }
  },
  
  logo: {
    required: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'],
    messages: {
      maxSize: 'Logo must be smaller than 5MB',
      allowedTypes: 'Only JPG and PNG images allowed'
    }
  }
};
```

### 3.2.4 User Interactions

```javascript
// Interaction flow
const interactions = {
  // Logo upload
  onLogoSelect: async (file) => {
    if (!validateFile(file)) return;
    setUploading(true);
    const compressed = await compressImage(file);
    const preview = await fileToBase64(compressed);
    setLogo(preview);
    setUploading(false);
  },
  
  // Real-time validation
  onInputBlur: (field) => {
    const error = validateField(field, values[field]);
    setErrors({ ...errors, [field]: error });
  },
  
  // Save profile
  onSave: async () => {
    // Validate all fields
    const validationErrors = validateAll(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Upload logo if present
      let logoUrl = null;
      if (logo && logo.startsWith('data:')) {
        logoUrl = await uploadLogo(logo);
      }
      
      // Save to Firestore
      const profileData = {
        name: values.businessName,
        phone: `+91${values.phone}`,
        description: values.description,
        logo: logoUrl,
        userId: getDeviceId(),
        updatedAt: new Date()
      };
      
      if (isEditing) {
        await updateProfile(profileId, profileData);
        showToast('Profile updated successfully', 'success');
      } else {
        await createProfile(profileData);
        showToast('Profile created successfully', 'success');
      }
      
      // Navigate back
      navigate('/');
      
    } catch (error) {
      console.error('Save failed:', error);
      showToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  },
  
  // Back button
  onBack: () => {
    if (hasUnsavedChanges) {
      showConfirmDialog({
        title: 'Discard changes?',
        message: 'You have unsaved changes. Are you sure you want to go back?',
        confirmText: 'Discard',
        cancelText: 'Stay',
        onConfirm: () => navigate(-1)
      });
    } else {
      navigate(-1);
    }
  }
};
```

---

This is Part 1. Due to length limits, I'm stopping here. Shall I continue with Part 2 containing:
- Screen 3-7 (Create Card Flow, Preview, History)
- Complete component library with code
- Backend implementation
- Firebase configuration
- Deployment guide

Say "CONTINUE WITH PART 2" and I'll create the second document.
