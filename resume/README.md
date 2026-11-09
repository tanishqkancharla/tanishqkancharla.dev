# Résumé drafts — November 2026

Run `npm run build:resumes` to generate four standalone HTML documents in
`.amp/in/artifacts/resumes/`: product engineer, product/design, senior full-stack,
and AI/developer tools. `index.html` opens the new Product Engineer default;
`tanishq-product-engineer.html` is its direct URL. Earlier versions remain available.
Each page has a keyboard-accessible
version switcher using ordinary links, with the current version marked by `aria-current`.
Run `npm run serve:resumes` to serve the editable versions (uses `$PORT`, default
30871). The supervised `resume-drafts` service runs this server in the current orb.
Click résumé text directly, then **Save edits**. Changes persist to `resume/content.json`,
the source of truth for the next build, and regenerate all four HTML files.
Contact links (including X), company names, the YC label, and project/contribution
names are underlined links. Descriptions, skills, and CMU remain unlinked.
Ctrl/Cmd-click opens links in the editable portal; plain clicks keep editing.
PDF links work normally and add no visible URL lines.
Person details, headings, jobs, and education are shared. Variant headlines,
summaries, Saffron/Shortwave bullets, projects, and skills belong to that variant.
Save before switching versions. The page warns before leaving unsaved edits;
**Discard edits** resets to the last saved copy. Stale edits to the same field are
rejected rather than silently overwriting another tab's save. Failed saves keep
the typed text on screen. Save fetches a fresh same-origin token so server restarts
do not invalidate an open editor tab. **Download PDF** exports the selected version's latest
saved HTML as a US Letter PDF, without the review controls. Save or discard edits
before downloading. The server uses Puppeteer and its installed Chrome browser
to generate PDFs on demand (`npm install` downloads the browser by default).
This is file-backed persistence in this checkout, not
a Git commit, push, or cloud database. Anyone authorized to open this editing
portal can save changes; do not treat it as a public read-only résumé link.
Standalone downloaded HTML remains editable but needs the live server to save.
These four versions remain private review deliverables. `noindex` is not access control.

## Website résumé

The homepage's Resume link opens `/resume`, a read-only export of the default
Product Engineer version. Its only control is **Download PDF**, linking to
`/resume.pdf`. It has no draft note, variant switcher, editable fields, save token,
or editor script; résumé links open normally.

Run `npm run build:public-resume` after approving content changes to regenerate
`public/resume.html` and `public/resume.pdf` together from `resume/content.json`.
The ordinary website build copies these checked-in static files to `dist`, so
production needs no editing server or runtime Chromium. Editor saves do not
silently update the public snapshot. Run `npm run build` afterward to preview
the complete website. The public PDF uses the same font and print renderer as
the editing portal. Generated HTML/PDF are kept alongside the existing public assets.

## Format recommendation

Use a US, reverse-chronological, single-column résumé. Start at one page for this
career stage, prioritizing the founder role and Shortwave over older internships.
Two pages are reasonable if substantive experience needs the space; one page is a
recommendation, not a universal ATS requirement. Use conventional section names,
selectable text, clear dates, and links rather than icons. Avoid photos, proficiency
bars, sidebars, and keyword stuffing. Tailor emphasis and truthful skills to the job.

There is no authoritative new “2026 format.” Current university guidance largely
agrees on readability and relevance, but differs on length and PDF versus DOCX.
Follow the employer's upload instructions. HTML is the editable source, not the
default application upload; export a text PDF and inspect its reading order.

Print on US Letter at 100%, with browser headers/footers off. The review note,
version switcher, editing buttons, and focus highlights are screen-only. All résumé text below the name and target-role
headline uses Maui's 14px size, including dates, contact links, and section headings.
Companies are bold, with italic roles in parentheses on the same line where space
allows; narrow screens stack the dates. Only bullet markers use Maui's secondary
text color; the bullet text uses the normal body color.
Saffron's role includes YC Spring 2025; the separate Saffron → Libretto label is omitted.
Typography, spacing, colors, and surfaces are compiled from the Maui package through
purse-styles; a small inline script handles editing, with no React runtime.
The résumé and review tools use embedded Inter regular (400), semibold (600), bold
(700), and italic font files instead of the OS-dependent system font stack. This
keeps the portal and Linux-generated PDF consistent and preserves real semibold
weights. Inter files come from `rsms/inter/docs/font-files`; their SIL OFL license
is in `resume/fonts/Inter-OFL.txt`.
The role subtitle sits beside the name with a 24px gap, wrapping on narrow screens.
It uses Newsreader Italic at the same 22px size as the name, in Maui's secondary
text color. The font is embedded in the HTML for offline use and print. Its SIL OFL license is in
`resume/fonts/OFL.txt`. Section-heading and summary gaps are one spacing step tighter.
Review controls use Maui's exported `buttonStyles` on native buttons and navigation
links: primary Save, quiet Discard, and raised current-version treatment. This keeps
Maui's actual hover, disabled, shadow, and focus states without adding a React runtime
to the standalone document. Metadata uses Maui's xs/secondary typography and spacing.
The upstream Maui skill and reference files are installed in
`.agents/skills/using-maui/` (local name normalized from `maui`); use it for future UI work.
Deep token imports avoid MauiProvider's DOM-only behavior during static rendering.
The template intentionally uses semantic HTML rather than browser UI controls.

