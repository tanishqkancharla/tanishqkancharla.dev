import { isParseSuccess } from "teg-parser";
import { assert, assertEqual } from "../utils/assertUtils";
import { blockquoteParser } from "./blockQuote";

describe("blockQuote", () => {
	it("works", () => {
		const result = blockquoteParser.run(
			`| *bold*
| text
`
		);
		assert.ok(isParseSuccess(result));

		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, [
			[{ type: "bold", content: "bold" }],
			[{ type: "plain", content: "text" }],
		]);
	});
});
