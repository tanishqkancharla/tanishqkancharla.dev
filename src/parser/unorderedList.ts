import { Parser } from "./Parser";
import { TKBlock } from "./parseTK";
import { line, maybe, nOrMore, prefix, str } from "./parseUtils";

const blockType = "unorderedList";

// Recursive types going on here, since list items can have their own internal
// unordered list
type ListItemContent = string | [string, TKBlock<"unorderedList">];
export type UnorderedListContent = ListItemContent[];

declare module "./parseTK" {
	interface TKBlockMap {
		[blockType]: { listItems: UnorderedListContent };
	}
}

type UnorderedListToken = TKBlock<typeof blockType>;

export const indentedListItemParser = (
	indent: number
): Parser<ListItemContent> =>
	prefix(str(" ".repeat(indent) + "- "), line)
		.chain((firstContent) =>
			maybe(indentedUnorderedListParser(indent + 2)).map((indentedList) => [
				firstContent,
				indentedList,
			])
		)
		.map(([firstContent, indentedList]) =>
			indentedList ? [firstContent, indentedList] : firstContent
		);

export const indentedUnorderedListParser = (
	indent: number
): Parser<UnorderedListToken> =>
	nOrMore(1, indentedListItemParser(indent)).map((listItems) => ({
		type: "unorderedList",
		listItems,
	}));

export const unorderedListParser: Parser<UnorderedListToken> =
	indentedUnorderedListParser(0);
