import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Casharoo – Logo & Loading Screen Kit
 * -------------------------------------------------
 * Updated to use custom PNG logos.
 * Replace placeholder images in public/logos/ directory with your own:
 * - casharoo-mark.png (main logo - square format, ~200x200px minimum)
 * - casharoo-coin.png (circular variant - square format, ~200x200px minimum)
 * - casharoo-wordmark.png (horizontal text logo - ~600x200px, transparent bg)
 * - casharoo-full-logo.png (mark + wordmark combined - ~600x200px)
 * - casharoo-favicon.png (small icon - 64x64px minimum for favicon)
 */

/******************************
 *        LOGO VARIANTS        *
 ******************************/

// 1) Roo Mark (main logo - your primary brand mark)
export const CasharooMark = ({ className = 'w-16 h-16' }) => (
  <img 
    src="/logos/casharoo-mark.png" 
    alt="Casharoo mark" 
    className={className}
    loading="lazy"
  />
)

// 2) Roo Coin (circular logo variant - good for avatars, app icons)
export const CasharooCoin = ({ className = 'w-16 h-16' }) => (
  <img 
    src="/logos/casharoo-coin.png" 
    alt="Casharoo coin" 
    className={className}
    loading="lazy"
  />
)

// 3) Wordmark (horizontal text logo - for headers, footers)
export const CasharooWordmark = ({ className = 'h-8' }) => (
  <img 
    src="/logos/casharoo-wordmark.png" 
    alt="Casharoo" 
    className={className}
    loading="lazy"
  />
)

// 4) Favicon (small icon - for browser tab, bookmarks)
export const CasharooFavicon = ({ className = 'w-8 h-8' }) => (
  <img 
    src="/logos/casharoo-favicon.png" 
    alt="Casharoo icon" 
    className={className}
    loading="lazy"
  />
)

// 5) Full Logo (mark + wordmark combined - for landing pages, marketing)
export const CasharooFullLogo = ({ className = 'h-12' }) => (
  <img 
    src="/logos/casharoo-full-logo.png" 
    alt="Casharoo" 
    className={className}
    loading="lazy"
  />
)

// 6) Roo Hop (animated mark for loaders - uses CasharooMark)
export const CasharooHop = ({ size = 56 }) => (
  <motion.div
    className="inline-flex items-center justify-center"
    initial={{ y: 0 }}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <img 
      src="/logos/casharoo-mark.png" 
      alt="Casharoo" 
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  </motion.div>
)

/******************************
 *  BACKGROUND / LOADING SCREENS
 ******************************/

// 1) Aurora gradient (time‑of‑day friendly)
const AuroraBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(16,185,129,0.35),transparent),radial-gradient(40%_40%_at_80%_20%,rgba(245,158,11,0.25),transparent),radial-gradient(50%_50%_at_50%_80%,rgba(16,185,129,0.25),transparent)]" />
    <div className="absolute inset-0 backdrop-blur-[2px]" />
    <div className="relative z-10">{children}</div>
  </div>
)

// 2) Subtle diagonal stripes + noise
const StripesBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 [background:repeating-linear-gradient(135deg,theme(colors.emerald.500)/6_0_8px,transparent_8px_16px)]" />
    <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.06\'/></svg>")'}} />
    <div className="relative z-10">{children}</div>
  </div>
)

// 3) Conic gradient halo
const ConicHaloBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,theme(colors.emerald.400),theme(colors.emerald.700),theme(colors.emerald.500),theme(colors.emerald.400))] opacity-20" />
    <div className="relative z-10">{children}</div>
  </div>
)

// 4) Dotted grid (finance desk paper vibes)
const DottedGridBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-[60vh] overflow-hidden">
    <div className="absolute inset-0 [background:radial-gradient(theme(colors.emerald.500)/15_1px,transparent_1px)] bg-[length:22px_22px]" />
    <div className="relative z-10">{children}</div>
  </div>
)

// 5) Glass cards over gradient
const GlassGradientBackground = ({ children }: { children: React.ReactNode }) => (
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
    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
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
      src="/logos/casharoo-coin.png"
      alt="Loading"
      className="size-12 rounded-full shadow"
      animate={{ rotateY: [0, 180, 360] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
      style={{ transformStyle: 'preserve-3d' }}
    />
  </motion.div>
)

/******************************
 *         DEMO PAGES          *
 ******************************/

const SplashCard = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="mx-auto max-w-xl p-8">
    <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-xl">
      <div className="p-6 flex items-center gap-4">
        <CasharooCoin className="w-12 h-12" />
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

export default function CasharooBrandKit() {
  const [bgIndex, setBgIndex] = useState(0)
  const backgrounds = [AuroraBackground, StripesBackground, ConicHaloBackground, DottedGridBackground, GlassGradientBackground]
  const BG = backgrounds[bgIndex]

  useEffect(() => {
    const t = setInterval(() => setBgIndex(i => (i + 1) % backgrounds.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CasharooMark className="w-8 h-8" />
          <CasharooWordmark className="text-2xl" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => setBgIndex(i => (i + backgrounds.length - 1) % backgrounds.length)} className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">Prev bg</button>
          <span className="opacity-60">{bgIndex + 1} / {backgrounds.length}</span>
          <button onClick={() => setBgIndex(i => (i + 1) % backgrounds.length)} className="px-3 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10">Next bg</button>
        </div>
      </div>

      <BG>
        <div className="py-10">
          <SplashCard title="Casharoo" subtitle="Personal finance, with personality.">
            <div className="grid sm:grid-cols-2 gap-8">
              <Section label="Logo Variants">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <CasharooMark />
                    <p className="text-xs mt-2 opacity-60">Mark</p>
                  </div>
                  <div className="text-center">
                    <CasharooCoin />
                    <p className="text-xs mt-2 opacity-60">Coin</p>
                  </div>
                  <div className="text-center">
                    <CasharooWordmark />
                    <p className="text-xs mt-2 opacity-60">Wordmark</p>
                  </div>
                  <div className="text-center">
                    <CasharooFavicon />
                    <p className="text-xs mt-2 opacity-60">Favicon</p>
                  </div>
                </div>
              </Section>
              <Section label="Full Logo">
                <div className="flex items-center">
                  <CasharooFullLogo />
                </div>
              </Section>
              <Section label="Loaders">
                <div className="flex items-center gap-6">
                  <LoaderPulse />
                  <LoaderBars />
                  <LoaderCoinSpin />
                </div>
              </Section>
              <Section label="CTA Example">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white shadow hover:shadow-lg transition-shadow">Get Started</button>
                  <button className="px-4 py-2 rounded-xl border border-emerald-600/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/10">Learn More</button>
                </div>
              </Section>
            </div>
          </SplashCard>
        </div>
      </BG>

      <footer className="py-10 text-center text-xs opacity-60">Casharoo Brand Kit • Replace PNG logos in public/logos/ directory • Aurora gradient (#1) is your favorite!</footer>
    </div>
  )
}
