import {
	between,
	isParseSuccess,
	line,
	nOrMore,
	notChars,
	oneOf,
	oneOrMore,
	ParseFailure,
	Parser,
	ParseSuccess,
	sequence,
	str,
	takeUntilAfter,
	zeroOrMore,
} from "teg-parser";
import { not } from "teg-parser/build/parseUtils";
import { concat, identity } from "./parseUtils";

function delimitedInlineTextParser<Char extends string>(
	c: Char
): Parser<string> {
	return between(str(c), zeroOrMore(notChars([c, "\n"])), str(c)).map(concat);
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
	str("["),
	takeUntilAfter(str("]")),
	str("("),
	takeUntilAfter(str(")")),
])
	.map((seq) => [seq[1], seq[3]])
	.map(([content, href]) => ({ type: "link", content, href }));

type PlainToken = { type: "plain"; content: string };

export const plainParser: Parser<PlainToken> = nOrMore(
	1,
	not(oneOf([str("\n"), boldParser, linkParser, codeParser, italicParser]))
)
	.map(concat)
	.map((content) => ({ type: "plain", content }));

export type RichTextToken =
	| ItalicToken
	| BoldToken
	| CodeToken
	| LinkToken
	| PlainToken;

export type RichTextContent = RichTextToken[];

export const richTextParser: Parser<RichTextToken[]> = line.fold((result) => {
	const richText = oneOrMore(
		oneOf([italicParser, boldParser, codeParser, linkParser, plainParser])
	).run(result.value);
	// We want to parse the line but keep the rest of the stream.
	if (isParseSuccess(richText)) {
		return new ParseSuccess(richText.value, result.stream);
	} else {
		return new ParseFailure(richText.value, result.stream);
	}
}, identity);
