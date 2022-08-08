import { rootPath } from "./tools/rootPath";

export type WebsiteContext = {
	accentColor: string;
	headerImageURL: string;
	headerImageAlt: string;
	headerImageCredits: string;

	postsDir: string;
	outDir: string;

	clientJsPath: string;
	outClientJsPath: string;

	mode: "DEV" | "PROD";
};

export const defaultWebsiteContext: WebsiteContext = {
	accentColor: "#7772e0",

	postsDir: rootPath("/src/pages/"),
	outDir: rootPath("/dist/"),

	clientJsPath: rootPath("/src/client/index.tsx"),
	outClientJsPath: "/index.js",

	headerImageURL: "/montreal.jpg",
	headerImageAlt:
		"A port with boats at Old Port of Montreal, Montreal, Canada, shot just after sunset with the lit-up city in the background",
	headerImageCredits: "https://unsplash.com/photos/LoGWCnEVDgU",
	mode: "DEV",
};
