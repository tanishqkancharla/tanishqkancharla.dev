import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { char, concat, sequence, str, takeUntil } from "./parseUtils";

// [[Gem]](https://moonrise.tk)
const blockType = "bookmark";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { title: string; href: string };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const bookmarkParser: Parser<BlockLinkToken> = sequence([
	str("[["),
	takeUntil(str("]]")),
	char("("),
	takeUntil(char(")")),
	char("\n"),
])
	.map((seq) => [concat(seq[1]), concat(seq[3])])
	.map(([title, href]) => ({ type: "bookmark", title, href }));
