// Application-wide constants

export const APP_NAME = 'Festiva'
export const APP_VERSION = '1.0.0'

// Card formats
export const CARD_FORMATS = {
    SQUARE: {
        id: 'square',
        name: 'Square',
        width: 1080,
        height: 1080,
        label: '1:1 (Instagram)',
        icon: '⬜',
    },
    PORTRAIT: {
        id: 'portrait',
        name: 'Portrait',
        width: 1080,
        height: 1920,
        label: '9:16 (Story/Status)',
        icon: '📱',
    },
}

// Banner styles
export const BANNER_STYLES = {
    CLASSIC: {
        id: 'classic',
        name: 'Classic',
        description: 'Clean, professional look',
    },
    MODERN: {
        id: 'modern',
        name: 'Modern',
        description: 'Rounded corners, shadow',
    },
    MINIMAL: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Text only, transparent',
    },
    POSTER: {
        id: 'poster',
        name: 'Poster',
        description: 'Large logo, bold text',
    },
}

// Banner positions
export const BANNER_POSITIONS = {
    TOP: 'top',
    BOTTOM: 'bottom',
    CENTER: 'center',
}

// Default banner colors (preset palettes)
export const COLOR_PRESETS = [
    { name: 'Festival Orange', background: '#FF6B35', text: '#FFFFFF' },
    { name: 'Festival Gold', background: '#F7B731', text: '#1A1A1A' },
    { name: 'Celebration Red', background: '#EE5A6F', text: '#FFFFFF' },
    { name: 'Royal Purple', background: '#7C3AED', text: '#FFFFFF' },
    { name: 'Ocean Blue', background: '#2563EB', text: '#FFFFFF' },
    { name: 'Forest Green', background: '#059669', text: '#FFFFFF' },
    { name: 'Midnight Black', background: '#1A1A1A', text: '#FFFFFF' },
    { name: 'Pure White', background: '#FFFFFF', text: '#1A1A1A' },
]

// Image compression settings
export const IMAGE_COMPRESSION = {
    maxSizeInput: 5 * 1024 * 1024, // 5MB max input
    targetSizeOutput: 500 * 1024, // 500KB target output
    maxWidthOrHeight: 2048,
    useWebWorker: true,
}

// Validation limits
export const VALIDATION_LIMITS = {
    businessName: { min: 3, max: 50 },
    description: { min: 10, max: 60 },
    phoneLength: 10,
}

// API endpoints (if needed)
export const API_ENDPOINTS = {
    // Add Firebase endpoints here if needed
}

// Error messages
export const ERROR_MESSAGES = {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    SAVE_FAILED: 'Failed to save. Please try again.',
    UPLOAD_FAILED: 'Failed to upload image. Please try again.',
    INVALID_IMAGE: 'Invalid image format. Please use JPG or PNG.',
    IMAGE_TOO_LARGE: 'Image is too large. Maximum size is 5MB.',
}

// Success messages
export const SUCCESS_MESSAGES = {
    PROFILE_CREATED: 'Business profile created successfully!',
    PROFILE_UPDATED: 'Business profile updated successfully!',
    PROFILE_DELETED: 'Business profile deleted.',
    CARD_CREATED: 'Festival card created successfully!',
    CARD_EXPORTED: 'Card exported successfully!',
}
