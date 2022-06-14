import { codeBlockParser, langParser } from "./codeBlock";
import { testParser } from "./testParser";

describe("codeBlock", () => {
	testParser(
		"lang parser",
		langParser,
		`
\`\`\`rust
`,
		"rust"
	);

	testParser("lang parser without lang", langParser, "\n```\n", undefined);

	testParser(
		"works",
		codeBlockParser,
		`
\`\`\`
const code = runCode();
\`\`\`
`,
		{ type: "codeBlock", content: "const code = runCode();", lang: undefined }
	);
});
