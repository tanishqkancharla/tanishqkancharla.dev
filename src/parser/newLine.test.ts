import { assert } from "../utils/assertUtils";
import { newLineParser } from "./newLine";
import { isParseSuccess, logResult } from "./parseUtils";

describe("newLine", () => {
	it("works", () => {
		const result = newLineParser.run(
			`
`
		);

		logResult(result);
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
	});

	it("works when there's content after", () => {
		const result = newLineParser.run(
			`
Content`
		);

		logResult(result);
		assert.ok(isParseSuccess(result));
	});
});
