import { assert } from "../assertUtils";
import { newLineParser } from "./newLine";
import { isParseSuccess } from "./parseUtils";

describe("newLine", () => {
	it("works", () => {
		const result = newLineParser.run("\n\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
	});
});
