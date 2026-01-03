// Step 2: Upload Festival Image - FIXED (no auto-cropping)

import { useState, useRef } from 'react'
import { IconUpload, IconPhoto, IconX, IconRefresh, IconCheck } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'
import { compressImage, createObjectURL, revokeObjectURL } from '../../utils/imageCompression'

export default function Step2UploadImage() {
    const { cardCreation, setFestivalImage } = useAppStore()
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    const previewUrl = cardCreation.festivalImage

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Image is too large. Maximum size is 10MB')
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const compressed = await compressImage(file, { maxSizeMB: 2, maxWidthOrHeight: 2048 })
            const url = createObjectURL(compressed)
            setFestivalImage(url)
            useAppStore.setState(state => ({
                cardCreation: { ...state.cardCreation, festivalImage: url, festivalImageFile: compressed }
            }))
        } catch (err) {
            console.error('Upload failed:', err)
            setError('Failed to process image. Please try again.')
        } finally {
            setIsUploading(false)
        }

        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleRemove = () => {
        if (previewUrl) revokeObjectURL(previewUrl)
        setFestivalImage(null)
        useAppStore.setState(state => ({
            cardCreation: { ...state.cardCreation, festivalImage: null, festivalImageFile: null }
        }))
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Upload Festival Image</h2>
            <p className="text-sm text-neutral-500 mb-4">Select a festival greeting image from your gallery</p>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

            {previewUrl ? (
                <div className="space-y-3">
                    {/* Preview - FIXED: Shows full image without cropping */}
                    <div className="relative bg-neutral-900 rounded-xl overflow-hidden border-2 border-neutral-200 shadow-lg">
                        <img
                            src={previewUrl}
                            alt="Festival image preview"
                            className="w-full h-auto"
                            style={{
                                display: 'block',
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                objectFit: 'contain', // FIXED: Shows full image, no cropping
                                margin: '0 auto'
                            }}
                        />

                        {/* Success badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg shadow-lg text-sm font-medium">
                            <IconCheck size={16} />
                            Uploaded
                        </div>

                        {/* Format indicator */}
                        <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                            {cardCreation.format === 'portrait' ? '9:16 Portrait' : '1:1 Square'}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 h-11 rounded-xl bg-white border-2 border-neutral-200 font-medium text-neutral-700 flex items-center justify-center gap-2 hover:border-neutral-300 active:scale-[0.98] transition-all"
                        >
                            <IconRefresh size={18} />
                            Change Image
                        </button>
                        <button
                            onClick={handleRemove}
                            className="h-11 px-4 rounded-xl bg-white border-2 border-neutral-200 text-neutral-500 flex items-center justify-center hover:border-red-300 hover:text-red-500 active:scale-[0.98] transition-all"
                        >
                            <IconX size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`w-full rounded-xl border-2 border-dashed aspect-[4/3] flex flex-col items-center justify-center gap-4 transition-all duration-200 ${isUploading ? 'border-primary-orange bg-primary-orange/5' : 'border-neutral-300 hover:border-primary-orange hover:bg-neutral-50'
                        }`}
                >
                    {isUploading ? (
                        <>
                            <div className="w-12 h-12 rounded-full border-2 border-neutral-300 border-t-primary-orange animate-spin" />
                            <p className="text-sm text-neutral-600">Processing image...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 rounded-full bg-gradient-festival flex items-center justify-center">
                                <IconPhoto size={40} className="text-white" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-neutral-900">Tap to upload image</p>
                                <p className="text-sm text-neutral-500 mt-1">JPG, PNG, or WebP</p>
                            </div>
                            <div className="flex items-center gap-2 text-primary-orange">
                                <IconUpload size={20} />
                                <span className="font-medium">Select from gallery</span>
                            </div>
                        </>
                    )}
                </button>
            )}

            {error && <p className="mt-3 text-sm text-error text-center">{error}</p>}

            <div className="mt-6 p-4 bg-neutral-100 rounded-xl">
                <h3 className="font-medium text-neutral-900 mb-2">💡 Tips</h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• Full image will be preserved (no cropping)</li>
                    <li>• Black bars may appear if aspect ratio differs</li>
                    <li>• Use pinch-zoom in next step to adjust</li>
                </ul>
            </div>
        </div>
    )
}
