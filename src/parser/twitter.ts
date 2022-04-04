import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { concat, prefix, str, takeUntil } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		twitter: { url: string };
	}
}

type TwitterToken = TKBlock<"twitter">;

export const twitterParser: Parser<TwitterToken> = prefix(
	str("[twitter:"),
	takeUntil(str("]\n"))
) //
	.map(concat)
	.map((url) => ({ type: "twitter", url }));
