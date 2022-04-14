import { buildWebsite } from "./src";

(async () =>
	await buildWebsite({
		postsDir: "./posts/",
		outDir: "./dist/",
		accentColor: "#e68058",
		headerImageURL: "./newyork.webp",
	}))();
