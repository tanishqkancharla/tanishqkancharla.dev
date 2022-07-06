import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import { TKBlock } from "tk-parser";
import { TKBlockTransformer } from "./Transformer";

export type LoadedCodeBlock = {
	type: "codeBlock";
	lang?: string;
	html: string;
};

type CodeBlockLoader = TKBlockTransformer<"codeBlock", LoadedCodeBlock>;

export const codeBlockLoader: CodeBlockLoader = async (
	block: Extract<TKBlock, { type: "codeBlock" }>
) => {
	const { content, lang } = block;

	if (!lang) return { ...block, html: content };

	console.log("Loading code block with lang", lang);

	loadLanguages(lang);
	const html = Prism.highlight(content, Prism.languages[lang], lang);

	return { ...block, html } as const;
};
