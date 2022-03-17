import { compile } from "./compiler/compile";
import { TKDoc } from "./parser/parseTK";

export type Website = { [page: string]: TKDoc };

export type WebsiteContext = {
	accentColor: string;
	headerImageURL: string;
};

compile({ postsDir: "./posts/", outDir: "./dist/" });
