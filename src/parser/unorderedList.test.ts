import { assert, assertEqual } from "../utils/assertUtils";
import { isParseSuccess } from "./parseUtils";
import { unorderedListParser } from "./unorderedList";

describe("unorderedList", () => {
	it("works", () => {
		const result = unorderedListParser.run("- list item 1\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value.listItems, ["list item 1"]);
	});

	it("works with multiple list items", () => {
		const result = unorderedListParser.run(
			"- list item 1\n- list item 2\n- list item 3\n"
		);

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.listItems, [
			"list item 1",
			"list item 2",
			"list item 3",
		]);
	});
});