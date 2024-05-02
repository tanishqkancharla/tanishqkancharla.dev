#!/usr/bin/env ts-node
import { exec } from "child_process";
import { watch } from "chokidar";
import { copyPublic } from "./build";
import { defaultWebsiteContext } from "./src/config";
import { buildPage, buildWebsite } from "./src/server/buildWebsite";
import { rootPath } from "./src/tools/rootPath";

function serveWebsite() {
	return exec("npx serve");
}

async function buildAndServe() {
	const context = defaultWebsiteContext;

	await copyPublic(context);
	await buildWebsite(context);

	serveWebsite();

	console.log("Serving at http://localhost:3000");

	watch(["src"]).on("change", async (filePath) => {
		const built = await buildPage(context, rootPath(filePath));
		if (built) {
			console.log(`Rebuilt ${filePath}`);
		} else {
			console.warn(`No match found for ${filePath}: Rebuilding website`);
			await buildWebsite(context);
		}
	});
}

if (require.main === module) {
	buildAndServe().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
