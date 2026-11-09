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
	assert.doesNotMatch(html, /<script\b|\scontenteditable=|\sdata-field=|resume-save-token|\/api\//i);
	assert.doesNotMatch(html, /<nav\b|id="save-edits"|id="discard-edits"|noindex/);
	assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
});
