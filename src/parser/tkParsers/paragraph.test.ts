import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils.test";
import { paragraphParser } from "./paragraph";

describe("paragraph", () => {
	it("works", () => {
		const result = paragraphParser.run("paragraph\n");
		assert.ok(isParseSuccess(result));

		assertEqual(result.value.content, "paragraph");
	});
});
