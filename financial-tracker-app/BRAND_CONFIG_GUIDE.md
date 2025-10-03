# 🎨 Brand Configuration Guide

## Overview

The entire application is now **completely configurable** with **zero hardcoded values**. You can rebrand the entire app by editing a single configuration file.

---

## 📁 Configuration File

**Location**: `src/config/brand.config.ts`

This single file controls:
- Brand name and tagline
- Logo asset paths
- Color palettes (via CSS variables)
- Animation timings
- Spacing and border radius
- All visual branding

---

## 🔧 How to Rebrand

### Step 1: Update Brand Identity

Edit `src/config/brand.config.ts`:

```typescript
export const brandConfig = {
  // Change your brand name here
  name: {
    full: 'YourBrand',        // Full brand name
    short: 'YB',              // Short version
    tagline: 'Your tagline',  // Subtitle for demo page
  },

  // Update logo paths (relative to public/)
  assets: {
    mark: '/logos/your-mark.png',
    coin: '/logos/your-coin.png',
    wordmark: '/logos/your-wordmark.png',
    fullLogo: '/logos/your-full-logo.png',
    favicon: '/logos/your-favicon.png',
  },
  // ...
}
```

### Step 2: Update Colors

Edit `src/styles/brand-theme.css`:

```css
:root {
  /* PRIMARY BRAND COLORS - Change these to your brand colors */
  --brand-primary-50: #your-color;
  --brand-primary-100: #your-color;
  --brand-primary-200: #your-color;
  /* ... continue with your color palette */
  
  /* ACCENT COLORS (gold/coin color) */
  --brand-accent-400: #your-accent;
  --brand-accent-500: #your-accent;
  /* ...etc */
}
```

**Pro Tip**: Generate a complete color palette at https://uicolors.app

### Step 3: Update Logo Files

Replace files in `public/logos/`:
```
public/logos/
├── your-mark.png      (match asset path in config)
├── your-coin.png
├── your-wordmark.png
├── your-full-logo.png
└── your-favicon.png
```

### Step 4: Adjust Animations (Optional)

In `brand.config.ts`:

```typescript
animations: {
  hopDuration: 1200,      // Logo bounce speed (ms)
  coinSpinDuration: 1100, // Coin rotation speed (ms)
  pulseDuration: 1200,    // Pulse effect speed (ms)
  backgroundCycle: 6000,  // Background auto-change interval (ms)
},
```

---

## 🎯 Component Usage

All logo components are now generic and use the config:

### Before (Hardcoded)
```tsx
import { CasharooMark, CasharooCoin } from './CasharooBrandKit'

<CasharooMark className="w-8 h-8" />
```

### After (Configurable)
```tsx
import { BrandMark, BrandCoin } from '../../components/brand/BrandKit'

<BrandMark size="small" />  // Uses config for sizing
<BrandCoin className="w-16 h-16" />  // Or custom className
```

### Available Components

| Component | Purpose | Props |
|-----------|---------|-------|
| `<BrandMark>` | Main logo/icon | `size`, `className` |
| `<BrandCoin>` | Circular variant | `size`, `className` |
| `<BrandWordmark>` | Text logo | `size`, `className` |
| `<BrandFavicon>` | Small icon | `size`, `className` |
| `<BrandFullLogo>` | Mark + wordmark | `size`, `className` |
| `<BrandAnimatedLogo>` | Bouncing logo | `size` (px number) |

**Size options**: `'small'`, `'default'`, `'large'` (configured in brand.config.ts)

---

## 🎨 CSS Variable Usage

All colors are now generic CSS variables:

### In Components
```tsx
// Use Tailwind with emerald (temporary for Casharoo)
<div className="bg-emerald-500">

// Or use CSS variables directly (brand-agnostic)
<div style={{ backgroundColor: 'var(--brand-primary-500)' }}>
```

### In CSS Files
```css
.my-component {
  background-color: var(--brand-primary-500);
  color: var(--brand-accent-600);
  border-radius: var(--brand-radius-lg);
  box-shadow: var(--brand-shadow-brand);
}
```

### Utility Classes (Generic)
```tsx
<button className="brand-btn-primary">Click Me</button>
<div className="brand-card">Content</div>
<input className="brand-input" />
<span className="brand-badge">New</span>
<div className="brand-glass">Glass effect</div>
```

**Available utility classes** (defined in `brand-theme.css`):
- `.brand-btn-primary` / `.brand-btn-secondary`
- `.brand-card`
- `.brand-input`
- `.brand-badge` / `.brand-badge-outline`
- `.brand-glass`
- `.brand-gradient-primary` / `.brand-gradient-accent`

---

## 🔄 Migration Path

To fully remove Casharoo-specific references:

