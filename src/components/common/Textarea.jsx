import { forwardRef } from 'react'
import { IconAlertCircle } from '@tabler/icons-react'

export const Textarea = forwardRef(({
    label,
    error,
    helperText,
    required = false,
    showCharCount = false,
    maxLength,
    value = '',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const hasError = Boolean(error)
    const charCount = value.length
    const isNearLimit = maxLength && charCount >= maxLength - 10

    return (
        <div className={`space-y-2 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-neutral-700">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                value={value}
                maxLength={maxLength}
                className={`
          w-full px-4 py-3
          border-2 rounded-lg
          text-base text-neutral-900
          placeholder:text-neutral-400
          resize-none
          transition-all duration-200
          focus:outline-none focus:ring-4
          ${hasError
                        ? 'border-error focus:border-error focus:ring-error/10'
                        : 'border-neutral-200 focus:border-primary-orange focus:ring-primary-orange/10'
                    }
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${className}
        `}
                aria-invalid={hasError}
                aria-describedby={
                    error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
                }
                {...props}
            />

            <div className="flex justify-between items-center">
                {/* Error message */}
                {hasError ? (
                    <p
                        id={`${props.id}-error`}
                        className="text-xs text-error flex items-center gap-1"
                    >
                        <IconAlertCircle size={14} />
                        {error}
                    </p>
                ) : helperText ? (
                    <p id={`${props.id}-helper`} className="text-xs text-neutral-500">
                        {helperText}
                    </p>
                ) : (
                    <span />
                )}

                {/* Character count */}
                {showCharCount && maxLength && (
                    <p
                        className={`text-xs font-medium transition-colors ${isNearLimit ? 'text-warning' : 'text-neutral-400'
                            }`}
                    >
                        {charCount}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    )
})

Textarea.displayName = 'Textarea'

export default Textarea
