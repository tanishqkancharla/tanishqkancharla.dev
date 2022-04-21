import { assert, assertEqual } from "../utils/assertUtils";
import { blockquoteParser } from "./blockQuote";
import { isParseSuccess, logResult } from "./parseUtils";

describe("blockQuote", () => {
	it("works", () => {
		const result = blockquoteParser.run(
			`| *bold*
| text
`
		);
		logResult(result);
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, [
			[{ type: "bold", content: "bold" }],
			[{ type: "plain", content: "text" }],
		]);
	});
});
