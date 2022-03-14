import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils.test";
import { h1Parser } from "./h1";

describe("h1", () => {
	it("works", () => {
		const result = h1Parser.run("# h1 heading\n");
		assert.ok(isParseSuccess(result));

		assertEqual(result.value.content, "h1 heading");
	});
});
