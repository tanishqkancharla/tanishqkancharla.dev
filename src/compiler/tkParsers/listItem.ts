import { TKBlock } from "..";
import { Parser } from "../Parser";
import { line, prefix, str } from "../utils";

const blockType = "listItem";

declare module ".." {
	interface TKBlockMap {
		[blockType]: { content: string };
	}
}

type ListItemToken = TKBlock<typeof blockType>;

export const listItemParser: Parser<ListItemToken> = prefix(
	str("- "),
	line
).map((content) => ({ type: "listItem", content }));
