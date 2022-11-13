import { rootPath } from "./tools/rootPath";

export type WebsiteContext = {
	accentColor: string;
	headerImageURL: string;
	headerImageAlt: string;
	headerImageCredits: string;

	publicDir: string;
	postsDir: string;
	outDir: string;

	clientJsPath: string;
	outClientJsPath: string;

	mode: "DEV" | "PROD";
};

export const defaultWebsiteContext: WebsiteContext = {
	accentColor: "#6c81ad",

	publicDir: rootPath("/public/"),
	postsDir: rootPath("/src/pages/"),
	outDir: rootPath("/dist/"),

	clientJsPath: rootPath("/src/client/index.tsx"),
	outClientJsPath: "/index.js",

	headerImageURL: "Italy.jpeg",
	headerImageAlt: "Foggy mountains in Italy after the evening rain.",
	headerImageCredits: "https://unsplash.com/photos/LoGWCnEVDgU",
	mode: "DEV",
};
