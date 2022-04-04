import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { char } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		newLine: {};
	}
}

type NewLineToken = TKBlock<"newLine">;

export const newLineParser: Parser<NewLineToken> = char("\n").map((char) => ({
	type: "newLine",
}));
