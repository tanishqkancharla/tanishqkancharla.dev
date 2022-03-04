#!/usr/bin/env node
import { build } from "estrella";

build({
  entry: ["./src/index.ts", "./src/style.css"],
  outdir: "dist",
  sourceRoot: "src",
  watch: true,
  bundle: false,
  minify: false,
  tslint: "off",
//   sourcemap: "inline",
//   absWorkingDir
  run: ["tsc src/*.ts","npx serve -n -l 3000 dist"],
});
