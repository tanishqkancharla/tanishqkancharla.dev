import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { line, prefix, str } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		h1: { content: string };
	}
}

type H1Token = TKBlock<"h1">;

export const h1Parser: Parser<H1Token> = prefix(str("# "), line).map(
	(content) => ({ type: "h1", content })
);
