import { codeToHtml } from "shiki";
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

	const html = await codeToHtml(content, {
		lang,
		theme: "one-dark-pro",
	});

	return { ...block, html } as const;
};
