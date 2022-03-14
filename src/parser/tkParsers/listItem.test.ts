import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils.test";
import { listItemParser } from "./listItem";

describe("listItem", () => {
	it("works", () => {
		const result = listItemParser.run("- list item\n");
		assert.ok(isParseSuccess(result));

		assertEqual(result.value.content, "list item");
	});
});
