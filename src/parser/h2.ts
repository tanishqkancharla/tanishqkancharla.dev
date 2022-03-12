import { ParserStep, ParseToken } from ".";
import { error, success } from "../typeUtils";

declare module "." {
	interface ParseTokenMap {
		h2: { content: string };
	}
}

type H2Token = ParseToken<"h2">;

export const h2Parser: ParserStep<H2Token> = (state) => {
	if (!state.content.startsWith("## ")) {
		return error("Incorrect prefix.");
	}

	const content = state.content.slice(3);

	const newLine = content.indexOf("\n");
	if (newLine < 0) {
		// Consume rest of content
		return success({
			state: { content: "" },
			token: { type: "h2", content },
		});
	}
	const text = content.slice(0, newLine);
	const restContent = content.slice(newLine + 1);

	return success({
		state: { content: restContent },
		token: { type: "h2", content: text },
	});
};
