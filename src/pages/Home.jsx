import { useNavigate } from 'react-router-dom'
import { IconSparkles, IconPlus, IconHistory } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import Header from '../components/layout/Header'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/common/Button'
import { BusinessProfileCard } from '../components/business/BusinessProfileCard'
import { NoBusinessesEmpty, NoCardsEmpty } from '../components/common/EmptyState'
import { formatRelativeTime } from '../utils/formatters'
import { useEffect, useState } from 'react'
import { getCardHistory } from '../services/firebase/cardService'

export default function Home() {
    const navigate = useNavigate()
    const { businesses, selectedBusinessId, selectBusiness } = useAppStore()
    const [recentCards, setRecentCards] = useState([])
    const [isLoadingCards, setIsLoadingCards] = useState(true)

    useEffect(() => {
        loadRecentCards()
    }, [])

    const loadRecentCards = async () => {
        try {
            const cards = await getCardHistory()
            setRecentCards(cards.slice(0, 10))
        } catch (err) {
            console.error('Failed to load recent cards:', err)
        } finally {
            setIsLoadingCards(false)
        }
    }

    const handleBusinessClick = (business) => {
        selectBusiness(business.id)
        navigate('/profile/' + business.id + '/edit')
    }

    const handleCreateProfile = () => {
        navigate('/profile/new')
    }

    const handleCreateCard = () => {
        if (businesses.length === 0) {
            navigate('/profile/new')
        } else {
            navigate('/create')
        }
    }

    const handleViewHistory = () => {
        navigate('/history')
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            <Header />

            <PageContainer className="pb-24">
                <section className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-neutral-900 font-display">
                            Your Business Profiles
                        </h2>
                        {businesses.length > 0 && (
                            <button
                                onClick={handleCreateProfile}
                                className="text-sm text-primary-orange font-medium hover:underline flex items-center gap-1"
                            >
                                <IconPlus size={16} />
                                Add New
                            </button>
                        )}
                    </div>

                    {businesses.length === 0 ? (
                        <NoBusinessesEmpty onCreateClick={handleCreateProfile} />
                    ) : (
                        <div className="space-y-3">
                            {businesses.map((business) => (
                                <BusinessProfileCard
                                    key={business.id}
                                    business={business}
                                    isSelected={business.id === selectedBusinessId}
                                    onClick={() => handleBusinessClick(business)}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-neutral-900 font-display">
                            Recent Cards
                        </h2>
                        {recentCards.length > 0 && (
                            <button
                                onClick={handleViewHistory}
                                className="text-sm text-primary-orange font-medium hover:underline flex items-center gap-1"
                            >
                                <IconHistory size={16} />
                                View All
                            </button>
                        )}
                    </div>

                    {isLoadingCards ? (
                        <div className="py-8 text-center">
                            <div className="w-8 h-8 mx-auto rounded-full border-2 border-neutral-300 border-t-primary-orange animate-spin" />
                        </div>
                    ) : recentCards.length === 0 ? (
                        <NoCardsEmpty />
                    ) : (
                        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            <div className="flex gap-3 w-max">
                                {recentCards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="w-40 flex-shrink-0 bg-white rounded-lg border border-neutral-200 overflow-hidden cursor-pointer hover:shadow-lg active:scale-95 transition-all duration-200"
                                        onClick={() => navigate('/history')}
                                    >
                                        <img
                                            src={card.exportedImageUrl}
                                            alt="Card thumbnail"
                                            className={`w-full ${card.format === 'portrait' ? 'aspect-[9/16]' : 'aspect-square'} object-cover`}
                                        />
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
                    )}
                </section>
            </PageContainer>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-50 via-neutral-50 to-transparent pt-8">
                <Button
                    variant="primary"
                    size="xl"
                    fullWidth
                    onClick={handleCreateCard}
                    leftIcon={<IconSparkles size={24} />}
                    className="max-w-md mx-auto"
                >
                    Create Festival Card
                </Button>
            </div>
        </div>
    )
}
