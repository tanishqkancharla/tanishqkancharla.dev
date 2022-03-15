import { TKBlock } from "..";
import { Parser } from "../Parser";
import { line } from "../utils";

declare module ".." {
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
