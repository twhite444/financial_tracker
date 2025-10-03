import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Casharoo – Logo & Loading Screen Kit
 * -------------------------------------------------
 * This single file gives you:
 * 1) Four logo variants (SVG) + a wordmark and favicon ideas
 * 2) Five distinct loading/landing backgrounds with subtle animations
 * 3) Minimal animation primitives you can reuse across the app
 *
 * Drop this file anywhere in your app and render <CasharooBrandKit /> to preview.
 * Copy/paste the logo components wherever you need them (header, splash, favicon, etc.).
 * Tailwind required. Framer Motion required.
 */

/******************************
 *        LOGO VARIANTS        *
 ******************************/

// 1) Roo Mark (abstract kangaroo formed by cash curve)
export const CasharooMark = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-label="Casharoo mark">
    {/* coin */}
    <circle cx="46" cy="18" r="6" className="fill-amber-400" />
    <circle cx="46" cy="18" r="6" className="fill-transparent stroke-amber-500" strokeWidth="2" />
    {/* roo body as a flowing S = cash curve */}
    <path
      d="M10 40c10-12 20-8 26-18 2.5-4 6-6 10-6 4 0 8 2.5 8 7 0 5-4 8-9 9-6 1-11 3-14 7-2.5 3-3 7-3 12"
      className="stroke-emerald-500 dark:stroke-emerald-400"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* tail / hop line */}
    <path d="M8 48c6 0 10 2 14 6" className="stroke-emerald-600/60" strokeWidth="3" strokeLinecap="round" />
    {/* ear */}
    <path d="M34 17l4-6" className="stroke-emerald-500" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// 2) Roo Coin (wallaby face embedded in a coin)
export const CasharooCoin = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-label="Casharoo coin">
    <defs>
      <radialGradient id="g" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="24" fill="url(#g)" />
    <circle cx="32" cy="32" r="24" className="fill-transparent stroke-amber-600" strokeWidth="2" />
    {/* minimal roo */}
    <path d="M20 38c6-8 18-8 24 0" className="fill-none stroke-emerald-700" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="26" r="2" className="fill-emerald-800" />
    <circle cx="32" cy="24" r="1.5" className="fill-emerald-800" />
    <path d="M30 22l6-6" className="stroke-emerald-700" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// 3) Wordmark (display type – swap fonts if you have a brand font)
export const CasharooWordmark = ({ className = 'text-3xl' }) => (
  <div className={`font-semibold tracking-tight ${className}`} aria-label="Casharoo">
    <span className="text-emerald-500">Casha</span>
    <span className="text-emerald-700 dark:text-emerald-300">roo</span>
  </div>
)

// 4) Roo Hop (animated mark for loaders)
export const CasharooHop = ({ size = 56 }) => (
  <motion.div
    className="inline-flex items-center justify-center"
    initial={{ y: 0 }}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <CasharooMark className={`w-[${size}px] h-[${size}px]`} />
  </motion.div>
)

/******************************
 *      FAVICON SUGGESTIONS    *
 ******************************/
export const Favicons = () => (
  <div className="grid grid-cols-6 gap-3">
    <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">💲</div>
    <div className="size-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">🦘</div>
    <div className="size-10 rounded-xl bg-amber-400 flex items-center justify-center">🪙</div>
    <div className="size-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white">CR</div>
    <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white">¢</div>
    <div className="size-10 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/40 flex items-center justify-center text-emerald-700">roo</div>
  </div>
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
  <motion.div
    className="size-12 rounded-full bg-amber-400 ring-2 ring-amber-600 shadow"
    animate={{ rotateY: [0, 180, 360] }}
    transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
    style={{ transformStyle: 'preserve-3d' }}
  />
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
              <Section label="Logos">
                <div className="flex items-center gap-6 flex-wrap">
                  <CasharooMark />
                  <CasharooCoin />
                  <CasharooWordmark />
                  <CasharooHop />
                </div>
              </Section>
              <Section label="Favicons / App Icons">
                <Favicons />
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

      <footer className="py-10 text-center text-xs opacity-60">Casharoo Brand Kit • Swap colors via Tailwind tokens • All SVGs inline-editable</footer>
    </div>
  )
}
