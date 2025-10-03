# 🦘 Casharoo Rebrand - Feature Branch

This branch contains the **Casharoo** rebrand with a kangaroo-themed design system.

## 🎨 What's New

### Brand Identity
- **New Name**: Financial Tracker → **Casharoo**
- **Theme**: Kangaroo/Australian outback inspired
- **Color Palette**: Emerald greens (kangaroo/nature) + Amber/Gold (coins/money)
- **Mascot**: Playful kangaroo incorporating dollar signs and coins

### Design System

#### Colors
- **Primary (Roo)**: Emerald greens (#10b981) - represents the kangaroo and nature
- **Secondary (Coin)**: Amber/Gold (#f59e0b) - represents money and coins
- **Accent (Hop)**: Orange (#f97316) - represents energy and action
- **Tertiary (Pouch)**: Teal (#14b8a6) - represents savings/storage

#### CSS Variables
All theme colors and design tokens are available as CSS variables:
```css
/* Brand colors */
var(--casharoo-brand-primary)
var(--casharoo-brand-secondary)
var(--casharoo-brand-accent)

/* Spacing (hop metaphor) */
var(--casharoo-space-hop-sm)  /* small hop */
var(--casharoo-space-hop-md)  /* medium hop */
var(--casharoo-space-hop-lg)  /* big hop */

/* Border radius (pouch-like) */
var(--casharoo-radius-3xl)  /* pouch shape */

/* Shadows */
var(--casharoo-shadow-roo)   /* greenish glow */
var(--casharoo-shadow-coin)  /* golden glow */
```

### New Files

#### Components
- **`src/components/brand/CasharooBrandKit.tsx`** - Complete brand kit showcase
  - 4 logo variants (Mark, Coin, Wordmark, Hop)
  - 5 animated backgrounds (Aurora, Stripes, Conic, Dotted, Glass)
  - 3 loading animations (Pulse, Bars, Coin Spin)
  - Favicon suggestions

#### Styles
- **`src/styles/casharoo-theme.css`** - Complete CSS variable system
  - Color palette (primary, coin, hop, pouch)
  - Spacing system (hop metaphor)
  - Typography scale
  - Animation keyframes
  - Utility classes

#### Pages
- **`src/pages/CasharooDemoPage.tsx`** - Brand kit demo page

### Logo Variants

#### 1. Casharoo Mark
Abstract kangaroo formed by a cash curve (S-shape) with a coin.
```tsx
import { CasharooMark } from './components/brand/CasharooBrandKit';
<CasharooMark className="w-16 h-16" />
```

#### 2. Casharoo Coin
Kangaroo face embedded in a gold coin.
```tsx
import { CasharooCoin } from './components/brand/CasharooBrandKit';
<CasharooCoin className="w-16 h-16" />
```

#### 3. Casharoo Wordmark
Text logo with color-coded syllables.
```tsx
import { CasharooWordmark } from './components/brand/CasharooBrandKit';
<CasharooWordmark className="text-3xl" />
```

#### 4. Casharoo Hop (Animated)
Bouncing kangaroo logo for loaders.
```tsx
import { CasharooHop } from './components/brand/CasharooBrandKit';
<CasharooHop size={56} />
```

### Animations

#### Kangaroo Hop
```css
.casharoo-hop-animation {
  animation: casharoo-hop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
}
```

#### Coin Flip
```css
.casharoo-coin-flip {
  animation: casharoo-coin-flip 1.5s linear infinite;
}
```

#### Pulse Glow
```css
.casharoo-pulse-glow {
  animation: casharoo-pulse-glow 2s ease-in-out infinite;
}
```

#### Pouch Bounce
```css
.casharoo-pouch-bounce {
  animation: casharoo-pouch-bounce 0.6s ease-in-out;
}
```

## 🚀 Testing the Rebrand

### View the Brand Kit
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the brand demo page:
   ```
   http://localhost:5173/casharoo-demo
   ```

3. Use the "Prev bg" / "Next bg" buttons to cycle through different background styles

### Using in Components

Import logo components:
```tsx
import { 
  CasharooMark, 
  CasharooCoin, 
  CasharooWordmark, 
  CasharooHop 
} from '@/components/brand/CasharooBrandKit';
```

Use CSS variables:
```tsx
<div style={{ 
  color: 'var(--casharoo-brand-primary)',
  padding: 'var(--casharoo-space-hop-lg)',
  borderRadius: 'var(--casharoo-radius-3xl)',
  boxShadow: 'var(--casharoo-shadow-roo)'
}}>
  Content
</div>
```

Use utility classes:
```tsx
<button className="casharoo-btn-primary">
  Get Started
</button>

<div className="casharoo-card">
  Card content
</div>

<div className="casharoo-gradient-roo">
  Gradient background
</div>
```

## 📦 What's NOT Changed (Yet)

This branch focuses on the **design system and brand assets**. The following are unchanged:
- Application functionality
- API endpoints
- Database schemas
- User flows
- Component logic

These will be updated in follow-up PRs once the design system is approved.

## 🎯 Next Steps

### Phase 1: Design Review (Current)
- [ ] Review brand kit and logo variants
- [ ] Test animations and interactions
- [ ] Verify dark mode support
- [ ] Get stakeholder approval

### Phase 2: Component Migration
- [ ] Update Header with Casharoo logo
- [ ] Update Sidebar with new branding
- [ ] Apply theme variables to all components
- [ ] Replace color classes with CSS variables

### Phase 3: Content Updates
- [ ] Update all "Financial Tracker" text to "Casharoo"
- [ ] Update page titles and meta tags
- [ ] Update error messages and notifications
- [ ] Update documentation

### Phase 4: Assets
- [ ] Generate favicon set from logo
- [ ] Create social media preview images
- [ ] Update README badges
- [ ] Create marketing assets

## 🦘 Design Philosophy

### Kangaroo Metaphors
- **Hop**: Quick, bouncy transitions
- **Pouch**: Secure storage (accounts, savings)
- **Jump**: Big changes, major transactions
- **Coin**: Money, rewards, savings goals

### Color Meanings
- **Emerald Green**: Growth, stability, nature (like a kangaroo's habitat)
- **Gold/Amber**: Wealth, prosperity, achievement
- **Orange**: Energy, urgency, action items
- **Teal**: Trust, calm, long-term savings

### Animation Principles
- **Playful but Professional**: Subtle animations that don't distract
- **Performance First**: GPU-accelerated transforms only
- **Purposeful Motion**: Every animation communicates state or action

## 🤔 Feedback & Questions

Please review the brand demo at `/casharoo-demo` and provide feedback on:
1. Logo variants - which do you prefer?
2. Color palette - does it feel "financial" enough?
3. Animations - too playful or just right?
4. Overall vibe - does it match our vision?

## 📝 Branch Info

- **Branch**: `feature/casharoo-rebrand`
- **Based on**: `main`
- **Status**: Design review
- **Merge**: After stakeholder approval

---

**To merge this branch:**
```bash
git checkout main
git merge feature/casharoo-rebrand
```

**To revert to original design:**
```bash
git checkout main
```
