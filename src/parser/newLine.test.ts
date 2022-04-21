import { assert } from "../utils/assertUtils";
import { newLineParser } from "./newLine";
import { isParseSuccess } from "./parseUtils";

describe("newLine", () => {
	it("works", () => {
		const result = newLineParser.run(`\n`);

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
	});

	it("works when there's content after", () => {
		const result = newLineParser.run(`\nContent`);

		assert.ok(isParseSuccess(result));
	});
});
