import { Link } from 'react-router-dom'
import { IconSettings } from '@tabler/icons-react'

export function Header({ showSettings = true }) {
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between h-14">
            {/* Logo/Brand */}
            <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-festival rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🎉</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-neutral-900 font-display">
                        Festiva
                    </h1>
                    <p className="text-xs text-neutral-500">
                        Business Cards
                    </p>
                </div>
            </Link>

            {/* Settings Icon */}
            {showSettings && (
                <button
                    className="w-10 h-10 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 flex items-center justify-center transition-colors duration-200"
                    aria-label="Settings"
                >
                    <IconSettings size={20} className="text-neutral-600" />
                </button>
            )}
        </header>
    )
}

export default Header
