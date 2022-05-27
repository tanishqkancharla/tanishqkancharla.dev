import { isParseSuccess } from "teg-parser";
import { assert, assertEqual } from "../utils/assertUtils";
import { toggleParser } from "./toggle";

describe("toggle", () => {
	it("works", () => {
		const result = toggleParser.run(`> Toggle\n| Content\n`);
		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);

		assertEqual(result.value.label, "Toggle");
		assertEqual(result.value.content, [
			[{ type: "plain", content: "Content" }],
		]);
	});
});
