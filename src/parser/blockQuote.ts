import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { nOrMore, prefix, str } from "./parseUtils";
import { RichTextContent, richTextParser } from "./richText";

// | This
// | is a blockquote
const blockType = "blockquote";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { content: RichTextContent[] };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const blockquoteParser: Parser<BlockLinkToken> = nOrMore(
	1,
	prefix(str("| "), richTextParser)
).map((content) => ({ type: "blockquote", content }));
