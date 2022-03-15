import { TKBlock } from "..";
import { Parser } from "../Parser";
import { ParseFailure, ParseSuccess } from "../ParseResult";
import { char, identity, sequence, takeUntil } from "../utils";

declare module ".." {
	interface TKBlockMap {
		date: { year: number; month: number };
	}
}

type DateToken = TKBlock<"date">;

/** Parse [year]-[month] */
export const dateParser: Parser<DateToken> = sequence([
	takeUntil(char("-")).bimap(identity, (error) => `Expected year`),
	takeUntil(char("\n")),
] as const).chain(
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
