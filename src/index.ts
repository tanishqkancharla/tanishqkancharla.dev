import * as fs from "fs/promises";
import path from "path";
import { compilePost } from "./compiler/compile";

export type WebsiteContext = {
	accentColor: string;
	headerImageURL: string;
	postsDir: string;
	outDir: string;
};

export async function buildWebsite(context: WebsiteContext) {
	const { postsDir, outDir } = context;
	const dirItems = await fs.readdir(postsDir);
	const oldDirItems = await fs.readdir(outDir);

	for (const oldDirItem of oldDirItems) {
		await fs.rm(path.join(outDir, oldDirItem), { recursive: true });
	}

	const pageNames = dirItems
		.filter((path) => path.endsWith(".tk"))
		.map((name) => name.slice(0, -3));

	for (const pageName of pageNames) {
		console.log(`${pageName}.tk => ${pageName}.html`);

		const rawContents = await fs.readFile(
			path.join(postsDir, `${pageName}.tk`),
			"utf8"
		);

		const compiledContents = compilePost(rawContents);

		await fs.writeFile(
			path.join(outDir, `${pageName}.html`),
			compiledContents,
			"utf8"
		);
	}
}
