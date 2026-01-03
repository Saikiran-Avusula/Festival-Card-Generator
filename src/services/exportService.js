// Export Service - Fixed WhatsApp sharing with proper image handling

import { cardGenerator } from './cardGenerator'

/**
 * Download card with proper error handling
 */
export async function downloadCard(cardData) {
    try {
        console.log('Starting download...')

        const { blob } = await cardGenerator.generate({
            festivalImageUrl: cardData.festivalImageUrl,
            businessData: cardData.businessData,
            format: cardData.format || 'square',
            bannerConfig: {
                style: cardData.bannerStyle || 'classic',
                position: cardData.bannerPosition || 'bottom',
                colors: cardData.bannerColors || { background: '#FF6B35', text: '#FFFFFF' }
            },
            imageTransform: cardData.imageTransform || { scale: 1, x: 0, y: 0 }
        })

        if (!blob || blob.size === 0) throw new Error('Generated image is empty')

        const timestamp = Date.now()
        const safeName = (cardData.businessData?.name || 'card').replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 20)
        const filename = `festiva_${safeName}_${timestamp}.png`

        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()

        setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(downloadUrl)
        }, 100)

        console.log('Download triggered:', filename)
        return { success: true, filename, blob }

    } catch (error) {
        console.error('Download failed:', error)
        throw error
    }
}

/**
 * Share to WhatsApp with proper image handling
 */
export async function shareToWhatsApp(cardData) {
    try {
        console.log('Starting WhatsApp share...')

        // Generate the card
        const { blob } = await cardGenerator.generate({
            festivalImageUrl: cardData.festivalImageUrl,
            businessData: cardData.businessData,
            format: cardData.format || 'square',
            bannerConfig: {
                style: cardData.bannerStyle || 'classic',
                position: cardData.bannerPosition || 'bottom',
                colors: cardData.bannerColors || { background: '#FF6B35', text: '#FFFFFF' }
            },
            imageTransform: cardData.imageTransform || { scale: 1, x: 0, y: 0 }
        })

        console.log('Card generated:', { size: blob.size, type: blob.type })

        // Create File object
        const file = new File([blob], `festiva_${Date.now()}.png`, { type: 'image/png', lastModified: Date.now() })

        // Check if device supports native sharing with files
        const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] })
        console.log('Can share files:', canShareFiles)

        if (canShareFiles) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Festival Greeting',
                    text: `Festival greetings from ${cardData.businessData?.name || 'us'}! 🎉`
                })
                return { success: true, method: 'native_share' }
            } catch (shareError) {
                if (shareError.name === 'AbortError') {
                    return { success: false, cancelled: true }
                }
                console.warn('Native share failed, falling back:', shareError)
            }
        }

        // Fallback: Download + Instructions
        console.log('Using download fallback...')

        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `festiva_${cardData.businessData?.name || 'card'}_${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => {
            URL.revokeObjectURL(downloadUrl)
        }, 100)

        // Open WhatsApp with text
        const message = encodeURIComponent(`Festival greetings from ${cardData.businessData?.name || 'us'}! 🎉`)

        setTimeout(() => {
            window.open(`https://wa.me/?text=${message}`, '_blank')
        }, 500)

        return { success: true, method: 'download_manual', message: 'Image downloaded! Attach it in WhatsApp.' }

    } catch (error) {
        console.error('WhatsApp share failed:', error)
        throw new Error('Share failed. Try downloading instead.')
    }
}

/**
 * Generic share using Web Share API
 */
export async function shareCard(cardData) {
    try {
        const { blob } = await cardGenerator.generate({
            festivalImageUrl: cardData.festivalImageUrl,
            businessData: cardData.businessData,
            format: cardData.format || 'square',
            bannerConfig: {
                style: cardData.bannerStyle || 'classic',
                position: cardData.bannerPosition || 'bottom',
                colors: cardData.bannerColors || { background: '#FF6B35', text: '#FFFFFF' }
            },
            imageTransform: cardData.imageTransform || { scale: 1, x: 0, y: 0 }
        })

        const file = new File([blob], 'festiva-card.png', { type: 'image/png', lastModified: Date.now() })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Festival Greeting',
                text: `Festival greetings from ${cardData.businessData?.name}!`
            })
            return { success: true, method: 'share_api' }
        } else {
            await downloadCard(cardData)
            return { success: true, method: 'download_fallback' }
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            return { success: false, cancelled: true }
        }
        throw error
    }
}
