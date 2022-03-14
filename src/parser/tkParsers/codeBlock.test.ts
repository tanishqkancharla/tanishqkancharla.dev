import { assert, assertEqual } from "../assertUtils";
import { line, maybe, prefix, str } from "../utils";
import { isParseSuccess } from "../utils.test";
import { codeBlockParser } from "./codeBlock";

describe("codeBlock", () => {
	it("lang parser", () => {
		const langParser = prefix(str("```"), maybe(line)) //
			.map((lang) => (lang === "" ? undefined : lang));

		const result = langParser.run("```rust\n");

		assert.ok(isParseSuccess(result));

		assertEqual(result.value, "rust");
	});

	it("lang parser without lang", () => {
		const langParser = prefix(str("```"), maybe(line)) //
			.map((lang) => (lang === "" ? undefined : lang));

		const result = langParser.run("```\n");

		assert.ok(isParseSuccess(result));

		assertEqual(result.value, undefined);
	});

	it("works", () => {
		const result = codeBlockParser.run("```\nconst code = runCode();\n```");
		assert.ok(isParseSuccess(result));

		assertEqual(result.value.content, "const code = runCode();");
	});
});
