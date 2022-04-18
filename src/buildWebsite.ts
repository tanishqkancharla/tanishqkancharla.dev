import fs from "fs-extra";
import path from "path";
import { compilePost, compileReactComponent } from "./compiler/compile";
import { crawlDirectory } from "./tools/crawlDirectory";
import { defaultWebsiteContext, WebsiteContext } from "./WebsiteContext";

async function buildPost(context: WebsiteContext, postFilePath: string) {
	const { dir, name } = path.parse(postFilePath);

	console.log(`${name}.tk => ${name}.html`);

	const rawContents = await fs.readFile(postFilePath, "utf8");

	const relativePostDir = path.relative(context.postsDir, dir);
	const outPostPath = path.join(
		context.outDir,
		relativePostDir,
		`${name}.html`
	);
	const href = path.join(relativePostDir, name);

	const compiledContents = compilePost(rawContents, context, href);

	await fs.ensureFile(outPostPath);
	await fs.writeFile(outPostPath, compiledContents, "utf8");
}

async function buildReactPage(context: WebsiteContext, postFilePath: string) {
	const { dir, name } = path.parse(postFilePath);

	console.log(`${name}.tsx => ${name}.html`);

	const { default: Component, getStaticProps } = await import(postFilePath);

	let props = {};
	if (getStaticProps) {
		props = await getStaticProps(context);
	}

	const relativePostDir = path.relative(context.postsDir, dir);
	const outPostPath = path.join(
		context.outDir,
		relativePostDir,
		`${name}.html`
	);
	const href = path.join(relativePostDir, name);

	const compiledContents = compileReactComponent(
		Component,
		props,
		context,
		href
	);

	await fs.writeFile(outPostPath, compiledContents, "utf8");
}

export async function buildWebsite() {
	const context = defaultWebsiteContext;
	const { postsDir } = context;

	for await (const postFilePath of crawlDirectory(postsDir)) {
		if (postFilePath.endsWith(".tk")) {
			await buildPost(context, postFilePath);
		} else if (postFilePath.endsWith(".tsx")) {
			await buildReactPage(context, postFilePath);
		}
	}
}
