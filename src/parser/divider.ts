import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { str } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		divider: {};
	}
}

type DividerToken = TKBlock<"divider">;

export const dividerParser: Parser<DividerToken> = str("---\n").map(() => ({
	type: "divider",
}));
