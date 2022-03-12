// import { ParserStep, ParseToken } from ".";
// import { error, success } from "../typeUtils";

// declare module "." {
// 	interface ParseTokenMap {
// 		h1: { content: string };
// 	}
// }

// type H1Token = ParseToken<"h1">;

// export const h1Parser: ParserStep<H1Token> = (state) => {
// 	if (!state.content.startsWith("# ")) {
// 		return error("Incorrect prefix.");
// 	}

// 	const content = state.content.slice(2);

// 	const newLine = content.indexOf("\n");
// 	if (newLine < 0) {
// 		// Consume rest of content
// 		return success({
// 			state: { content: "" },
// 			token: { type: "h1", content },
// 		});
// 	}
// 	const text = content.slice(0, newLine);
// 	const restContent = content.slice(newLine + 1);

// 	return success({
// 		state: { content: restContent },
// 		token: { type: "h1", content: text },
// 	});
// };
