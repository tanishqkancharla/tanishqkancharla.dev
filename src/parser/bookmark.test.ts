import { assert, assertEqual } from "../utils/assertUtils";
import { bookmarkParser } from "./bookmark";
import { isParseSuccess } from "./parseUtils";

describe("bookmark", () => {
	it("works", () => {
		const result = bookmarkParser.run("[bookmark:https://gem.moonrise.tk]\n");
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value, {
			type: "bookmark",
			url: "https://gem.moonrise.tk",
		});
	});
});
