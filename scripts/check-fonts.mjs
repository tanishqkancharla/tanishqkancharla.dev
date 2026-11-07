// Manual browser verification, not part of the build. See fonts/README.md.
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [before, after, destination = ".amp/in/artifacts/font-check"] = process.argv.slice(2);
if (!before || !after) throw new Error("Usage: node scripts/check-fonts.mjs BEFORE_URL AFTER_URL [OUTPUT_DIR]");
const screenshotsOnly = process.argv.includes("--screenshots-only");
const output = path.resolve(destination);
await fs.mkdir(output, { recursive: true });
const manifest = JSON.parse(await fs.readFile("scripts/fonts/manifest.json", "utf8"));
const fileBytes = new Map([...manifest.originals, ...manifest.outputs].map(f => [path.basename(f.file), f.bytes]));
let session = "font-proof";
let sessionNumber = 0;
let opened = false;
function browser(...args) {
	const run = () => spawnSync("agent-browser", ["--session", session, "--json", ...args], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
	let call = run();
	// A just-closed browser's socket can disappear during the next launch.
	if (args[0] === "open" && call.status !== 0 && call.stdout.includes("Failed to connect: No such file or directory")) call = run();
	if (call.status !== 0) throw new Error(`${args[0]}: ${call.stdout}\n${call.stderr}`);
	const reply = JSON.parse(call.stdout);
	if (!reply.success) throw new Error(JSON.stringify(reply));
	return reply.data;
}
function openCold(url, width = 1280) {
	// External stylesheet FontFace objects can stay loaded across navigations.
	// A fresh browser makes every byte measurement a cold-document measurement.
	if (opened) browser("close");
	session = `font-proof-${++sessionNumber}`;
	browser("open", url);
	opened = true;
	browser("wait", "--url", url);
	browser("wait", "--fn", "document.body && document.body.innerText.trim().length > 0");
	browser("set", "viewport", String(width), "900", "2");
}
function fontRequests() {
	return browser("network", "requests", "--type", "font").requests.map(r => {
		const bytes = fileBytes.get(path.basename(new URL(r.url).pathname));
		if (bytes === undefined) throw new Error(`Unmeasured font: ${r.url}`);
		return {url:r.url, bytes};
	});
}
const ready = `(async () => {
 // Flush new fixture text into layout before reading the FontFaceSet promise.
 document.body.getBoundingClientRect();
 await document.fonts.ready;
 await Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{})));
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 await document.fonts.ready;
 return true;
})()`;
const usage = `(() => {
 const groups = new Map(), walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()) {
  const n=walker.currentNode,e=n.parentElement;
  if(!e || e.closest('script,style') || !n.textContent.trim()) continue;
  const s=getComputedStyle(e);
  const style=Object.fromEntries(['fontFamily','fontWeight','fontStyle','fontStretch','fontSize','fontFeatureSettings','fontVariationSettings','fontVariant','fontVariantLigatures','fontVariantNumeric','fontKerning','fontOpticalSizing','hyphens','textTransform'].map(k=>[k,s[k]]));
  const key=JSON.stringify(style);
  if(!groups.has(key))groups.set(key,{style,text:''});
  groups.get(key).text+=n.textContent+'\\n';
 }
 return {groups:[...groups.values()],preloads:[...document.querySelectorAll('link[rel=preload][as=font]')].map(e=>e.getAttribute('href')),faces:[...document.fonts].map(f=>({family:f.family,weight:f.weight,range:f.unicodeRange,status:f.status}))};
})()`;
const fixture = `(() => {
 document.body.innerHTML = '<main style="margin:24px;max-width:1000px;line-height:1.65;color:rgb(171,171,171)">'
 + '<h1>Font rendering control</h1>'
 + '<p>AV WA To office affinity ffi fi fl 0123456789 “quotes” — – …</p>'
 + '<p><i>Italic text <b>and bold inside italics Ā café</b></i> <b>Bold 700</b></p>'
 + '<p style="font-weight:600">Semibold 600 — component override Ā Ē Ł</p>'
 + '<p style="font-size:13.94px">Small component text and punctuation.</p>'
 + '<p>Accents: café naïve Ångström ÀV ĀV Œuvre Straße ſ</p>'
 + '<p>Latin Extended-A: Ā Ă Ą Ć Č Ď Đ Ē Ę Ě Ł Ń Ő Ř Ś Ş Š Ť Ů Ű Ź Ż Ž</p>'
 + '<p>Hyphens: soft hyphen co&shy;operate, U+2010 ‐, nonbreaking ‑</p>'
 + '<p style="hyphens:auto;width:140px" lang="en">extraordinarily counterintuitive</p>'
 + '<p>CJK fallback: 中文 日本語 한국어. Emoji: 🙋🏾‍♂️ 📸</p>'
 + '<pre><code style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace">const café = &quot;中文&quot;; // fi ffi</code></pre>'
 + '</main>';
 return true;
})()`;
const glyphGrid = `(() => {
 const text=Array.from({length:224},(_,i)=>'V'+String.fromCodePoint(0xA0+i)+'AV').join(' ');
 document.body.innerHTML='<main style="margin:24px;max-width:1000px;color:rgb(171,171,171);font-size:14px;line-height:1.3">'
 + ['font-weight:400','font-weight:600','font-weight:400;font-style:italic','font-weight:700;font-style:italic'].map(style=>'<p style="'+style+'">'+text+'</p>').join('')+'</main>';
 return true;
})()`;
const cases = [
	{ name: "home", route: "/" },
	{ name: "blog", route: "/blog" },
	{ name: "projects", route: "/projects" },
	{ name: "thoughts", route: "/thoughts" },
	{ name: "code", route: "/blog/extendable-systems", selector: "pre" },
	{ name: "italics", route: "/blog/ui-as-an-api", selector: "i" },
	{ name: "coverage", route: "/", fixture: true },
	{ name: "coverage-narrow", route: "/", fixture: true, width: 390 },
	{ name: "glyph-grid", route: "/", grid: true },
	{ name: "cjk-only", route: "/", cjk: true },
];
const results = { pages: {}, controls: {}, screenshots: [] };
let failed = false;
try {
	for (const [label, base] of [["before", before], ["after", after]]) {
		results.pages[label] = [];
		const files = await fs.readdir("dist", { recursive: true });
		for (const file of files.filter(f => !screenshotsOnly && f.endsWith(".html")).sort()) {
			const route = file === "index.html" ? "/" : `/${file.slice(0, -5)}`;
			openCold(new URL(route, base).href);
			browser("eval", ready);
			const state = browser("eval", usage).result;
			const fonts = fontRequests();
			results.pages[label].push({ route, ...state, fonts, fontBytes: fonts.reduce((n, f) => n + f.bytes, 0) });
			console.log(label, route, results.pages[label].at(-1).fontBytes);
		}
		for (const scene of cases) {
			openCold(new URL(scene.route, base).href, scene.width ?? 1280);
			if (scene.fixture) browser("eval", fixture);
			if (scene.grid) browser("eval", glyphGrid);
			if (scene.cjk) browser("eval", `document.body.innerHTML='<p style="color:white">中文 日本語 한국어</p>'`);
			// Compare settled rendering, not intentionally deferred image timing.
			browser("eval", "[...document.images].forEach(i=>i.loading='eager')");
			browser("eval", ready);
			if (scene.selector) browser("eval", `document.querySelector(${JSON.stringify(scene.selector)}).scrollIntoView({block:'center'})`);
			browser("eval", "new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");
			const state = browser("eval", usage).result;
			results.controls[`${scene.name}-${label}`] = fontRequests();
			await fs.writeFile(path.join(output, `${scene.name}-${label}.json`), JSON.stringify(state, null, 2));
			browser("screenshot", path.join(output, `${scene.name}-${label}.png`));
		}
	}
	for (const scene of cases) {
		const a = await sharp(path.join(output, `${scene.name}-before.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		const b = await sharp(path.join(output, `${scene.name}-after.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		if (a.data.length !== b.data.length) throw new Error(`Screenshot size mismatch: ${scene.name}`);
		let changed = 0, maxChannelDelta = 0;
		const diff = Buffer.alloc(a.data.length);
		for (let i = 0; i < a.data.length; i += 4) {
			const delta = Math.max(...[0,1,2].map(c => Math.abs(a.data[i+c] - b.data[i+c])));
			if (delta) changed++;
			maxChannelDelta = Math.max(maxChannelDelta, delta);
			diff[i] = delta ? 255 : 0; diff[i+1] = 0; diff[i+2] = delta ? 255 : 0; diff[i+3] = 255;
		}
		await sharp(diff, { raw: a.info }).png().toFile(path.join(output, `${scene.name}-diff.png`));
		results.screenshots.push({ case: scene.name, changedPixels: changed, totalPixels: a.info.width * a.info.height, maxChannelDelta });
		if (changed) failed = true;
		console.log(scene.name, changed, "changed pixels");
	}
	await fs.writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2));
} finally {
	if (opened) browser("close");
}
if (failed) process.exitCode = 1;
