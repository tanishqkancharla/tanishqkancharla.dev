import { isParseSuccess } from "teg-parser";
import { assert, assertEqual } from "../../utils/assertUtils";
import { paragraphParser } from "./paragraph";

describe("paragraph", () => {
	it("works", () => {
		const result = paragraphParser.run("paragraph\n");
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
