import { listItemParser } from "./listItem";
import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { nOrMore } from "./parseUtils";

const blockType = "unorderedList";

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { listItems: string[] };
	}
}

type UnorderedListToken = TKBlock<typeof blockType>;

// const indentedUnorderedListParser = (
// 	indent: number
// ): Parser<UnorderedListToken> =>
// 	nOrMore(
// 		1,
// 		oneOf([
// 			indentedListItemParser(indent),
// 			indentedUnorderedListParser(indent + 2),
// 		])
// 	)
// 		.map((listItems) => listItems.map((listItem) => listItem.content))
// 		.map((listItems) => ({ type: "unorderedList", listItems }));

export const unorderedListParser: Parser<UnorderedListToken> = nOrMore(
	1,
	listItemParser
)
	.map((listItems) => listItems.map((listItem) => listItem.content))
	.map((listItems) => ({ type: "unorderedList", listItems }));
