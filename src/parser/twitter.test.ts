import { assert, assertEqual } from "../utils/assertUtils";
import { isParseSuccess } from "./parseUtils";
import { tweetParser } from "./twitter";

describe("twitter", () => {
	it("works", () => {
		const result = tweetParser.run(
			"[tweet:https://twitter.com/joeyabanks/status/1417505963272249346?s=21]\n"
		);
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(
			result.value.url,
			"https://twitter.com/joeyabanks/status/1417505963272249346?s=21"
		);
	});
});
