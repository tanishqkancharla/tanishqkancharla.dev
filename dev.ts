#!/usr/bin/env node
import { build } from "estrella";

build({
	entry: ["./src/index.ts", "./src/style.css"],
	outdir: "dist",
	sourceRoot: "src",
	bundle: true,
	minify: false,
	platform: "node",

	tslint: "on",
	jsxFactory: "h",
	jsxFragment: "Fragment",
	sourcemap: "inline",
	sourcesContent: true,
	run: "node dist/index.js",
});
