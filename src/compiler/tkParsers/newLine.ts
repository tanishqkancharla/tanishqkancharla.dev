import { TKBlock } from "..";
import { Parser } from "../Parser";
import { str } from "../utils";

declare module ".." {
	interface TKBlockMap {
		newLine: {};
	}
}

type NewLineToken = TKBlock<"newLine">;

export const newLineParser: Parser<NewLineToken> = str("\n\n").map((char) => ({
	type: "newLine",
}));
