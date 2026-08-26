# Open in Cursor or VS Code

This is the **pre-animation** version of the Emenla site: white canvas, Manrope,
violet reserved for the person's own words, outlined pill buttons, no characters
and no looping motion. The only movement is a fade-up on scroll, which respects
`prefers-reduced-motion`.

1. Unzip and open the `emenla-website-v1` folder (File → Open Folder).
2. In the terminal (Ctrl/Cmd + `):

```
npm run build
npm run serve
```

3. Visit http://localhost:8080

`dist/` is already built, so you can also open `dist/index.html` directly.

## Where things are

| Path | What |
|------|------|
| `site.config.json` | Domain, support email, Instagram, CTA mode, legal facts, pricing. Edit values here, never in the page files. |
| `content/claims.json` | Every claim-bearing line with its source. |
| `content/banned-terms.json` | The claims policy as a machine-checkable list. |
| `src/pages/home.mjs` | Home page sections and copy. |
| `src/styles.css` | All styling. Tokens at the top. |
| `DESIGN.md` | The design system this was built from. |
| `README.md` | Full launch checklist and what was and was not verified. |

## Checks

```
npm run check        # banned terms, em dashes, dead links, unresolved TODOs
```

It fails today on purpose: domain, support email, operator name, governing law,
hosting provider and the CTA endpoint are still TODO in `site.config.json`.
Those are the App Store Connect blockers.
