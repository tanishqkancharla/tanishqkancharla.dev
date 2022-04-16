import { assert, assertEqual } from "../utils/assertUtils";
import { paragraphParser } from "./paragraph";
import { isParseSuccess, logResult } from "./parseUtils";

describe("paragraph", () => {
	it("works", () => {
		const result = paragraphParser.run("paragraph\n");
		logResult(result);
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.content, [
			{
				type: "plain",
				content: "paragraph",
			},
		]);
	});
});
