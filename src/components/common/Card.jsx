export function Card({
    children,
    onClick,
    hoverable = false,
    className = '',
    ...props
}) {
    const isClickable = Boolean(onClick)

    return (
        <div
            onClick={onClick}
            className={`
        bg-white
        rounded-xl
        border-2 border-neutral-200
        ${isClickable ? 'cursor-pointer' : ''}
        ${hoverable || isClickable
                    ? 'hover:border-primary-orange hover:shadow-lg active:scale-[0.98] transition-all duration-200'
                    : ''
                }
        ${className}
      `}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={isClickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick?.(e)
                }
            } : undefined}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