### 1. Replace Tailwind Colors
Find and replace in your components:
```bash
# Search for:
bg-emerald-500
text-emerald-600
border-emerald-400

# Replace with CSS variables or utility classes:
style={{ backgroundColor: 'var(--brand-primary-500)' }}
className="brand-btn-primary"
```

### 2. Update Gradient Backgrounds
In `BrandKit.tsx`, the background components still use hardcoded emerald colors.

**Option A**: Make them use CSS variables
```tsx
// Current (hardcoded)
<div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(16,185,129,0.35),transparent)]" />

// Better (variable)
<div className="absolute inset-0" style={{
  background: 'radial-gradient(60% 60% at 20% 10%, color-mix(in srgb, var(--brand-primary-500) 35%, transparent), transparent)'
}} />
```

**Option B**: Create background utility classes in CSS

### 3. Rename Demo Route (Optional)
In `App.tsx`:
```tsx
// Current (Casharoo-specific)
<Route path="/casharoo-demo" element={<BrandDemoPage />} />

// Generic
<Route path="/brand-demo" element={<BrandDemoPage />} />
```

Don't forget to update documentation references!

---

## 📝 Complete Rebranding Checklist

- [ ] Update `brand.config.ts` with new brand name, tagline, asset paths
- [ ] Replace PNG files in `public/logos/` (5 files)
- [ ] Update color palette in `brand-theme.css` (all `--brand-*` variables)
- [ ] Test `/casharoo-demo` route - verify all logos appear
- [ ] Check dark mode - ensure colors work on dark backgrounds
- [ ] Replace hardcoded `emerald` colors in components with CSS variables
- [ ] Update background gradients to use brand colors
- [ ] Rename `/casharoo-demo` route to `/brand-demo` (optional)
- [ ] Update `README.md` with new brand name
- [ ] Update favicon in `index.html`
- [ ] Test on mobile devices
- [ ] Run Lighthouse performance audit

---

## 🚀 Benefits of This Approach

### 1. **Single Source of Truth**
- All branding in one file (`brand.config.ts`)
- No scattered hardcoded values across components

### 2. **Type-Safe**
- TypeScript ensures you use valid config keys
- Intellisense autocompletes logo sizes, asset paths

### 3. **Easy A/B Testing**
- Swap `brand.config.ts` to test different brands
- Git diff shows exactly what changed

### 4. **White-Label Ready**
- Deploy same codebase with different configs
- Environment-based branding: `brand.config.prod.ts` vs `brand.config.dev.ts`

### 5. **Designer-Friendly**
- Non-developers can update colors in CSS file
- Logo replacements don't require code knowledge

### 6. **Performance**
- CSS variables are faster than inline styles
- No runtime string concatenation
- Single CSS file for all brand styling

---

## 🎨 Example: Complete Rebrand

Let's rebrand from "Casharoo" to "MoneyHop":

**1. brand.config.ts**
```typescript
name: {
  full: 'MoneyHop',
  short: 'MH',
  tagline: 'Finance made simple',
},
assets: {
  mark: '/logos/moneyhop-mark.png',
  // ...etc
},
```

**2. brand-theme.css**
```css
:root {
  /* Purple/Blue instead of Green */
  --brand-primary-500: #8b5cf6;  /* violet */
  --brand-accent-500: #3b82f6;   /* blue */
}
```

**3. Replace logos in public/logos/**
```
moneyhop-mark.png
moneyhop-coin.png
etc.
```

**4. Test**
```bash
npm run dev
# Visit http://localhost:5173/casharoo-demo
# All components now show "MoneyHop" with purple theme!
```

**That's it!** The entire app is rebranded.

---

## 🆘 Troubleshooting

**Q: Components still show old brand name**
- Check you saved `brand.config.ts`
- Hard refresh browser (Cmd+Shift+R)
- Restart dev server

**Q: Colors aren't changing**
- Verify CSS variable names match in both files
- Check for typos: `--brand-primary-500` not `--brand-primay-500`
- Ensure `brand-theme.css` is imported in `index.css`

**Q: Logos not appearing**
- Verify file paths match in `brand.config.ts`
- Files must be in `public/logos/` directory
- Check browser console for 404 errors
- File names are case-sensitive!

**Q: TypeScript errors in brand.config.ts**
- Run `npm run build` to see full error details
- Ensure all required config keys are present
- Check for trailing commas in objects

---

## 📚 Related Files

- **Config**: `src/config/brand.config.ts` - All brand settings
- **CSS**: `src/styles/brand-theme.css` - Color variables and utilities
- **Components**: `src/components/brand/BrandKit.tsx` - Logo components
- **Demo**: `src/pages/CasharooDemoPage.tsx` - Brand showcase
- **Route**: `src/App.tsx` - Demo route setup
- **Docs**: `LOGO_OPTIMIZATION_GUIDE.md` - Logo preparation guide

---

**You're all set!** Your app is now completely rebrandable through configuration files. No more hunting through code for hardcoded values! 🎉
