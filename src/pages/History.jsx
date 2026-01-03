// History Page - Card edit and delete functionality

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    IconArrowLeft,
    IconTrash,
    IconDownload,
    IconFilter,
    IconX,
    IconEdit,
    IconShare2
} from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import { getCardHistory, deleteCard } from '../services/firebase/cardService'
import { formatRelativeTime, formatDateGroup } from '../utils/formatters'
import Button from '../components/common/Button'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { EmptyState } from '../components/common/EmptyState'

export default function History() {
    const navigate = useNavigate()
    const { businesses, showToast, updateCardCreation } = useAppStore()

    const [cards, setCards] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedBusinessFilter, setSelectedBusinessFilter] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)

    useEffect(() => {
        loadCards()
    }, [selectedBusinessFilter])

    const loadCards = async () => {
        setIsLoading(true)
        try {
            const history = await getCardHistory(selectedBusinessFilter)
            setCards(history)
        } catch (err) {
            console.error('Failed to load history:', err)
            showToast('Failed to load card history', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    // TAP CARD → Open in Edit Mode
    const handleCardEdit = (card, e) => {
        if (e) e.stopPropagation()

        // Load card settings into store for editing
        updateCardCreation({
            businessId: card.businessId,
            format: card.format,
            festivalImage: card.exportedImageUrl, // Use the exported image
            festivalImageFile: null,
            bannerStyle: card.bannerStyle || 'classic',
            bannerPosition: card.bannerPosition || 'bottom',
            bannerColors: card.bannerColors || { background: '#FF6B35', text: '#FFFFFF' },
            imageTransform: { scale: 1, x: 0, y: 0 },
            // Mark as editing existing card
            editingCardId: card.id
        })

        // Navigate to Step 3 (customize) with edit mode
        navigate('/create?edit=true')
        showToast('Editing card - customize and re-export', 'info')
    }

    const handleCardClick = (card) => {
        setSelectedCard(card)
    }

    const handleDelete = async (cardId, e) => {
        if (e) e.stopPropagation()
        if (!window.confirm('Delete this card permanently?')) return

        try {
            await deleteCard(cardId)
            setCards(cards.filter(c => c.id !== cardId))
            setSelectedCard(null)
            navigator.vibrate?.(100)
            showToast('Card deleted', 'success')
        } catch (err) {
            showToast('Failed to delete card', 'error')
        }
    }

    const handleDownload = (card, e) => {
        if (e) e.stopPropagation()

        const link = document.createElement('a')
        link.href = card.exportedImageUrl
        link.download = `festiva_${card.businessName?.replace(/[^a-z0-9]/gi, '_')}_${card.id}.png`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        showToast('Download started!', 'success')
    }

    const handleShare = async (card) => {
        if (navigator.share) {
            try {
                const response = await fetch(card.exportedImageUrl)
                const blob = await response.blob()
                const file = new File([blob], 'festiva_card.png', { type: 'image/png' })
                await navigator.share({ files: [file] })
            } catch (err) {
                handleDownload(card)
            }
        } else {
            handleDownload(card)
        }
    }

    const groupedCards = cards.reduce((groups, card) => {
        const dateGroup = formatDateGroup(card.createdAt)
        if (!groups[dateGroup]) {
            groups[dateGroup] = []
        }
        groups[dateGroup].push(card)
        return groups
    }, {})

    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between h-14">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 rounded-lg hover:bg-neutral-100 flex items-center justify-center transition-colors"
                >
                    <IconArrowLeft size={20} className="text-neutral-600" />
                </button>

                <h1 className="text-lg font-semibold text-neutral-900">Card History</h1>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedBusinessFilter ? 'bg-primary-orange/10 text-primary-orange' : 'hover:bg-neutral-100 text-neutral-600'}`}
                >
                    <IconFilter size={20} />
                </button>
            </header>

            {showFilters && (
                <div className="bg-white border-b border-neutral-200 p-4">
                    <p className="text-sm font-medium text-neutral-700 mb-2">Filter by business</p>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedBusinessFilter(null)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedBusinessFilter ? 'bg-primary-orange text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                        >
                            All
                        </button>
                        {businesses.map(business => (
                            <button
                                key={business.id}
                                onClick={() => setSelectedBusinessFilter(business.id)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedBusinessFilter === business.id ? 'bg-primary-orange text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                            >
                                {business.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <main className="p-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : cards.length === 0 ? (
                    <EmptyState
                        emoji="📸"
                        title="No Cards Yet"
                        description="Your created festival cards will appear here"
                        actionLabel="Create Your First Card"
                        onAction={() => navigate('/create')}
                    />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedCards).map(([dateGroup, groupCards]) => (
                            <div key={dateGroup}>
                                <h2 className="text-sm font-medium text-neutral-500 mb-3">{dateGroup}</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {groupCards.map(card => (
                                        <div
                                            key={card.id}
                                            onClick={() => handleCardClick(card)}
                                            className="bg-white rounded-xl border border-neutral-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
                                        >
                                            <div className={`relative ${card.format === 'portrait' ? 'aspect-[9/16]' : 'aspect-square'}`}>
                                                <img src={card.exportedImageUrl} alt="Card" className="w-full h-full object-cover" />

                                                {/* Quick action buttons - Download + Delete */}
                                                <div className="absolute top-2 right-2 flex gap-1.5">
                                                    <button
                                                        onClick={(e) => handleDownload(card, e)}
                                                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
                                                        title="Download"
                                                    >
                                                        <IconDownload size={16} className="text-neutral-700" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(card.id, e)}
                                                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group"
                                                        title="Delete"
                                                    >
                                                        <IconTrash size={16} className="text-neutral-700 group-hover:text-white" />
                                                    </button>
                                                </div>

                                                {/* Tap to edit indicator */}
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-1">
                                                    <IconEdit size={10} className="text-white" />
                                                    <span className="text-[9px] text-white font-medium">Tap to edit</span>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <p className="text-xs font-medium text-neutral-900 truncate">{card.businessName}</p>
                                                <p className="text-xs text-neutral-400">{formatRelativeTime(card.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Preview Modal with Edit option */}
            {selectedCard && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedCard(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                            <h3 className="font-semibold text-neutral-900">{selectedCard.businessName}</h3>
                            <button onClick={() => setSelectedCard(null)} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center">
                                <IconX size={20} className="text-neutral-600" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[55vh]">
                            <img src={selectedCard.exportedImageUrl} alt="Card preview" className="w-full h-auto rounded-lg" />
                        </div>
                        <div className="p-4 border-t border-neutral-200 space-y-3">
                            {/* Primary: Edit button */}
                            <Button
                                variant="primary"
                                size="md"
                                fullWidth
                                onClick={() => handleCardEdit(selectedCard)}
                                leftIcon={<IconEdit size={18} />}
                            >
                                Edit & Re-export
                            </Button>

                            {/* Secondary row: Download + Share */}
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="secondary" size="md" onClick={() => handleDownload(selectedCard)} leftIcon={<IconDownload size={18} />}>
                                    Download
                                </Button>
                                <Button variant="secondary" size="md" onClick={() => handleShare(selectedCard)} leftIcon={<IconShare2 size={18} />}>
                                    Share
                                </Button>
                            </div>

                            {/* Delete */}
                            <Button variant="ghost" size="sm" fullWidth onClick={(e) => handleDelete(selectedCard.id, e)} leftIcon={<IconTrash size={16} />} className="!text-error hover:!bg-error/10">
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
