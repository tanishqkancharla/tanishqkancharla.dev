import { codeBlockParser as codeBlock } from "./codeBlock";
import { dateParser as date } from "./date";
import { dividerParser as divider } from "./divider";
import { h1Parser as h1 } from "./h1";
import { h2Parser as h2 } from "./h2";
import { h3Parser as h3 } from "./h3";
import { newLineParser as newLine } from "./newLine";
import { paragraphParser as paragraph } from "./paragraph";
import { isParseFailure, oneOf, sequence, zeroOrMore } from "./parseUtils";
import { twitterParser as twitter } from "./twitter";
import { unorderedListParser as unorderedList } from "./unorderedList";

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
		date: { year: date.year, month: date.month },
	}));

export const document = sequence([header, zeroOrMore(block)] as const);

export type TKDoc = {
	metadata: {
		title: string;
		description: string;
		date: { year: number; month: number };
	};
	blocks: TKBlock[];
};

export function parseTK(contents: string): TKDoc {
	const result = document.run(contents);

	if (isParseFailure(result)) {
		throw new Error(result.value);
	}

	const [metadata, blocks] = result.value;

	return { metadata, blocks };
}
