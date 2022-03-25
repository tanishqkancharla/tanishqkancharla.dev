import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import {
	between,
	char,
	not,
	sequence,
	takeUntil,
	zeroOrMore,
} from "./parseUtils";

// [Gem:https://moonrise.tk]
const blockType = "blockLink";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { content: string; href: string };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const blockLinkParser: Parser<BlockLinkToken> = between(
	char("["),
	sequence([takeUntil(char(":")), zeroOrMore(not(char("]")))] as const),
	char("]")
)
	.map(([content, hrefChars]) => [content, hrefChars.join("")])
	.map(([content, href]) => ({ type: "blockLink", content, href }));
