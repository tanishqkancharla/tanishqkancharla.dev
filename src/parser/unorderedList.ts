import { listItemParser } from "./listItem";
import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { oneOrMore } from "./parseUtils";

const blockType = "unorderedList";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { listItems: string[] };
	}
}

type UnorderedListToken = TKBlock<typeof blockType>;

export const unorderedListParser: Parser<UnorderedListToken> = oneOrMore(
	listItemParser
)
	.map((listItems) => listItems.map((listItem) => listItem.content))
	.map((listItems) => ({ type: "unorderedList", listItems }));
