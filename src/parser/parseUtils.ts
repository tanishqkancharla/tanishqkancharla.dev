import { Parser } from "./Parser";
import { ParseFailure, ParseResult, ParseSuccess } from "./ParseResult";

export const identity = <T>(arg: T) => arg;

export function isParseSuccess<T>(
	result: ParseResult<T>
): result is ParseSuccess<T> {
	return result instanceof ParseSuccess;
}

export function isParseFailure(
	result: ParseResult<any>
): result is ParseFailure {
	return result instanceof ParseFailure;
}

export function logResult(result: ParseResult<any>) {
	if (isParseFailure(result)) {
		const { content, marker } = result.stream.log();
		console.log(
			`
Parse Failure
|
| ${content}
| ${marker}
Failed at index ${result.stream.index}: ${result.value}
`
		);
	} else {
		console.log(
			`
Parse Success
"${result.stream.content}" ==> ${JSON.stringify(result.value, undefined, "  ")}
`
		);
	}
}

// Helper types
// Hover over the declare const to get a sense of what they do

type ParserToken<T> = T extends Parser<infer U> ? U : never;

declare const aParser: Parser<"a">;
declare const tokenX: ParserToken<typeof aParser>;

type ParserTokenArray<Tuple extends readonly Parser<any>[]> = {
	[Index in keyof Tuple]: ParserToken<Tuple[Index]>;
};

declare const parsers: [Parser<"a">, Parser<"b">, Parser<"c">];
declare const tokenArray: ParserTokenArray<typeof parsers>;

type ParserArrayType<ParserArray extends readonly Parser<any>[]> =
	ParserTokenArray<ParserArray>[number];

declare const type: ParserArrayType<typeof parsers>;

type FixedSizeArray<N extends number, T> = N extends 0
	? never[]
	: {
			0: T;
			length: N;
	  } & ReadonlyArray<T>;

export const char = <Char extends string>(c: Char): Parser<Char> =>
	new Parser((stream) => {
		const value = stream.head() as Char | undefined;

		if (value === c) {
			return new ParseSuccess(value, stream.move(1));
		}

		return new ParseFailure(`Char did not match ${JSON.stringify(c)}`, stream);
	});

export const notChars = (chars: string[]): Parser<string> =>
	not(oneOf(chars.map((charV) => char(charV))));

export const nOrMore = <T>(n: number, parser: Parser<T>): Parser<T[]> =>
	new Parser((stream) => {
		const values: T[] = [];

		while (true) {
			let result = parser.run(stream);
			if (isParseSuccess(result)) {
				values.push(result.value);
				stream = result.stream;
			} else {
				break;
			}
		}

		if (values.length < n) {
			return new ParseFailure(
				`nOrMore failed: only matched ${values.length} tokens`,
				stream
			);
		}

		return new ParseSuccess(values, stream);
	});

export const zeroOrMore = <T>(parser: Parser<T>) => nOrMore(0, parser);

export const oneOf = <ParserArray extends readonly Parser<any>[]>(
	parsers: ParserArray
): Parser<ParserToken<ParserArray[number]>> =>
	new Parser((stream) => {
		for (const parser of parsers) {
			const result = parser.run(stream);

			if (result instanceof ParseSuccess) {
				return result;
			}
		}

		return new ParseFailure("oneOf failed", stream);
	});

export function sequence<
	N extends number,
	ParserArray extends FixedSizeArray<N, Parser<any>>
>(parsers: ParserArray): Parser<ParserTokenArray<ParserArray>>;

export function sequence<N extends number, ParserArray extends Parser<any>[]>(
	parsers: ParserArray
): Parser<ParserTokenArray<ParserArray>>;

export function sequence<
	N extends number,
	ParserArray extends FixedSizeArray<N, Parser<any>>
>(parsers: ParserArray): Parser<ParserTokenArray<ParserArray>> {
	return new Parser((stream) => {
		// type SeqParserTokenArray = ParserTokenArray<ParserArray>;
		// type SeqParserToken = SeqParserTokenArray[keyof SeqParserTokenArray];
		const seqValues = [] as any;

		for (const parser of parsers) {
			const result = parser.run(stream);

			if (result instanceof ParseSuccess) {
				const { value, stream: newStream } = result;
				seqValues.push(value);
				stream = newStream;
			} else {
				return result;
			}
		}

		return new ParseSuccess(seqValues, stream);
	});
}

export const lookahead = <T>(parser: Parser<T>): Parser<T> =>
	new Parser((stream) => {
		const result = parser.run(stream);

		if (isParseFailure(result)) {
			return new ParseFailure(result.value, stream);
		} else {
			return new ParseSuccess(result.value, stream);
		}
	});

export const maybe = <T>(parser: Parser<T>): Parser<T | undefined> =>
	new Parser((stream) => {
		const result = parser.run(stream);

		if (isParseFailure(result)) {
			return new ParseSuccess(undefined, stream);
		} else {
			return new ParseSuccess(result.value, result.stream);
		}
	});

export const str = (str: string): Parser<string> =>
	sequence(str.split("").map(char)).map(concat);

export const concat = (strs: string[]) => strs.join("");

export const between = <L, T, R>(
	left: Parser<L>,
	parser: Parser<T>,
	right: Parser<R>
): Parser<T> => sequence([left, parser, right] as const).map((v) => v[1]);

export const prefix = <P, T>(prefix: Parser<P>, parser: Parser<T>): Parser<T> =>
	sequence([prefix, parser] as const).map((v) => v[1]);

export const suffix = <T, S>(parser: Parser<T>, suffix: Parser<S>): Parser<T> =>
	sequence([parser, suffix] as const).map((v) => v[0]);

export const not = <T>(parser: Parser<T>): Parser<string> =>
	new Parser((stream) => {
		if (stream.isEmpty) {
			return new ParseFailure("stream was emptied", stream);
		}
		const result = parser.run(stream);

		if (isParseFailure(result)) {
			return new ParseSuccess(stream.head(), stream.move(1));
		} else {
			return new ParseFailure("not failed", result.stream);
		}
	});

export const takeUntil = <T>(parser: Parser<T>): Parser<string[]> =>
	suffix(zeroOrMore(not(parser)), parser);

export const line = takeUntil(char("\n")).map(concat);