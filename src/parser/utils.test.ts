import { assert, assertEqual } from "./assertUtils";
import { ParseFailure, ParseResult, ParseSuccess } from "./ParseResult";
import { ParserStream } from "./ParserStream";
import { char, maybe, sequence } from "./utils";

export function isParseSuccess<T>(
	result: ParseResult<T>
): result is ParseSuccess<T> {
	return result instanceof ParseSuccess;
}

export function isParseFailure(
	result: ParseResult<any>
): result is ParseFailure {
	return result instanceof ParseFailure;
}

describe("Parse utils", () => {
	it("char success", () => {
		const result = char("a").run("a");

		assert.ok(result instanceof ParseSuccess);

		const { stream, value } = result;

		assert.ok(stream.isEmpty);
		assertEqual(value, "a");
	});

	it("char error", () => {
		const result = char("a").run("b");
		assert.ok(result instanceof ParseFailure);
	});

	it("sequence success", () => {
		const result = sequence([char("a"), char("b"), char("c")] as const).run(
			"abc"
		);

		assert.ok(isParseSuccess(result));

		const { value } = result;
		assertEqual(value, ["a", "b", "c"]);
	});

	it("sequence error", () => {
		const result = sequence([char("a"), char("b"), char("c")]).run("bac");

		assert.ok(isParseFailure(result));
	});

	it("maybe success", () => {
		const result = maybe(char("a")).run(new ParserStream("a"));

		assert.ok(isParseSuccess(result));
		const { value, stream } = result;

		assert.ok(stream.isEmpty);
		assertEqual(value, "a");
	});

	it("maybe unsuccessful", () => {
		const result = maybe(char("a")).run(new ParserStream("b"));

		assert.ok(isParseSuccess(result));
		const { value, stream } = result;

		assert.ok(!stream.isEmpty);
		assertEqual(value, undefined);
	});
});
