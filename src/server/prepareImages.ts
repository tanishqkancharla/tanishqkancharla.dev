import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { PreparedImage } from "../config";

export async function prepareImages(outDir: string, imagePaths: string[]) {
	const assets: Record<string, PreparedImage> = {};

	async function writeHashed(relativePath: string, bytes: Buffer) {
		const { dir, name, ext } = path.parse(relativePath);
		const hash = createHash("sha256")
			.update(new Uint8Array(bytes))
			.digest("hex")
			.slice(0, 16);
		const hashed = path.join(dir, `${name}.${hash}${ext}`);
		await fs.writeFile(path.join(outDir, hashed), new Uint8Array(bytes));
		return `/${hashed.split(path.sep).join("/")}`;
	}

	// Explicit source paths make repeated builds safe: previously generated
	// hashes are never inputs. Non-images (including fonts) are never read here.
	for (const relativePath of imagePaths) {
		if (!/\.(jpe?g|png|gif|webp)$/i.test(relativePath)) continue;
		const original = await fs.readFile(path.join(outDir, relativePath));
		const metadata = await sharp(original).metadata();
		const width = metadata.width!;
		const height = metadata.pageHeight ?? metadata.height!;
		const asset: PreparedImage = {
			src: await writeHashed(relativePath, original),
			width,
			height,
		};
		assets[`/${relativePath.split(path.sep).join("/")}`] = asset;
	}
	return assets;
}
