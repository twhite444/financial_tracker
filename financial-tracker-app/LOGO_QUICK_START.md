# 📝 Logo Upload Quick Reference

## File Names (MUST match exactly!)
```
✓ casharoo-mark.png
✓ casharoo-coin.png
✓ casharoo-wordmark.png
✓ casharoo-full-logo.png
✓ casharoo-favicon.png
```

## Recommended Dimensions
```
casharoo-mark.png        → 512×512px   (square)
casharoo-coin.png        → 512×512px   (square)
casharoo-wordmark.png    → 1200×400px  (3:1 ratio)
casharoo-full-logo.png   → 1800×600px  (landscape)
casharoo-favicon.png     → 192×192px   (small)
```

## Target File Sizes
```
casharoo-mark.png        → 20-50KB
casharoo-coin.png        → 20-50KB
casharoo-wordmark.png    → 30-80KB
casharoo-full-logo.png   → 40-100KB
casharoo-favicon.png     → <10KB (important!)
```

## 3-Step Upload Process

### 1️⃣ Optimize First
→ Go to https://tinypng.com
→ Drag your PNG files
→ Download compressed versions

### 2️⃣ Replace Placeholders
→ Navigate to: `public/logos/` directory
→ Delete or rename the placeholder files
→ Add your optimized PNGs

### 3️⃣ Test
→ Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
→ Visit: http://localhost:5173/casharoo-demo
→ Check all 5 logos display correctly

## Troubleshooting

**Logo not appearing?**
- Check file name spelling (case-sensitive!)
- File must be in `public/logos/` not `src/logos/`
- Hard refresh browser to clear cache
- Check browser console (F12) for errors

**Logo looks blurry?**
- Export at 2x or 3x resolution
- Use PNG-24 format (not PNG-8)
- Don't resize in browser (use correct dimensions)

**File too large?**
- Compress at https://tinypng.com
- Reduce dimensions if still too big
- Simplify design (fewer colors/gradients)

## Where Logos Are Used

```tsx
<CasharooMark />        // Sidebar, headers (64px typical)
<CasharooCoin />        // Loading spinner, avatars
<CasharooWordmark />    // Navigation bar, footers
<CasharooFullLogo />    // Hero section, landing page
<CasharooFavicon />     // Browser tab icon
```

## Pro Tips

✨ **Always use transparent backgrounds** (not white!)
✨ **Test on dark mode** before finalizing
✨ **Compress with TinyPNG** (can reduce size by 70%!)
✨ **Export at 2x resolution** for retina displays
✨ **Keep favicon simple** (details disappear at 16px)

---

**Ready?** See full guide → `LOGO_OPTIMIZATION_GUIDE.md`
