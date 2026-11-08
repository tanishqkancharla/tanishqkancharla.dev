# Web font maintenance

Read [scripts/fonts/README.md](scripts/fonts/README.md) before changing fonts or
typography. Rendering must stay identical unless the user approves a visual
change. Preserve `font-display: swap`, the fallback stack, and existing synthetic
italic/bold behavior. Report savings and rendering differences for rejected
optimizations rather than silently accepting them.

- Font processing is manual, never part of the build. After content, typography
  (including inline component styles), OpenType feature, language, or font changes,
  run `npm run build`, then `uv run scripts/optimize-fonts.py`, then
  `npm run build` again. Keep the pinned originals and processing dependencies.
- Commit generated `public/fonts/*.woff2`, `src/styles/fonts.ts`, and
  `scripts/fonts/manifest.json` together. Do not hand-edit generated output.
- Keep supported content characters plus Latin-1 and Latin Extended-A. Preserve
  system fallback for CJK and unsupported characters, including U+2010 when
  considering automatic hyphenation. Audit computed typography and inline styles,
  including one-off weights, bold inside italics, and feature/axis overrides.
- Preload only the two core faces; load extended faces through `unicode-range`.
  Keep Latin-1 in core: an ASCII-only core changed accent kerning. Preserve shared
  U+0304/U+0308 coverage and extended-before-core rule order. Do not insert a
  generated fallback face between them. Check advertised ranges against saved
  font cmaps and preserve shaping dependencies.
- Preserve the OFL and derivative internal name **TK Site Sans**; the original
  Reserved Font Name must not be reused for subsets.
- Before a font change, preserve a same-content baseline build. Compare it with
  the optimized build using `node scripts/check-fonts.mjs BEFORE_URL AFTER_URL
  .amp/in/artifacts/font-check`. Inspect screenshots and require zero pixel
  differences across code, italics, accents, component overrides, narrow layouts,
  and CJK. Do not waive differences as sub-pixel rounding without approval.
- Re-measure cold-page font bytes and preloads; verify extended files load only
  when needed. Report the browser/platform tested rather than claiming universal
  pixel identity. Sharp-decoded image equality alone does not prove browser pixel
  equality; browser comparisons rejected previously tested WebP conversions.

# Header image

Read [scripts/header/README.md](scripts/header/README.md) before changing the
header photo, the glass look, or the header's size. The glass is a manual bake,
never part of the build: `npm run render-header` writes
`public/mcwayfalls-glass.jpg`; commit it with the change that caused it.

- Never screenshot a live page to re-bake: headless Chrome ignores the emulated
  device scale for the shader's canvas, which once shipped a 1× bake stretched
  2×. The render script sets the scale through the shader and checks the size.
- `src/styles/resolutions.ts` owns the variants and `sizes`. If the header's
  height or the strip's aspect changes, update it and check in a browser that
  no viewport and pixel ratio picks a file smaller than its drawn size.
