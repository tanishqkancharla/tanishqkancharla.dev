#!/usr/bin/env ts-node
import { watch } from "chokidar";
import decache from "decache";
import { defaultWebsiteContext } from "./src/config";
import { buildPage, buildWebsite } from "./src/server/buildWebsite";
import { rootPath } from "./src/tools/rootPath";
import { spawn } from "./src/tools/spawn";

type BuildStep = () => void | Promise<void>;

const buildSteps: BuildStep[] = [
	() => {
		decache("./src/server/buildWebsite");
		const module = require("./src/server/buildWebsite");
		if (!module.buildWebsite) {
			throw new Error(
				"Expected to find `buildWebsite` in ./src/server/buildWebsite"
			);
		}
		// const buildWebsite = module.buildWebsite as BuildWebsite;
		buildWebsite(defaultWebsiteContext);
	},
];

function serveWebsite() {
	return spawn("serve", []);
}

async function buildAndServe() {
	const context = defaultWebsiteContext;

	await buildWebsite(context);
	serveWebsite();

	watch(["src"]).on("change", async (filePath) => {
		try {
			await buildPage(context, rootPath(filePath));
		} catch (e) {
			console.error(e);
		}
	});
}

buildAndServe();
