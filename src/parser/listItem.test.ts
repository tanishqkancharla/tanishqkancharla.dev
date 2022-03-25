import { assert, assertEqual } from "../utils/assertUtils";
import { listItemParser } from "./listItem";
import { isParseSuccess } from "./parseUtils";

describe("listItem", () => {
	it("works", () => {
		const result = listItemParser.run("- list item\n");
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, "list item");
	});
});
