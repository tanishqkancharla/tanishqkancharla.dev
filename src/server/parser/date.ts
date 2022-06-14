import {
	ParseFailure,
	Parser,
	ParseSuccess,
	sequence,
	str,
	takeUntilAfter,
} from "teg-parser";
import { Date } from "../../utils/typeUtils";
import { TKBlock } from "./parseTK";

declare module "./parseTK" {
	interface TKBlockMap {
		date: Date;
	}
}

type DateToken = TKBlock<"date">;

/** Parse [year]-[month] */
export const dateParser: Parser<DateToken> = sequence([
	takeUntilAfter(str("-")),
	takeUntilAfter(str("\n")),
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
