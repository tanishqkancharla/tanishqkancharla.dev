import { TKBlock } from "..";
import { Parser } from "../Parser";
import { oneOrMore } from "../utils";
import { listItemParser } from "./listItem";

const blockType = "unorderedList";

declare module ".." {
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
