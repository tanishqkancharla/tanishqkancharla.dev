import { TKBlock } from "..";
import { Parser } from "../Parser";
import { line, prefix, str } from "../utils";

declare module ".." {
	interface TKBlockMap {
		h3: { content: string };
	}
}

type H3Token = TKBlock<"h3">;

export const h3Parser: Parser<H3Token> = prefix(str("### "), line).map(
	(content) => ({ type: "h3", content })
);
