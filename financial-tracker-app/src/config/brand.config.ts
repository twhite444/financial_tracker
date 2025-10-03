/**
 * Brand Configuration
 * -------------------------------------------------
 * Central configuration for all branding, colors, and assets.
 * Change values here to rebrand the entire application.
 */

export const brandConfig = {
  // Brand Identity
  name: {
    full: 'Casharoo',
    short: 'Casharoo',
    tagline: 'Personal finance, with personality.',
  },

  // Logo Assets (all paths relative to public/)
  assets: {
    mark: '/logos/casharoo-mark.png',           // Main icon/mark
    coin: '/logos/casharoo-coin.png',           // Circular variant
    wordmark: '/logos/casharoo-wordmark.png',   // Horizontal text logo
    fullLogo: '/logos/casharoo-full-logo.png',  // Mark + wordmark combined
    favicon: '/logos/casharoo-favicon.png',     // Browser icon
  },

  // Logo Display Sizes (Tailwind classes)
  sizes: {
    mark: {
      small: 'w-8 h-8',
      default: 'w-16 h-16',
      large: 'w-24 h-24',
    },
    coin: {
      small: 'w-8 h-8',
      default: 'w-16 h-16',
      large: 'w-24 h-24',
    },
    wordmark: {
      small: 'h-4',
      default: 'h-8',
      large: 'h-12',
    },
    fullLogo: {
      small: 'h-8',
      default: 'h-12',
      large: 'h-16',
    },
    favicon: {
      small: 'w-4 h-4',
      default: 'w-8 h-8',
      large: 'w-12 h-12',
    },
  },

  // Color Palette (CSS variable names without --)
  colors: {
    // Primary brand color
    primary: {
      50: 'var(--brand-primary-50)',
      100: 'var(--brand-primary-100)',
      200: 'var(--brand-primary-200)',
      300: 'var(--brand-primary-300)',
      400: 'var(--brand-primary-400)',
      500: 'var(--brand-primary-500)',
      600: 'var(--brand-primary-600)',
      700: 'var(--brand-primary-700)',
      800: 'var(--brand-primary-800)',
      900: 'var(--brand-primary-900)',
      950: 'var(--brand-primary-950)',
    },
    // Accent color (coin/gold)
    accent: {
      400: 'var(--brand-accent-400)',
      500: 'var(--brand-accent-500)',
      600: 'var(--brand-accent-600)',
      700: 'var(--brand-accent-700)',
      800: 'var(--brand-accent-800)',
      900: 'var(--brand-accent-900)',
    },
    // Secondary accent
    secondary: {
      400: 'var(--brand-secondary-400)',
      500: 'var(--brand-secondary-500)',
      600: 'var(--brand-secondary-600)',
      700: 'var(--brand-secondary-700)',
      800: 'var(--brand-secondary-800)',
      900: 'var(--brand-secondary-900)',
    },
    // Tertiary accent
    tertiary: {
      500: 'var(--brand-tertiary-500)',
      600: 'var(--brand-tertiary-600)',
      700: 'var(--brand-tertiary-700)',
      800: 'var(--brand-tertiary-800)',
      900: 'var(--brand-tertiary-900)',
    },
  },

  // Animation Settings
  animations: {
    hopDuration: 1200,      // ms for bounce animation
    coinSpinDuration: 1100, // ms for coin rotation
    pulseDuration: 1200,    // ms for pulse effect
    backgroundCycle: 6000,  // ms between background changes
  },

  // Spacing (using theme metaphor)
  spacing: {
    xs: 'var(--brand-space-xs)',
    sm: 'var(--brand-space-sm)',
    md: 'var(--brand-space-md)',
    lg: 'var(--brand-space-lg)',
    xl: 'var(--brand-space-xl)',
    '2xl': 'var(--brand-space-2xl)',
    '3xl': 'var(--brand-space-3xl)',
  },

  // Border Radius
  radius: {
    sm: 'var(--brand-radius-sm)',
    md: 'var(--brand-radius-md)',
    lg: 'var(--brand-radius-lg)',
    xl: 'var(--brand-radius-xl)',
    '2xl': 'var(--brand-radius-2xl)',
    '3xl': 'var(--brand-radius-3xl)',
    full: 'var(--brand-radius-full)',
  },

  // Shadows
  shadows: {
    brand: 'var(--brand-shadow-brand)',
    accent: 'var(--brand-shadow-accent)',
  },
} as const

// Type-safe getters
export const getBrandName = (type: 'full' | 'short' = 'full') => brandConfig.name[type]
export const getAssetPath = (asset: keyof typeof brandConfig.assets) => brandConfig.assets[asset]
export const getLogoSize = (logo: keyof typeof brandConfig.sizes, size: 'small' | 'default' | 'large' = 'default') => brandConfig.sizes[logo][size]
export const getColor = (palette: keyof typeof brandConfig.colors, shade: string) => {
  const colorPalette = brandConfig.colors[palette] as Record<string, string>
  return colorPalette[shade] || colorPalette['500']
}
