#!/usr/bin/env ts-node
import { watch } from "chokidar";
import { defaultWebsiteContext } from "./src/config";
import { buildPage, buildWebsite } from "./src/server/buildWebsite";
import { rootPath } from "./src/tools/rootPath";
import { spawn } from "./src/tools/spawn";

function serveWebsite() {
	return spawn("serve", []);
}

async function buildAndServe() {
	const context = defaultWebsiteContext;

	await buildWebsite(context);
	serveWebsite();

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

buildAndServe();
