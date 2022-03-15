import { codeBlockParser as codeBlock } from "./tkParsers/codeBlock";
import { dateParser as date } from "./tkParsers/date";
import { dividerParser as divider } from "./tkParsers/divider";
import { h1Parser as h1 } from "./tkParsers/h1";
import { h2Parser as h2 } from "./tkParsers/h2";
import { h3Parser as h3 } from "./tkParsers/h3";
import { newLineParser as newLine } from "./tkParsers/newLine";
import { paragraphParser as paragraph } from "./tkParsers/paragraph";
import { twitterParser as twitter } from "./tkParsers/twitter";
import { unorderedListParser as unorderedList } from "./tkParsers/unorderedList";
import { isParseFailure, oneOf, sequence, zeroOrMore } from "./utils";

export interface TKBlockMap {}

type TKBlockType = keyof TKBlockMap;

export type TKBlock<Types extends TKBlockType = TKBlockType> = {
	[Type in Types]: {
		type: Type;
	} & TKBlockMap[Type];
}[Types];

export const block = oneOf([
	h1,
	h2,
	h3,
	unorderedList,
	divider,
	twitter,
	codeBlock,
	newLine,
	paragraph,
]);

export const header = sequence([h1, divider, paragraph, divider, date] as const)
	.map(
		([h1, divider1, paragraph, divider2, date]) =>
			[h1, paragraph, date] as const
	)
	.map(([h1, paragraph, date]) => ({
		title: h1.content,
		description: paragraph.content,
		date,
	}));

export const document = sequence([header, zeroOrMore(block)] as const);

export function parseTK(contents: string) {
	const result = document.run(contents);

	if (isParseFailure(result)) {
		throw new Error(result.value);
	}

	const [metadata, blocks] = result.value;

	return { metadata, blocks };
}
