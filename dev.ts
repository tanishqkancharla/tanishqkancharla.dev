#!/usr/bin/env node
import chokidar from "chokidar";
import decache from "decache";
import { rootPath } from "./src/tools/rootPath";
import { spawn } from "./src/tools/spawn";

type BuildStep = () => void | Promise<void>;

const buildSteps: BuildStep[] = [
	() => {
		decache("./src/index");
		const module = require("./src/index");
		if (!module.buildWebsite) {
			throw new Error("Expected to find `buildWebsite` in ./src/index");
		}
		module.buildWebsite({
			postsDir: rootPath("posts/"),
			outDir: rootPath("dist/"),
			headerImageURL: "./newyork.webp",
		});
	},
];

async function build() {
	for (const buildStep of buildSteps) {
		await buildStep();
	}
}

function serveWebsite() {
	return spawn("serve", []);
}

async function buildAndServe() {
	await build();
	serveWebsite();

	chokidar.watch(["src", "posts"]).on("change", async () => {
		try {
			await build();
		} catch (e) {
			console.error(e);
		}
	});
}

buildAndServe();
