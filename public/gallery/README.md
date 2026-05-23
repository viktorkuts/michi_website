# Gallery images (§7)

12 portrait images for the horizontal-scroll marquee.

## Naming

```
gallery-01.jpg ... gallery-12.jpg
```

## Specs

- 3:4 portrait, long edge ≥ 1600px
- JPG q85 or WebP q82
- Each image is paired with a tag in `/content/gallery-tags.json`
- Neutral, slightly warm color grading — images should feel of one world

## Tags

Tags live in `/content/gallery-tags.json` keyed by filename. Tag format:
`EVENT NAME, CITY` (mono caps, comma-separated). Example:

```
PICKUP BASKETBALL, BROOKLYN
```

## Missing-image fallback

Until real images land, `<UiMarquee />` renders a tinted gradient block
in place of any missing file so layout never breaks.