## Editorial decisions

- The new Product Engineer default emphasizes customer discovery, shipped products,
  paying adoption, measurable clinic outcomes, and the product sale—not frontend or
  UI specialization. It features Tandem, diffmap, and Halo, describing user value
  alongside implementation scope. No new adoption/satisfaction metrics are claimed.
  The previous Product / Design and engineering-specific versions are preserved.
- Removed bit.io and ASML at Tanishq's request to make room for substantive projects.
- Carried the saved Product / Design facts into other variants: fifth engineer at
  Shortwave, React Native iOS/Android redesigns, inbox layouts and web design-system
  work, and Libretto's reusable integration scripts. The shared notebook role now
  uses Tanishq's confirmation of working with Chet Corcos. Product copy is otherwise
  preserved, with minor grammar fixes and a tighter notebook description.
- Product/design emphasizes Maui, diffmap, Tandem, and the merged ProseMirror
  clipboard-hook contribution. Full-stack emphasizes Tandem, calldiff, diffmap,
  and the merged Electron Architecture testing contribution. AI/developer tools
  emphasizes calldiff, diffmap, Tandem, and the merged Cua X11 click-identity fix.
  Upstream contributions are explicitly labeled; these are not ownership claims
  about ProseMirror, Electron core, or Cua. Project details come from current public
  READMEs and implementation structure; no adoption or performance figures invented.
- One company entry: **Saffron Health, Inc.**, with Saffron and Libretto as product
  phases. CTO title, equally shared founder responsibilities, and November end month
  confirmed by Tanishq in this thread. November **2026** is inferred from the current
  date and the 2025-to-2026 postmortem chronology.
- **“Sold the Saffron Health product for $125,000”** is Tanishq's statement here.
  This is not described as a company acquisition or an individual payout. Confirm
  disclosure permission, currency, and whether a buyer can be named before public use.
- Clinic metrics are team outcomes from the public YC launch and explicitly approved
  by Tanishq. Preserve the original metric definitions; do not silently reinterpret
  “82% faster” as an independently verified 82% reduction. Baseline, sample size, and
  measurement period still need confirmation for interview preparation.
- The wind-down does not need a defensive explanation in the résumé. An interview
  explanation can distinguish the sold healthcare product from the later Libretto
  wind-down and focus on product adoption, integrations, and technical ownership.
- Role headlines express target positioning, not historical job titles. “Senior” is
  only the full-stack variant's target headline; Shortwave's sourced title is retained.
- No claims of backend languages, cloud platforms, funding amounts, or revenue beyond
  the supplied sale price have been invented.

## Questions for the next revision

1. Can the Shortwave redesign and inbox work be tied to measurable adoption,
   performance, reliability, or delivery improvements? The shipped work is now
   confirmed in Tanishq's saved edits; additional metrics are not yet supplied.
2. Can the 2021–2022 stealth company be named? What shipped, to whom, and with what
   result? Working with Chet Corcos on the research notebook is now confirmed.
3. What was the production stack at Saffron/Libretto? Which hard technical problems
   best show your depth? Any verified Libretto usage, contributors, downloads, or
   maintenance/time/cost improvements?
4. Confirm contact email, desired location/remote preference, exact CMU degree
   wording, and whether to include LinkedIn. Dates before Saffron come from Peerlist
   and still need your review.

## Research and evidence

Accessed November 6, 2026. Public profiles may lag current facts; Tanishq's corrections
in this thread take precedence.

