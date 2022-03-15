import { TKBlock } from "..";
import { Parser } from "../Parser";
import { prefix, str, takeUntil } from "../utils";

declare module ".." {
	interface TKBlockMap {
		twitter: { url: string };
	}
}

type TwitterToken = TKBlock<"twitter">;

export const twitterParser: Parser<TwitterToken> = prefix(
	str("[twitter:"),
	takeUntil(str("]\n"))
) //
	.map((url) => ({ type: "twitter", url }));
