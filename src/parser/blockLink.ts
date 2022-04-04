import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { char, concat, sequence, takeUntil } from "./parseUtils";

// [Gem:https://moonrise.tk]
const blockType = "blockLink";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { content: string; href: string };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const blockLinkParser: Parser<BlockLinkToken> = sequence([
	char("["),
	takeUntil(char(":")),
	takeUntil(char("]")),
])
	.map((seq) => [concat(seq[1]), concat(seq[2])])
	.map(([content, href]) => ({ type: "blockLink", content, href }));
