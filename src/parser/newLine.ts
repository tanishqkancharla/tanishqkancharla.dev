import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { str } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		newLine: {};
	}
}

type NewLineToken = TKBlock<"newLine">;

export const newLineParser: Parser<NewLineToken> = str("\n\n").map((char) => ({
	type: "newLine",
}));
