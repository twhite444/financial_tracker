import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { brandConfig, getAssetPath, getBrandName, getLogoSize } from '../../config/brand.config'

/**
 * Brand Kit Component
 * -------------------------------------------------
 * Displays all brand assets, logos, and backgrounds.
 * Completely configurable via brand.config.ts - no hardcoded values.
 */

/******************************
 *        LOGO COMPONENTS      *
 ******************************/

interface LogoProps {
  className?: string
  size?: 'small' | 'default' | 'large'
}

// Main brand mark/icon
export const BrandMark = ({ className, size = 'default' }: LogoProps) => (
  <img 
    src={getAssetPath('mark')}
    alt={`${getBrandName('short')} mark`}
    className={className || getLogoSize('mark', size)}
    loading="lazy"
  />
)

// Circular logo variant
export const BrandCoin = ({ className, size = 'default' }: LogoProps) => (
  <img 
    src={getAssetPath('coin')}
    alt={`${getBrandName('short')} coin`}
    className={className || getLogoSize('coin', size)}
    loading="lazy"
  />
)

// Horizontal text logo
export const BrandWordmark = ({ className, size = 'default' }: LogoProps) => (
  <img 
    src={getAssetPath('wordmark')}
    alt={getBrandName('full')}
    className={className || getLogoSize('wordmark', size)}
    loading="lazy"
  />
)

// Small icon for favicons/tabs
export const BrandFavicon = ({ className, size = 'default' }: LogoProps) => (
  <img 
    src={getAssetPath('favicon')}
    alt={`${getBrandName('short')} icon`}
    className={className || getLogoSize('favicon', size)}
    loading="lazy"
  />
)

// Combined mark + wordmark
export const BrandFullLogo = ({ className, size = 'default' }: LogoProps) => (
  <img 
    src={getAssetPath('fullLogo')}
    alt={getBrandName('full')}
    className={className || getLogoSize('fullLogo', size)}
    loading="lazy"
  />
)

// Animated logo for loaders
export const BrandAnimatedLogo = ({ size = 56 }: { size?: number }) => (
  <motion.div
    className="inline-flex items-center justify-center"
    initial={{ y: 0 }}
    animate={{ y: [0, -8, 0] }}
    transition={{ 
      duration: brandConfig.animations.hopDuration / 1000, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }}
  >
    <img 
      src={getAssetPath('mark')}
      alt={getBrandName('short')}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  </motion.div>
)

/******************************
 *  BACKGROUND COMPONENTS     *
 ******************************/

interface BackgroundProps {
  children: React.ReactNode
}

// Gradient aurora background
const AuroraBackground = ({ children }: BackgroundProps) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(16,185,129,0.35),transparent),radial-gradient(40%_40%_at_80%_20%,rgba(245,158,11,0.25),transparent),radial-gradient(50%_50%_at_50%_80%,rgba(16,185,129,0.25),transparent)]" />
    <div className="absolute inset-0 backdrop-blur-[2px]" />
    <div className="relative z-10">{children}</div>
  </div>
)

// Diagonal stripes with noise
const StripesBackground = ({ children }: BackgroundProps) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 [background:repeating-linear-gradient(135deg,theme(colors.emerald.500)/6_0_8px,transparent_8px_16px)]" />
    <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.06\'/></svg>")'}} />
    <div className="relative z-10">{children}</div>
  </div>
)

// Conic gradient halo
const ConicHaloBackground = ({ children }: BackgroundProps) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.emerald.400),theme(colors.emerald.700),theme(colors.emerald.500),theme(colors.emerald.400))] opacity-20" />
    <div className="relative z-10">{children}</div>
  </div>
)

// Dotted grid
const DottedGridBackground = ({ children }: BackgroundProps) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 [background:radial-gradient(theme(colors.emerald.500)/15_1px,transparent_1px)] bg-[length:22px_22px]" />
    <div className="relative z-10">{children}</div>
  </div>
)

// Glass gradient
const GlassGradientBackground = ({ children }: BackgroundProps) => (
  <div className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 dark:from-emerald-900 dark:via-emerald-950 dark:to-black">
    <div className="relative z-10">{children}</div>
  </div>
)

/******************************
 *      LOADER COMPONENTS      *
 ******************************/

