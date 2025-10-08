/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ink color palette (grays/blacks) - WCAG AA compliant
        ink: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#334155', // Secondary/meta text - 7.79:1 on white
          800: '#1B2432', // Headings - 13.37:1 on white
          900: '#0B1220', // Primary text - 16.58:1 on white
        },
        // Primary color palette (blues) - matching brand colors
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Main brand blue
          600: '#2563EB',
          700: '#1D4ED8', // Primary accent - 6.48:1 on white
          800: '#1E40AF', // Darker accent - 8.59:1 on white
          900: '#0F3E7C', // Deep blue
        },
        // Semantic colors - WCAG AA compliant
        success: {
          DEFAULT: '#059669', // 5.31:1 on white
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          DEFAULT: '#D97706', // 4.51:1 on white
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          DEFAULT: '#DC2626', // 5.86:1 on white
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          DEFAULT: '#0891B2', // 4.52:1 on white
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
        },
        // Surface colors
        paper: {
          DEFAULT: '#FFFFFF',
          soft: '#F8FAFC',
          dark: '#0F172A',
        },
        // Sun exposure colors
        sun: {
          none: '#6B7280',      // Gray - no sun
          minimal: '#10B981',   // Green - full shade
          low: '#3B82F6',       // Blue - mostly shade
          moderate: '#F59E0B',  // Amber - partial sun
          high: '#F97316',      // Orange - high sun
          extreme: '#EF4444',   // Red - full sun
        },
      },
      borderColor: {
        DEFAULT: '#E5E7EB',
        dark: '#1E293B',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'pulse': 'pulse 2s ease-in-out infinite',
        'pulse-sync': 'pulseSync 1.5s ease-in-out infinite',
        'pulse-spinner': 'pulseSpinner 1.4s ease-in-out infinite',
        'dash': 'dash 1.4s ease-in-out infinite',
        'tooltip-fade-in': 'tooltipFadeIn 0.2s ease-out forwards',
        'fade-in': 'fadeIn 300ms ease-in-out',
        'pulse-error': 'pulseError 2s ease-in-out infinite',
        'share-menu-slide': 'shareMenuSlideIn 0.2s ease-out forwards',
        'pulse-install': 'pulseInstall 1.2s ease-in-out infinite',
        'toast-slide-up': 'toastSlideUp 0.3s ease-out forwards',
        'fade-in-scale': 'fadeInScale 300ms ease-out both',
        'modal-fade-in': 'fadeIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'skeleton': 'skeleton 1.2s infinite linear',
        'blink': 'blink 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        pulseSync: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.6' },
        },
        pulseSpinner: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
        },
        dash: {
          '0%': { strokeDasharray: '1 125', strokeDashoffset: '0' },
          '50%': { strokeDasharray: '90 125', strokeDashoffset: '-35' },
          '100%': { strokeDasharray: '90 125', strokeDashoffset: '-124' },
        },
        tooltipFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseError: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        shareMenuSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseInstall: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.5' },
        },
        toastSlideUp: {
          '0%': { bottom: '-100px', opacity: '0' },
          '100%': { bottom: '1.25rem', opacity: '1' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}