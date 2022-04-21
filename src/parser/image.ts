import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import {
	between,
	char,
	concat,
	maybe,
	not,
	oneOrMore,
	sequence,
	str,
	takeUntil,
} from "./parseUtils";

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
	takeUntil(str("]")),
	maybe(between(char("("), oneOrMore(not(char(")"))), char(")"))),
	char("\n"),
])
	.map((seq) => [concat(seq[1]), seq[2] ? concat(seq[2]) : undefined] as const)
	.map(([url, caption]) => ({ type: "image", url, caption }));
