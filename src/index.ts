import * as fs from "fs/promises";
import path from "path";
import { compilePost, compileReactComponent } from "./compiler/compile";
import { crawlDirectory } from "./tools/crawlDirectory";

export type WebsiteContext = {
	headerImageURL: string;
	postsDir: string;
	outDir: string;
};

async function buildPost(context: WebsiteContext, postFilePath: string) {
	const { dir, name } = path.parse(postFilePath);

	console.log(`${name}.tk => ${name}.html`);

	const rawContents = await fs.readFile(postFilePath, "utf8");

	const compiledContents = compilePost(rawContents, context);

	const relativePostDir = path.relative(context.postsDir, dir);
	const outPostPath = path.join(
		context.outDir,
		relativePostDir,
		`${name}.html`
	);

	await fs.writeFile(outPostPath, compiledContents, "utf8");
}

async function buildReactPage(context: WebsiteContext, postFilePath: string) {
	const { dir, name } = path.parse(postFilePath);

	console.log(`${name}.tsx => ${name}.html`);

	const Component = (await import(postFilePath)).default;

	const compiledContents = compileReactComponent(Component, context);

	const relativePostDir = path.relative(context.postsDir, dir);
	const outPostPath = path.join(
		context.outDir,
		relativePostDir,
		`${name}.html`
	);

	await fs.writeFile(outPostPath, compiledContents, "utf8");
}

export async function buildWebsite(context: WebsiteContext) {
	const { postsDir } = context;

	for await (const postFilePath of crawlDirectory(postsDir)) {
		if (postFilePath.endsWith(".tk")) {
			await buildPost(context, postFilePath);
		} else if (postFilePath.endsWith(".tsx")) {
			await buildReactPage(context, postFilePath);
		}
	}
}
