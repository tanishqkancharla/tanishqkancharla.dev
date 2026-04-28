import * as esbuild from "esbuild";
import fs from "node:fs/promises";
import { glob } from "glob";
import { minimatch } from "minimatch";
import path from "path";
import { WebsiteContext } from "../config";
import { rootPath } from "../tools/rootPath";
import { keys } from "../utils/typeUtils";
import { compilePost, compileReactComponent } from "./compiler/compile";

async function buildTKPost(context: WebsiteContext, postFilePath: string) {
	const { dir, name } = path.parse(postFilePath);

	const rawContents = await fs.readFile(postFilePath, "utf8");

	const relativePostDir = path.relative(context.postsDir, dir);
	const href = path.join(relativePostDir, name);

	const compiledContents = await compilePost(rawContents, context, href);

	const contents = `<!DOCTYPE html>${compiledContents}`;

	const outPostPath = path.join(
		context.outDir,
		relativePostDir,
		`${name}.html`
	);

	await fs.mkdir(path.dirname(outPostPath), { recursive: true });
	await fs.writeFile(outPostPath, contents, "utf8");
}

async function buildReactPage(context: WebsiteContext, pageFilePath: string) {
	const { dir, name } = path.parse(pageFilePath);

	delete require.cache[require.resolve(pageFilePath)];
	const imports = await import(pageFilePath);
	const { default: Component, getStaticProps } = imports;

	let props = {};
	if (getStaticProps) {
		props = await getStaticProps(context);
	}

	const title = imports.title || "Tanishq K.";

	const relativePostDir = path.relative(context.postsDir, dir);
	const href = path.join(relativePostDir, name);

	const compiledContents = compileReactComponent(Component, props, context, {
		href,
		title,
	});

	const contents = `<!DOCTYPE html>${compiledContents}`;

	const outPostPath = path.join(
		context.outDir,
		relativePostDir,
		`${name}.html`
	);

	await fs.mkdir(path.dirname(outPostPath), { recursive: true });
	await fs.writeFile(outPostPath, contents, "utf8");
}

async function buildJavascript(context: WebsiteContext, filePath: string) {
	const dev = context.mode === "DEV";
	await esbuild.build({
		entryPoints: [filePath],
		outdir: context.outDir,
		bundle: true,
		minify: !dev,
		sourcemap: dev ? "inline" : undefined,
		sourcesContent: dev,
	});
}

const pageBuilders = {
	"src/pages/**/*.tk": buildTKPost,
	"src/pages/**/*.tsx": buildReactPage,
	"src/client/index.tsx": buildJavascript,
};

function matchGlob(globStr: string): Promise<string[]> {
	return glob(globStr);
}

export async function getAllPages() {
	const pageGlobs = keys(pageBuilders).map(rootPath);
	const matchingFiles = await Promise.all(pageGlobs.map(matchGlob));
	return matchingFiles.flat();
}

export async function buildPage(context: WebsiteContext, filePath: string) {
	for (const pageGlob of keys(pageBuilders)) {
		const match = minimatch(filePath, rootPath(pageGlob));
		if (match) {
			const buildPage = pageBuilders[pageGlob];
			await buildPage(context, filePath);
			return true;
		}
	}

	return false;
}

/** Build website pages */
export async function buildWebsite(context: WebsiteContext) {
	const filePaths = await getAllPages();
	if (context.mode === "DEV") {
		for (const filePath of filePaths) {
			await buildPage(context, filePath);
		}
	} else if (context.mode === "PROD") {
		// Parallel
		await Promise.all(
			filePaths.map((filePath) => buildPage(context, filePath))
		);
	}
}
