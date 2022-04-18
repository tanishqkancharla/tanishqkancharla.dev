#!/usr/bin/env node
import chokidar from "chokidar";
import decache from "decache";
import { spawn } from "./src/tools/spawn";

type BuildStep = () => void | Promise<void>;

const buildSteps: BuildStep[] = [
	() => {
		decache("./src/buildWebsite");
		const module = require("./src/buildWebsite");
		if (!module.buildWebsite) {
			throw new Error("Expected to find `buildWebsite` in ./src/buildWebsite");
		}
		module.buildWebsite();
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
