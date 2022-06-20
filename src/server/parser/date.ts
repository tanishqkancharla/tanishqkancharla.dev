import {
	ParseFailure,
	Parser,
	ParseSuccess,
	str,
	takeUntilAfter,
} from "teg-parser";
import { TKBlock } from "./parseTK";

declare module "./parseTK" {
	interface TKBlockMap {
		date: { content: Date };
	}
}

type DateToken = TKBlock<"date">;

/** Parse date */
export const dateParser: Parser<DateToken> = takeUntilAfter(str("\n")).chain(
	(str) =>
		new Parser((stream) => {
			const content = new Date(str);

			if (content.toString() === "Invalid Date") {
				return new ParseFailure(`Expected date, found, ${str}`, stream);
			}

			return new ParseSuccess({ content, type: "date" as const }, stream);
		})
);
