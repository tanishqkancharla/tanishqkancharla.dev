import { assert, assertEqual } from "./assertUtils";
import { ParseFailure, ParseResult, ParseSuccess } from "./ParseResult";
import { char, line, maybe, notChars, sequence, zeroOrMore } from "./utils";

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
	it("char", () => {
		const parser = char("a");

		success: {
			const result = parser.run("a");

			assert.ok(result instanceof ParseSuccess);

			const { stream, value } = result;

			assert.ok(stream.isEmpty);
			assertEqual(value, "a");
		}

		fail: {
			const result = parser.run("b");
			assert.ok(isParseFailure(result));
		}
	});

	it.skip("notChar");

	it("notChars", () => {
		const parser = notChars(["a", "b", "c"]);

		success: {
			const result = parser.run("ddd");

			assert.ok(isParseSuccess(result));
		}

		fail: {
			let result = parser.run("a");
			assert.ok(isParseFailure(result));

			result = parser.run("abc");
			assert.ok(isParseFailure(result));
		}
	});

	it("sequence", () => {
		const parser = sequence([char("a"), char("b"), char("c")] as const);

		success: {
			const result = parser.run("abc");

			assert.ok(isParseSuccess(result));

			const { value } = result;
			assertEqual(value, ["a", "b", "c"]);
		}

		fail: {
			const result = parser.run("bac");

			assert.ok(isParseFailure(result));
		}
	});

	it("maybe", () => {
		const parser = maybe(char("a"));
		success: {
			const result = parser.run("a");

			assert.ok(isParseSuccess(result));
			const { value, stream } = result;

			assert.ok(stream.isEmpty);
			assertEqual(value, "a");
		}
		fail: {
			const result = parser.run("b");

			assert.ok(isParseSuccess(result));
			const { value, stream } = result;

			assert.ok(!stream.isEmpty);
			assertEqual(value, undefined);
		}
	});

	it("zeroOrMore", () => {
		const parser = zeroOrMore(char("a"));
		zero: {
			const result = parser.run("b");

			assert.ok(isParseSuccess(result));
			const { value } = result;

			assertEqual(value, []);
		}
		more: {
			const result = parser.run("aaa");

			assert.ok(isParseSuccess(result));
			const { value } = result;

			assertEqual(value, ["a", "a", "a"]);
		}
	});

	it.skip("oneOrMore");

	it.skip("str");

	it.skip("between");

	it.skip("prefix");

	describe("line", () => {
		it("works", () => {
			const result = line.run("a sentence\n");

			assert.ok(isParseSuccess(result));
			const { value } = result;

			assertEqual(value, "a sentence");
		});

		it("multiple sentences", () => {
			let result = line.run("a sentence\na second sentence\n");

			assert.ok(isParseSuccess(result));
			assertEqual(result.value, "a sentence");

			result = line.run(result.stream);

			assert.ok(isParseSuccess(result));

			assertEqual(result.value, "a second sentence");
		});
	});
});
