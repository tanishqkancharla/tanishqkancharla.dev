# Fluted glass header

The header is a static JPEG of Paper Design's `FlutedGlass` shader laid over
`public/mcwayfalls.JPG`. A static image doesn't flash on each page load the way
the live shader did. **The build does not render the glass**; it only resizes
the committed bake into the variants in `src/styles/resolutions.ts`.

## Re-render

```sh
npm run render-header                    # from public/mcwayfalls.JPG
npm run render-header -- path/to/photo   # from another photo
npm run build
```

The script needs `agent-browser` (preinstalled in Amp orbs). It writes
`public/mcwayfalls-glass.jpg`, the file `headerImageURL` in `src/config.ts`
names, at `HEADER_IMAGE_WIDTH` × `HEADER_IMAGE_HEIGHT` (5760×1152). Look at the
result in `dist` across phone and desktop widths, then commit the JPEG with the
change that caused it.

- **Change the look:** edit `glass` in [page.tsx](page.tsx). The shader package
  is pinned so the same settings render the same image.
- **Change the photo:** pass its path. Use the full-resolution original; the
  shader cover-fits it, so the centre band of the photo shows. To keep a new
  photo, put it in `public/` and update the photo credits in `src/config.ts`.

## How the render works

[render.ts](render.ts) serves [page.tsx](page.tsx) and the photo from a local
server and opens it with agent-browser. The page lays the glass out at 1440×288
CSS pixels (90rem × 18rem, the strip's narrowest drawn size) and renders it at
4× through the shader's `minPixelRatio`. Headless Chrome's emulated device scale
does not reach the shader's canvas, so a screenshot at "2×" holds only 1× of
detail; the script checks the canvas size instead of trusting it. It reads the
canvas with `toDataURL`, then composites it over the cover-fitted photo, because
the glass is partly transparent at its left and right edges and the live shader
sat over the photo.

## Variants

The header is 18rem tall and the 5:1 strip covers it, so the strip is never
drawn narrower than 90rem: its `sizes` is not `100vw`. At 40rem and below only
its centre shows, so `<picture>` serves a 40rem × 18rem centre crop instead,
which saves phones most of the bytes. The crops line up with the strip pixel for
pixel at the breakpoint. If the header's height or the strip's aspect changes,
update the numbers in `resolutions.ts` and `build.ts`, and the CSS size in
`render.ts`.
