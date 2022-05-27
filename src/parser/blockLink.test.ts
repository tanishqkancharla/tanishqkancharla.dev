import { isParseSuccess } from "teg-parser";
import { assert, assertEqual } from "../utils/assertUtils";
import { blockLinkParser } from "./blockLink";

describe("blockLink", () => {
	it("works", () => {
		const result = blockLinkParser.run("[Gem](https://gem.moonrise.tk)\n");

		assert.ok(isParseSuccess(result));
		assert.ok(result.stream.isEmpty);
		assertEqual(result.value, {
			type: "blockLink",
			content: "Gem",
			href: "https://gem.moonrise.tk",
		});
	});
});
