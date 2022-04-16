import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { RichTextContent, richTextParser } from "./richText";

declare module "./parseTK" {
	interface TKBlockMap {
		paragraph: { content: RichTextContent };
	}
}

type ParagraphToken = TKBlock<"paragraph">;

export const paragraphParser: Parser<ParagraphToken> = richTextParser.map(
	(content) => ({
		type: "paragraph",
		content,
	})
);
