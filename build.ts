#!/usr/bin/env ts-node
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { defaultWebsiteContext } from "./src/config";
import { buildWebsite } from "./src/server/buildWebsite";
import { resolutionFileName, resolutions } from "./src/styles/resolutions";

async function copyPublic() {
	const { publicDir, outDir, headerImageURL } = defaultWebsiteContext;
	const headerImagePath = path.join(publicDir, headerImageURL);

	await fs.cp(publicDir, outDir, { recursive: true });

	const { name: fileName } = path.parse(headerImagePath);
	const inputBuffer = await fs.readFile(headerImagePath);

	for (const res of resolutions) {
		const jpgOutputFilename = resolutionFileName(fileName, res);

		const jpgFilePath = path.join(outDir, jpgOutputFilename);

		await sharp(inputBuffer).resize(res).toFile(jpgFilePath);
	}
}

async function main() {
	await copyPublic();
	await buildWebsite({ ...defaultWebsiteContext, mode: "PROD" });
}

main();
