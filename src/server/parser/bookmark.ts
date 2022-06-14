import { Parser, sequence, str, takeUntilAfter } from "teg-parser";
import { TKBlock } from "./parseTK";

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
	takeUntilAfter(str("]")),
	str("\n"),
])
	.map((seq) => seq[1])
	.map((url) => ({ type: "bookmark", url }));
