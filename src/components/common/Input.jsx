import { forwardRef } from 'react'
import { IconAlertCircle } from '@tabler/icons-react'

export const Input = forwardRef(({
    label,
    error,
    helperText,
    leftElement,
    rightElement,
    required = false,
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const hasError = Boolean(error)

    return (
        <div className={`space-y-2 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-neutral-700">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {leftElement && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                        {leftElement}
                    </div>
                )}

                <input
                    ref={ref}
                    className={`
            w-full h-12 px-4
            ${leftElement ? 'pl-12' : ''}
            ${rightElement ? 'pr-12' : ''}
            border-2 rounded-lg
            text-base text-neutral-900
            placeholder:text-neutral-400
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

                {rightElement && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500">
                        {rightElement}
                    </div>
                )}
            </div>

            {/* Error message */}
            {hasError && (
                <p
                    id={`${props.id}-error`}
                    className="text-xs text-error flex items-center gap-1"
                >
                    <IconAlertCircle size={14} />
                    {error}
                </p>
            )}

            {/* Helper text */}
            {!hasError && helperText && (
                <p id={`${props.id}-helper`} className="text-xs text-neutral-500">
                    {helperText}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
