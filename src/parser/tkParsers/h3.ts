import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { notChar, prefix, str, zeroOrMore } from "../utils";

declare module ".." {
	interface TKParseTokenMap {
		h3: { content: string };
	}
}

type H3Token = TKParseToken<"h3">;

export const h3Parser: Parser<H3Token> = prefix(
	str("### "),
	zeroOrMore(notChar("\n"))
)
	.map((chars) => chars.join(""))
	.map((content) => ({ type: "h3", content }));
