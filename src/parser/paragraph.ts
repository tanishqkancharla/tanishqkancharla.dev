import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { char, suffix } from "./parseUtils";
import { richTextParser, RichTextToken } from "./richText";

declare module "./parseTK" {
	interface TKBlockMap {
		paragraph: { content: RichTextToken[] };
	}
}

type ParagraphToken = TKBlock<"paragraph">;

export const paragraphParser: Parser<ParagraphToken> = suffix(
	richTextParser,
	char("\n")
).map((content) => ({
	type: "paragraph",
	content,
}));
