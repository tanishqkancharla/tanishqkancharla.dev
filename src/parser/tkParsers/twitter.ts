import { TKParseToken } from "..";
import { Parser } from "../Parser";
import { between, char, notChars, prefix, str, zeroOrMore } from "../utils";

declare module ".." {
	interface TKParseTokenMap {
		twitter: { url: string };
	}
}

type TwitterToken = TKParseToken<"twitter">;

export const twitterParser: Parser<TwitterToken> = between(
	char("["),
	prefix(str("twitter:"), zeroOrMore(notChars(["\n", "]"]))),
	char("]")
)
	.map((chars) => chars.join(""))
	.map((url) => ({ type: "twitter", url }));
