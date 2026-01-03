// Image Compression Utility

import imageCompression from 'browser-image-compression'

export async function compressImage(file, options = {}) {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        ...options
    }

    try {
        return await imageCompression(file, defaultOptions)
    } catch (error) {
        console.error('Image compression failed:', error)
        return file // Return original on failure
    }
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export function base64ToBlob(base64, type = 'image/png') {
    const byteString = atob(base64.split(',')[1])
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString || type })
}

export function createObjectURL(file) {
    return URL.createObjectURL(file)
}

export function revokeObjectURL(url) {
    URL.revokeObjectURL(url)
}

export function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve({ width: img.width, height: img.height })
        img.onerror = reject
        img.src = src
    })
}

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
