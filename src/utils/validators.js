// Validation rules and functions for form inputs

export const validationRules = {
    businessName: {
        required: true,
        minLength: 3,
        maxLength: 50,
        // Allow Telugu characters (Unicode range U+0C00 to U+0C7F)
        pattern: /^[a-zA-Z0-9\s\u0C00-\u0C7F.'&-]+$/,
    },

    phone: {
        required: true,
        // Indian mobile numbers start with 6-9 and have 10 digits
        pattern: /^[6-9]\d{9}$/,
    },

    description: {
        required: true,
        minLength: 10,
        maxLength: 60,
    },

    logo: {
        required: false,
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
}

export function validateBusinessName(value) {
    const rules = validationRules.businessName

    if (!value || value.trim() === '') {
        return rules.required ? 'Business name is required' : null
    }

    const trimmed = value.trim()

    if (trimmed.length < rules.minLength) {
        return `Name must be at least ${rules.minLength} characters`
    }

    if (trimmed.length > rules.maxLength) {
        return `Name cannot exceed ${rules.maxLength} characters`
    }

    if (!rules.pattern.test(trimmed)) {
        return 'Only letters, numbers, spaces, and basic punctuation allowed'
    }

    return null
}

export function validatePhone(value) {
    const rules = validationRules.phone

    if (!value || value.trim() === '') {
        return rules.required ? 'Phone number is required' : null
    }

    const cleaned = value.replace(/\D/g, '')

    if (!rules.pattern.test(cleaned)) {
        return 'Enter valid 10-digit Indian mobile number'
    }

    return null
}

export function validateDescription(value) {
    const rules = validationRules.description

    if (!value || value.trim() === '') {
        return rules.required ? 'Description is required' : null
    }

    const trimmed = value.trim()

    if (trimmed.length < rules.minLength) {
        return `Description must be at least ${rules.minLength} characters`
    }

    if (trimmed.length > rules.maxLength) {
        return `Description cannot exceed ${rules.maxLength} characters`
    }

    return null
}

export function validateLogo(file) {
    const rules = validationRules.logo

    if (!file) {
        return rules.required ? 'Logo is required' : null
    }

    if (file.size > rules.maxSize) {
        return 'Logo must be smaller than 5MB'
    }

    if (!rules.allowedTypes.includes(file.type)) {
        return 'Only JPG, PNG, and WebP images allowed'
    }

    return null
}

export function validateBusinessProfile(values) {
    const errors = {}

    const nameError = validateBusinessName(values.name)
    if (nameError) errors.name = nameError

    const phoneError = validatePhone(values.phone)
    if (phoneError) errors.phone = phoneError

    const descriptionError = validateDescription(values.description)
    if (descriptionError) errors.description = descriptionError

    return errors
}

export function isValidForm(errors) {
    return Object.keys(errors).length === 0
}
