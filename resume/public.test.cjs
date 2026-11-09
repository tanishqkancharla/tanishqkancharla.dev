const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("the website résumé is the read-only default with a static PDF download", () => {
	const root = path.resolve(__dirname, "..");
	const homepage = fs.readFileSync(path.join(root, "src/pages/index.tk"), "utf8");
	const html = fs.readFileSync(path.join(root, "public/resume.html"), "utf8");
	const pdf = fs.readFileSync(path.join(root, "public/resume.pdf"));

	assert.match(homepage, /\[📋 Resume\]\(\/resume\)/);
	assert.match(html, /<title>Tanishq Kancharla — Product Engineer<\/title>/);
	assert.match(html, /href="\/resume\.pdf" download="Tanishq-Kancharla-Resume\.pdf"/);
	assert.match(html, /Updated <time dateTime="\d{4}-\d{2}-\d{2}">/i);
	assert.doesNotMatch(html, /<script\b|\scontenteditable=|\sdata-field=|resume-save-token|\/api\//i);
	assert.doesNotMatch(html, /<nav\b|id="save-edits"|id="discard-edits"|noindex/);
	assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
});

test("discard restores edited text and preserves company and role links", async () => {
	const { default: puppeteer } = await import("puppeteer");
	const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
	try {
		const page = await browser.newPage();
		await page.setContent(`<!DOCTYPE html>
			<meta name="resume-save-token" content="test-token">
			<button id="save-edits" disabled>Save edits</button>
			<button id="discard-edits" disabled>Discard edits</button>
			<a id="download-pdf" href="/resume.pdf">Download PDF</a>
			<p id="save-status" role="status"></p>
			<main>
				<p data-field="summary" contenteditable="plaintext-only">Original summary</p>
				<p data-field="company" contenteditable="plaintext-only"><a href="https://saffron.health/">Saffron Health, Inc.</a></p>
				<p data-field="role" contenteditable="plaintext-only">Co-founder &amp; CTO · <a href="https://www.ycombinator.com/launches/Ola-saffron-health-ai-powered-care-coordination-for-primary-care">YC Spring 2025</a></p>
			</main>`);
		await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "editor.js"), "utf8") });

		// Both unrelated edits and edits to a linked field must discard cleanly.
		for (const field of ["summary", "company", "role"]) {
			await page.focus(`[data-field="${field}"]`);
			await page.keyboard.down("Control");
			await page.keyboard.press("KeyA");
			await page.keyboard.up("Control");
			await page.keyboard.type("Unsaved replacement");
			await page.click("#discard-edits");
			assert.deepEqual(await page.$$eval("main [data-field]", els => els.map(el => el.innerText)), [
				"Original summary", "Saffron Health, Inc.", "Co-founder & CTO · YC Spring 2025",
			]);
			assert.deepEqual(await page.$$eval("main a", els => els.map(el => el.href)), [
				"https://saffron.health/",
				"https://www.ycombinator.com/launches/Ola-saffron-health-ai-powered-care-coordination-for-primary-care",
			]);
			assert.equal(await page.$eval("#save-edits", el => el.disabled), true);
		}
	} finally {
		await browser.close();
	}
});
