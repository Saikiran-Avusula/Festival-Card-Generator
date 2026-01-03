export function PageContainer({
    children,
    className = '',
    noPadding = false,
}) {
    return (
        <main
            className={`
        min-h-[calc(100vh-56px)]
        ${noPadding ? '' : 'p-4'}
        ${className}
      `}
        >
            {children}
        </main>
    )
}

export default PageContainer
