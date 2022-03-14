import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { notChar, prefix, str, zeroOrMore } from "../utils";

declare module ".." {
	interface TKParseTokenMap {
		h2: { content: string };
	}
}

type H2Token = TKParseToken<"h2">;

export const h2Parser: Parser<H2Token> = prefix(
	str("## "),
	zeroOrMore(notChar("\n"))
)
	.map((chars) => chars.join(""))
	.map((content) => ({ type: "h2", content }));
