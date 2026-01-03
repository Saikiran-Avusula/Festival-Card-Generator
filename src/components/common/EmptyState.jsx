import Button from './Button'

export function EmptyState({
    icon,
    emoji,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}) {
    return (
        <div className={`py-12 px-6 text-center ${className}`}>
            {/* Icon or Emoji */}
            {(icon || emoji) && (
                <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                    {icon ? (
                        <span className="text-neutral-400">{icon}</span>
                    ) : (
                        <span className="text-4xl">{emoji}</span>
                    )}
                </div>
            )}

            {/* Title */}
            {title && (
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {title}
                </h3>
            )}

            {/* Description */}
            {description && (
                <p className="text-sm text-neutral-600 mb-6 max-w-xs mx-auto">
                    {description}
                </p>
            )}

            {/* Action Button */}
            {actionLabel && onAction && (
                <Button variant="primary" size="md" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}

// Specialized empty states
export function NoBusinessesEmpty({ onCreateClick }) {
    return (
        <EmptyState
            emoji="🏪"
            title="No Business Profiles Yet"
            description="Create your first business profile to start making festival cards"
            actionLabel="Create Business Profile"
            onAction={onCreateClick}
        />
    )
}

export function NoCardsEmpty() {
    return (
        <div className="py-8 px-4 text-center bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300">
            <span className="text-4xl mb-3 block">📸</span>
            <p className="text-sm text-neutral-600">
                Your created cards will appear here
            </p>
        </div>
    )
}

export default EmptyState
