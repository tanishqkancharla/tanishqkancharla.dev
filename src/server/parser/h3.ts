import { line, Parser, prefix, str } from "teg-parser";
import { TKBlock } from "./parseTK";

declare module "./parseTK" {
	interface TKBlockMap {
		h3: { content: string };
	}
}

type H3Token = TKBlock<"h3">;

export const h3Parser: Parser<H3Token> = prefix(str("### "), line).map(
	(content) => ({ type: "h3", content })
);
