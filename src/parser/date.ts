import { Parser } from "./Parser";
import { ParseFailure, ParseSuccess } from "./ParseResult";
import { TKBlock } from "./parseTK";
import { char, concat, sequence, takeUntil } from "./parseUtils";

declare module "./parseTK" {
	interface TKBlockMap {
		date: { year: number; month: number };
	}
}

type DateToken = TKBlock<"date">;

/** Parse [year]-[month] */
export const dateParser: Parser<DateToken> = sequence([
	takeUntil(char("-")).map(concat),
	takeUntil(char("\n")).map(concat),
]).chain(
	([yearStr, monthStr]) =>
		new Parser((stream) => {
			const year = Number(yearStr);
			if (!year)
				return new ParseFailure(`Expected year, found ${yearStr}`, stream);

			const month = Number(monthStr);
			if (!month)
				return new ParseFailure(`Expected month, found ${monthStr}`, stream);

			return new ParseSuccess({ year, month, type: "date" as const }, stream);
		})
);