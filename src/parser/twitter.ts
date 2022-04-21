import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { concat, prefix, str, takeUntil } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		tweet: { url: string };
	}
}

type TwitterToken = TKBlock<"tweet">;

export const tweetParser: Parser<TwitterToken> = prefix(
	str("[tweet:"),
	takeUntil(str("]\n"))
) //
	.map(concat)
	.map((url) => ({ type: "tweet", url }));
