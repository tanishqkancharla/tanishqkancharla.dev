# Manually maintained web fonts

The site serves checked-in WOFF2 files. **The build does not process fonts.**
`src/styles/fonts.ts` is generated CSS plus the two core preload URLs. Font files
have content hashes; Vercel can cache them immutably without stale deployments.
The fallback stack and `font-display: swap` are unchanged. No service worker,
idle precache, embedded font bytes, or extra fallback face is introduced.

## Regenerate

With Node dependencies installed and [uv](https://docs.astral.sh/uv/) available:

```sh
npm run build
uv run scripts/optimize-fonts.py
npm run build
```

The script pins FontTools, Brotli, and the HarfBuzz repacker in its inline dependency metadata. It reads
the actual rendered content in `dist`, uses the pinned originals below, and
writes `public/fonts/*.woff2`, `src/styles/fonts.ts`, and `manifest.json`.
Commit all three kinds of output together. Do not fetch a newer Google font
version as part of a routine regeneration.

Rerun after adding or changing content, changing typography (including inline
styles), enabling a font feature, adding a script/language, or updating a font.
ASCII changes are already covered, but rerunning updates the content audit.
Review component font settings as well as global styles; the script deliberately
does not guess which new CSS feature/axis settings are safe to discard.
It stops rather than silently removing a newly used non-Latin script supported
by an original face. CJK and unsupported characters retain system fallback.

The default subset keeps all available Latin-1 and Latin Extended-A characters,
all current content characters supported by the original CSS, common punctuation,
and canonical-decomposition dependencies. U+017F, U+2010, and U+2011 are not
available in these original webfont faces: they remain system fallback, just as
before. Current site CSS uses `hyphens: manual`; the browser proof also exercises
`hyphens: auto` and literal U+2010 rather than assuming a hyphen glyph exists.

## Why the core contains more than ASCII

An ASCII/punctuation-only core was tested and rejected: moving Latin-1 accents
into a separate face changed kerning and pixels in the accent control. The
rejected core pair was 14,088 bytes; the rendering-preserving core pair is
24,728 bytes. The extra **10,640 bytes** preserves the existing accented rendering.

The original Latin and extended faces also share combining-mark coverage.
Removing that overlap changed 181 pixels in the Ā control, even with identical
glyph outlines and spacing. Both files retain the needed combining marks;
extended is declared first and core last, matching the original cascade.
There is no generated fallback face between them. Each advertised Unicode range
contains only codepoints actually present in the saved artifact. The extended
file also retains an encoded base letter for shaping without advertising that
letter in its CSS range, so ASCII alone does not download the extended file.

The derivatives are renamed **TK Site Sans** internally (family, full name,
PostScript name, unique ID, typographic family/style) because Adobe reserves the
font name “Source.” Only the primary webfont family name changes in `Body.tsx`;
the system fallback families are untouched. Original copyright notices and the
SIL Open Font License remain included.

## What was measured

The pinned Google response is Source Sans Pro v24, font version 2.045, fetched
from the exact stylesheet previously used by `Head.tsx`:

https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap

`originals/google-original.css` and its 14 unmodified binaries preserve the
baseline. All original faces are normal style, static weight 400 or 600; there
are **no variable axes, hinting tables, or glyph instructions** to remove.
Original sizes, glyph counts, axes, features, and hinting are recorded per file
in `manifest.json`, together with the same measurements for saved output files.

The 51 rendered pages use normal 400/600, requested bold 700 (matched to the
existing 600 face), and synthesized italics. Code uses system monospace fonts.
There are no explicit feature/variation overrides, automatic hyphenation, or
text-transform rules in current rendered styles. The proof checks computed
styles on text nodes, including inline styles and component-specific typography.
It also tests bold inside italics rather than adding a new italic/bold font.

Keep default `ccmp`, `locl`, `liga`, `kern`, `mark`, and `mkmk` shaping. Remove
opt-in `dnom`, `frac`, `numr`, and `pnum`; current CSS does not enable them.
Hint stripping is requested and checked, but saves zero bytes because the input
was already unhinted. No axis is artificially pinned: the inputs are static.

## Browser pixel proof

Before changing/regenerating fonts, preserve a build of the current content:

```sh
npm run build
cp -R dist /tmp/site-font-baseline
```

Serve that directory and the optimized `dist` on separate ports using your usual
development-server workflow. Then, with `agent-browser` and Chromium installed:

```sh
node scripts/check-fonts.mjs BEFORE_URL AFTER_URL .amp/in/artifacts/font-check
```

Use `--screenshots-only` after the output directory for a faster rendering check.
The full command audits font requests and preloads on all built pages, and
compares homepage, blog, projects, thoughts, a real code block, real italic text,
desktop/narrow controls, every Latin-1/Extended-A codepoint in kerning pairs at
400/600/italic/bold-italic, and CJK fallback. Accented/CJK controls are injected
identically into both builds; published content is not changed to create tests.

It flushes layout before awaiting `document.fonts.ready`, waits for images and
two animation frames, and captures at 2×. Screenshot cases make images eager on
both sides to compare settled rendering, not deferred-image timing. A fresh browser per case prevents
cached external-stylesheet FontFace objects from inflating a later page's font
request list. Byte counts sum measured WOFF2 file sizes for observed font URLs,
not missing `Content-Length` headers on cached responses. These are cold-page
font payload sizes, not total HTTP wire bytes or a claimed latency benchmark.

Every nonzero RGB pixel difference fails the command; no tolerance or mask is
used. It writes before/after images, magenta-on-black diff images, computed
styles, request lists, per-page bytes, and `results.json`. Check the images as
well as the numbers, and verify extended files appear only in extended-character
controls, never on ASCII/punctuation pages or the CJK-only control. Keep zero
differences as the default; do not approve rounding changes automatically.

This proves the recorded Chromium/orb environment, not every OS/browser/font
rasterizer. Rerun on other target platforms before claiming cross-platform pixel
identity. When upstream fonts change, establish a fresh original-font baseline
and repeat the complete proof rather than assuming outlines are unchanged.
