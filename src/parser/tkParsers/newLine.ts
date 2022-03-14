import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { char } from "../utils";

declare module ".." {
	interface TKParseTokenMap {
		newLine: {};
	}
}

type NewLineToken = TKParseToken<"newLine">;

export const newLineParser: Parser<NewLineToken> = char("\n").map((char) => ({
	type: "newLine",
}));
