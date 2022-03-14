import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { line, maybe, prefix, sequence, str, takeUntil } from "../utils";

const blockType = "codeBlock";

declare module ".." {
	interface TKParseTokenMap {
		[blockType]: { lang?: string; content: string };
	}
}

type CodeBlockToken = TKParseToken<typeof blockType>;

const langParser = prefix(str("```"), maybe(line)) //
	.map((lang) => (lang === "" ? undefined : lang));

export const codeBlockParser: Parser<CodeBlockToken> = sequence([
	langParser,
	takeUntil(str("\n```")),
	// zeroOrMore(not(str("\n```"))),
	// str("\n```"),
] as const) //
	.map(([lang, content]) => ({
		type: "codeBlock",
		lang,
		content,
	}));
