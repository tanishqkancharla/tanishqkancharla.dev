import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils";
import { h2Parser } from "./h2";

describe("h2", () => {
	it("works", () => {
		const result = h2Parser.run("## h2 heading\n");
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, "h2 heading");
	});
});
