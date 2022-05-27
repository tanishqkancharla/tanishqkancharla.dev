import { testParser } from "./testParser";
import { tweetParser } from "./twitter";

describe("twitter", () => {
	testParser(
		"tweet",
		tweetParser,
		`
    [tweet:https://twitter.com/joeyabanks/status/1417505963272249346?s=21]\n`,
		{
			type: "tweet",
			url: "https://twitter.com/joeyabanks/status/1417505963272249346?s=21",
		}
	);
});
