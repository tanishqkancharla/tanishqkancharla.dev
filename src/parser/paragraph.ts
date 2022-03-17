import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { line } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		paragraph: { content: string };
	}
}

type ParagraphToken = TKBlock<"paragraph">;

export const paragraphParser: Parser<ParagraphToken> = line //
	.map((content) => ({
		type: "paragraph",
		content,
	}));
