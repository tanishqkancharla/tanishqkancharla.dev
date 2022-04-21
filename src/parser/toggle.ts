import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { line, nOrMore, prefix, sequence, str } from "./parseUtils";
import { RichTextContent, richTextParser } from "./richText";

// > Toggle
// | Content inside toggle
const blockType = "toggle";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { label: string; content: RichTextContent[] };
	}
}

type BlockLinkToken = TKBlock<typeof blockType>;

export const toggleParser: Parser<BlockLinkToken> = sequence([
	prefix(str("> "), line),

	nOrMore(1, prefix(str("| "), richTextParser)),
]).map(([label, content]) => ({ type: "toggle", label, content }));
