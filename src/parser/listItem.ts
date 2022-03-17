import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { line, prefix, str } from "./parseUtils";

const blockType = "listItem";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { content: string };
	}
}

type ListItemToken = TKBlock<typeof blockType>;

export const listItemParser: Parser<ListItemToken> = prefix(
	str("- "),
	line
).map((content) => ({ type: "listItem", content }));
