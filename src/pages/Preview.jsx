// Preview & Export Page - Fixed with better sharing

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconDownload, IconCheck, IconRefresh, IconAlertCircle, IconShare2 } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { cardGenerator } from '../services/cardGenerator'
import { downloadCard, shareCard } from '../services/exportService'
import { saveCard } from '../services/firebase/cardService'
import Button from '../components/common/Button'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export default function Preview() {
    const navigate = useNavigate()
    const { cardCreation, businesses, showToast, resetCardCreation } = useAppStore()

    const [isGenerating, setIsGenerating] = useState(true)
    const [generatedCard, setGeneratedCard] = useState(null)
    const [error, setError] = useState(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const selectedBusiness = businesses.find(b => b.id === cardCreation.businessId)

    useEffect(() => {
        if (!cardCreation.festivalImage || !selectedBusiness) {
            navigate('/create')
            return
        }
        generateCard()
    }, [])

    const generateCard = async () => {
        setIsGenerating(true)
        setError(null)
        try {
            const result = await cardGenerator.generate({
                festivalImageUrl: cardCreation.festivalImage,
                businessData: selectedBusiness,
                format: cardCreation.format,
                bannerConfig: {
                    style: cardCreation.bannerStyle,
                    position: cardCreation.bannerPosition,
                    colors: cardCreation.bannerColors
                },
                imageTransform: cardCreation.imageTransform || { scale: 1, x: 0, y: 0 }
            })
            setGeneratedCard(result)
        } catch (err) {
            console.error('Card generation failed:', err)
            setError('Failed to generate card. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDownload = async () => {
        if (!generatedCard) return
        setIsDownloading(true)
        try {
            // Save to history
            if (!isSaved) {
                try {
                    await saveCard({
                        businessId: cardCreation.businessId,
                        businessName: selectedBusiness.name,
                        festivalImageUrl: cardCreation.festivalImage,
                        format: cardCreation.format,
                        bannerStyle: cardCreation.bannerStyle,
                        bannerPosition: cardCreation.bannerPosition,
                        bannerColors: cardCreation.bannerColors,
                        exportedImageBlob: generatedCard.blob
                    })
                    setIsSaved(true)
                } catch (e) { console.warn('Save failed:', e) }
            }

            // Download
            const link = document.createElement('a')
            link.href = generatedCard.url
            link.download = `festiva_${selectedBusiness.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            showToast('Card downloaded! ✓', 'success')
        } catch (err) {
            showToast('Download failed', 'error')
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        setIsSharing(true)
        try {
            const result = await shareCard({
                festivalImageUrl: cardCreation.festivalImage,
                businessData: selectedBusiness,
                format: cardCreation.format,
                bannerStyle: cardCreation.bannerStyle,
                bannerPosition: cardCreation.bannerPosition,
                bannerColors: cardCreation.bannerColors,
                imageTransform: cardCreation.imageTransform
            })

            if (result.cancelled) return
            if (result.method === 'download_fallback') {
                showToast('Downloaded! Share from gallery.', 'info')
            } else {
                showToast('Shared! ✓', 'success')
            }
        } catch (err) {
            showToast('Share failed', 'error')
        } finally {
            setIsSharing(false)
        }
    }

    const handleCreateAnother = () => {
        resetCardCreation()
        navigate('/create')
    }

    if (!selectedBusiness) return null

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="sticky top-0 z-40 bg-neutral-800/90 backdrop-blur px-4 py-3 flex items-center justify-between h-14 border-b border-neutral-800">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-lg hover:bg-neutral-800 flex items-center justify-center">
                    <IconArrowLeft size={20} className="text-white" />
                </button>
                <h1 className="text-lg font-semibold text-white">Preview</h1>
                <div className="w-10" />
            </header>

            <main className="flex-1 overflow-y-auto pb-48 p-4">
                {/* Card Preview */}
                <div className={`w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl ${cardCreation.format === 'portrait' ? 'aspect-[9/16]' : 'aspect-square'} bg-neutral-800`}>
                    {isGenerating ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                            <LoadingSpinner size="lg" color="white" />
                            <p className="text-white font-medium">Generating card...</p>
                            <p className="text-neutral-400 text-sm">This may take a few seconds</p>
                        </div>
                    ) : error ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                            <IconAlertCircle size={48} className="text-error" />
                            <p className="text-white font-medium">{error}</p>
                            <Button variant="secondary" size="sm" onClick={generateCard}><IconRefresh size={18} className="mr-2" />Try Again</Button>
                        </div>
                    ) : generatedCard ? (
                        <img src={generatedCard.url} alt="Generated festival card" className="w-full h-full object-contain" style={{ display: 'block' }} />
                    ) : null}
                </div>

                {/* Info badges */}
                {generatedCard && !isGenerating && (
                    <div className="mt-4 flex items-center justify-center gap-3 text-sm text-neutral-400">
                        <span className="flex items-center gap-1"><IconCheck size={16} className="text-green-500" />Ready</span>
                        <span>•</span>
                        <span>{cardCreation.format === 'portrait' ? '1080×1920' : '1080×1080'}</span>
                        <span>•</span>
                        <span>PNG</span>
                    </div>
                )}
            </main>

            {/* Action Buttons - Fixed */}
            {generatedCard && !isGenerating && (
                <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 pb-6">
                    <div className="max-w-md mx-auto space-y-3">
                        <button onClick={handleCreateAnother} className="w-full h-10 text-white font-medium text-sm transition-colors border border-white rounded-xl">
                            Create Another Card
                        </button>
                        
                        {/* Primary buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleDownload} disabled={isDownloading} className="h-14 px-4 bg-white text-neutral-700 border-2 border-neutral-200 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg">
                                <IconDownload size={20} />Download
                            </button>
                            <button onClick={handleShare} disabled={isSharing} className="h-14 px-4 bg-primary-orange text-white rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg">
                                <IconShare2 size={20} />Share
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