const LoaderPulse = () => (
  <motion.div
    className="size-12 rounded-full bg-emerald-500/80"
    initial={{ scale: 0.9, opacity: 0.7 }}
    animate={{ scale: [0.9, 1.06, 0.9], opacity: [0.7, 1, 0.7] }}
    transition={{ 
      duration: brandConfig.animations.pulseDuration / 1000, 
      repeat: Infinity, 
      ease: 'easeInOut' 
    }}
  />
)

const LoaderBars = () => (
  <div className="flex items-end gap-1 h-10">
    {[0, 1, 2, 3].map(i => (
      <motion.div
        key={i}
        className="w-2 rounded bg-emerald-500"
        initial={{ height: 6 }}
        animate={{ height: [6, 28, 10, 22, 6] }}
        transition={{ duration: 1.1 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
)

const LoaderCoinSpin = () => (
  <motion.div className="relative size-12">
    <motion.img
      src={getAssetPath('coin')}
      alt="Loading"
      className="size-12 rounded-full shadow"
      animate={{ rotateY: [0, 180, 360] }}
      transition={{ 
        duration: brandConfig.animations.coinSpinDuration / 1000, 
        repeat: Infinity, 
        ease: 'linear' 
      }}
      style={{ transformStyle: 'preserve-3d' }}
    />
  </motion.div>
)

/******************************
 *         DEMO COMPONENT      *
 ******************************/

const SplashCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="mx-auto max-w-xl p-8">
    <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-xl">
      <div className="p-6 flex items-center gap-4">
        <BrandCoin className="w-12 h-12" />
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-black/60 dark:text-white/60">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 border-t border-black/5 dark:border-white/10">
        {children}
      </div>
    </div>
  </div>
)

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="text-xs uppercase tracking-wider text-black/60 dark:text-white/60">{label}</div>
    {children}
  </div>
)

export default function BrandKit() {
  const [bgIndex, setBgIndex] = useState(0)
  const backgrounds = [
    AuroraBackground, 
    StripesBackground, 
    ConicHaloBackground, 
    DottedGridBackground, 
    GlassGradientBackground
  ]
  const BG = backgrounds[bgIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(i => (i + 1) % backgrounds.length)
    }, brandConfig.animations.backgroundCycle)
    return () => clearInterval(interval)
  }, [backgrounds.length])

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark size="small" />
          <BrandWordmark className="h-6" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={() => setBgIndex(i => (i + backgrounds.length - 1) % backgrounds.length)} 
            className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Prev bg
          </button>
          <span className="opacity-60">{bgIndex + 1} / {backgrounds.length}</span>
          <button 
            onClick={() => setBgIndex(i => (i + 1) % backgrounds.length)} 
            className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Next bg
          </button>
        </div>
      </div>

      <BG>
        <div className="py-10">
          <SplashCard title={getBrandName('full')} subtitle={brandConfig.name.tagline}>
            <div className="grid sm:grid-cols-2 gap-8">
              <Section label="Logo Variants">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <BrandMark />
                    <p className="text-xs mt-2 opacity-60">Mark</p>
                  </div>
                  <div className="text-center">
                    <BrandCoin />
                    <p className="text-xs mt-2 opacity-60">Coin</p>
                  </div>
                  <div className="text-center">
                    <BrandWordmark />
                    <p className="text-xs mt-2 opacity-60">Wordmark</p>
                  </div>
                  <div className="text-center">
                    <BrandFavicon />
                    <p className="text-xs mt-2 opacity-60">Favicon</p>
                  </div>
                </div>
              </Section>
              <Section label="Full Logo">
                <div className="flex items-center">
                  <BrandFullLogo />
                </div>
              </Section>
              <Section label="Loaders">
                <div className="flex items-center gap-6">
                  <LoaderPulse />
                  <LoaderBars />
                  <LoaderCoinSpin />
                  <BrandAnimatedLogo />
                </div>
              </Section>
              <Section label="CTA Example">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white shadow hover:shadow-lg transition-shadow">
                    Get Started
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/10">
                    Learn More
                  </button>
                </div>
              </Section>
            </div>
          </SplashCard>
        </div>
      </BG>

      <footer className="py-10 text-center text-xs opacity-60">
        Brand Kit • Configured via brand.config.ts • Aurora gradient (#1) default
      </footer>
    </div>
  )
}
