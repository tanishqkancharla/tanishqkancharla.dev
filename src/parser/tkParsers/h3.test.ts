import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils.test";
import { h3Parser } from "./h3";

describe("h3", () => {
	it("works", () => {
		const result = h3Parser.run("### h3 heading\n");
		assert.ok(isParseSuccess(result));

		assertEqual(result.value.content, "h3 heading");
	});
});
