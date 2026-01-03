// Date and number formatting utilities

/**
 * Format a date as relative time (e.g., "2 hours ago", "Yesterday")
 */
export function formatRelativeTime(date) {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
        return 'Just now'
    }

    if (diffMins < 60) {
        return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    }

    if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    }

    if (diffDays === 1) {
        return 'Yesterday'
    }

    if (diffDays < 7) {
        return `${diffDays} days ago`
    }

    // Format as date for older items
    return past.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}

/**
 * Format a date as a full date string
 */
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Format a date for grouping (e.g., "Today", "Yesterday", "January 2025")
 */
export function formatDateGroup(date) {
    const now = new Date()
    const past = new Date(date)

    // Reset hours for comparison
    now.setHours(0, 0, 0, 0)
    past.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((now - past) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return 'Today'
    }

    if (diffDays === 1) {
        return 'Yesterday'
    }

    if (diffDays < 7) {
        return 'This Week'
    }

    return past.toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Format phone number with country code
 */
export function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')

    // If it's a 10-digit Indian number
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    }

    // If it already has country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
    }

    return phone
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
