# About-section images (§8)

Asymmetric grid: one anchor image + 3–5 satellite images.

## Naming

```
about-hero.jpg              (large anchor image)
about-01.jpg                (satellite)
about-02.jpg                (satellite)
about-03.jpg                (satellite)
about-04.jpg                (satellite)
about-05.jpg                (optional satellite)
```

## Specs

- `about-hero.jpg` — 4:3 or 16:10, long edge ≥ 2000px
- `about-NN.jpg` — varied aspects (1:1, 3:4, 4:3) on purpose
- Neutral, warm color grade consistent with the gallery section

## Tags

Lives in `/content/about-tags.json`. Tag format:
`CITY, YEAR` or `EVENT, YEAR`. Example: `BROOKLYN, 2024`.

## Optional founder portrait

If `/public/founder.jpg` exists, it auto-replaces one satellite slot
and gets a `FOUNDER` tag. The about-tags JSON does not need to be
edited; the component detects the file at build time.

## Missing-image fallback

Same as gallery — tinted gradient placeholder until real images land.
