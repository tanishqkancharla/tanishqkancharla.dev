import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { char, concat, sequence, str, takeUntil } from "./parseUtils";

// [bookmark:https://moonrise.tk]
const blockType = "bookmark";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { url: string };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const bookmarkParser: Parser<BlockLinkToken> = sequence([
	str("[bookmark:"),
	takeUntil(str("]")),
	char("\n"),
])
	.map((seq) => concat(seq[1]))
	.map((url) => ({ type: "bookmark", url }));
