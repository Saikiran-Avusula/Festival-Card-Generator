/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary - Festival Orange (Diwali vibes)
                'primary-orange': {
                    DEFAULT: '#FF6B35',
                    light: '#FF8C5A',
                    dark: '#E55520',
                },
                // Secondary - Festival Gold (Prosperity)
                'primary-gold': {
                    DEFAULT: '#F7B731',
                    light: '#F9C856',
                    dark: '#E5A510',
                },
                // Accent - Celebration Red
                'primary-red': {
                    DEFAULT: '#EE5A6F',
                    light: '#F27B8D',
                    dark: '#DC3F55',
                },
                // Semantic colors
                success: {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                },
                error: {
                    DEFAULT: '#EF4444',
                    light: '#F87171',
                    dark: '#DC2626',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#FBBF24',
                    dark: '#D97706',
                },
                info: {
                    DEFAULT: '#3B82F6',
                    light: '#60A5FA',
                    dark: '#2563EB',
                },
                // Neutral palette
                neutral: {
                    50: '#FAFAFA',
                    100: '#F5F5F5',
                    200: '#E5E5E5',
                    300: '#D4D4D4',
                    400: '#A3A3A3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
            fontFamily: {
                display: ['Poppins', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
                body: ['Inter', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
                telugu: ['Noto Sans Telugu', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-festival': 'linear-gradient(135deg, #FF6B35 0%, #F7B731 100%)',
                'gradient-diwali': 'linear-gradient(135deg, #FF6B35 0%, #EE5A6F 100%)',
                'gradient-sankranti': 'linear-gradient(135deg, #F7B731 0%, #10B981 100%)',
                'gradient-sunset': 'linear-gradient(135deg, #EE5A6F 0%, #8B5CF6 100%)',
            },
            boxShadow: {
                'festival': '0 10px 40px -10px rgba(255, 107, 53, 0.3)',
                'festival-lg': '0 20px 50px -10px rgba(255, 107, 53, 0.4)',
            },
            borderRadius: {
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
                '2xl': '32px',
            },
            spacing: {
                '14': '3.5rem',
                '18': '4.5rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.15s ease-out',
                'pulse-slow': 'pulse 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
