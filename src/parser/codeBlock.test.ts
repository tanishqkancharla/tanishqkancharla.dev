import { assert, assertEqual } from "../utils/assertUtils";
import { codeBlockParser, langParser } from "./codeBlock";
import { isParseSuccess } from "./parseUtils";

describe("codeBlock", () => {
	it("lang parser", () => {
		const result = langParser.run("```rust\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value, "rust");
	});

	it("lang parser without lang", () => {
		const result = langParser.run("```\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value, undefined);
	});

	it("works", () => {
		const result = codeBlockParser.run("```\nconst code = runCode();\n```\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value.content, "const code = runCode();");
	});
});
