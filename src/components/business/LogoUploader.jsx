import { useState, useRef } from 'react'
import { IconCamera, IconX } from '@tabler/icons-react'
import { validateLogo } from '../../utils/validators'

export function LogoUploader({
    value,
    onChange,
    error,
}) {
    const [isUploading, setIsUploading] = useState(false)
    const inputRef = useRef(null)

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        const validationError = validateLogo(file)
        if (validationError) {
            onChange(null, validationError)
            return
        }

        setIsUploading(true)

        try {
            // Convert to base64 for preview
            const reader = new FileReader()
            reader.onloadend = () => {
                onChange(reader.result, null)
                setIsUploading(false)
            }
            reader.onerror = () => {
                onChange(null, 'Failed to read image')
                setIsUploading(false)
            }
            reader.readAsDataURL(file)
        } catch (err) {
            onChange(null, 'Failed to process image')
            setIsUploading(false)
        }

        // Reset input
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const handleRemove = () => {
        onChange(null, null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <label className="text-sm font-medium text-neutral-700">
                Upload Logo / Photo (Optional)
            </label>

            {/* Upload area */}
            <div className="relative">
                {/* Preview or placeholder */}
                {value ? (
                    <div className="relative">
                        <img
                            src={value}
                            alt="Business logo preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-neutral-200"
                        />
                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neutral-900 text-white shadow-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"
                            aria-label="Remove logo"
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                ) : (
                    <div
                        className={`
              w-32 h-32 rounded-full
              bg-gradient-to-br from-neutral-100 to-neutral-200
              border-2 border-dashed
              ${error ? 'border-error' : 'border-neutral-300'}
              flex items-center justify-center
              ${isUploading ? 'animate-pulse' : ''}
            `}
                    >
                        {isUploading ? (
                            <div className="w-10 h-10 rounded-full border-2 border-neutral-300 border-t-primary-orange animate-spin" />
                        ) : (
                            <span className="text-4xl text-neutral-400">📷</span>
                        )}
                    </div>
                )}

                {/* Upload button overlay */}
                <label
                    className={`
            absolute bottom-0 right-0
            w-10 h-10 rounded-full
            bg-primary-orange shadow-lg
            flex items-center justify-center
            cursor-pointer
            hover:scale-110 active:scale-95
            transition-transform duration-200
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
                >
                    <IconCamera size={20} className="text-white" />
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        aria-label="Upload business logo"
                    />
                </label>
            </div>

            {/* Helper text */}
            {error ? (
                <p className="text-xs text-error text-center">{error}</p>
            ) : (
                <p className="text-xs text-neutral-500 text-center max-w-xs">
                    Upload your business logo or owner photo
                    <br />
                    <span className="text-neutral-400">(JPG, PNG, or WebP, max 5MB)</span>
                </p>
            )}
        </div>
    )
}

export default LogoUploader
