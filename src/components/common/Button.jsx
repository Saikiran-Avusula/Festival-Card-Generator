import { forwardRef } from 'react'

const variants = {
    primary: `
    bg-gradient-festival text-white font-semibold
    shadow-festival hover:shadow-xl
    active:scale-95
  `,
    secondary: `
    bg-white text-neutral-700 font-medium
    border-2 border-neutral-200
    hover:border-primary-orange hover:text-primary-orange
    active:scale-95
  `,
    ghost: `
    bg-transparent text-neutral-600 font-medium
    hover:bg-neutral-100
    active:bg-neutral-200
  `,
    danger: `
    bg-error text-white font-semibold
    hover:bg-error-dark
    active:scale-95
  `,
}

const sizes = {
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-12 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-xl',
    xl: 'h-16 px-10 text-lg rounded-2xl',
}

export const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}, ref) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus:ring-4 focus:ring-primary-orange/20
  `

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <>
                    <LoadingSpinner size={size === 'sm' ? 16 : 20} />
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    )
})

Button.displayName = 'Button'

// Small inline loading spinner for button
function LoadingSpinner({ size = 20 }) {
    return (
        <svg
            className="animate-spin"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

export default Button
