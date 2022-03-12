// import { ParserStep, ParseToken } from ".";
// import { error, success } from "../typeUtils";

// declare module "." {
// 	interface ParseTokenMap {
// 		h3: { content: string };
// 	}
// }

// type H3Token = ParseToken<"h3">;

// export const h3Parser: ParserStep<H3Token> = (state) => {
// 	if (!state.content.startsWith("### ")) {
// 		return error("Incorrect prefix.");
// 	}

// 	const content = state.content.slice(3);

// 	const newLine = content.indexOf("\n");
// 	if (newLine < 0) {
// 		// Consume rest of content
// 		return success({
// 			state: { content: "" },
// 			token: { type: "h3", content },
// 		});
// 	}
// 	const text = content.slice(0, newLine);
// 	const restContent = content.slice(newLine + 1);

// 	return success({
// 		state: { content: restContent },
// 		token: { type: "h3", content: text },
// 	});
// };
