import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { line, prefix, str } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		h3: { content: string };
	}
}

type H3Token = TKBlock<"h3">;

export const h3Parser: Parser<H3Token> = prefix(str("### "), line).map(
	(content) => ({ type: "h3", content })
);
