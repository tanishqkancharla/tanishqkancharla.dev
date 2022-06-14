#!/usr/bin/env node
import chokidar from "chokidar";
import decache from "decache";
import { BuildWebsite } from "./src/server/buildWebsite";
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
		const buildWebsite = module.buildWebsite as BuildWebsite;
		buildWebsite(true);
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

	chokidar.watch(["src"]).on("change", async () => {
		try {
			await build();
		} catch (e) {
			console.error(e);
		}
	});
}

buildAndServe();
