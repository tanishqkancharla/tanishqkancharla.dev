import { ParserStep } from ".";
import { success } from "../typeUtils";

type ParagraphToken = { type: "paragraph"; content: string };

declare module "." {
	interface ParseTokenMap {
		paragraph: { content: string };
	}
}

export const paragraphParser: ParserStep<ParagraphToken> = (state) => {
	const newLine = state.content.indexOf("\n");
	if (newLine < 0) {
		// Consume rest of content
		return success({
			state: { content: "" },
			token: { type: "paragraph", content: state.content },
		});
	}
	const paragraph = state.content.slice(0, newLine);
	const restContent = state.content.slice(newLine + 1);

	return success({
		state: { content: restContent },
		token: { type: "paragraph", content: paragraph },
	});
};
