import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils";
import { listItemParser } from "./listItem";

describe("listItem", () => {
	it("works", () => {
		const result = listItemParser.run("- list item\n");
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, "list item");
	});
});
