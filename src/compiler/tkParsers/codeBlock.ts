import { TKBlock } from "..";
import { Parser } from "../Parser";
import { line, maybe, prefix, sequence, str, takeUntil } from "../utils";

const blockType = "codeBlock";

declare module ".." {
	interface TKBlockMap {
		[blockType]: { lang?: string; content: string };
	}
}

type CodeBlockToken = TKBlock<typeof blockType>;

export const langParser = prefix(str("```"), maybe(line)) //
	.map((lang) => (lang === "" ? undefined : lang));

export const codeBlockParser: Parser<CodeBlockToken> = sequence([
	langParser,
	takeUntil(str("\n```\n")),
	// zeroOrMore(not(str("\n```"))),
	// str("\n```"),
] as const) //
	.map(([lang, content]) => ({
		type: "codeBlock",
		lang,
		content,
	}));
