import { blockLinkParser as blockLink } from "./blockLink";
import { blockquoteParser } from "./blockQuote";
import { bookmarkParser } from "./bookmark";
import { codeBlockParser as codeBlock } from "./codeBlock";
import { dateParser as date } from "./date";
import { dividerParser as divider } from "./divider";
import { h1Parser as h1 } from "./h1";
import { h2Parser as h2 } from "./h2";
import { h3Parser as h3 } from "./h3";
import { imageParser } from "./image";
import { newLineParser as newLine } from "./newLine";
import { paragraphParser as paragraph } from "./paragraph";
import {
	isParseFailure,
	line,
	logResult,
	maybe,
	oneOf,
	sequence,
	zeroOrMore,
} from "./parseUtils";
import { toggleParser } from "./toggle";
import { tweetParser } from "./twitter";
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
	tweetParser,
	codeBlock,
	blockquoteParser,
	imageParser,
	blockLink,
	toggleParser,
	bookmarkParser,
	newLine,
	paragraph,
]);

export const header = sequence([h1, divider, line, divider, date])
	.map(([h1, divider1, line, divider2, date]) => [h1, line, date] as const)
	.map(([h1, description, date]) => ({
		title: h1.content,
		description,
		date: { year: date.year, month: date.month },
	}));

export const document = sequence([maybe(header), zeroOrMore(block)]);

export type TKMetadata = {
	title: string;
	description?: string;
	date: { year: number; month: number };
};

export type TKDoc = {
	metadata?: TKMetadata;
	blocks: TKBlock[];
};

export function parseTK(contents: string): TKDoc {
	const result = document.run(contents);

	if (isParseFailure(result)) {
		console.log(logResult(result));
		throw new Error(result.value);
	}

	const [metadata, blocks] = result.value;

	return { metadata, blocks };
}