- [Harvard résumé guide](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/): specific, factual, results-oriented language; consistent format; check PDF conversion.
- [UCSB résumé guidance](https://career.ucsb.edu/get-hired/resumes): reverse chronology, relevance, single-column layout, 0.5–1 inch margins, context-dependent length.
- [USC format guidance](https://careers.usc.edu/resources/resume-format-guidelines/): minimal layout, conventional sections, restrained graphics; one page is common, two for extensive experience.
- [UMD ATS guidance](https://careers.umd.edu/find-jobs-internships/resumes-cover-letters/resume-how-to-guide): standard headings, job-specific language, no contact details in page headers/footers; prefers DOCX where possible. ATS behavior varies, so do not claim universal parsing guarantees.
- [Personal site](https://tanishqkancharla.dev) and repository `src/pages/thinking.tk`, project pages, `blog/what-i-learned.tk`, and `blog/grad-essay.tk`: technical interests, React Native iOS work, projects, education.
- [Peerlist résumé](https://peerlist.io/tanishqkancharl/resume): earlier employment dates/titles and 2017–2021 CMU education. The old [Read.cv link](https://read.cv/tk) now shows its shutdown notice, not the résumé.
- [Saffron postmortem](https://saffron.health): founder chronology, five months of manual referral coordination, paid pilot, healthcare-to-Libretto pivot, integration reliability problem.
- [Saffron YC launch](https://www.ycombinator.com/launches/Ola-saffron-health-ai-powered-care-coordination-for-primary-care): referral outcomes; Shortwave iOS/desktop leadership and tens-of-thousands user scope; double major.
- [Libretto](https://libretto.sh): open-source CLI, browser tools, and integration workflow positioning. No unverified adoption metric is used.
- [Maui source](https://github.com/tanishqkancharla/maui): design conventions and token API. Generated output uses the installed npm release, not copied approximations.
- [Tandem](https://github.com/tanishqkancharla/tandem): local database, optimistic replay, live queries, IndexedDB tab sharing, React bindings, server adapters, and collaborative agent-chat example. Pre-1.0; not described as production-proven.
- [calldiff](https://github.com/tanishqkancharla/calldiff): Tree-sitter call-tree diffs, call-path tracing, structured output, MCP integration. README language counts differ from the website, so no count is claimed.
- [diffmap](https://github.com/tanishqkancharla/diffmap): agent skill, interactive source-linked diagrams, commit diffs, persistent inline comments, and shared walkthroughs.
- [Halo](https://github.com/tanishqkancharla/halo-v2): desktop coding-agent app, independently running Node workspace server, Pi sessions, durable Turso conversation storage, workspace tools, and GCP-backed workspaces. The current README supersedes the website's older “Pi in main process” description; public release 0.1.91 was published October 21, 2026. No user count or satisfaction claim is inferred from a release.
- [ProseMirror #141](https://github.com/ProseMirror/prosemirror-view/pull/141): merged September 8, 2022; added `transformCopied` before clipboard serialization, covering copied/cut slices.
- [Electron Architecture #137](https://github.com/ccorcos/electron-architecture/pull/137): merged October 27, 2022; headless Playwright tests, main/renderer test harness, and esbuild tooling. Not Electron core.
- [Cua #3864](https://github.com/trycua/cua/pull/3864): merged September 16, 2026; retained observed X11 accessibility target identities instead of resolving a stale ordinal against a reordered tree. Claim is limited to this fix, not general desktop automation reliability.
- [Beautiful Mermaid #97](https://github.com/lukilabs/beautiful-mermaid/pull/97): merged May 5, 2026; extended a live browser editor with theming, zoom/pan, sharing, and SVG/PNG export. Builds on another contributor's #94; a good product/design alternative, not included to avoid crowding.
- [Tuple Database #12](https://github.com/ccorcos/tuple-database/pull/12): merged July 28, 2022; prevented queued recomputations from invoking destroyed subscriptions. Useful systems-correctness alternative.
- [Parcel #8362](https://github.com/parcel-bundler/parcel/pull/8362): merged October 25, 2022; corrected optional config API arguments in generated TypeScript definitions. A narrow typing fix, not bundler ownership.

Project/contribution sources were rechecked November 7, 2026. Merged upstream PRs
were distinguished from forks and unmerged proposals. No merged React Native core
or Pi core claim was substantiated; Nushell ecosystem contributions are not labeled
as Nushell core implementation.

The live YC company profile now uses **Cashew Labs**, which may be stale or reflect
another phase. It is deliberately not substituted for the company history Tanishq
gave here; confirm only if another phase needs to be included.
