import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { notChar, prefix, str, zeroOrMore } from "../utils";

declare module ".." {
	interface TKParseTokenMap {
		h1: { content: string };
	}
}

type H1Token = TKParseToken<"h1">;

export const h1Parser: Parser<H1Token> = prefix(
	str("# "),
	zeroOrMore(notChar("\n"))
)
	.map((chars) => chars.join(""))
	.map((content) => ({ type: "h1", content }));
