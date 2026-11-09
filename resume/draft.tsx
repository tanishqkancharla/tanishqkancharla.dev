import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { createInMemoryStyleApi, style } from "purse-styles";
// Deep imports keep this static document independent of Maui's browser-only provider.
import { text } from "@tanishqkancharla/maui/src/tokens/text";
import { spacing } from "@tanishqkancharla/maui/src/tokens/spacing";
import { radius } from "@tanishqkancharla/maui/src/tokens/radius";
import { colors } from "@tanishqkancharla/maui/src/tokens/colors";
import { backgroundColor } from "@tanishqkancharla/maui/src/tokens/background";
import { borderColor } from "@tanishqkancharla/maui/src/tokens/borders";
import { buttonStyles } from "@tanishqkancharla/maui/src/components/Button";

type Job = { company: string; role: string; dates: string; bullet?: string };
export type ResumeContent = {
	person: { name: string; email: string; website: string; github: string; x: string };
	headings: Record<"experience" | "projects" | "skills" | "education", string>;
	jobs: Record<"saffron" | "shortwave" | "stealth", Job>;
	education: { school: string; dates: string; degree: string };
	variants: Record<string, {
		title: string; summary: string; founder: string[]; shortwave: string[];
		projects: { name: string; url: string; detail: string }[]; skills: string;
	}>;
};

export const contentPath = path.resolve(__dirname, "content.json");
export async function readContent(): Promise<ResumeContent> {
	return JSON.parse(await fs.readFile(contentPath, "utf8"));
}

const links: Record<string, string> = {
	"Saffron Health, Inc.": "https://saffron.health/",
	"YC Spring 2025": "https://www.ycombinator.com/launches/Ola-saffron-health-ai-powered-care-coordination-for-primary-care",
	"Shortwave": "https://www.shortwave.com/",
};
const linkedNames = new RegExp(`(?<![\\w])(${Object.keys(links).sort((a, b) => b.length - a.length).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\w])`, "g");
function linkText(value: string) {
	const parts: React.ReactNode[] = [];
	let offset = 0;
	for (const match of value.matchAll(linkedNames)) {
		parts.push(value.slice(offset, match.index));
		parts.push(<a key={match.index} href={links[match[0]]}>{match[0]}</a>);
		offset = match.index + match[0].length;
	}
	parts.push(value.slice(offset));
	return parts;
}

