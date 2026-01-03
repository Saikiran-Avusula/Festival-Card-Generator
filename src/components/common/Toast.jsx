import { useEffect } from 'react'
import { IconCheck, IconX, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'

const variants = {
    success: {
        bg: 'bg-success',
        icon: IconCheck,
    },
    error: {
        bg: 'bg-error',
        icon: IconX,
    },
    warning: {
        bg: 'bg-warning',
        icon: IconAlertTriangle,
    },
    info: {
        bg: 'bg-info',
        icon: IconInfoCircle,
    },
}

export function Toast({
    message,
    type = 'success',
    duration = 3000,
    onClose,
}) {
    const { bg, icon: Icon } = variants[type] || variants.success

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, onClose])

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[70] flex justify-center pointer-events-none">
            <div
                className={`
          ${bg}
          text-white
          px-4 py-3
          rounded-xl
          shadow-xl
          flex items-center gap-3
          max-w-sm w-full
          pointer-events-auto
          animate-slide-up
        `}
                role="alert"
                aria-live="polite"
            >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon size={18} />
                </div>
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Dismiss notification"
                >
                    <IconX size={18} />
                </button>
            </div>
        </div>
    )
}

export default Toast
