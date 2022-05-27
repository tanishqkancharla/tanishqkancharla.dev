import { isParseSuccess } from "teg-parser";
import { assert, assertEqual } from "../utils/assertUtils";
import {
	boldParser,
	codeParser,
	italicParser,
	plainParser,
	richTextParser,
} from "./richText";

describe("Rich Text", () => {
	describe("bold", () => {
		it("works", () => {
			const result = boldParser.run("*bold content*");

			assert.ok(isParseSuccess(result));
			assert.ok(result.stream.isEmpty);
			assertEqual(result.value, {
				type: "bold",
				content: "bold content",
			});
		});
	});

	describe("italic", () => {
		it("works", () => {
			const result = italicParser.run("_italic content_");

			assert.ok(isParseSuccess(result));
			assert.ok(result.stream.isEmpty);
			assertEqual(result.value, {
				type: "italic",
				content: "italic content",
			});
		});
	});

	describe("code", () => {
		it("works", () => {
			const result = codeParser.run("`code content`");

			assert.ok(isParseSuccess(result));
			assert.ok(result.stream.isEmpty);
			assertEqual(result.value, {
				type: "code",
				content: "code content",
			});
		});
	});

	describe("plain", () => {
		it("works", () => {
			const result = plainParser.run("plain");

			assert.ok(isParseSuccess(result));
			assert.ok(result.stream.isEmpty);
			assertEqual(result.value, {
				type: "plain",
				content: "plain",
			});
		});
	});

	describe("Rich Text", () => {
		it("works", () => {
			const result = richTextParser.run("*bold* to _italic_ to `code`\n");

			assert.ok(isParseSuccess(result));
			assert.ok(result.stream.isEmpty);
			assertEqual(result.value, [
				{
					type: "bold",
					content: "bold",
				},
				{
					type: "plain",
					content: " to ",
				},
				{
					type: "italic",
					content: "italic",
				},
				{
					type: "plain",
					content: " to ",
				},
				{
					type: "code",
					content: "code",
				},
			]);
		});
	});
});
