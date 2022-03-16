import { TKBlock } from "..";
import { Parser } from "../Parser";
import { str } from "../utils";

declare module ".." {
	interface TKBlockMap {
		divider: {};
	}
}

type DividerToken = TKBlock<"divider">;

export const dividerParser: Parser<DividerToken> = str("---\n").map(() => ({
	type: "divider",
}));
