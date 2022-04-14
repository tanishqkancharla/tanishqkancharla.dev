import { Parser } from "./Parser";
import {
	between,
	char,
	concat,
	nOrMore,
	not,
	oneOf,
	sequence,
	takeUntil,
	zeroOrMore,
} from "./parseUtils";

function delimitedInlineTextParser<Char extends string>(
	c: Char
): Parser<string> {
	return between(
		char(c),
		zeroOrMore(not(oneOf([char(c), char("\n")]))),
		char(c)
	).map(concat);
}

type ItalicToken = { type: "italic"; content: string };

export const italicParser: Parser<ItalicToken> = delimitedInlineTextParser(
	"_"
).map((content) => ({ type: "italic", content }));

type BoldToken = { type: "bold"; content: string };

export const boldParser: Parser<BoldToken> = delimitedInlineTextParser("*").map(
	(content) => ({ type: "bold", content })
);

type CodeToken = { type: "code"; content: string };

export const codeParser: Parser<CodeToken> = delimitedInlineTextParser("`").map(
	(content) => ({ type: "code", content })
);

type LinkToken = { type: "link"; content: string; href: string };

export const linkParser: Parser<LinkToken> = sequence([
	char("["),
	takeUntil(char("]")),
	char("("),
	takeUntil(char(")")),
])
	.map((seq) => [concat(seq[1]), concat(seq[3])])
	.map(([content, href]) => ({ type: "link", content, href }));

type PlainToken = { type: "plain"; content: string };

export const plainParser: Parser<PlainToken> = nOrMore(
	1,
	not(oneOf([char("\n"), boldParser, linkParser, codeParser, italicParser]))
)
	.map(concat)
	.map((content) => ({ type: "plain", content }));

export type RichTextToken =
	| ItalicToken
	| BoldToken
	| CodeToken
	| LinkToken
	| PlainToken;

export const richTextParser: Parser<RichTextToken[]> = zeroOrMore(
	oneOf([italicParser, boldParser, codeParser, linkParser, plainParser])
);
