import { rootPath } from "./tools/rootPath";

export type WebsiteContext = {
	accentColor: string;
	headerImageURL: string;
	headerImageAlt: string;
	headerImageCredits: string;

	publicDir: string;
	postsDir: string;
	outDir: string;

	mode: "DEV" | "PROD";
};

export const defaultWebsiteContext: WebsiteContext = {
	accentColor: "#6c81ad",

	publicDir: rootPath("/public/"),
	postsDir: rootPath("/src/pages/"),
	outDir: rootPath("/dist/"),

	headerImageURL: "/mcwayfalls.JPG",
	headerImageAlt:
		"A top-down view of Mcway Falls, with a pristine turquouse blue beach lagoon, surrounded on all sides by rocky cliffs.",
	headerImageCredits: "https://unsplash.com/photos/n7wnAWG4hB0",
	mode: "DEV",
};
