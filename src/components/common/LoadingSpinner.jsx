export function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = '',
}) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    }

    const colors = {
        primary: 'text-primary-orange',
        white: 'text-white',
        neutral: 'text-neutral-400',
    }

    return (
        <div
            className={`${sizes[size]} ${colors[color]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <svg
                className="animate-spin w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
            <span className="sr-only">Loading...</span>
        </div>
    )
}

// Full-page loading overlay
export function LoadingOverlay({ message = 'Loading...' }) {
    return (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-neutral-600 font-medium">{message}</p>
        </div>
    )
}

export default LoadingSpinner
