import { Parser } from "./Parser";
import { ParseFailure, ParseSuccess } from "./ParseResult";

export const where = <Char extends string>(
	predicate: (char: Char) => boolean
): Parser<Char> =>
	new Parser((stream) => {
		const value = stream.head() as Char;

		if (predicate(value)) {
			return new ParseSuccess(value, stream.move(1));
		}

		return new ParseFailure("Char did not match", stream);
	});

export const char = <Char extends string>(c: Char): Parser<Char> =>
	where((char) => char === c);

export const oneOf = <ParserArray extends readonly Parser<any>[]>(
	parsers: ParserArray
): Parser<ParserArrayTypes<ParserArray>> =>
	new Parser((stream) => {
		for (const parser of parsers) {
			const result = parser.run(stream);

			if (result instanceof ParseSuccess) {
				return result;
			}
		}

		return new ParseFailure("oneOf failed", stream);
	});

type ParserToken<T> = T extends Parser<infer U> ? U : never;

type ParserArrayTypeMap<ParserArray extends readonly Parser<any>[]> = {
	[Parser in keyof ParserArray]: ParserToken<ParserArray[Parser]>;
};

type ParserArrayTypes<ParserArray extends readonly Parser<any>[]> = {
	[ParserKey in keyof ParserArray]: ParserToken<ParserArray[ParserKey]>;
}[keyof ParserArray];

export const sequence = <ParserArray extends readonly Parser<any>[]>(
	parsers: ParserArray
): Parser<ParserArrayTypeMap<ParserArray>> =>
	new Parser((stream) => {
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

export const maybe = <T>(parser: Parser<T>): Parser<T | undefined> =>
	new Parser((stream) => {
		const result = parser.run(stream);
		if (result instanceof ParseSuccess) {
			return result;
		} else {
			return new ParseSuccess(undefined, stream);
		}
	});

export const str = (str: string): Parser<string> =>
	sequence(str.split("").map(char)).map((tokens) => tokens.join(""));
