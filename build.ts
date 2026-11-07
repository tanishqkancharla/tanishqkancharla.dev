#!/usr/bin/env ts-node
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { defaultWebsiteContext, WebsiteContext } from "./src/config";
import { buildWebsite } from "./src/server/buildWebsite";
import { prepareImages } from "./src/server/prepareImages";
import { resolutionFileName, resolutions } from "./src/styles/resolutions";

export async function copyPublic(context: WebsiteContext) {
	const { publicDir, outDir, headerImageURL } = context;
	const headerImagePath = path.join(publicDir, path.basename(headerImageURL));

	await fs.cp(publicDir, outDir, { recursive: true });

	const { name: fileName } = path.parse(headerImagePath);
	const inputBuffer = await fs.readFile(headerImagePath);
	const publicPaths = await fs.readdir(publicDir, { recursive: true });
	const headerPaths: string[] = [];

	for (const res of resolutions) {
		const jpgOutputFilename = resolutionFileName(fileName, res);
		headerPaths.push(jpgOutputFilename);

		const jpgFilePath = path.join(outDir, jpgOutputFilename);

		await sharp(inputBuffer).resize(res).toFile(jpgFilePath);
	}

	context.imageAssets = await prepareImages(outDir, [
		...publicPaths,
		...headerPaths,
	]);
}

async function main() {
	const context = defaultWebsiteContext;

	await copyPublic(context);
	await buildWebsite({ ...context, mode: "PROD" });
}

if (require.main === module) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
