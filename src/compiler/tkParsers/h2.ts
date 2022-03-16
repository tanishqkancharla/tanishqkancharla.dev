import { TKBlock } from "..";
import { Parser } from "../Parser";
import { line, prefix, str } from "../utils";

declare module ".." {
	interface TKBlockMap {
		h2: { content: string };
	}
}

type H2Token = TKBlock<"h2">;

export const h2Parser: Parser<H2Token> = prefix(str("## "), line).map(
	(content) => ({ type: "h2", content })
);
