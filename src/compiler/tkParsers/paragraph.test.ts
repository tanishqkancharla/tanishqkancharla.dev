import { assert, assertEqual } from "../assertUtils";
import { isParseSuccess } from "../utils";
import { paragraphParser } from "./paragraph";

describe("paragraph", () => {
	it("works", () => {
		const result = paragraphParser.run("paragraph\n");
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, "paragraph");
	});
});
