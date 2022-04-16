import { buildWebsite } from "./src";

(async () =>
	await buildWebsite({
		postsDir: "./posts/",
		outDir: "./dist/",
		headerImageURL: "./newyork.webp",
	}))();
