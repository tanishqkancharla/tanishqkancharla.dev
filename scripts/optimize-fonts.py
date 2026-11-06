#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools[woff]==4.68.0", "brotli==1.2.1", "uharfbuzz==0.57.0"]
# ///
"""Manually regenerate checked-in fonts after building current content. See fonts/README.md."""

import hashlib
import json
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "scripts/fonts/originals"
OUTPUT = ROOT / "public/fonts"
FAMILY = "TK Site Sans"
# CSS uses normal feature settings. Keep default shaping and positioning, not
# opt-in fractions, numerators, denominators, or proportional-number alternates.
FEATURES = ["ccmp", "locl", "liga", "kern", "mark", "mkmk"]
CORE = set(range(0x20, 0x7F)) | {0xA0, 0x2010, 0x2011, 0x2012, 0x2013,
    0x2014, 0x2015, 0x2018, 0x2019, 0x201A, 0x201B, 0x201C, 0x201D,
    0x201E, 0x201F, 0x2026}


class Content(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.text = ""

    def handle_starttag(self, tag, attrs):
        if tag in ("style", "script"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ("style", "script"):
            self.skip -= 1

    def handle_data(self, text):
        if not self.skip:
            self.text += text


def ranges(codepoints):
    result = []
    for point in sorted(codepoints):
        if result and point == result[-1][1] + 1:
            result[-1][1] = point
        else:
            result.append([point, point])
    return ",".join(f"U+{a:04X}" + (f"-{b:04X}" if a != b else "") for a, b in result)


def metadata(path):
    font = TTFont(path)
    return {
        "file": str(path.relative_to(ROOT)),
        "bytes": path.stat().st_size,
        "glyphs": len(font.getGlyphOrder()),
        "characters": len(font.getBestCmap()),
        "axes": [{"tag": a.axisTag, "min": a.minValue, "default": a.defaultValue,
                  "max": a.maxValue} for a in font["fvar"].axes] if "fvar" in font else [],
        "features": {tag: sorted({f.FeatureTag for f in font[tag].table.FeatureList.FeatureRecord})
                     for tag in ("GSUB", "GPOS") if tag in font and font[tag].table.FeatureList},
        "hintingTables": [tag for tag in ("fpgm", "prep", "cvt ", "gasp") if tag in font],
        "instructedGlyphs": sum(bool(getattr(font["glyf"][g], "program", None)
                                    and font["glyf"][g].program.getBytecode())
                                for g in font.getGlyphOrder()),
    }


def main():
    pages = sorted((ROOT / "dist").rglob("*.html"))
    if not pages:
        raise SystemExit("Run npm run build first, then rerun this script manually.")
    characters = set()
    digest = hashlib.sha256()
    for page in pages:
        contents = page.read_text()
        parser = Content()
        parser.feed(contents)
        characters.update(map(ord, parser.text))
        digest.update(parser.text.encode())
    # Keep the requested Latin-1 and Latin Extended-A coverage even when unused.
    # Retain U+2010 for CSS automatic hyphenation, even though current CSS is manual.
    requested = characters | set(range(0xA0, 0x180)) | CORE
    normalization_points = {ord(c) for cp in requested for c in unicodedata.normalize("NFD", chr(cp))}
    css = (ORIGINALS / "google-original.css").read_text()
    originals = []
    faces = []
    for block in re.findall(r"@font-face\s*\{([^}]+)\}", css):
        url = re.search(r"url\(([^)]+)\)", block)[1]
        weight = int(re.search(r"font-weight:\s*(\d+)", block)[1])
        coverage = set()
        for a, b in re.findall(r"U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?", block):
            coverage.update(range(int(a, 16), int(b or a, 16) + 1))
        path = ORIGINALS / url.rsplit("/", 1)[-1]
        originals.append({**metadata(path), "url": url, "weight": weight})
        faces.append((weight, path, coverage))

    OUTPUT.mkdir(exist_ok=True)
    outputs = []
    css_rules = []
    preloads = []
    for weight in (400, 600):
        inputs = [(p, c) for w, p, c in faces if w == weight]
        latin, latin_range = next((p, c) for p, c in inputs if 0x41 in c)
        extended, extended_range = next((p, c) for p, c in inputs if 0x100 in c)
        # Preserve the original split. Moving Latin-1 accents out of the core
        # breaks cross-file kerning (e.g. ÀV). Keeping a few extra core glyphs is
        # intentional: rendering equality takes precedence over minimum bytes.
        # Include combining marks exposed by the original CSS, even when only
        # reached by canonical decomposition (Ā needs the shared U+0304).
        core_points = (requested | normalization_points) & latin_range & set(TTFont(latin).getBestCmap())
        extended_points = (requested | normalization_points) & extended_range & set(TTFont(extended).getBestCmap())
        covered = core_points | extended_points
        original_coverage = set().union(*(set(TTFont(p).getBestCmap()) & c for p, c in inputs))
        if requested & original_coverage - covered:
            raise SystemExit("Content needs another script subset. Review font coverage before regenerating.")
        # Combining marks may belong to both faces. Preserve Google's cascade:
        # extended first, Latin core last. Don't add an intermediate fallback face.
        for part, source, points in (("extended", extended, extended_points), ("core", latin, core_points)):
            result = TTFont(source, recalcTimestamp=False)
            # Keep encoded base letters needed for canonical decomposition.
            # Combining marks are advertised only where the original CSS did.
            support = {ord(c) for cp in points for c in unicodedata.normalize("NFD", chr(cp))}
            support &= set(result.getBestCmap()) & set(range(0x20, 0x7F))
            encoded = points | support
            options = subset.Options()
            options.hinting = False
            options.harfbuzz_repacker = True
            options.layout_features = FEATURES
            options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14, 16, 17]
            options.recalc_timestamp = False
            subsetter = subset.Subsetter(options=options)
            subsetter.populate(unicodes=encoded)
            subsetter.subset(result)
            # RFN 'Source': rename the derivative internally, not just its filename.
            style = "Regular" if weight == 400 else "SemiBold"
            names = {1: FAMILY, 2: style, 3: f"TKSiteSans-{style}-{part}-1",
                     4: f"{FAMILY} {style}", 6: f"TKSiteSans-{style}-{part}",
                     16: FAMILY, 17: style}
            for name_id, value in names.items():
                for platform, encoding, language in ((3, 1, 0x409), (1, 0, 0)):
                    result["name"].setName(value, name_id, platform, encoding, language)
            result.flavor = "woff2"
            result.recalcTimestamp = False
            from io import BytesIO
            buffer = BytesIO()
            result.save(buffer)
            data = buffer.getvalue()
            name = f"tk-site-sans-{weight}-{part}-{hashlib.sha256(data).hexdigest()[:12]}.woff2"
            path = OUTPUT / name
            path.write_bytes(data)
            # Read the saved artifact: don't trust the pre-serialization cmap.
            saved = TTFont(path)
            actual = set(saved.getBestCmap())
            assert actual == encoded, (name, actual ^ encoded)
            assert points <= actual
            assert not metadata(path)["hintingTables"]
            assert not metadata(path)["instructedGlyphs"]
            assert all("Source" not in (saved["name"].getDebugName(i) or "") for i in names)
            url = f"/fonts/{name}"
            css_rules.append(f'@font-face{{font-family:"{FAMILY}";font-style:normal;'
                f'font-weight:{weight};font-display:swap;src:url("{url}") format("woff2");'
                f'unicode-range:{ranges(points)};}}')
            if part == "core":
                preloads.append(url)
            outputs.append({**metadata(path), "weight": weight, "part": part,
                            "unicodeRange": ranges(points), "shapingSupport": ranges(support - points)})

    expected = {Path(o["file"]).name for o in outputs}
    for path in OUTPUT.glob("tk-site-sans-*.woff2"):
        if path.name not in expected:
            path.unlink()
    (ROOT / "src/styles/fonts.ts").write_text(
        '// Generated by scripts/optimize-fonts.py. Do not edit by hand.\n'
        + f'export const fontCSS = {json.dumps("".join(css_rules))};\n'
        + f'export const coreFontURLs = {json.dumps(preloads)};\n')
    report = {"contentSHA256": digest.hexdigest(), "pageCount": len(pages),
              "usedCharacters": ranges(characters), "requestedCharacters": ranges(requested),
              "featuresKept": FEATURES, "originals": originals, "outputs": outputs}
    (ROOT / "scripts/fonts/manifest.json").write_text(json.dumps(report, indent=2) + "\n")
    for item in outputs:
        print(f'{item["weight"]} {item["part"]}: {item["bytes"]} bytes, {item["glyphs"]} glyphs')


if __name__ == "__main__":
    main()
