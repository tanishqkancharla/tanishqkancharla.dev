import { bookmarkParser } from "./bookmark";
import { testParser } from "./testParser";

describe("bookmark", () => {
	testParser(
		"bookmark",
		bookmarkParser,
		`
    [bookmark:https://gem.moonrise.tk]\n`,
		{
			type: "bookmark",
			url: "https://gem.moonrise.tk",
		}
	);
});
