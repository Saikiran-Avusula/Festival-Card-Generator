// Card Creation Flow - 3-step process with Edit Mode support

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IconArrowLeft, IconArrowRight, IconX, IconEdit } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import Step1SelectBusiness from './Step1'
import Step2UploadImage from './Step2'
import Step3CustomizeBanner from './Step3'
import Button from '../../components/common/Button'

const STEPS = [
    { id: 1, title: 'Select Business', subtitle: 'Choose format' },
    { id: 2, title: 'Upload Image', subtitle: 'Festival photo' },
    { id: 3, title: 'Customize', subtitle: 'Banner style' },
]

export default function CreateCard() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { cardCreation, resetCardCreation, businesses } = useAppStore()

    // Check if we're in edit mode
    const isEditMode = searchParams.get('edit') === 'true' || !!cardCreation.editingCardId

    const getInitialStep = () => {
        // If editing, start at Step 3 (customize)
        if (isEditMode && cardCreation.festivalImage) return 3
        if (cardCreation.festivalImage) return 3
        if (cardCreation.businessId && cardCreation.format) return 2
        return 1
    }

    const [currentStep, setCurrentStep] = useState(getInitialStep)

    useEffect(() => {
        // Only redirect if not in edit mode and no businesses
        if (!isEditMode && businesses.length === 0) {
            navigate('/profile/new')
        }
    }, [businesses, navigate, isEditMode])

    const canProceedStep1 = cardCreation.businessId && cardCreation.format
    const canProceedStep2 = cardCreation.festivalImage
    const canProceedStep3 = true

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        } else {
            navigate('/preview')
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            // In edit mode, going back from Step 3 returns to history
            if (isEditMode && currentStep === 3) {
                if (window.confirm('Discard changes?')) {
                    resetCardCreation()
                    navigate('/history')
                }
            } else {
                setCurrentStep(currentStep - 1)
            }
        } else {
            handleClose()
        }
    }

    const handleClose = () => {
        if (cardCreation.festivalImage || cardCreation.businessId) {
            if (window.confirm(isEditMode ? 'Discard changes?' : 'Discard this card?')) {
                resetCardCreation()
                navigate(isEditMode ? '/history' : '/')
            }
        } else {
            navigate(isEditMode ? '/history' : '/')
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1: return canProceedStep1
            case 2: return canProceedStep2
            case 3: return canProceedStep3
            default: return false
        }
    }

    const getButtonText = () => {
        if (currentStep === 3) return isEditMode ? 'Save & Export' : 'Preview & Export'
        return 'Continue'
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between h-14">
                <button onClick={handleBack} className="w-10 h-10 rounded-lg hover:bg-neutral-100 flex items-center justify-center">
                    <IconArrowLeft size={20} className="text-neutral-600" />
                </button>
                <div className="text-center">
                    {isEditMode ? (
                        <>
                            <h1 className="text-base font-semibold text-neutral-900 flex items-center justify-center gap-1.5">
                                <IconEdit size={16} className="text-primary-orange" />
                                Edit Card
                            </h1>
                            <p className="text-xs text-neutral-500">Customize & re-export</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-base font-semibold text-neutral-900">{STEPS[currentStep - 1].title}</h1>
                            <p className="text-xs text-neutral-500">Step {currentStep} of 3</p>
                        </>
                    )}
                </div>
                <button onClick={handleClose} className="w-10 h-10 rounded-lg hover:bg-neutral-100 flex items-center justify-center">
                    <IconX size={20} className="text-neutral-600" />
                </button>
            </header>

            {/* Progress bar - show all filled in edit mode */}
            <div className="bg-white px-4 py-2 border-b border-neutral-100">
                <div className="flex gap-2">
                    {STEPS.map((step) => (
                        <div
                            key={step.id}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${isEditMode || step.id <= currentStep ? 'bg-primary-orange' : 'bg-neutral-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Edit mode info banner */}
            {isEditMode && currentStep === 3 && (
                <div className="bg-primary-orange/10 border-b border-primary-orange/20 px-4 py-2">
                    <p className="text-xs text-primary-orange font-medium text-center">
                        ✏️ Editing existing card • Changes will create a new version
                    </p>
                </div>
            )}

            <main className="flex-1 overflow-y-auto pb-24">
                {currentStep === 1 && <Step1SelectBusiness />}
                {currentStep === 2 && <Step2UploadImage />}
                {currentStep === 3 && <Step3CustomizeBanner />}
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4">
                <div className="flex gap-3 max-w-lg mx-auto">
                    {(currentStep > 1 || isEditMode) && (
                        <Button variant="secondary" size="lg" onClick={handleBack}>
                            {isEditMode && currentStep === 3 ? 'Cancel' : 'Back'}
                        </Button>
                    )}
                    <Button variant="primary" size="lg" fullWidth onClick={handleNext} disabled={!canProceed()} rightIcon={<IconArrowRight size={20} />}>
                        {getButtonText()}
                    </Button>
                </div>
            </div>
        </div>
    )
}

