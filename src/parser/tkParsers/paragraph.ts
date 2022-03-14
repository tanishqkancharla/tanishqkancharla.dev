import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { line } from "../utils";

declare module ".." {
	interface TKParseTokenMap {
		paragraph: { content: string };
	}
}

type ParagraphToken = TKParseToken<"paragraph">;

export const paragraphParser: Parser<ParagraphToken> = line //
	.map((content) => ({
		type: "paragraph",
		content,
	}));
