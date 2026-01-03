// Step 3: Customize Banner - FIXED PORTRAIT FORMAT

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useGesture } from '@use-gesture/react'
import { IconLayoutNavbar, IconLayoutBottombar, IconPalette, IconCheck, IconRefresh } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { COLOR_PRESETS, BANNER_STYLES } from '../../utils/constants'

export default function Step3CustomizeBanner() {
    const { cardCreation, setBannerStyle, setBannerPosition, setBannerColors, businesses, updateCardCreation } = useAppStore()
    const [previewKey, setPreviewKey] = useState(0)

    const [imageTransform, setImageTransform] = useState(
        cardCreation.imageTransform || { scale: 1, x: 0, y: 0 }
    )
    const [isDragging, setIsDragging] = useState(false)
    const imageTransformRef = useRef(imageTransform)

    const selectedBusiness = businesses.find(b => b.id === cardCreation.businessId)

    // Format-aware banner height (smaller for portrait)
    const bannerHeightPercent = cardCreation.format === 'portrait' ? 12 : 18

    useEffect(() => {
        setPreviewKey(prev => prev + 1)
    }, [cardCreation.bannerStyle, cardCreation.bannerPosition, cardCreation.bannerColors.background])

    useEffect(() => {
        imageTransformRef.current = imageTransform
    }, [imageTransform])

    const saveTransformToStore = useCallback(() => {
        const current = imageTransformRef.current
        if (
            cardCreation.imageTransform?.scale !== current.scale ||
            cardCreation.imageTransform?.x !== current.x ||
            cardCreation.imageTransform?.y !== current.y
        ) {
            updateCardCreation({ imageTransform: { ...current } })
        }
    }, [cardCreation.imageTransform, updateCardCreation])

    const bind = useGesture({
        onPinch: ({ offset: [scale] }) => {
            const clampedScale = Math.max(0.5, Math.min(4, scale))
            setImageTransform(prev => ({ ...prev, scale: clampedScale }))
        },
        onPinchEnd: () => saveTransformToStore(),
        onDrag: ({ offset: [x, y], first, last }) => {
            if (first) setIsDragging(true)
            if (last) {
                setIsDragging(false)
                saveTransformToStore()
            }
            setImageTransform(prev => ({ ...prev, x: x / prev.scale, y: y / prev.scale }))
        }
    }, {
        drag: { from: () => [imageTransform.x * imageTransform.scale, imageTransform.y * imageTransform.scale], filterTaps: true },
        pinch: { from: () => [imageTransform.scale, 0], scaleBounds: { min: 0.5, max: 4 } }
    })

    const handleReset = () => {
        const reset = { scale: 1, x: 0, y: 0 }
        setImageTransform(reset)
        updateCardCreation({ imageTransform: reset })
    }

    // Responsive banner content based on format
    const BannerContent = useMemo(() => {
        const style = cardCreation.bannerStyle
        const isPortrait = cardCreation.format === 'portrait'

        // Smaller sizes for portrait
        const logoSize = isPortrait ? 'w-6 h-6' : 'w-8 h-8'
        const nameSize = isPortrait ? 'text-[10px]' : 'text-xs'
        const phoneSize = isPortrait ? 'text-[8px]' : 'text-[10px]'

        if (style === 'poster') {
            return (
                <div className="flex flex-col items-center text-center py-1.5 px-2">
                    {selectedBusiness?.logo && <img src={selectedBusiness.logo} alt="" className={`${logoSize} rounded-full object-cover mb-0.5 border border-white/20`} />}
                    <p className={`font-bold ${nameSize} leading-tight`} style={{ color: cardCreation.bannerColors.text }}>{selectedBusiness?.name}</p>
                    <p className={`${phoneSize} opacity-90 mt-0.5`} style={{ color: cardCreation.bannerColors.text }}>📞 {selectedBusiness?.phone}</p>
                </div>
            )
        } else if (style === 'minimal') {
            return (
                <div className="flex items-center justify-center py-1.5 px-2 text-center">
                    <div>
                        <p className={`font-bold ${nameSize}`} style={{ color: cardCreation.bannerColors.text }}>{selectedBusiness?.name}</p>
                        <p className={`${phoneSize} opacity-80`} style={{ color: cardCreation.bannerColors.text }}>{selectedBusiness?.phone}</p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="flex items-center gap-1.5 py-1.5 px-2">
                    {selectedBusiness?.logo && <img src={selectedBusiness.logo} alt="" className={`${logoSize} rounded-full object-cover flex-shrink-0 border border-white/20`} />}
                    <div className="flex-1 min-w-0">
                        <p className={`font-bold ${nameSize} truncate leading-tight`} style={{ color: cardCreation.bannerColors.text }}>{selectedBusiness?.name}</p>
                        <p className={`${phoneSize} truncate opacity-90`} style={{ color: cardCreation.bannerColors.text }}>📞 {selectedBusiness?.phone}</p>
                    </div>
                </div>
            )
        }
    }, [cardCreation.bannerStyle, cardCreation.bannerColors, cardCreation.format, selectedBusiness])

    return (
        <div className="p-4 space-y-4">
            {/* Preview */}
            <section>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium text-neutral-700">
                        Preview ({cardCreation.format === 'portrait' ? '9:16' : '1:1'})
                    </h2>
                    <div className="flex items-center gap-2">
                        {imageTransform.scale !== 1 && (
                            <span className="text-xs text-neutral-500 font-mono">{Math.round(imageTransform.scale * 100)}%</span>
                        )}
                        <button onClick={handleReset} className="text-xs text-primary-orange font-medium flex items-center gap-1">
                            <IconRefresh size={12} />Reset
                        </button>
                    </div>
                </div>
                <p className="text-xs text-neutral-500 mb-2">Pinch to zoom, drag to adjust</p>

                {/* Preview container - max width for portrait */}
                <div className={cardCreation.format === 'portrait' ? 'max-w-[280px] mx-auto' : 'max-w-full'}>
                    <div
                        key={previewKey}
                        className="relative rounded-xl overflow-hidden border-2 border-neutral-200 shadow-lg bg-neutral-900"
                        style={{
                            paddingBottom: cardCreation.format === 'portrait' ? '177.78%' : '100%',
                            position: 'relative',
                            touchAction: 'none',
                            overflow: 'hidden' // Prevent overflow
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            {/* Festival Image */}
                            {cardCreation.festivalImage && (
                                <div
                                    {...bind()}
                                    className={`absolute inset-0 flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                                    style={{ touchAction: 'none' }}
                                >
                                    <img
                                        src={cardCreation.festivalImage}
                                        alt="Festival preview"
                                        className="pointer-events-none select-none"
                                        draggable={false}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            transform: `scale(${imageTransform.scale}) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
                                            transformOrigin: 'center',
                                            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Banner - FIXED HEIGHT for portrait */}
                            <div
                                className="absolute left-0 right-0 pointer-events-none overflow-hidden"
                                style={{
                                    [cardCreation.bannerPosition === 'top' ? 'top' : 'bottom']: 0,
                                    height: `${bannerHeightPercent}%`,
                                    backgroundColor: cardCreation.bannerColors.background,
                                    zIndex: 10
                                }}
                            >
                                {BannerContent}
                            </div>

                            {/* Badge */}
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium z-20 pointer-events-none">
                                {BANNER_STYLES[cardCreation.bannerStyle]?.name} • {cardCreation.bannerPosition}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Position */}
            <section>
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Position</h3>
                <div className="grid grid-cols-2 gap-2">
                    {['top', 'bottom'].map(pos => (
                        <button key={pos} onClick={() => setBannerPosition(pos)} className={`h-10 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${cardCreation.bannerPosition === pos ? 'bg-primary-orange text-white shadow-md' : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}>
                            {pos === 'top' ? <IconLayoutNavbar size={16} /> : <IconLayoutBottombar size={16} />}
                            <span className="capitalize">{pos}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Style */}
            <section>
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Style</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(BANNER_STYLES).map((style) => (
                        <button key={style.id} onClick={() => setBannerStyle(style.id)} className={`p-2.5 rounded-lg text-left relative transition-all ${cardCreation.bannerStyle === style.id ? 'bg-primary-orange/10 border-2 border-primary-orange' : 'bg-white border-2 border-neutral-200 hover:border-neutral-300'}`}>
                            {cardCreation.bannerStyle === style.id && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary-orange flex items-center justify-center"><IconCheck size={10} className="text-white" /></div>}
                            <span className="font-semibold text-sm text-neutral-900">{style.name}</span>
                            <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">{style.description}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Color */}
            <section>
                <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1.5"><IconPalette size={14} />Color</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {COLOR_PRESETS.map((preset, i) => (
                        <button key={i} onClick={() => setBannerColors({ background: preset.background, text: preset.text })} className={`flex-shrink-0 w-10 h-10 rounded-lg transition-all hover:scale-105 active:scale-95 ${cardCreation.bannerColors.background === preset.background ? 'ring-2 ring-primary-orange ring-offset-2 scale-110' : 'border-2 border-neutral-200'}`} style={{ backgroundColor: preset.background }} title={preset.name}>
                            {cardCreation.bannerColors.background === preset.background && <IconCheck size={16} style={{ color: preset.text }} className="mx-auto" />}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}
