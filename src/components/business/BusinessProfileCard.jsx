import { IconPhone, IconChevronRight } from '@tabler/icons-react'
import Card from '../common/Card'

export function BusinessProfileCard({
    business,
    onClick,
    isSelected = false,
    showChevron = true,
}) {
    return (
        <Card
            onClick={onClick}
            className={`
        p-4 flex items-center gap-4
        ${isSelected ? 'border-primary-orange shadow-md' : ''}
      `}
        >
            {/* Logo */}
            {business.logo ? (
                <img
                    src={business.logo}
                    alt={`${business.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
            ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-festival flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏪</span>
                </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-base truncate">
                    {business.name}
                </h3>
                <p className="text-sm text-neutral-600 flex items-center gap-1 mt-1">
                    <IconPhone size={14} />
                    {business.phone}
                </p>
                <p className="text-xs text-neutral-500 mt-1 truncate">
                    {business.description}
                </p>
            </div>

            {/* Chevron */}
            {showChevron && (
                <IconChevronRight
                    size={20}
                    className="text-neutral-400 flex-shrink-0"
                />
            )}
        </Card>
    )
}

export default BusinessProfileCard
