import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import {
	concat,
	line,
	maybe,
	prefix,
	sequence,
	str,
	takeUntil,
} from "./parseUtils";

const blockType = "codeBlock";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { lang?: string; content: string };
	}
}

type CodeBlockToken = TKBlock<typeof blockType>;

export const langParser = prefix(str("```"), maybe(line)) //
	.map((lang) => (lang === "" ? undefined : lang));

export const codeBlockParser: Parser<CodeBlockToken> = sequence([
	langParser,
	takeUntil(str("\n```\n")).map(concat),
]) //
	.map(([lang, content]) => ({
		type: "codeBlock",
		lang,
		content,
	}));
