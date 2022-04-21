import { rootPath } from "./tools/rootPath";
import { WebsiteContext } from "./WebsiteContext";

export const defaultWebsiteContext: WebsiteContext = {
	postsDir: rootPath("/src/pages/"),
	outDir: rootPath("/dist/"),
	headerImageURL: "/bolivia.jpg",
	headerImageAlt:
		"Shot in infrared from Isla Incahuasi, a rocky island composed of marine limestone sediments and volcanic material surrounded by the Salar de Uyuni, a massive pink salt desert",
	headerImageCredits:
		"https://www.behance.net/gallery/85911149/Bolivia-Infraland",
};
