# Hero frame sequence

Pre-rendered scroll-scrubbed sequence for the hero (§4).

## Naming convention

```
desktop/frame-0001.webp ... frame-0090.webp     (90 frames)
mobile/frame-0001.webp  ... frame-0090.webp     (90 frames)
poster-desktop.webp                              (= frame-0045)
poster-mobile.webp                               (= frame-0045 mobile)
```

- Zero-padded to 4 digits (`frame-0001`, not `frame-1`)
- WebP only
- 90 frames per orientation
- Frame 1: sitting indoors with phone (start)
- Frame 90: outside with friends (end)
- Frame 45: static fallback for `prefers-reduced-motion` and as
  poster image during preload

## Source specs

- **Desktop source:** 1920×1080
- **Desktop export:** 1280×720 WebP, q80
- **Mobile source:** 1080×1350 (4:5)
- **Mobile export:** 720×900 WebP, q80
- Target total payload: < 1.5MB (≈16KB per frame avg)

## Placeholder generator

If frames are missing, run `npm run frames` to generate a simple
placeholder sequence so layout works during development. Replace with
real frames before launch — the placeholder is purely structural.
