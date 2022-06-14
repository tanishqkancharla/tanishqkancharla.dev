import { line, Parser, prefix, str } from "teg-parser";
import { TKBlock } from "./parseTK";

declare module "./parseTK" {
	interface TKBlockMap {
		h1: { content: string };
	}
}

type H1Token = TKBlock<"h1">;

export const h1Parser: Parser<H1Token> = prefix(str("# "), line).map(
	(content) => ({ type: "h1", content })
);
