import { rootPath } from "./tools/rootPath";

export type WebsiteContext = {
	accentColor: string;
	headerImageURL: string;
	headerImageAlt: string;
	headerImageCredits: string;

	postsDir: string;
	relativeClientJsPath: string;
	outDir: string;

	mode: "DEV" | "PROD";
};

export const defaultWebsiteContext: WebsiteContext = {
	accentColor: "#7772e0",
	postsDir: rootPath("/src/pages/"),
	outDir: rootPath("/dist/"),
	relativeClientJsPath: "/index.js",
	headerImageURL: "/seoul.jpeg",
	headerImageAlt:
		"A shot of Seoul, South Korea of high-rise buildings set against the backdrop of a mountain, with a purple and blue sky during sunrise.",
	headerImageCredits: "https://unsplash.com/photos/LoGWCnEVDgU",
	mode: "DEV",
};
