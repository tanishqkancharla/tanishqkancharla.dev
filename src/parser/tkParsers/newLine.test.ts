import { assert } from "../assertUtils";
import { isParseSuccess } from "../utils";
import { newLineParser } from "./newLine";

describe("newLine", () => {
	it("works", () => {
		const result = newLineParser.run("\n\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
	});
});
