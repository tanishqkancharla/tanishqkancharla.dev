import {
	between,
	maybe,
	oneOrMore,
	Parser,
	sequence,
	str,
	takeUntilAfter,
} from "teg-parser";
import { not } from "teg-parser/build/parseUtils";
import { TKBlock } from "./parseTK";
import { concat } from "./parseUtils";

// [image:/posts/ui-as-an-api/spotify-console.png](The Spotify API Console)
const blockType = "image";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { url: string; caption: string | undefined };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const imageParser: Parser<BlockLinkToken> = sequence([
	str("[image:"),
	takeUntilAfter(str("]")),
	// Caption
	maybe(between(str("("), oneOrMore(not(str(")"))), str(")"))),
])
	.map((seq) => [seq[1], seq[2] ? concat(seq[2]) : undefined] as const)
	.map(([url, caption]) => ({ type: "image", url, caption }));
