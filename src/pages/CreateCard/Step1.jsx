// Step 1: Select Business & Format

import { useAppStore } from '../../store/useAppStore'
import { IconSquare, IconDeviceMobile, IconCheck } from '@tabler/icons-react'

export default function Step1SelectBusiness() {
    const { businesses, cardCreation, selectBusiness, setCardFormat } = useAppStore()

    const selectedBusinessId = cardCreation.businessId
    const selectedFormat = cardCreation.format

    const handleSelectBusiness = (id) => {
        selectBusiness(id)
        useAppStore.setState(state => ({
            cardCreation: { ...state.cardCreation, businessId: id }
        }))
    }

    const handleSelectFormat = (format) => {
        setCardFormat(format)
    }

    return (
        <div className="p-4 space-y-6">
            <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">Select Business</h2>
                <div className="space-y-3">
                    {businesses.map((business) => (
                        <button
                            key={business.id}
                            onClick={() => handleSelectBusiness(business.id)}
                            className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 ${selectedBusinessId === business.id ? 'border-primary-orange bg-primary-orange/5 shadow-md' : 'border-neutral-200 bg-white hover:border-neutral-300'
                                }`}
                        >
                            {business.logo ? (
                                <img src={business.logo} alt={business.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                                <div className="w-14 h-14 rounded-lg bg-gradient-festival flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">🏪</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-neutral-900 truncate">{business.name}</h3>
                                <p className="text-sm text-neutral-500 truncate">{business.phone}</p>
                            </div>
                            {selectedBusinessId === business.id && (
                                <div className="w-6 h-6 rounded-full bg-primary-orange flex items-center justify-center flex-shrink-0">
                                    <IconCheck size={16} className="text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-3">Select Format</h2>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleSelectFormat('square')}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${selectedFormat === 'square' ? 'border-primary-orange bg-primary-orange/5 shadow-md' : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }`}
                    >
                        <div className={`w-16 h-16 mx-auto mb-3 rounded-lg border-2 flex items-center justify-center ${selectedFormat === 'square' ? 'border-primary-orange' : 'border-neutral-300'}`}>
                            <IconSquare size={32} className={selectedFormat === 'square' ? 'text-primary-orange' : 'text-neutral-400'} />
                        </div>
                        <h3 className="font-semibold text-neutral-900">Square</h3>
                        <p className="text-xs text-neutral-500 mt-1">1080 × 1080</p>
                        <p className="text-xs text-neutral-400">Instagram, Facebook</p>
                    </button>

                    <button
                        onClick={() => handleSelectFormat('portrait')}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${selectedFormat === 'portrait' ? 'border-primary-orange bg-primary-orange/5 shadow-md' : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }`}
                    >
                        <div className={`w-10 h-16 mx-auto mb-3 rounded-lg border-2 flex items-center justify-center ${selectedFormat === 'portrait' ? 'border-primary-orange' : 'border-neutral-300'}`}>
                            <IconDeviceMobile size={24} className={selectedFormat === 'portrait' ? 'text-primary-orange' : 'text-neutral-400'} />
                        </div>
                        <h3 className="font-semibold text-neutral-900">Portrait</h3>
                        <p className="text-xs text-neutral-500 mt-1">1080 × 1920</p>
                        <p className="text-xs text-neutral-400">Stories, Status</p>
                    </button>
                </div>
            </section>
        </div>
    )
}
