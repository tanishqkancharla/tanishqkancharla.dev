import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "./parseUtils";
import { twitterParser } from "./twitter";

describe("twitter", () => {
	it("works", () => {
		const result = twitterParser.run(
			"[twitter:https://twitter.com/joeyabanks/status/1417505963272249346?s=21]\n"
		);
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(
			result.value.url,
			"https://twitter.com/joeyabanks/status/1417505963272249346?s=21"
		);
	});
});
