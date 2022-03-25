import { assert, assertEqual } from "../utils/assertUtils";
import { block, parseTK } from "./parseTK";
import { isParseSuccess } from "./parseUtils";

describe("Parser", () => {
	it("Parsing block works", () => {
		const heading1 = "# Heading\n";
		const heading2 = "## Heading\n";
		const heading3 = "### Heading\n";
		const unorderedList = "- list item\n- list item 2\n";
		const twitter =
			"[twitter:https://twitter.com/joeyabanks/status/1417505963272249346?s=21]\n";
		const divider = "---\n";
		const codeBlock = "```\nconst code = runCode();\n```\n";
		const newLine = "\n\n";
		const paragraph = "paragraph\n";

		const possibleBlocks = [
			heading1,
			heading2,
			heading3,
			unorderedList,
			twitter,
			divider,
			codeBlock,
			newLine,
			paragraph,
		];

		for (const possibleBlock of possibleBlocks) {
			const result = block.run(possibleBlock);
			assert.ok(isParseSuccess(result));
			assert.ok(result.stream.isEmpty, "Stream wasn't consumed");
		}
	});

	it("works", () => {
		const tk = `# Heading\n---\nDescription\n---\n2021-07\nWhoa a block\n`;
		const result = parseTK(tk);

		assertEqual(result, {
			metadata: {
				title: "Heading",
				description: "Description",
				date: { year: 2021, month: 7 },
			},
			blocks: [{ type: "paragraph", content: "Whoa a block" }],
		});
	});
});