export async function buildResumes(content?: ResumeContent, { publish = false } = {}) {
	const output = path.resolve(publish ? "public" : ".amp/in/artifacts/resumes");
	await fs.mkdir(output, { recursive: true });
	const newsreader = (await fs.readFile(path.resolve(__dirname, "fonts/newsreader-italic.ttf"))).toString("base64");
	const inter = (await fs.readFile(path.resolve(__dirname, "fonts/inter-Regular.woff2"))).toString("base64");
	const interSemibold = (await fs.readFile(path.resolve(__dirname, "fonts/inter-SemiBold.woff2"))).toString("base64");
	const interBold = (await fs.readFile(path.resolve(__dirname, "fonts/inter-Bold.woff2"))).toString("base64");
	const interItalic = (await fs.readFile(path.resolve(__dirname, "fonts/inter-Italic.woff2"))).toString("base64");
	const { person, headings, jobs, education, variants } = content ?? await readContent();
	for (const [id, variant] of Object.entries(variants)) {
		if (publish && id !== "product-engineer") continue;
		const edit = (field: string, value: string, linked = false) => <span data-field={publish ? undefined : field} contentEditable={publish ? undefined : "plaintext-only"} suppressContentEditableWarning>{linked ? linkText(value) : value}</span>;
		const variantField = (field: string, value: string) => edit(`variants.${id}.${field}`, value);
		const api = createInMemoryStyleApi();
		const css = (definition: Parameters<typeof style>[0]) => {
			const compiled = style(definition);
			api.addStyleElement(compiled);
			return compiled.className;
		};
		const body = css(text({ size: "md" }));
		const title = css(text({ size: "xl", fontWeight: 700 }));
		const label = css(text({ size: "xl", color: "lowContrast" }));
		const secondary = css(text({ size: "md", color: "lowContrast" }));
		const heading = css(text({ size: "md", fontWeight: 600 }));
		const role = css(text({ size: "md" }));
		const meta = css(text({ size: "xs", color: "lowContrast" }));
		const saveButton = css(buttonStyles.root({ variant: "primary" }));
		const quietButton = css(buttonStyles.root({ variant: "quiet" }));
		const defaultButton = css(buttonStyles.root());
		const buttonLabel = css(buttonStyles.label);
		const sheet = css({
			backgroundColor: backgroundColor.element,
			padding: spacing.value(16),
			border: `1px solid ${borderColor.outline}`,
		});
		const jobHeading = (key: keyof typeof jobs) => <div className="role-line"><h3 className={role}><strong>{edit(`jobs.${key}.company`, jobs[key].company, true)}</strong> (<em>{edit(`jobs.${key}.role`, jobs[key].role, true)}</em>)</h3><p className={secondary}>{edit(`jobs.${key}.dates`, jobs[key].dates)}</p></div>;
		const html = renderToStaticMarkup(
			<html lang="en" data-theme="light">
				<head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{!publish && <meta name="robots" content="noindex, nofollow" />}
					<title>{`Tanishq Kancharla — ${variant.title}${publish ? "" : " — Draft"}`}</title>
				</head>
				<body className={body}>
					{publish ? <aside className={`review ${meta}`} aria-label="Résumé download">
						<a className={defaultButton} style={{ alignSelf: "flex-end" }} href="/resume.pdf" download="Tanishq-Kancharla-Resume.pdf"><span className={buttonLabel}>Download PDF</span></a>
					</aside> : <aside className={`review ${meta}`} aria-label="Draft review tools">
						<nav className="variant-switcher" aria-label="Résumé version">
							{Object.keys(variants).map((key) => <a key={key} className={key === id ? defaultButton : quietButton} href={`tanishq-${key}.html`} aria-current={key === id ? "page" : undefined}><span className={buttonLabel}>{key === "product-engineer" ? "Product Engineer" : key === "product" ? "Product / Design" : key === "full-stack" ? "Full-Stack" : "AI / Dev Tools"}</span></a>)}
						</nav>
						<p>Draft · November 2026 · Verify earlier-role details before sending.</p>
						<div className="edit-tools">
							<button type="button" id="save-edits" className={saveButton} disabled><span className={buttonLabel}>Save edits</span></button>
							<button type="button" id="discard-edits" className={quietButton} disabled><span className={buttonLabel}>Discard edits</span></button>
							<a id="download-pdf" className={quietButton} href={`/api/pdf/${id}`} download><span className={buttonLabel}>Download PDF</span></a>
							<p id="save-status" role="status">Click any résumé text to edit. Save writes back to the source file.</p>
						</div>
					</aside>}
					<main className={`sheet ${sheet} ${css(radius.sm)}`}>
						<header>
							<div className="identity">
								<h1 className={title}>{edit("person.name", person.name)}</h1>
								<p className={`position ${label}`}>{variantField("title", variant.title)}</p>
							</div>
							<address className={secondary}>
								<a href={`mailto:${person.email}`}>{edit("person.email", person.email)}</a>
								<a href={`https://${person.website}`}>{edit("person.website", person.website)}</a>
								<a href={`https://${person.github}`}>{edit("person.github", person.github)}</a>
								<a href={`https://${person.x}`}>{edit("person.x", person.x)}</a>
							</address>
						</header>
						<p className="summary">{variantField("summary", variant.summary)}</p>
						<section aria-labelledby="experience">
							<h2 id="experience" className={heading}>{edit("headings.experience", headings.experience)}</h2>
							<article>
								{jobHeading("saffron")}
								<ul>{variant.founder.map((bullet, i) => <li key={i}>{variantField(`founder.${i}`, bullet)}</li>)}</ul>
							</article>
							<article>
								{jobHeading("shortwave")}
								<ul>{variant.shortwave.map((bullet, i) => <li key={i}>{variantField(`shortwave.${i}`, bullet)}</li>)}</ul>
							</article>
							<article>
								{jobHeading("stealth")}
								<ul><li>{edit("jobs.stealth.bullet", jobs.stealth.bullet!)}</li></ul>
							</article>
						</section>
						{variant.projects.length > 0 && <section aria-labelledby="projects">
							<h2 id="projects" className={heading}>{edit("headings.projects", headings.projects)}</h2>
							{variant.projects.map((project, i) => <p className="project" key={i}><a href={project.url}><strong>{variantField(`projects.${i}.name`, project.name)}</strong></a> — {variantField(`projects.${i}.detail`, project.detail)}</p>)}
						</section>}
						<section aria-labelledby="skills">
							<h2 id="skills" className={heading}>{edit("headings.skills", headings.skills)}</h2>
							<p>{variantField("skills", variant.skills)}</p>
						</section>
						<section aria-labelledby="education">
							<h2 id="education" className={heading}>{edit("headings.education", headings.education)}</h2>
							<div className="role-line"><h3 className={role}><strong>{edit("education.school", education.school)}</strong></h3><p className={secondary}>{edit("education.dates", education.dates)}</p></div>
							<p>{edit("education.degree", education.degree)}</p>
						</section>
					</main>
				</body>
			</html>,
		);
		const layout = `
@font-face { font-family: "Newsreader"; font-style: italic; font-weight: 400; src: url(data:font/ttf;base64,${newsreader}) format("truetype"); font-display: swap; }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 400; src: url(data:font/woff2;base64,${inter}) format("woff2"); font-display: swap; }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 600; src: url(data:font/woff2;base64,${interSemibold}) format("woff2"); font-display: swap; }
@font-face { font-family: "Inter"; font-style: normal; font-weight: 700; src: url(data:font/woff2;base64,${interBold}) format("woff2"); font-display: swap; }
@font-face { font-family: "Inter"; font-style: italic; font-weight: 400; src: url(data:font/woff2;base64,${interItalic}) format("woff2"); font-display: swap; }
* { box-sizing: border-box; }
html { color-scheme: light; -webkit-text-size-adjust: 100%; }
body { margin: 0; background: ${backgroundColor.app}; -webkit-font-smoothing: antialiased; }
.sheet, .review { font-family: "Inter", sans-serif; font-synthesis: none; }
.sheet *, .review * { font-family: inherit; }
h1,h2,h3,p { margin: 0; }
a { color: inherit; text-decoration: none; }
a:hover { text-decoration: underline; }
main a { text-decoration: underline; text-underline-offset: 2px; }
main a:focus-visible { outline: 2px solid ${colors.blue[8]}; outline-offset: 3px; }
[contenteditable] { border-radius: 2px; white-space: pre-wrap; overflow-wrap: anywhere; }
[contenteditable]:focus { outline: 2px solid ${colors.blue[8]}; outline-offset: 3px; }
@media (hover: hover) { [contenteditable]:hover { background: ${colors.gray[3]}; } }
.edit-tools { display: flex; flex-wrap: wrap; align-items: center; gap: ${spacing.value(4)}; }
#save-status { flex-basis: 100%; }
.review { display: flex; flex-direction: column; gap: ${spacing.value(4)}; max-width: 816px; margin: ${spacing.value(12)} auto ${spacing.value(8)}; padding: 0 ${spacing.value(16)}; }
.variant-switcher { display: flex; flex-wrap: wrap; gap: ${spacing.value(4)}; }
.review a:hover { text-decoration: none; }
.sheet { width: min(816px, calc(100% - 32px)); margin: 0 auto 32px; }
.identity { display: flex; flex-wrap: wrap; align-items: baseline; gap: ${spacing.value(2)} ${spacing.value(12)}; }
.position { font-family: "Newsreader", Georgia, serif; font-style: italic; font-weight: 400; font-optical-sizing: auto; }
address { display: flex; flex-wrap: wrap; gap: 2px 8px; font-style: normal; margin-top: 9px; }
address a { display: inline-flex; align-items: baseline; gap: 8px; }
address a:not(:last-child)::after { content: "·"; }
.summary { margin-top: ${spacing.value(8)}; }
section { margin-top: 24px; }
h2 { border-bottom: 1px solid ${borderColor.outline}; padding-bottom: 6px; margin-bottom: ${spacing.value(4)}; }
article + article { margin-top: 16px; }
.role-line { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.role-line > p { white-space: nowrap; font-variant-numeric: tabular-nums; }
ul { margin: 8px 0 0; padding-left: 17px; }
li { padding-left: 2px; }
li::marker { color: ${colors.gray[11]}; }
li + li { margin-top: 4px; }
.project + .project { margin-top: 6px; }
strong { font-weight: 600; }
@media screen and (max-width: 580px) {
 .sheet { width: 100%; margin: 0; padding: 24px 20px; border: 0; }
 .review { margin-top: 16px; padding: 0 20px; }
 .role-line { display: block; }
 address { flex-direction: column; }
 address a::after { display: none; }
}
@page { size: letter; margin: 0.5in; }
@media print {
 .review { display: none; }
 [contenteditable] { outline: none !important; background: none !important; }
 body { background: white; }
 .sheet { width: 100%; padding: 0; margin: 0; border: 0; line-height: 20px; }
 .summary, section { margin-top: 16px; }
 .summary { margin-top: ${spacing.value(6)}; }
 h2 { padding-bottom: 4px; margin-bottom: ${spacing.value(3)}; }
 article + article { margin-top: 12px; }
 article, .project { break-inside: avoid; }
 h2, h3, .role-line { break-after: avoid; }
}
`;
		const editorScript = publish ? "" : await fs.readFile(path.resolve(__dirname, "editor.js"), "utf8");
		const contents = "<!DOCTYPE html>" + html.replace("</head>", `<style>${api.styleRulesRef.current.join("\n")}\n${layout}</style></head>`).replace("</body>", `${publish ? "" : `<script>${editorScript}</script>`}</body>`);
		const filename = publish ? "resume.html" : `tanishq-${id}.html`;
		await fs.writeFile(path.join(output, filename), contents);
		if (!publish && id === "product-engineer") await fs.writeFile(path.join(output, "index.html"), contents);
		api.detachVariableGroups();
		console.log(`Built ${id}: ${path.relative(process.cwd(), output)}/${filename}`);
	}
}

export async function renderResumePDF(html: string) {
	const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
	try {
		const page = await browser.newPage();
		await page.setJavaScriptEnabled(false);
		await page.setContent(html);
		await page.evaluate(() => document.fonts.ready);
		return await page.pdf({ preferCSSPageSize: true, printBackground: true });
	} finally { await browser.close(); }
}

if (require.main === module) {
	(async () => {
		const publish = process.argv.includes("--publish");
		await buildResumes(undefined, { publish });
		if (publish) {
			const html = await fs.readFile(path.resolve("public/resume.html"), "utf8");
			await fs.writeFile(path.resolve("public/resume.pdf"), await renderResumePDF(html));
			console.log("Built public/resume.pdf");
		}
	})().catch((error) => { console.error(error); process.exitCode = 1; });
}
