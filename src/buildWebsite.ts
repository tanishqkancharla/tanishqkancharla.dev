import fs from "fs-extra";
import path from "path";
import { compilePost, compileReactComponent } from "./compiler/compile";
import { defaultWebsiteContext } from "./config";
import { crawlDirectory } from "./tools/crawlDirectory";
import { WebsiteContext } from "./WebsiteContext";

async function buildPost(context: WebsiteContext, postFilePath: string) {
	const { dir, name } = path.parse(postFilePath);

	const rawContents = await fs.readFile(postFilePath, "utf8");

	const relativePostDir = path.relative(context.postsDir, dir);
	const href = path.join(relativePostDir, name);

	const compiledContents = await compilePost(rawContents, context, href);

	return `<!DOCTYPE html>${compiledContents}`;
}

async function buildReactPage(context: WebsiteContext, pageFilePath: string) {
	const { dir, name } = path.parse(pageFilePath);

	const imports = await import(pageFilePath);
	const { default: Component, getStaticProps } = imports;

	let props = {};
	if (getStaticProps) {
		props = await getStaticProps(context);
	}

	const title = imports.title || "Moonrise";

	const relativePostDir = path.relative(context.postsDir, dir);
	const href = path.join(relativePostDir, name);

	const compiledContents = compileReactComponent(Component, props, context, {
		href,
		title,
	});

	return `<!DOCTYPE html>${compiledContents}`;
}

export async function buildWebsite() {
	const context = defaultWebsiteContext;
	const { postsDir } = context;

	for await (const filePath of crawlDirectory(postsDir)) {
		const { dir, name, ext } = path.parse(filePath);

		let compiledContents: string;

		if (ext === ".tk") {
			console.log(`${name}.tk => ${name}.html`);

			compiledContents = await buildPost(context, filePath);
		} else if (ext === ".tsx") {
			console.log(`${name}.tsx => ${name}.html`);

			compiledContents = await buildReactPage(context, filePath);
		} else {
			console.error("Unknown extension found for file: ", filePath);
			continue;
		}

		const relativePostDir = path.relative(context.postsDir, dir);
		const outPostPath = path.join(
			context.outDir,
			relativePostDir,
			`${name}.html`
		);

		await fs.ensureFile(outPostPath);
		await fs.writeFile(outPostPath, compiledContents, "utf8");
	}
}
